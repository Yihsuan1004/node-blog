const express = require("express");
const router = express.Router();
const postControllers = require("../../controllers/posts-controller");
const auth = require("../../middleware/auth");

//@router POST /api/posts
//@desc Create Post.
//@access Public
router.post("/", auth, postControllers.createPost);

//@router GET api/posts
//@desc Get all posts.
//@access Public
router.get("/", auth, postControllers.getAllPost);

//@router GET api/posts/byTag
//@desc Get all posts by tag.
//@access Public
router.get("/byTag", auth, postControllers.getPostsByTag);


//@router  GET api/posts/:postId
//@desc Get single post.
//@access Public
router.get("/:postId", auth, postControllers.getPost);

//@router PUT /api/posts/:postId
//@desc Edit Post.
//@access Public
router.put("/:postId", auth, postControllers.updatePost);

//@router DELETE api/posts
//@desc Delete Post.
//@access Public
router.delete("/:postId", auth, postControllers.deletePost);




module.exports = router;
