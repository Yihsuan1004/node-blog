const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const checkRole = require('../../middleware/role');
const authControllers = require('../../controllers/auth-controller');

//@router GET api/auth
//@desc Test Route
//@access Public

router.get('/', auth, checkRole(['admin']), authControllers.getAuthUser); 

//@router POST api/auth/login
//@desc Authenticate user & get token.
//@access Public

router.post('/login', authControllers.login); 

//@router POST api/auth/register
//@desc Register user
//@access Public

router.post('/register',authControllers.registerUser); 

module.exports = router;