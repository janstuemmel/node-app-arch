const Boom = require('boom');

const Calendar = require('../model/calendar');
const User = require('../model/user');

const { routeWrapAsync } = require('../util');

module.exports.post = routeWrapAsync(async (req, res) => {

  req.body = req.body || "";

  const cal = await Calendar.create({ ...req.body })

  res.send(cal);
});

module.exports.delete = (req, res) => {};

module.exports.put = (req, res) => {};

module.exports.addUser = routeWrapAsync(async (req, res, next) => {

  const { userId, calId } = req.params;

  const user = await User.findOne({ where: { id: userId } });

  if (!user) throw Boom.notFound('resource.missing', { entity: 'user', id: userId });

  const cal = await Calendar.findOne({ where: { id: calId } });

  if (!cal) throw Boom.notFound('resource.missing', { entity: 'calendar', id: calId });

  // add a user to a cal
  await cal.addUser(user);

  res.send(cal);

});
