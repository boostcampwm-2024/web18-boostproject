FROM node:20-alpine

WORKDIR /app

COPY ./ ./

RUN corepack enable && \
    yarn install && \
    yarn add react-router-dom && \
    cd ../

WORKDIR /app/client

EXPOSE 5173
CMD ["yarn", "run", "dev", "--no-open", "--host"]
