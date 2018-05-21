const Sequelize = require('sequelize');
const db = require('../db');

const User = require('./user');
const Calendar = require('./calendar');

const Role = db.define('role', {
  role: {
    type: Sequelize.ENUM,
    allowNull: false,
    values: [ 'owner', 'admin', 'user' ],
    default: 'user'
  }
});

User.belongsToMany(Calendar, { through: Role });
Calendar.belongsToMany(User, { through: Role });

module.exports = Role;
