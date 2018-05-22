const Boom = require('boom');
const { assign, map } = require('lodash');
const jwt = require('jsonwebtoken');

const { secret } = require('./config');

module.exports.tokenSign = (userId, opts) => {
  return jwt.sign({ id: userId }, secret, opts);
};

module.exports.tokenVerify = (token) => {

  return new Promise((res, rej) => {

    jwt.verify(token, secret, (err, decoded) => {

      if (err) return rej(err);

      return res(decoded);
    });

  });
};

// from http://thecodebarbarian.com/80-20-guide-to-express-error-handling.html
module.exports.routeWrapAsync = (fn) => {
  return function(req, res, next) {
    fn(req, res, next).catch(next);
  };
};

module.exports.errorHandler = (err, req, res, next) => {

  switch(err.name) {
    case 'SequelizeUniqueConstraintError':
      err = Boom.conflict('db.fail.unique', mapSequelizeErrors(err.errors));
      break;
    case 'SequelizeValidationError':
      err = Boom.badData('db.fail.validation', mapSequelizeErrors(err.errors));
      break;
    default:
      err = (!err.isBoom) ? Boom.boomify(err) : err;
  }

  // send status and error
  res
    .status(err.output.statusCode)
    .send({ ...err.output.payload, data: err.data });
};

// HELPERS

function mapSequelizeErrors(errors) {
  return map(errors, (item) => {
    return {
      path: item.path,
      constraint: item.validatorKey
    }
  });
}
