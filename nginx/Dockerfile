FROM nginx:stable-alpine

COPY ./cert /etc/nginx/cert
COPY ./default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
