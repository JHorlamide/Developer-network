const express = require('express');

/* Custom module */

const route = (app) => {
  app.use(express.json());

  app.get('/api/user', (req, res) => {
    res.send('API Running');
  });
};

module.exports = route;