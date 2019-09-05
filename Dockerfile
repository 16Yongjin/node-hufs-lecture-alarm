FROM node:10

RUN mkdir /app
ADD . /app
WORKDIR /app

RUN npm install

CMD ["node", "app.js"]