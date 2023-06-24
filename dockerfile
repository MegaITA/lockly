FROM node:lts 

WORKDIR /lockly-bot
COPY package.json .
RUN npm install
COPY . .
CMD node app.js