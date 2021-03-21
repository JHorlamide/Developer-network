const express = require('express');

/* Routes Controller */
const PostController = require('../../controllers/PostController');

const router = express.Router();

/***
 * @router  GET: api/posts
 * @desc    Get all posts
 * @access  Public
 * ***/
router.get('/', PostController.index);

module.exports = router;
