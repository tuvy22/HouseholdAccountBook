# ベースとなるイメージを指定
FROM golang:1.22.4-alpine3.20

WORKDIR /go/src
COPY . .

RUN apk upgrade --update && apk --no-cache add git && apk --no-cache add curl

CMD ["go", "run", "main.go"]