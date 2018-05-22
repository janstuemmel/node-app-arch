const router = require('express').Router();

const { resetDatabase, createTestServer } = require('../../util');

const userController = require('../../../src/controller/user');
const User = require('../../../src/model/user');

const POST_HEADERS = { 'Content-Type': 'application/json' };

describe('user controller tests', () => {

  let test;

  beforeAll( async () => {
    router.post('/', userController.postUser);
    test = await createTestServer(router);
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
    expect(body).toMatchObject({ id: 1, email: 'foo@bar.com' });
  });


  it('should post user fail - email invalid', async () => {

    // given
    const user = JSON.stringify({ email: 'not_valid', password: 'baz' });

    // when
    const res = await test.post('/', { body: user, headers: POST_HEADERS });
    const body = await res.json();

    // then
    expect(body).toMatchObject({
      statusCode: 422,
      data: [ { constraint: 'isEmail', path: 'email' } ],
      message: 'db.fail.validation',
    });
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
    expect(body).toMatchObject({
      statusCode: 409,
      message: 'db.fail.unique',
      data: [ { constraint: 'not_unique', path: 'email' } ]
    });
  });


  it('should post user fail - empty request body', async () => {

    // when
    const res = await test.post('/');
    const body = await res.json();

    // then
    expect(body).toMatchObject({
      statusCode: 422,
      message: 'db.fail.validation',
      data: [
        { constraint: 'is_null', path: 'email' },
        { constraint: 'is_null', path: 'password' }
      ]
    });
  });

});
