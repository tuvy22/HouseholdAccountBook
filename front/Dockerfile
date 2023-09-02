# ベースイメージを指定
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# プロジェクトの依存関係をコピー
COPY ./package.json ./package-lock.json ./

# 依存関係のインストール
RUN npm install

COPY ./src/app ./app
COPY ./public ./public
COPY next.config.js .
COPY tsconfig.json .
COPY .eslintrc.json .
COPY postcss.config.js .
COPY tailwind.config.ts .
COPY next-env.d.ts .


# ポートを指定
# EXPOSE 3000

# アプリを起動（Dockerイメージ起動時に実行）
CMD ["npm", "run", "dev"] 
#RUN npm run dev