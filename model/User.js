const mongoose = require('mongoose');
const config = require('config');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    maxLength: 50,
    required: true,
  },

  email: {
    type: String,
    minLength: 5,
    maxLength: 255,
    match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    minLength: 5,
    maxLenght: 10,
    required: true,
  },

  avatar: {
    type: String,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.generateAuthToken = function () {
  const payload = {
    id: this.id,
  };

  const token = jwt.sign(payload, config.get('JwtPrivateKey'), {
    expiresIn: 360000,
  });
  return token;
};

const User = mongoose.model('User', userSchema);

const validation = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(20).required(),
  });

  return schema.validate(user);
};

module.exports = { validation };
module.exports = User;
