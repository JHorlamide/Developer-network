const jwt = require('jsonwebtoken');
const config = require('config');

const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res
      .status(401)
      .json({ msg: 'Authorization denied, token not valid' });
  }

  try {
    const decoded = jwt.verify(token, config.get('JwtPrivateKey'));
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = auth;