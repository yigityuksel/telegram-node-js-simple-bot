FROM node:8

# Create app directory
RUN mkdir -p /usr/src/telegram-bot
WORKDIR /usr/src/telegram-bot

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY .env .env

RUN npm install

# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . /usr/src/telegram-bot

CMD [ "npm", "start" ]