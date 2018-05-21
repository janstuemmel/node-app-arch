const Calendar = require('../../../src/model/calendar');
const User = require('../../../src/model/user');
const Role = require('../../../src/model/role');

const { resetDatabase } = require('../../util');

const TEST_USER = { email: 'foo@bar.com', password: 'fo0barbaz' };

describe('calendar model tests', () => {

  let testUser;

  beforeEach(async () => {
    await resetDatabase();
    testUser = await User.create(TEST_USER);
  });


  it('should create calendar', async () => {

    // given
    await Calendar.create({ name: 'foo' });

    // when
    const cal = await Calendar.findOne();

    // then
    expect(cal.dataValues).toMatchObject({ id: 1, name: 'foo' });
  });


  it('add users to cal', async () => {

    // given
    const cal = await Calendar.create({ name: 'foo' });

    // when
    await cal.addUser(testUser, { through: { role: 'user' }});

    // then
    expect(await cal.getUsers()).toHaveLength(1);
  });


});
