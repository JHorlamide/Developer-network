const express = require('express');
const error = require('../middleware/error');

/* Custom module */
const userRoute = require('../routes/api/user');
const postRoute = require('../routes/api/post');
const profileRoute = require('../routes/api/profile');
const authRoute = require('../routes/api/auth');

const route = (app) => {
  app.use(express.json({ extended: false }));

  app.use('/api/users', userRoute);
  app.use('/api/posts', postRoute);
  app.use('/api/profile', profileRoute);
  app.use('/api/auth', authRoute);
  app.use(error);
};

module.exports = route;
