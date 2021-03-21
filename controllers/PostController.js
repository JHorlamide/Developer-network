const asyncMiddleware = require('../middleware/async');

const index = asyncMiddleware(async (req, res) => {
  res.send('This is post route');
});

module.exports = { index };
