FROM node:20

RUN apt-get update && apt-get install -y sqlite3

WORKDIR /app

# 1. 패키지 설치
COPY package*.json ./
RUN npm ci

# 2. Prisma 관련 파일과 환경 변수 복사
COPY prisma ./prisma
COPY .env ./

# 3. Prisma Client 생성 및 DB 마이그레이션
RUN npx prisma generate
RUN npx prisma migrate deploy

# 4. 소스코드 복사
COPY . .

CMD ["npm", "start"]