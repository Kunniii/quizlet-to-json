FROM node:18-alpine
WORKDIR /web-app
COPY ./package.json /web-app/
COPY ./yarn.lock /web-app/
COPY ./src /web-app/src
RUN yarn
CMD yarn start