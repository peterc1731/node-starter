const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./api/routes/routes');
const log = require('./api/utils/logger');
const config = require('./config.json');

const app = express();
const port = process.env.PORT || config.port || 3000;

module.exports = app;

log.title('Node API Starter');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb.url, { useNewUrlParser: true })
  .then(() => {
    log.message(`MongoDB connected @ ${config.mongodb.url}`);

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    routes(app);

    app.listen(port);

    log.message(`Server started on port ${port}`);
  }).catch((err) => {
    log.error('Error starting server');
    log.error(err);
  });
