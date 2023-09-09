const c = require('config');
const express = require('express');
const router = express.Router();
const HttpError = require('../../models/http-error');
const Post = require('../../models/Post');


//@router POST /api/posts
//@desc Create Post.
//@access Public

router.post('/',async (req, res, next) => {
  try {
      const { title, content } = req.body;
      const post = new Post({
          title,
          content,
      });

      console.log('post',post);
      await post.save();
      res.status(201).json(post);
  } catch (error) {
      next(new HttpError('Server error', 500));
  }
}); 


//@router GET api/posts
//@desc Get all posts.
//@access Public
router.get('/',(req,res) => res.send('Posts route')); 

//@router  GET api/posts/:postId
//@desc Get single post.
//@access Public
router.get('/:postId', async (req, res, next) => {
  try {
      const post = await Post.findById(req.params.postId);

      if (!post) next(new HttpError('Post not found', 404));

      res.json(post);

  } catch (error) {
      next(new HttpError('Server error', 500));
  }
}); 

//@router PUT /api/posts/:postId
//@desc Edit Post.
//@access Public
router.put('/:postId', async (req, res) => {
  try {
      let post = await Post.findById(req.params.postId);
      
      if (!post) next(new HttpError('Post not found', 404));

      const { title, content } = req.body;

      if (title) post.title = title;
      if (content) post.content = content;

      await post.save();
      res.json(post);
  } catch (error) {
      next(new HttpError('Server error', 500));
  }
}); 

//@router DELETE api/posts
//@desc Delete Post.
//@access Public
router.delete('/:postId', async (req,res,next) =>  {
  try {
      console.log('postId',req.params.postId);
      const post = await Post.findById(req.params.postId);

      if (!post) next(new HttpError('Post not found', 404));

      await post.deleteOne();

      res.json({ msg: 'Post removed' });

  } catch (error) {
      next(new HttpError('Server error', 500));
  }
}); 


module.exports = router;