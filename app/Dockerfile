# ベースとなるイメージを指定
FROM golang:1.21.3-alpine3.17

WORKDIR /go/src
COPY . .

RUN apk upgrade --update && apk --no-cache add git

CMD ["go", "run", "main.go"]