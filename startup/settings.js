const logger = require('./error_handler');
const config = require('config');


/* Configuration settings for Json Web Token */
const configSettings = function () {
  if (!config.get('jwtScrete')) {
    throw new Error('FATAL ERROR: JwtPrivateKey is not defined');
  }
};


/* Checking NODE_ENV */
const NODE_ENV = function () {
  if (process.env.NODE_EN !== 'production') {
    logger.info('NODE_ENV NOT IN PRODUCTION');
  }
};

module.exports = configSettings;
module.exports = NODE_ENV;

