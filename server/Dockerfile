FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml tsconfig.json ./
COPY .yarn .yarn
COPY server server

RUN corepack enable
RUN yarn install

WORKDIR /app/server
RUN yarn install
RUN yarn build

FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache ffmpeg
RUN corepack enable

COPY --from=builder /app/server/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder /app/.yarn ./.yarn
COPY --from=builder /app/server/dist ./dist

RUN yarn workspaces focus --production --all

EXPOSE 3000
CMD ["node", "dist/main.js"]
