const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult}  =  require('express-validator');
const User = require('../models/User');
const HttpError = require('../models/http-error');
const { check }  =  require('express-validator');

const login = async(req,res,next) => {
    // Array of validation chains
    const validationChains =  [
        check('email','Please include a valid email').isEmail(),
        check('password','Password is required.').exists()
    ];

    // Execute the validation chains
    await Promise.all(validationChains.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new HttpError('Validation failed', 400).toJSON();
    }

    const { email , password } = req.body;

    try{
        //Verify if user exists
        let user = await User.findOne({email});

        if(!user){
            throw new HttpError('Invalid Credentials.', 400).toJSON();
        }


        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            throw new HttpError('Invalid Credentials.', 400).toJSON();
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
            {expiresIn: 360000},
            (err,token)=>{
                if(err) throw err;
                res.json({ 
                    token, 
                    role:user.role 
                });
            }
        )

    } catch (err){
        if (err instanceof HttpError) {
            next(err);
        } else {
            console.error(err.message);
            next(new HttpError('Server error', 500).toJSON());
        }
    }
    
}


const getAuthUser = async(req,res) =>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err){
        console.error(err);
        res.status(500).send('Server Error');
    }
}


exports.getAuthUser = getAuthUser;
exports.login = login;