# ベースとなるイメージを指定
FROM golang:1.20.7-alpine3.17

WORKDIR /go/src
#COPY ./go .

RUN apk upgrade --update && apk --no-cache add git
RUN go install github.com/cosmtrek/air@latest

CMD ["go", "run", "main.go"]