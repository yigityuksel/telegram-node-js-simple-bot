const telegramBot = require('node-telegram-bot-api');
const telegramCredentials = JSON.parse(process.env.TELEGRAM_CREDENTIALS)
const messageBot = new telegramBot(telegramCredentials.token, { polling: true });

var send = function send(message) {

    messageBot.sendMessage(telegramCredentials.chatId, message);

};

module.exports = {
    send: send
};