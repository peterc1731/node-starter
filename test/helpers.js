const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports = {
  getToken: id => jwt.sign({ id }, config.secret, { expiresIn: 10 }),
};
