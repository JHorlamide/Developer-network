const asyncMiddleware = require('../middleware/async');
const Profile = require('../model/Profile');
const User = require('../model/User');
const { Post, postValidation } = require('../model/Post');

/***
 * @router  POST: api/posts
 * @desc    Create a post
 * @access  Private
 * ***/
const createPost = asyncMiddleware(async (req, res) => {
  const { error } = postValidation(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  const user = await User.findById(req.user.id).select('-password');

  const newPost = new Post({
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
    user: req.user.id,
  });

  const post = await newPost.save();

  res.json(post);
});

/***
 * @router  GET: api/posts
 * @desc    Get all posts
 * @access  Private
 * ***/
const getAllPosts = asyncMiddleware(async (req, res) => {
  const posts = await Post.find().sort({ date: -1 });

  res.json(posts);
});

/***
 * @router  GET: api/posts/post_id
 * @desc    Get single post
 * @access  Private
 * ***/
const getPost = asyncMiddleware(async (req, res) => {
  const post = await Post.findById(req.params.post_id);

  if (!post) {
    return res.status(404).json({ msg: 'Post not found' });
  }

  res.json(post);
});

/***
 *  @router  DELETE: api/posts/:post_id
 * @desc    Delete post
 * @access  Private
 * ***/
const deletePost = asyncMiddleware(async (req, res) => {
  const post = await Post.findById(req.params.post_id);

  if (!post) {
    return res.status(404).json({ msg: 'Post not found' });
  }

  if (post.user.toString() === req.user.id) {
    return res.status(401).json({ msg: 'User not authorized' });
  }

  await post.remove();

  res.json({ msg: 'Post removed' });
});

/***
 *  @router  PUT: api/posts/like/:id
 * @desc     Like a post
 * @access   Private
 * ***/
const LikePost = asyncMiddleware(async (req, res) => {
  const post = await Post.findById(req.params.post_id);

  /* Check if post has alreay been liked by login user */
  if (
    post.likes.filter((likes) => likes.user.toString() === req.user.id).length >
    0
  ) {
    return res.status(400).json({ msg: 'Post already liked' });
  }

  post.likes.unshift({ user: req.user.id });

  await post.save();

  res.json(post.likes);
});

/***
 * @router  PUT: api/posts/like/:id
 * @desc    Unlike post
 * @access  Private
 * ***/
const unLikePost = asyncMiddleware(async (req, res) => {
  const post = await Post.findById(req.params.post_id);

  /* Check if post has already been liked by logged in user */
  if (
    post.likes.filter((like) => like.user.toString() === req.user.id).length ===
    0
  ) {
    return res.status(400).json({ msg: 'Post has not yet been liked.' });
  }

  /* Post index */
  const removeIndex = post.likes
    .map((like) => like.user.toString())
    .indexOf(req.params.id);

  post.likes.splice(removeIndex, 1);

  await post.save();

  res.json(post.likes);
});

/***
 * @router  PUT: api/posts/comment/:post_id
 * @desc    Comment on a post
 * @access  Private
 * ***/
const commentPost = asyncMiddleware(async (req, res) => {
  const { error } = postValidation(req.body);

  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  const user = await User.findById(req.user.id);

  const post = await Post.findById(req.params.post_id);

  const newComment = {
    user: req.user.id,
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
  };

  post.comments.unshift(newComment);

  await post.save();

  res.json(post.comments);

  post.comments;
});

/***
 * @router  PUT: api/posts/comment/:post_id/:comment_id
 * @desc    Delete comment
 * @access  Private
 * ***/
const deleteComment = asyncMiddleware(async (req, res) => {
  const { post_id, comment_id } = req.params;

  const post = await Post.findById(post_id);

  /* Pull out comment from post */
  const comment = post.comments.find((comment) => comment.id === comment_id);

  /* Check if comment exists */
  if (!comment) {
    return res.json({ msg: 'Comment does not exist' });
  }

  /* Check if user create post */
  if (comment.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: 'User not authorized' });
  }

  /* Comment index */
  const removeIndex = post.comments
    .map((comment) => {
      return comment.user;
    })
    .indexOf(req.user.id);

  post.comments.splice(removeIndex, 1);

  await post.save();

  res.json(post.comments);
});

module.exports = {
  createPost,
  getAllPosts,
  getPost,
  deletePost,
  LikePost,
  unLikePost,
  commentPost,
  deleteComment,
};
