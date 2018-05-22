const createTestServer = require('testtp');
const express = require('express');
const bodyParser = require('body-parser');

const db = require('../src/db');
const { errorHandler } = require('../src/util');

module.exports.resetDatabase = async () => {

  // disables foreign key checks
  await db.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });

  // resets database to initial state
  await db.sync({ force: true });
};

module.exports.createTestServer = async (router) => {

  const app = express();
  app.use(bodyParser.json());
  app.use(router);
  app.use(errorHandler);

  return await createTestServer(app);
}
