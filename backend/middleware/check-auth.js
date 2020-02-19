const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
      // retrieve token
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, 'secretsecret');
      next();
    } catch (error) {
        res.status(401).json({message: 'Auth failed!'});
    }
}