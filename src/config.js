const config = require('rc')('app', {

  // mongo db connection string
  db: 'mongodb://db/app',

  // secret for jwt
  secret: 's3cret'

});

module.exports = config;
