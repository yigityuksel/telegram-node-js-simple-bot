const binance = require('node-binance-api');
const binanceCredentials = JSON.parse(process.env.BINANCE_CREDENTIALS)

const binance_ = new binance().options({
    APIKEY: binanceCredentials.apiKey,
    APISECRET: binanceCredentials.apiSecret,
    useServerTime: true,
    test: true
});

function getCoinsBitcoinValues(callback) {

    binance_.prices((error, result) => {

        if (error)
            callback(error);

        Object.keys(result).forEach(element => {

            if (!element.includes("BTC"))
                delete result[element];

        });

        callback(null, result);

    });

}

function getSelectedCoinsBitcoinValues(selectedCoins, callback) {

    getCoinsBitcoinValues(function (error, result) {

        if (error)
            callback(error);

        selectedCoins.forEach(element => {
            element.latestPrice = result[element.coinSymbol];
        });

        callback(null, selectedCoins);

    });

}

module.exports = {
    getCoinsBitcoinValues,
    getSelectedCoinsBitcoinValues
};