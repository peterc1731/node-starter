var mongoose = require('mongoose')
var User = mongoose.model('User')

exports.get_all_users = function (req, res) {
    User.find({}, function(err, users) {
        if (err) res.send(err)
        else res.json(users)
    })
}

exports.create_a_user = function (req, res) {
    var new_user = new User(req.body)
    new_user.save(function (err, user) {
        if (err) res.send(err)
        else res.json(user)
    });
}

exports.get_a_user = function (req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) res.send(err)
        else res.json(user)
    })
}

exports.update_a_user = function (req, res) {
     User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, user) {
         if (err) res.send(err)
         else res.json(user)
     }) 
}

exports.delete_a_user = function (req, res) {
    User.findByIdAndRemove({ _id: req.params.id }, function (err, user) {
        if (err) res.send(err)
        else res.json(user)
    })
}