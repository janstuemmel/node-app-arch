const { assign } = require('lodash');
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
