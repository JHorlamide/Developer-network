const express = require('express');
const authMiddleware = require('../../middleware/auth');


/* Routes Controller */
const AuthController = require('../../controllers/AuthController');

const router = express.Router();

/***
 * @router  GET: api/auth
 * ***/
router.get('/', authMiddleware, AuthController.getAuthUser);

/***
 * @router  POST: api/auth
 * ***/
router.post('/', AuthController.authUser);

module.exports = router;
