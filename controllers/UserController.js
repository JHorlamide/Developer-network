const asyncMiddleware = require('../middleware/async');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const _ = require('lodash');

/* Custom Modules */
const validation = require('../model/User');
const User = require('../model/User');


/***
 * @router  GET: api/users
 * @desc    Register users
 * @access  Public
 * ***/
const createUser = asyncMiddleware(async (req, res) => {
  const { name, email, password } = req.body;

  const { error } = validation({ name, email, password });
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  let user = await User.findOne({ email: email });
  if (user) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  const avatar = gravatar.url(email, {
    s: '200',
    r: 'pg',
    d: 'mm',
  });

  user = new User({ name, email, avatar, password });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();

  res.header('x-aut-token', token).json({ token });
});

module.exports = { createUser };
