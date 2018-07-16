const jwt = require('jsonwebtoken');
const config = require('../../config.json');

module.exports = (req, res, next) => {
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided. Format is: Bearer [token]',
    });
  }

  req.locals = {};
  return jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Failed to authenticate token.',
        error: err,
      });
    }

    req.locals.userId = decoded.id;
    return next();
  });
};
