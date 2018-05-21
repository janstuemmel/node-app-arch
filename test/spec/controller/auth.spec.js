const createTestServer = require('testtp');
const express = require('express');

const { resetDatabase } = require('../../util');

const User = require('../../../src/model/user');
const authController = require('../../../src/controller/auth');
const util = require('../../../src/util');

describe('auth controller tests', () => {

  beforeEach(async () => {
    await resetDatabase();
    await User.create({ email: 'test@example.com', password: 'fo0barbaz' });
  });

  describe('basic auth', () => {

    let test;
    const routeSpy = jest.fn((req, res) => res.send('OK'));
    const authSpy = jest.fn(authController.authBasic);

    // init web server
    beforeAll( async () => {
      const app = express();
      app.get('/', authSpy, routeSpy);
      test = await createTestServer(app);
    });

    // close web server
    afterAll( async () => await test.close());

    // clearing spy functions
    afterEach(() => {
      routeSpy.mockClear();
      authSpy.mockClear();
    });


    it('should authorize basic', async () => {

      // given
      const headers = {
        Authorization: genBasicAuthString('test@example.com', 'fo0barbaz')
      };

      // when
      const res = await test.get('/', { headers: headers });
      const body = await res.text();

      // then
      expect(body).toBe('OK');
      expect(res.status).toBe(200);
      expect(routeSpy).toHaveBeenCalled();
    });


    it('should not authorize basic - wrong credentials', async () => {

      // given
      const headers = {
        Authorization: genBasicAuthString('not@exists.com', 'fo0barbaz')
      };

      // when
      const res = await test.get('/', { headers: headers });
      const body = await res.json();

      // then
      expect(body).toMatchObject({
        auth: false,
        token: null,
        message: 'auth.fail.user'
      });
      expect(res.status).toBe(401);
      expect(routeSpy).not.toHaveBeenCalled();
    });
  });


  describe('jwt auth', () => {

    let test;
    const routeSpy = jest.fn((req, res) => res.send('OK'));
    const authSpy = jest.fn(authController.authJwt);

    // init web server
    beforeAll( async () => {
      const app = express();
      app.get('/', authSpy, routeSpy);
      test = await createTestServer(app);
    });

    // close web server
    afterAll( async () => await test.close());

    // clearing spy functions
    afterEach(() => {
      routeSpy.mockClear();
      authSpy.mockClear();
    });


    it('should authorize jwt', async () => {

      // given
      const user = await User.findOne();
      const token = util.tokenSign(user.id);
      const headers = {
        Authorization: 'Bearer ' + token
      };

      // when
      const res = await test.get('/', { headers: headers });
      const body = await res.text();

      // then
      expect(body).toBe('OK');
      expect(res.status).toBe(200);
      expect(routeSpy).toHaveBeenCalled();
    });


    it('should not authorize jwt - wrong token', async () => {

      // given
      const user = await User.findOne();
      const token = util.tokenSign(user.id);
      const headers = {
        Authorization: 'Bearer ' +
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
          'b4dp4yl0ad.' + // bad payload
          'LbGLaeH8wawNdyQ3G9FZJmitKOoTc3Sm9fZLwPYwn7I'
      };

      // when
      const res = await test.get('/', { headers: headers });
      const body = await res.json();

      // then
      expect(body).toMatchObject({
        auth: false,
        token: null,
        message: 'auth.fail.user'
      });
      expect(res.status).toBe(401);
      expect(routeSpy).not.toHaveBeenCalled();
    });


  });

});

function genBasicAuthString(username, password) {
  return 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
}
