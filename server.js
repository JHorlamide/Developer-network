const express = require('express');

const route = require('./startup/route');
const logger = require('./startup/error_handler');
const { configSettings, NODE_ENV } = require('./startup/settings');

const app = express();

const PORT = process.env.PORT || 4000;

/* Initialize routes */
route(app);

/* Configuration settings  */
configSettings();

/* Checking node environment */
NODE_ENV();

app.listen(PORT, () => {
  logger.info(`Server started on  ${PORT}`);
});

