const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = {
  getToken: id => jwt.sign({ id }, config.token.secret, { expiresIn: 10 }),
};
