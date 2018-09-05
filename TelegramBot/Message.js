process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');

const telegramCredentials = JSON.parse(process.env.TELEGRAM_CREDENTIALS)

const bot = new TelegramBot(telegramCredentials.token, { polling: true });

var send = function send(message) {

    bot.sendMessage(telegramCredentials.chatId, message);

};

module.exports = {
    send: send
};