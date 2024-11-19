FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache ffmpeg

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
COPY tsconfig.json ./
COPY server/ server/

RUN corepack enable && \
    yarn install

WORKDIR /app/server

EXPOSE 3000
CMD ["yarn", "start"]