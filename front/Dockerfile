# ベースイメージを指定
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# プロジェクトの依存関係をコピー
COPY ./package.json ./package-lock.json ./

# 依存関係のインストール
RUN npm install

COPY next.config.js .
COPY tsconfig.json .

# ポートを指定
# EXPOSE 3000

# アプリを起動（Dockerイメージ起動時に実行）
# CMD ["npm", "run", "dev"]
RUN npm run dev