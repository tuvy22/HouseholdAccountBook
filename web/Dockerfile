# NginxサーバのDockerfile
FROM nginx:latest

# Nginxの設定ファイルをコピー
#COPY nginx.conf /etc/nginx/nginx.conf

# Appサーバへのリバースプロキシを設定
COPY default.conf /etc/nginx/conf.d/default.conf

# 静的ファイルを配置するディレクトリを作成
RUN mkdir -p /usr/share/nginx/html/web

# Appサーバから提供される静的ファイルをNginxのディレクトリにコピー
COPY . /usr/share/nginx/html/web