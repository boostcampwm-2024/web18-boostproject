FROM node:22

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
COPY tsconfig.json ./
COPY server/ server/

RUN corepack enable && \
    yarn install && \
    yarn workspace server install

WORKDIR /app/server

EXPOSE 3000
CMD ["yarn", "start"]
