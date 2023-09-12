const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (allowedRoles) {
  return (req, res, next) => {
    const token = req.header('x-auth-token'); // Assuming "Bearer TOKEN"
    
    // Check if not token
    if(!token){
        return res.status(401).json({msg: 'No token, authorization denied'});
    }

    try {
    const decoded = jwt.verify(token,config.get('jwtSecret'));
      const userRole = decoded.user.role;

      if (allowedRoles.includes(userRole)) {
        next();
      } else {
        res.status(403).send('Access denied');
      }
    } catch (error) {
      res.status(401).send('Invalid token');
    }
  };
}
