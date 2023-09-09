const express = require('express');
const router = express.Router();
const userControllers = require('../../controllers/user-controller');

//@router POST api/users
//@desc Register user
//@access Public

router.post('/',userControllers.registerUser); 

module.exports = router;