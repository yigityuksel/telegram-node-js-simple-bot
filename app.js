require('dotenv').config();
const logger = require("./utils/logger").logger;
const coinTracker = require("./scheduledJobs/cointracker");
const coinFounder = require("./scheduledJobs/coinfounder");
const express = require('express');
const cors = require('cors');
const app = express();

logger.info("System has started");

coinTracker.start();
coinFounder.start();

app.use(cors());

app.post('/updateCoinList', function (req, res) {
  res.send('Hello World');
})

app.listen(3000, function () {
  console.log('CORS-enabled web server listening on port 3000');
});