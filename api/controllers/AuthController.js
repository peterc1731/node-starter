var User = require('../models/User'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcryptjs'),
    config = require('../../config'),
    mongoose = require('mongoose')

exports.register_a_new_user = function (req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8)
    var new_user = new User({
        name : req.body.name,
        email : req.body.email,
        password : hashedPassword
    })
    new_user.save(function (err, user) {
        if (err) return res.status(500).send(err)
        res.json({ success: true, message: "User " + req.body.name + " successfully created" })
    });
}

exports.get_user_from_token = function (req, res) {
    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.")
        if (!user) return res.status(404).send("User not found.")
        res.send(user)
    })
}

exports.login_an_existing_user = function (req, res) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).send('Error on the server.')
        if (!user) return res.status(404).send('No user found.')
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.send({ auth: true, token: token });
    })
}

exports.logout_a_user = function (req, res) {
    res.send({ auth: false, token: null })
}