# ベースとなるイメージを指定
FROM golang:1.20.7-alpine3.17

WORKDIR /go/src
#COPY ./go .

RUN apk upgrade --update && apk --no-cache add git
RUN go install github.com/cosmtrek/air@latest

CMD ["air", "-c", "./app/.air.toml"]
# コンテナ内の作業ディレクトリを設定
# WORKDIR /go/src

# COPY go/go.mod .
# COPY go/go.sum .

# RUN go mod download
