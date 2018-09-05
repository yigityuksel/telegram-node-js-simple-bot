require('dotenv').config();
const request = require("request");
const cronJob = require('cron').CronJob;
const binance = require('node-binance-api');
const logger = require('./utils/logger').logger;
const telegramMessageBot = require('./TelegramBot/Message');

if (process.env.BINANCE_CREDENTIALS == null || process.env.BINANCE_CREDENTIALS == undefined || process.env.BINANCE_CREDENTIALS == '') {
  logger.error("You need credentials.");
}

const binanceCredentials = JSON.parse(process.env.BINANCE_CREDENTIALS)

const binance_ = new binance().options({
  APIKEY: binanceCredentials.apiKey,
  APISECRET: binanceCredentials.apiSecret,
  useServerTime: true,
  test: true
});

logger.info("System has started");

new cronJob({
  cronTime: '0 */15 * * * *',
  onTick: function () {

    var message = "";

    request({ uri: "https://www.paribu.com/ticker" },
      function (error, response, body) {

        var paribu = JSON.parse(body);
        message += "BTCTRY : " + paribu.BTC_TL.last + " TRY \n";

        binance_.prices((error, ticker) => {

          message += "BTCUSD : " + ticker.BTCUSDT + " USD \n";
          message += "BCNBTC : " + ticker.BCNBTC + " BTC - Bought At : 246  \n";
          message += "XVGBTC : " + ticker.XVGBTC + " BTC - Bought At : 280  \n";
          message += "TRXBTC : " + ticker.TRXBTC + " BTC - Bought At : 400 \n";

          logger.info("Message : " + message);

          telegramMessageBot.send(message);

        });

      }
    );
  },
  runOnInit: true,
  start: true
});