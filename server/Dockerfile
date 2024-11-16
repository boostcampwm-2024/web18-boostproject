FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
COPY tsconfig.json ./
COPY ./ ./

RUN corepack enable && \
    yarn install && \
    cd server && \
    yarn add @nestjs/platform-socket.io @nestjs/websockets socket.io @types/socket.io && \
    cd ../

WORKDIR /app/server

EXPOSE 3000
CMD ["yarn", "start"]
