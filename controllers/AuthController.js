const bcrypt = require('bcrypt');
const Joi = require('joi');
const User = require('../model/User');
const asyncMiddleware = require('../middleware/async');

const inputValidation = (user) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(20).required(),
  });

  return schema.validate(user);
};

/***
 * @router  GET: api/auth
 * @desc    Authentication
 * @access  Private
 * ***/
const getAuthUser = asyncMiddleware(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');

  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  res.json({ user });
});

/***
 * @router  POST: api/auth
 * @desc    Authenticate user & get token
 * @access  Public
 * ***/
const authUser = asyncMiddleware(async (req, res) => {
  const { email, password } = req.body;

  const { error } = inputValidation({ email, password });
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  /* Check if user exists */
  let user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ msg: 'Invalide Credentials' });
  }

  /* Validate user password */
  const validatePassowrd = await bcrypt.compare(password, user.password);
  if (!validatePassowrd) {
    return res.status(400).json({ msg: 'Invalide Credentials' });
  }

  const token = user.generateAuthToken();
  res.json({ token });
});

module.exports = { getAuthUser, authUser };
