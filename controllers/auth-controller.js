const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check , validationResult}  =  require('express-validator');
const User = require('../models/User');
const HttpError = require('../models/http-error');

exports.login = async(req,res,next) => {
    // Array of validation chains
    const validationChains =  [
        check('email','Please include a valid email').isEmail(),
        check('password','Password is required.').exists()
    ];

    // Execute the validation chains
    await Promise.all(validationChains.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError('Validation failed', 400));
    }

    const { email , password } = req.body;

    try{
        //Verify if user exists
        let user = await User.findOne({email});

        if(!user){
            return next(new HttpError('Invalid Credentials.', 400));
        }


        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return next(new HttpError('Invalid Credentials.', 400));
        }
     
        //Return jsonwebtoken
        const payload = {
            user:{
                id: user.id,
                role: user.role
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn: '12h'},
            (err,token)=>{
                if(err) throw err;
                res.json({ 
                    token,
                    id: user.id,
                    role:user.role  
                });
            }
        )

    } catch (err){
        if (err instanceof HttpError) {
            next(err);
        } else {
            console.error(err.message);
            next(new HttpError('Server error', 500));
        }
    }
    
}


exports.getAuthUser = async(req,res) =>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err){
        console.error(err.message);
        next(new HttpError('Server error', 500));
    }
}

exports.registerUser = async(req, res, next) => {

    // Array of validation chains
    const validationChains = [
        check('fullName', 'Fullname is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ];

    // Execute the validation chains
    await Promise.all(validationChains.map(validation => validation.run(req)));


    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: errors.array()  
            })
        }

        const { fullName, email, password } = req.body;

        // Verify if user exists
        let user = await User.findOne({ email });

        if (user) {
            return next(new HttpError('User already exists.', 400));
        }

        user = new User({
            fullName,
            email,
            password
        });

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.json({ message: 'Registration Success.' });
       

    } catch (err) {
        if (err instanceof HttpError) {
            next(err);
        } else {
            console.error(err.message);
            next(new HttpError('Server error', 500));
        }
    }
};
