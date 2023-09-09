const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const authControllers = require('../../controllers/auth-controller');
const { check }  =  require('express-validator');

//@router GET api/auth
//@desc Test Route
//@access Public

router.get('/', auth, authControllers.getAuthUser); 

//@router POST api/auth
//@desc Authenticate user & get token.
//@access Public

router.post('/',auth , authControllers.postAuthUser); 


module.exports = router;