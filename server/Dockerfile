FROM node:iron-buster-slim

COPY .yarn api/.yarn

COPY server/package.json server/tsconfig.json .yarnrc.yml api/

WORKDIR /api


RUN yarn

COPY server/src src

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]