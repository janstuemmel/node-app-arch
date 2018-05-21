const createTestServer = require('testtp');
const express = require('express');
const bodyParser = require('body-parser');

const { resetDatabase } = require('../../util');

const calendarController = require('../../../src/controller/calendar');
const Calendar = require('../../../src/model/calendar');

const POST_HEADERS = { 'Content-Type': 'application/json' };

describe('user controller tests', () => {

  describe('postUser tests', () => {

    let test;

    beforeAll( async () => {
      const app = express();
      app.use(bodyParser.json());
      app.post('/', calendarController.post);
      test = await createTestServer(app);
    });

    afterAll( async () => await test.close());

    beforeEach(done => resetDatabase().then(done));

    it('should post user', async () => {

      // given
      const cal = JSON.stringify({ name: 'foo' });

      // when
      const res = await test.post('/', { body: cal, headers: POST_HEADERS });
      const body = await res.text();

      // then
      console.log(body);
    });

  });
});
