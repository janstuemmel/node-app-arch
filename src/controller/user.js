const User = require('../model/user');

const { routeWrapAsync } = require('../util');

module.exports.postUser = routeWrapAsync(async (req, res) => {

  // set empty request body if req.body is undefined
  req.body = req.body || "";

  const user = await User.create({ ...req.body });

  res.send(user);
});
