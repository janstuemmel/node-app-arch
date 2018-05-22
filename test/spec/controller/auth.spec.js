const router = require('express').Router();

const { resetDatabase, createTestServer } = require('../../util');
const { tokenSign } = require('../../../src/util');

const User = require('../../../src/model/user');
const authController = require('../../../src/controller/auth');

describe('auth controller tests', () => {

  let test;
  const routeSpy = jest.fn((req, res) => res.sendStatus(200));
  const authBasicSpy = jest.fn(authController.authBasic);
  const authJwtSpy = jest.fn(authController.authJwt);

  beforeEach(async () => {
    await resetDatabase();
    await User.create({ email: 'foo@bar.com', password: 'fo0barbaz' });
  });

  // init web server
  beforeAll( async () => {
    router.get('/basic', authBasicSpy, routeSpy);
    router.get('/jwt', authJwtSpy, routeSpy);
    test = await createTestServer(router);
  });

  // close web server
  afterAll( async () => await test.close());

  // clearing spy functions
  afterEach(() => {
    routeSpy.mockClear();
    authBasicSpy.mockClear();
    authJwtSpy.mockClear();
  });


  it('should authorize basic', async () => {

    // given
    const headers = { Authorization: basicAuth('foo@bar.com', 'fo0barbaz')};

    // when
    const res = await test.get('/basic', { headers: headers });

    // then
    expect(res.status).toBe(200);
    expect(routeSpy).toHaveBeenCalled();
  });


  it('should not authorize basic - wrong credentials', async () => {

    // given
    const headers = { Authorization: basicAuth('not@exists.com', 'fo0barbaz')};

    // when
    const res = await test.get('/basic', { headers: headers });
    const body = await res.json();

    // then
    expect(body).toMatchObject({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'auth.fail.credentials',
      data: null
    });
    expect(res.status).toBe(401);
    expect(routeSpy).not.toHaveBeenCalled();
  });


  it('should authorize jwt', async () => {

    // given
    const headers = { Authorization: 'Bearer ' + tokenSign(1) };

    // when
    const res = await test.get('/jwt', { headers: headers });

    // then
    expect(res.status).toBe(200);
    expect(routeSpy).toHaveBeenCalled();
  });


  it('should not authorize jwt - wrong token', async () => {

    // given
    const headers = {
      Authorization: 'Bearer ' +
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        'b4dp4yl0ad.' + // bad payload
        'LbGLaeH8wawNdyQ3G9FZJmitKOoTc3Sm9fZLwPYwn7I'
    };

    // when
    const res = await test.get('/jwt', { headers: headers });
    const body = await res.json();

    // then
    expect(res.status).toBe(401);
    expect(routeSpy).not.toHaveBeenCalled();
    expect(body).toMatchObject({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'auth.fail.credentials',
      data: null
    });
  });

});

function basicAuth(username, password) {
  return 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
}
