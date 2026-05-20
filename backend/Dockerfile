FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 5000

RUN chmod +x docker-entrypoint.sh

CMD ["./docker-entrypoint.sh"]