FROM alpine:latest

RUN apk add --no-cache nss curl bash \
  && curl -L -o /usr/local/bin/mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64 \
  && chmod +x /usr/local/bin/mkcert

WORKDIR /cert
ENTRYPOINT ["/usr/local/bin/mkcert"]
