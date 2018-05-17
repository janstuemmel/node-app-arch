const app = require('express')();
const bodyParser = require('body-parser');
const passport = require('passport');

const routes = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use(routes);

module.exports = app;
