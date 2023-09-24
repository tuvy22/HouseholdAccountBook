# ベースイメージを指定
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# プロジェクトの依存関係をコピー
COPY ./package.json ./package-lock.json ./

# 依存関係のインストール
RUN npm install

COPY . .

# アプリケーションをビルド
RUN npm run build

# アプリを起動
CMD ["npm", "start"]
