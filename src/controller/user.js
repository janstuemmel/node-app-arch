var User = require('../model/user');

module.exports.getUsers = (req, res) => {
  User.find((err, users) => {

    if(err) return res.send(err);

    res.json(users);

  });
};

module.exports.postUser = (req, res) => {

  // set empty request body if req.body is undefined
  req.body = req.body || "";

  const user = new User({ ...req.body });

  user.save(err => {

    if (err) return res.send(err);

    res.json(user);

  });
};
