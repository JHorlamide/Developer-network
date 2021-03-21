const logger = require('../startup/error_handler');

const error = (error, req, res, next) => {
  logger.error(error.message, error);

  if (error.kind === 'ObjectId') {
    return res.status(404).json({ msg: 'Profile not found' });
  }

  console.error(error.message);

  res
    .status(500)
    .json({ msg: 'Internal Server Error. Could not perform request.' });
};

module.exports = error;
