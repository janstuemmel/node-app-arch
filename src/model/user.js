const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('../db');

const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    validate: { isEmail: true },
    allowNull: false
  },
  password: { type: Sequelize.STRING, allowNull: false }
}, {
  defaultScope: { attributes: { exclude: [ 'password' ] } }
});

module.exports = User;

User.beforeCreate((user, opt) => {

  // return promise
  return bcrypt.hash(user.password, 5).then(hash => {

    // set has as password
    user.password = hash;
  });
});

User.prototype.verifyPassword = function(password) {

  return new Promise((res, rej) => {

    bcrypt.compare(password, this.password, (err, isMatch) => {

      if (err) return rej(err);

      if (!isMatch) return rej(new Error('password not valid'))

      return res();

    });
  });
}
