const fs = require('fs');
const moment = require('moment');
const cronJob = require('cron').CronJob;
const binance = require('../binance/binance');
const logger = require('../utils/logger').logger;
const telegramMessageBot = require('../TelegramBot/Message');

const minimumLapRate = 5;
const cronTime = '0 */5 * * * *';

function start() {

    new cronJob({
        cronTime: cronTime,
        onTick: function () {

            binance.getCoinsBitcoinValues(function (binanceError, binanceResult) {

                var message = "";
                var result = JSON.parse("[]");
                var path = "coin_history/" + moment().format("DD-MM-YYYY") + ".txt";

                fs.readFile(path, 'utf8', function (err, data) {

                    if (err)
                        logger.warn("The " + path + " is not avaliable and will be created ");
                    else
                        result = JSON.parse(data);

                    if (result.length > 0) {

                        var latestCoinInfo = result[result.length - 1].content;

                        Object.keys(latestCoinInfo).forEach(element => {

                            var lapRate = ((binanceResult[element] - latestCoinInfo[element]) / latestCoinInfo[element] * 100);

                            if (latestCoinInfo[element] > 0.00000100) {
                                if (lapRate > minimumLapRate)
                                    message += element + " lap rate is " + lapRate.toPrecision(2) + " from : " + latestCoinInfo[element] + " to : " + binanceResult[element] + "\n";
                            } else {
                                if (lapRate > minimumLapRate * 2)
                                    message += element + " lap rate is " + lapRate.toPrecision(2) + " from : " + latestCoinInfo[element] + " to : " + binanceResult[element] + "\n";
                            }

                        });

                        if (!message == "")
                            telegramMessageBot.send(message);

                    }

                    result.push({
                        date: moment().format("DD-MM-YYYY hh:mm:ss"),
                        content: binanceResult
                    });

                    fs.writeFile(path, JSON.stringify(result), function (err) {

                        if (err)
                            logger.error(err);

                        logger.warn("The file " + path + " saved");

                    });

                });

            });

        },
        start: true,
        runOnInit: true
    });

}

module.exports = {
    start
}