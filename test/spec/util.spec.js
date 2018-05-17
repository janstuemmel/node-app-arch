jest.mock('../../src/config', () => {
  return { secret: 'foo' };
});

const util = require('../../src/util');

describe('util tests', () => {

  it('shoul generate and verify token', async () => {

    // given
    const token = util.tokenSign(1337);

    // when
    const payload = await util.tokenVerify(token);

    // then
    expect(payload).toMatchObject({ id: 1337 });
  });

});
