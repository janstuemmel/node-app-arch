const User = require('../../../src/model/user');

const { resetDatabase } = require('../../util');

describe('user model tests', () => {

  beforeEach(done => resetDatabase().then(done));


  it('should persist a user', async () => {

    // given
    await User.create({ email: 'foo@bar.com', password: 'fo0barbaz' });

    // when
    const user = await User.findOne();

    // then
    expect(user.dataValues.password).toBeUndefined();
    expect(user.dataValues).toMatchObject({ id: 1, email: 'foo@bar.com' });
  });


  it('should not persist user - unique email', async () => {

    // given
    await User.create({ email: 'foo@bar.com', password: 'fo0barbaz' });

    // when
    const promise = User.create({ email: 'foo@bar.com', password: 'fo0barbaz' });

    // then
    expect(promise).rejects.toMatchObject({});
  });


  it('should not persist user - email not valid', async () => {

    expect.assertions(1);

    // when
    const promise = User.create({ email: 'foo_bar.com', password: 'fo0barbaz' });

    // then
    expect(promise).rejects.toMatchObject({});
  });


  it('should verify password', async () => {

    expect.assertions(1);

    // given
    const user = await User.create({ email: 'foo@bar.com', password: 'fo0barbaz' });

    // when
    const promise = user.verifyPassword('fo0barbaz');

    // then
    expect(promise).resolves.toBeUndefined();
  });


  it('should update');


  it('should not update password');

});
