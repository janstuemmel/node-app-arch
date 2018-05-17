const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const util = require('../util');
const { secret } = require('../config');
const User = require('../model/user');

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret
};

passport.use(new BasicStrategy((email, password, cb) => {

  User.findOne({ email: email }, (err, user) => {

    if (err) return cb(err, false);

    if (!user) return cb(null, false, 'user not found');

    user.verifyPassword(password, (err, isMatch) => {

      if (err) return cb(err, false);

      if (!isMatch) return cb(null, false, 'bad password')

      return cb(null, user);
    });
  });
}));


module.exports.authBasic = authenticate('basic');

passport.use(new JwtStrategy(jwtOpts, (payload, cb) => {

  User.findById(payload.id, (err, user) => {

    if (err) return cb(err, false);

    if (!user) return cb(null, false);

    return cb(null, user);

  });
}));

module.exports.authJwt = authenticate('jwt');

module.exports.login = (req, res) => {

  const userId = req.user.id;
  const token = util.tokenSign(userId);

  res.json({ auth: true, token: token, message: 'auth.success' });
}

// HELPERS

function authFailResponse(message) {
  return { auth: false, token: null, message: message };
}

function authenticate(strategy) {
  return (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {

      if (err) return res.status(401).json(authFailResponse('auth.fail'));

      if (!user) return res.status(401).json(authFailResponse('auth.fail.user'));

      // on success pass user to request object
      req.user = user;

      // next middleware
      next();

    })(req, res, next); // call passport.autheticate as middleware
  };
}
