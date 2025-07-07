FROM node:23 AS builder
WORKDIR /home/gradle/project
COPY ./frontend .
RUN npm ci
RUN npm run build


FROM nginx:stable-alpine

COPY ./nginx/cert /etc/nginx/cert
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

WORKDIR /
COPY --from=builder /home/gradle/project/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
