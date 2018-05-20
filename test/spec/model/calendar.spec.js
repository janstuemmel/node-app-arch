const Calendar = require('../../../src/model/calendar');
const User = require('../../../src/model/user');

describe('calendar model tests', () => {

  let testUser1;

  beforeEach(async () => {
    testUser1 = new User({ email: 't@t.com', password: 'fo0barbaz' });
    await testUser1.save();
  });

  afterEach(async () => await User.remove({}));

  afterEach(async () => await Calendar.remove({}));


  it('should create calendar with owner', async () => {

    // given
    const testCal = await Calendar.create({ name: 'test', users: [
      { role: 'owner', user: testUser1 }
    ]});

    // when
    const cal = await Calendar.findOne().populate('users.user').exec();

    // then
    expect(cal).toMatchObject({
      name: 'test',
      users: expect.arrayContaining([
        expect.objectContaining({ role: 'owner', user: expect.any(User) })
      ])
    });
  });


  it('should create calender ref in user', async () => {

    // given
    const cal = await Calendar.create({ name: 'test', users: [
      { role: 'owner', user: testUser1 }
    ]});

    // when
    const user = await User.findOne().populate('calendars').exec();

    // then
    expect(user).toMatchObject({
      email: 't@t.com',
      calendars: expect.arrayContaining([ expect.any(Calendar) ])
    });
  });




});
