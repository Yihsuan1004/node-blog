const express = require('express');
const router = express.Router();
const userControllers = require('../../controllers/users-controller');
const auth = require("../../middleware/auth");

//@router GET api/users/:userId/profile
//@desc GET user profie
//@access Public
router.get('/:userId/profile',auth, userControllers.getUserProfile);

//@router PUT api/users/:userId/profile
//@desc PUT user profie
//@access Public
router.put('/:userId/profile',auth, userControllers.updateUserProfile);


//@router GET api/users/:userId/posts
//@desc GET user posts
//@access Public
router.get('/:userId/posts',auth,userControllers.getUserPosts);

module.exports = router;