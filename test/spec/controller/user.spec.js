const createTestServer = require('testtp');
const express = require('express');
const bodyParser = require('body-parser');

const { resetDatabase } = require('../../util');

const userController = require('../../../src/controller/user');
const User = require('../../../src/model/user');

const POST_HEADERS = { 'Content-Type': 'application/json' };

describe('user controller tests', () => {

  describe('postUser tests', () => {

    let test;

    beforeAll( async () => {
      const app = express();
      app.use(bodyParser.json());
      app.post('/', userController.postUser);
      test = await createTestServer(app);
    });

    afterAll( async () => await test.close());

    beforeEach(done => resetDatabase().then(done));

    it('should post user', async () => {

      // given
      const user = JSON.stringify({ email: 'foo@bar.com', password: 'fo0barbaz' });

      // when
      const res = await test.post('/', { body: user, headers: POST_HEADERS });
      const body = await res.json();

      // then
      expect(body).toMatchObject({
        id: 1,
        email: 'foo@bar.com'
      });
    });


    it('should post user fail - email invalid', async () => {

      // given
      const user = JSON.stringify({ email: 'not_valid', password: 'baz' });

      // when
      const res = await test.post('/', { body: user, headers: POST_HEADERS });
      const body = await res.json();

      // then
      expect(body.errors[0]).toMatchObject({ message: 'Validation isEmail on email failed'});
    });

    // TODO: add password check
    it.skip('should post user fail - password invalid', async () => {

      // given
      const user = JSON.stringify({ email: 'foo@bar.com', password: '2short' });

      // when
      const res = await test.post('/', { body: user, headers: POST_HEADERS });
      const body = await res.json();

      // then
      expect(body).toMatchObject({ _message: 'User validation failed'});
    });


    it('should post user fail - email already exists', async () => {

      // given
      const user = JSON.stringify({ email: 'foo@bar.com', password: 'fo0barbaz' });
      await test.post('/', { body: user, headers: POST_HEADERS });

      // when
      const res = await test.post('/', { body: user, headers: POST_HEADERS });
      const body = await res.json();

      // then
      expect(body.errors[0]).toMatchObject({ message: 'email must be unique' });
    });


    it('should post user fail - empty request body', async () => {

      // when
      const res = await test.post('/');
      const body = await res.json();

      // then
      expect(body.errors[0]).toMatchObject({ message: 'user.email cannot be null'});
      expect(body.errors[1]).toMatchObject({ message: 'user.password cannot be null'});
    });

  });
});
