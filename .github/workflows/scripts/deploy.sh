#!/bin/bash

# Blue --> Green
switch_to_green() {
    echo "Deploying Green environment..."

    # 현재 실행중인 클라이언트 보존
    CURRENT_CLIENT=$(docker ps --filter name=web18-inear-client -q)

    # Green 환경 시작 
    docker compose -f docker-compose-green.yml up -d

    sleep 10  

    echo "Stopping Blue server..."
    # Blue 서버만 중지 (나머지는 유지)
    if [ ! -z "$CURRENT_CLIENT" ]; then
        docker compose -f docker-compose-blue.yml stop server-blue
        docker compose -f docker-compose-blue.yml rm -f server-blue
    else
        docker compose -f docker-compose-blue.yml down
    fi
}

# Green --> Blue 
switch_to_blue() {
    echo "Deploying Blue environment..."

    # 현재 실행중인 클라이언트 보존
    CURRENT_CLIENT=$(docker ps --filter name=web18-inear-client -q)

    # Blue 환경 시작 
    docker compose -f docker-compose-blue.yml up -d

    sleep 10  

    echo "Stopping Green server..."
    # Green 서버만 중지 (나머지는 유지)
    if [ ! -z "$CURRENT_CLIENT" ]; then
        docker compose -f docker-compose-green.yml stop server-green
        docker compose -f docker-compose-green.yml rm -f server-green
    else
        docker compose -f docker-compose-green.yml down
    fi
}

if docker compose -f docker-compose-blue.yml ps | grep -q "server-blue"; then
    switch_to_green
else
    switch_to_blue
fi