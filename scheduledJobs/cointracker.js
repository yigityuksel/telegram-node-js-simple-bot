const cronJob = require('cron').CronJob;
const paribu = require('../paribu/paribu');
const binance = require('../binance/binance');
const logger = require('../utils/logger').logger;
const telegramMessageBot = require('../TelegramBot/Message');

const cronTime = '0 */15 * * * *';
const selectedCoins = JSON.parse(process.env.SELECTED_COINS);

function start() {

    new cronJob({
        cronTime: cronTime,
        onTick: function () {

            var message = "";

            paribu.getBitcoinLatestLiraValue(function (error, result) {

                if (error) {
                    logger.error(error);
                    return;
                }

                message += "BTCTRY : " + result + " TRY \n";

                binance.getSelectedCoinsBitcoinValues(selectedCoins, function (binanceError, binanceResult) {

                    if (binanceError) {
                        logger.error(binanceError);
                        return;
                    }

                    binanceResult.forEach(element => {
                        message += element.coinSymbol + " : " + element.latestPrice;

                        if (element.boughtAt != 0) {
                            message += " BTC - Bought At : " + element.boughtAt;
                        }

                        message += "\n";

                    });

                    telegramMessageBot.send(message);

                });

            });

        },
        runOnInit: true,
        start: true
    });

}

module.exports = {
    start
}