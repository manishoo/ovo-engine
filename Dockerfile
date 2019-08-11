FROM node:10-alpine
MAINTAINER Ouranos Studio

WORKDIR /home/solarys

COPY src src
COPY locales locales
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY tsconfig.json .
COPY gulpfile.js .

RUN npm install
RUN npm run build

RUN rm -rf src
RUN rm package.json
RUN rm tsconfig.json
RUN rm gulpfile.js

RUN npm prune --production
