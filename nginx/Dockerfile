FROM nginx:stable-alpine

COPY ./cert /etc/nginx/cert
COPY ./default.conf /etc/nginx/conf.d/default.conf
#front test
# COPY ./html /usr/share/nginx/html 

CMD ["nginx", "-g", "daemon off;"]
