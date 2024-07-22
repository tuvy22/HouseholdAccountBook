package usecase

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/secretsmanager"

	documentai "cloud.google.com/go/documentai/apiv1"
	"cloud.google.com/go/documentai/apiv1/documentaipb"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"google.golang.org/api/option"
)

type OcrUsecase interface {
	GetTotalAndStoreFromReceipt(imageBytes []byte) (entity.Receipt, error)
}

type ocrUsecaseImpl struct {
}

func NewOcrUsecase() OcrUsecase {
	return &ocrUsecaseImpl{}
}

func (u *ocrUsecaseImpl) GetTotalAndStoreFromReceipt(imageBytes []byte) (entity.Receipt, error) {

	// Google CloudのプロジェクトIDとリージョンを設定
	projectID := os.Getenv("PROJECT_ID")
	location := os.Getenv("LOCATION")        // Document AIのリージョン
	processorID := os.Getenv("PROCESSOR_ID") // 予測エンドポイントのプロセッサID

	// Document AIクライアントを作成
	ctx := context.Background()

	var creds string
	if os.Getenv("ENV") != "development" {
		awsCreds, err := setGoogleCredentialsFromAWS()
		if err != nil {
			return entity.Receipt{}, err
		}
		creds = awsCreds

	} else {
		decodedCreds, err := base64.StdEncoding.DecodeString(os.Getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON_BASE64"))
		if err != nil {
			return entity.Receipt{}, err
		}
		creds = string(decodedCreds)
	}

	client, err := documentai.NewDocumentProcessorClient(ctx, option.WithCredentialsJSON([]byte(creds)))
	if err != nil {
		return entity.Receipt{}, err
	}
	defer client.Close()

	// 予測エンドポイントの設定
	endpoint := fmt.Sprintf("projects/%s/locations/%s/processors/%s", projectID, location, processorID)

	// Document AI APIを呼び出す
	req := &documentaipb.ProcessRequest{
		Name: endpoint,
		Source: &documentaipb.ProcessRequest_RawDocument{
			RawDocument: &documentaipb.RawDocument{
				Content:  imageBytes,
				MimeType: http.DetectContentType(imageBytes),
			},
		},
	}

	resp, err := client.ProcessDocument(ctx, req)
	if err != nil {
		return entity.Receipt{}, err
	}

	//結果を解析して店名と合計金額を抽出
	var storeName string
	var totalAmount string

	for _, entity := range resp.GetDocument().GetEntities() {
		switch entity.Type {
		case "merchant_name":
			storeName = entity.GetMentionText()
		case "total_amount":
			totalAmount = entity.GetMentionText()
		}
	}

	//storeNameが取れない場合は一番大きいエリアの文字をstoreNameとみなす
	if storeName == "" {

		// 全テキスト要素を取得
		document := resp.GetDocument()

		// トークンを結合して大きなエリアの文字列を抽出
		for _, page := range document.GetPages() {
			tokens := getTokensFromPage(page, document)
			sort.Slice(tokens, func(i, j int) bool {
				return getArea(tokens[i].BoundingPoly) > getArea(tokens[j].BoundingPoly)
			})

			// 最も大きなトークンを含む行を特定
			maxToken := tokens[0]
			lineTokens := []entity.Token{}
			for _, token := range tokens {
				if isSameLine(maxToken.BoundingPoly, token.BoundingPoly) {
					lineTokens = append(lineTokens, token)
				}
			}

			// トークンをX座標に基づいてソートし、正しい順序で結合
			sort.Slice(lineTokens, func(i, j int) bool {
				return lineTokens[i].BoundingPoly.GetNormalizedVertices()[0].GetX() < lineTokens[j].BoundingPoly.GetNormalizedVertices()[0].GetX()
			})

			var lineText []string
			for _, token := range lineTokens {
				lineText = append(lineText, token.Text)
			}
			storeName = strings.Join(lineText, "")
			break
		}
	}

	totalAmountInt, err := strconv.ParseInt(totalAmount, 10, 32)
	if err != nil {
		totalAmountInt = 0
	}

	var receipt entity.Receipt
	receipt.StoreName = storeName
	receipt.TotalAmount = int(totalAmountInt)

	return receipt, nil
}

func setGoogleCredentialsFromAWS() (string, error) {
	secretName := os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")
	region := os.Getenv("REGION")

	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(region))
	if err != nil {
		return "", err
	}

	svc := secretsmanager.NewFromConfig(cfg)

	input := &secretsmanager.GetSecretValueInput{
		SecretId:     aws.String(secretName),
		VersionStage: aws.String("AWSCURRENT"),
	}

	result, err := svc.GetSecretValue(context.TODO(), input)
	if err != nil {
		return "", err
	}

	var secretString string = *result.SecretString

	var creds map[string]interface{}
	err = json.Unmarshal([]byte(secretString), &creds)
	if err != nil {
		return "", err
	}

	// 環境変数にJSONを設定
	credsBytes, err := json.Marshal(creds)
	if err != nil {
		return "", err
	}

	return string(credsBytes), nil
}

// ドキュメントとレイアウトを基にテキストを抽出
func getTextFromLayout(document *documentaipb.Document, layout *documentaipb.Document_Page_Layout) string {
	var textSegments []string
	for _, segment := range layout.GetTextAnchor().GetTextSegments() {
		startIndex := segment.GetStartIndex()
		endIndex := segment.GetEndIndex()
		textSegments = append(textSegments, document.GetText()[startIndex:endIndex])
	}
	return strings.Join(textSegments, "")
}

// バウンディングポリゴンからエリアを計算
func getArea(boundingPoly *documentaipb.BoundingPoly) float64 {
	vertices := boundingPoly.GetNormalizedVertices()
	if len(vertices) < 4 {
		return 0
	}
	width := vertices[1].GetX() - vertices[0].GetX()
	height := vertices[2].GetY() - vertices[0].GetY()
	return float64(width * height)
}

// ページからトークンを抽出
func getTokensFromPage(page *documentaipb.Document_Page, document *documentaipb.Document) []entity.Token {
	var tokens []entity.Token
	for _, token := range page.GetTokens() {
		text := getTextFromLayout(document, token.GetLayout())
		tokens = append(tokens, entity.Token{
			Text:         text,
			BoundingPoly: token.GetLayout().GetBoundingPoly(),
		})
	}
	return tokens
}

// 2つのバウンディングポリゴンが同じ行にあるかどうかを判定
func isSameLine(b1, b2 *documentaipb.BoundingPoly) bool {
	y1 := b1.GetNormalizedVertices()[0].GetY()
	y2 := b2.GetNormalizedVertices()[0].GetY()
	return abs(y1-y2) < 0.01 // Y座標の差が小さい場合、同じ行とみなす
}

// 浮動小数点数の絶対値計算
func abs(x float32) float32 {
	if x < 0 {
		return -x
	}
	return x
}
