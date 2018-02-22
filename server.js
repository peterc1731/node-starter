var express = require('express'),
    mongoose = require('mongoose'),
    routes = require('./api/routes/routes'),
    userModel = require('./api/models/User'),
    bodyParser = require('body-parser'),
    app = express(),
    port = process.env.PORT || 3000

//mongoose instance connection
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/Auth')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static('public'))

routes(app)

app.listen(port)

console.log('RESTful API server started on: ' + port)