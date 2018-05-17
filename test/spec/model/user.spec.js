const User = require('../../../src/model/user');

describe('user model tests', () => {

  afterEach(done => User.remove({}, done));

  it('should persist a user', async () => {

    // given
    const user = new User({ email: 'foo@bar.com', password: 'fo0barbaz' });

    // when
    await user.save();

    // then
    expect(await User.findOne()).toMatchObject({
      _id: expect.any(Object), // it's mongoose ObjectId()
      email: 'foo@bar.com',
      password: expect.any(String),
    });
  });
});
