const db = require('../src/db');

module.exports.resetDatabase = async () => {

  // disables foreign key checks
  await db.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });

  // resets database to initial state
  await db.sync({ force: true });
};
