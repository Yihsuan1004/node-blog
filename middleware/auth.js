const jwt = require('jsonwebtoken');
const config = require('config');


module.exports = function(req, res, next) {
    //Get token from header
    const bearerHeader =  req.header('Authorization');

    // Check if not auth header
    if(!bearerHeader){
        return res.status(401).json({msg: 'No token, authorization denied'});
    }

    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    
    //Verify token
    try{
        const decoded = jwt.verify(token,config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    }
    catch(err){
        res.status(401).json({msg: 'Token is not valid'});
    }
}