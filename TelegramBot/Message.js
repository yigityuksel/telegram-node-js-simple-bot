process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');

const token = '';
const chatId = 0;

const bot = new TelegramBot(token, { polling: true });

var send = function send(message) {

    bot.sendMessage(chatId, message);

};

module.exports = {
    send: send
};