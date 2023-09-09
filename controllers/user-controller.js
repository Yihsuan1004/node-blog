
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {validationResult}  =  require('express-validator');
const User = require('../../models/User');
const HttpError = require('../models/http-error');

const registerUser = async(req, res, next) => {

    // Array of validation chains
    const validationChains = [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ];

    // Execute the validation chains
    await Promise.all(validationChains.map(validation => validation.run(req)));


    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpError('Validation failed', 400).toJSON();
        }

        const { name, email, password } = req.body;

        // Verify if user exists
        let user = await User.findOne({ email });

        if (user) {
            throw new HttpError('User already exists.', 400).toJSON();
        }

        user = new User({
            name,
            email,
            password
        });

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw new HttpError('Token generation failed', 500).toJSON();
                res.json({ token });
            }
        );

    } catch (err) {
        if (err instanceof HttpError) {
            next(err);
        } else {
            console.error(err.message);
            next(new HttpError('Server error', 500));
        }
    }
};


exports.registerUser = registerUser;