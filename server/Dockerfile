FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache ffmpeg

COPY package.json yarn.lock .yarnrc.yml tsconfig.json ./
COPY .yarn .yarn
COPY server/ server/

RUN corepack enable && \
    yarn install

WORKDIR /app/server

EXPOSE 3000
CMD ["yarn", "start"]
