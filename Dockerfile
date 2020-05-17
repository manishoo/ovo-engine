FROM node:10-alpine
MAINTAINER Mehdi J. Shooshtari

WORKDIR /service

RUN apk add --no-cache git

# Copy and extract yarn cache
# ADD .yarn-cache.tgz /
COPY ["package.json", "yarn.lock", "./"]

# Install only production
# RUN yarn --verbose --production
# COPY ["build", "locales", "./"]

# Full install and build
RUN yarn --no-cache --frozen-lockfile
ADD tsconfig.json gulpfile.js ./
COPY src src
COPY locales locales
RUN yarn run build
