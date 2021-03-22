const express = require('express');
const auth = require('../../middleware/auth');

/* Routes Controller */
const PostController = require('../../controllers/PostController');

const router = express.Router();

/***
 * @router  POST: api/posts
 * ***/
router.post('/', auth, PostController.createPost);

/***
 * @router  GET: api/posts
 * ***/
router.get('/', auth, PostController.getAllPosts);

/***
 * @router  GET: api/posts/post_id
 * ***/
router.get('/:post_id', auth, PostController.getPost);

/***
 * @router  DELETE: api/posts/:post_id
 * ***/
router.delete('/:post_id', auth, PostController.deletePost);

/***
 *  @router  PUT: api/posts/like/:post_id
 * ***/
router.put('/like/:post_id', auth, PostController.LikePost);

/***
 *  @router  PUT: api/posts/unlike/:post_id
 * ***/
router.put('/unlike/:post_id', auth, PostController.unLikePost);

/***
 *  @router  PUT: api/posts/comment/:post_id
 * ***/
router.put('/comment/:post_id', auth, PostController.commentPost);

/***
 *  @router  DELETE: api/posts/comment/:post_id/:comment_id
 * ***/
router.delete(
  '/comment/:post_id/:comment_id',
  auth,
  PostController.deleteComment
);

module.exports = router;
