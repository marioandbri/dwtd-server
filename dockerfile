FROM node:alpine

WORKDIR /server

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn prisma generate

EXPOSE 4000

CMD ["yarn", "start"]
