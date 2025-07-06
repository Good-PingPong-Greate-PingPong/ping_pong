FRONT_DIR=frontend
NGINX_CERT_DIR=nginx/cert

.PHONY: all cert frontend up down clean re

all: cert frontend up

cert:
	@echo "🔐 인증서 생성 (Docker + mkcert)..."
	@if [ ! -f $(NGINX_CERT_DIR)/cert.pem ] || [ ! -f $(NGINX_CERT_DIR)/key.pem ]; then \
		docker build -t mkcert-tool tools/mkcert; \
		docker run --rm -v $$PWD/$(NGINX_CERT_DIR):/cert mkcert-tool -cert-file cert.pem -key-file key.pem localhost; \
	else \
		echo "✅ 인증서 이미 존재합니다."; \
	fi

dev-frontend:
	@echo "⚙️ 프론트엔드 로컬 빌드 중..."
	cd $(FRONT_DIR) && npm ci
	cd $(FRONT_DIR) && npm run dev

frontend:
	@echo "⚙️ 프론트엔드 로컬 빌드 중..."
	cd $(FRONT_DIR) && npm ci
	cd $(FRONT_DIR) && npm run build
	@echo "📦 dist 폴더를 nginx에 복사 중..."
	rm -rf nginx/html
	mkdir -p nginx/html
	cp -r $(FRONT_DIR)/dist/* nginx/html/

up:
	@echo "🚀 Docker Compose 실행 (with build)"
	docker compose up --build

down:
	@echo "🛑 Docker Compose 종료"
	docker compose down

clean:
	@echo "🧹 정리 중..."
	rm -rf $(FRONT_DIR)/dist
	rm -rf $(FRONT_DIR)/node_modules
	rm -rf nginx/html
	docker volume prune -f

re: down clean all
