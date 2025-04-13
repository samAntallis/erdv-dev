# pull official base image
FROM node:13.12.0-alpine

# add git in case we need to install
# a yarn package from github
RUN apk update && apk upgrade && \
    apk add --no-cache git

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn

# start app
# CMD yarn start