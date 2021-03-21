const express = require('express');

/* Routes Controller */
const UserController = require('../../controllers/UserController');

const router = express.Router();

/***
 * @router  GET: api/users
 * ***/
router.post('/', UserController.createUser);

module.exports = router;
