const express = require('express');
const router = express.Router();
const userControllers = require('../../controllers/users-controller');

//@router GET api/users/:userId/profile
//@desc GET user profie
//@access Public
router.get('/:userId/profile', userControllers.getUserProfile);

//@router PUT api/users/:userId/profile
//@desc PUT user profie
//@access Public
router.put('/:userId/profile', userControllers.updateUserProfile);

module.exports = router;