require('dotenv').config();
const logger = require("./utils/logger").logger;
const coinTracker = require("./scheduledJobs/cointracker");
const coinFounder = require("./scheduledJobs/coinfounder");

if (process.env.BINANCE_CREDENTIALS == null) {
  logger.error("You need credentials.");
}

logger.info("System has started");

coinTracker.start();
coinFounder.start();