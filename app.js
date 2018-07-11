var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var request = require("request");
var fs = require('fs');
var util = require('util');
var app = express();

const cronJob = require('cron').CronJob;
const telegramMessageBot = require('./TelegramBot/Message')
const binance = require('node-binance-api');

var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(...args) {
    var output = args.join(' ');
    log_file.write(util.format(output) + '\r\n');
    log_stdout.write(util.format(output) + '\r\n');
};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const binanceInstance = new binance().options({
  APIKEY: '',
  APISECRET: '',
  useServerTime: true,
  test: true
});

new cronJob({
  cronTime: '0 */15 * * * *',
  onTick: function () {

    var message = "";

    request({ uri: "https://www.paribu.com/ticker" },
      function (error, response, body) {

        var paribu = JSON.parse(body);
        message += "BTCTRY : " + paribu.BTC_TL.last + " TRY \n";

        binanceInstance.prices((error, ticker) => {

          message += "BTCUSD : " + ticker.BTCUSDT + " USD \n";
          message += "BCNBTC : " + ticker.BCNBTC + " BTC \n";

          console.log("Message : " + message);

          telegramMessageBot.send(message);

        });

      }
    );

    console.log("worked at  : " + new Date());

  },
  start: true
});

module.exports = app;
