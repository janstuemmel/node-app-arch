const Sequelize = require('sequelize');
const db = require('../db');

const Calendar = db.define('calendar', {
  name: { type: Sequelize.STRING, allowNull: false }
});

module.exports = Calendar;
