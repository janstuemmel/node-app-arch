var User = require('../model/user');


module.exports.postUser = (req, res) => {

  // set empty request body if req.body is undefined
  req.body = req.body || "";

  User.create({ ...req.body })
    .then(user => res.send(user))
    .catch(err => res.send(err));
};
