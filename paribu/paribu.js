const request = require("request");

function getBitcoinLatestLiraValue(callback) {

    request({ uri: "https://www.paribu.com/ticker" },
        function (error, response, body) {

            if (error)
                callback(error);

            callback(null, JSON.parse(body).BTC_TL.last);

        }
    );

}

module.exports = {
    getBitcoinLatestLiraValue
};
