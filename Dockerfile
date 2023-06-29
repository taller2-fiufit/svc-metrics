FROM node:20 AS development

WORKDIR /usr/src/app

COPY package*.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:20 AS production

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

COPY yarn.lock ./

RUN yarn install --production=true

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["yarn", "run", "start:prod"]
