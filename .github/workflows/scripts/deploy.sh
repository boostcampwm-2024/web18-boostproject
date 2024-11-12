#!/bin/bash

# nginx 설정 업데이트 및 리로드 함수
update_and_reload_nginx() {
    local target=$1
    echo "Updating nginx configuration for $target environment..."

    # 임시 설정 파일 생성
    cat > nginx/conf.d/default.conf << EOF
upstream backend {
    server server-$target:3000;
}

server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://client:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
    }

    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
EOF

    # nginx 컨테이너 재시작
    echo "Restarting nginx to apply new configuration..."
    docker restart nginx

    # 설정이 제대로 적용되었는지 확인
    sleep 2
    docker exec nginx nginx -t
}

# Blue에서 Green으로 전환
switch_to_green() {
    echo "Deploying Green environment..."

    # Green 환경 시작
    docker compose -f docker-compose-green.yml up -d

    # nginx 설정 업데이트 및 리로드
    update_and_reload_nginx "green"

    echo "Stopping Blue server..."
    if docker ps -q --filter name=server-blue > /dev/null; then
        docker compose -f docker-compose-blue.yml stop server-blue
        docker compose -f docker-compose-blue.yml rm -f server-blue
    fi
}
# Green에서 Blue로 전환
switch_to_blue() {
    echo "Deploying Blue environment..."

    # Blue 환경 시작
    docker compose -f docker-compose-blue.yml up -d

    # nginx 설정 업데이트 및 리로드
    update_and_reload_nginx "blue"

    echo "Stopping Green server..."
    if docker ps -q --filter name=server-green > /dev/null; then
        docker compose -f docker-compose-green.yml stop server-green
        docker compose -f docker-compose-green.yml rm -f server-green
    fi
}

# 현재 실행 중인 환경 확인 및 전환
if [ -n "$(docker ps -q --filter name=blue)" ]; then
    switch_to_green
    echo "switch_to_green 실행"
else
    switch_to_blue
    echo "switch_to_blue 실행"
fi