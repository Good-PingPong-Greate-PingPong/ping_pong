FROM node:20 as build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

CMD ["echo", "✅ 프론트 빌드 완료"]
