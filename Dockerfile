FROM --platform=linux/amd64 chocolat.azurecr.io/chocolate:dev
#FROM --platform=linux/amd64 node:14.18.2

WORKDIR /usr/src/app

COPY . .

RUN sed -i -e 's|^REDIS_HOST\=.*$|REDIS_HOST\=20.41.104.108|' .env \
    && sed -i -e 's|^DB_HOST=.*$|DB_HOST\=20.214.100.20|' .env \
    && rm -rf dist/ \
    && npm i -g @nestjs/cli@9.0.0 \
    && yarn install\
    && nest build

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
