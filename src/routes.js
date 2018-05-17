const router = require('express').Router();
const userController = require('./controller/user');
const authController = require('./controller/auth');

router.route('/user')
  .get(userController.getUsers)
  .post(userController.postUser);

router.route('/auth/login')
  .post(authController.authBasic, authController.login);

router.route('/auth/authenticated')
  .get(authController.authJwt, (req, res) => res.json(req.user));

module.exports = router;
