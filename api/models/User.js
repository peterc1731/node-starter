const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'The username must not be empty',
    unique: true,
  },
  email: {
    type: String,
    required: 'The email must not be empty',
    unique: true,
  },
  password: {
    type: String,
    required: 'The password must not be empty',
  },
});

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
