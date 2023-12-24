# 家計簿アプリ（えふ Saku）

えふ Saku は、グループでの家計管理を容易にするための家計簿アプリです。友人や家族をグループに招待し、共有の支出を簡単に追跡し、精算することができます。

## 特徴

- **招待機能**:

  友人や家族をアプリのグループに招待し、共有の家計簿を作成できます。これにより、グループ内での支出をみんなで管理し、全員で収支を把握できます。

- **収支入力機能**:

  収支情報を一画面でサクッと入力できます。入力した情報はグループ内で共有されます。

- **精算機能**:

  分担する支出に対して精算を行うことができます。誰がいくら払うべきかを自動的に計算し、清算（割り勘）を簡単にします。

- **ダッシュボード機能**:

  入力した収支の情報を集計し、ダッシュボードとして見やすく表示します。月単位で過去の推移とカテゴリー別の収支を確認できます。

- **カテゴリー変更機能**:

  収支のカテゴリーは自由にカスタマイズでき、グループに合う独自のカテゴリーが設定出来ます。

## 主な技術スタック

- **フロントエンド**:

  Next.js13,TypeScript,TailwindCSS,react-hook-form,Zod,MUI,recharts

- **バックエンド**:

  Go,Gin,GROM

- **その他**:

  MariaDB,nginx,Docker,JWT

## 環境構築（vscode）

```bash
git clone https://github.com/tuvy22/HouseholdAccountBook.git
cd HouseholdAccountBook/local

開発用の自己署名SSL証明書を生成します。この証明書はローカルでのHTTPS接続に使用されます。
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx-selfsigned.key -out nginx-selfsigned.crt

cd ../
docker-compose up
```

※docker-compose 実行後、vscode で go(gin)をデバック実行する必要があります。

## 実行環境 URL

https://tuvy31322.com

※AWS(ECS+Fargate)で動作しています。
