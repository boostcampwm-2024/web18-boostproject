FROM node:22

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
COPY client/ client/

RUN corepack enable
RUN yarn install
RUN yarn workspace client install

WORKDIR /app/client

EXPOSE 5173
CMD ["yarn", "run", "dev", "--no-open", "--host"]