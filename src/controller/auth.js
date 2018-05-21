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

  User.findOne({ where: { email: email }, attributes: { include: 'password' } })
    .then(user => {

      if (!user) return cb(null, false);

      user.verifyPassword(password)
        .then(() => cb(null, user))
        .catch(err => cb(null, false))

    })
    .catch(err => cb(err, false));
}));


module.exports.authBasic = authenticate('basic');

passport.use(new JwtStrategy(jwtOpts, (payload, cb) => {

  User.findById(payload.id)
    .then(user => {

      if (!user) return cb(null, false);

      return cb(null, user);

    })
    .catch(err => cb(err, false));

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

// custom error handling (not just 401)
function authenticate(strategy) {
  return (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {

      // console.log(err);

      if (err) return res.status(401).json(authFailResponse('auth.fail'));

      if (!user) return res.status(401).json(authFailResponse('auth.fail.user'));

      // on success pass user to request object
      req.user = user;

      // next middleware
      next();

    })(req, res, next); // call passport.autheticate as middleware
  };
}
