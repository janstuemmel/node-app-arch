const config = require('rc')('app', {

  db: {
    driver: 'mysql',
    host: 'db',
    user: 'app',
    password: 'app',
    name: 'app',
  },

  // secret for jwt
  secret: 's3cret'

});

module.exports = config;
