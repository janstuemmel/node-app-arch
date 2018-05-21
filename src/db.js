const Sequelize = require('sequelize');
const { db } = require('./config');

const sequelize = new Sequelize(db.name, db.user, db.password, {

  // TODO: make this configurable for dev environments
  pool: { max: 1, min: 1 },
  operatorsAliases: false,
  logging: false,

  host: db.host,
  dialect: db.driver
});

module.exports = sequelize;
