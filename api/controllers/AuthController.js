const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config');
const User = require('../models/User');

exports.register_a_new_user = (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ success: false, message: 'Invalid user data' });
  }
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
  return new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  }).save()
    .then(user => res.status(200).json({ success: true, message: `User ${user.name} successfully created` }))
    .catch(error => res.status(500).json({ success: false, error }));
};

exports.get_user_from_token = (req, res) => User.findOne(
  { name: req.locals.user },
  { password: 0 },
)
  .then((user) => {
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    return res.status(200).json({ success: true, user });
  })
  .catch(error => res.status(500).json({ success: false, error }));

exports.login_an_existing_user = (req, res) => User.findOne({ email: req.body.email })
  .then((user) => {
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).json({ success: false, token: null });
    const token = jwt.sign(
      { id: user.name },
      config.token.secret,
      { expiresIn: config.token.lifetime },
    );
    return res.status(200).json({ success: true, token });
  })
  .catch(error => res.status(500).json({ success: false, error }));

exports.logout_a_user = (req, res) => User.findOne(
  { name: req.locals.user },
  { password: 0 },
)
  .then((user) => {
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    return res.status(200).json({ success: true, token: null });
  })
  .catch(error => res.status(500).json({ success: false, error }));

exports.unregister_a_user = (req, res) => User.findOne(
  { name: req.locals.user },
  { password: 0 },
)
  .then((user) => {
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    return User.findByIdAndRemove(user._id)
      .then(() => res.status(200).json({ success: true, message: 'User successfully removed' }));
  })
  .catch(error => res.status(500).json({ success: false, error }));
