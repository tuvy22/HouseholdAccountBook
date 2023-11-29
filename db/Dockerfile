# 使用するベースイメージ
FROM mariadb:10.5

# 初期化スクリプトをコピー
COPY ./init.sql /docker-entrypoint-initdb.d/init.sql
