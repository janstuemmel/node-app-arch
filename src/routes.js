const router = require('express').Router();

const { errorHandler } = require('./util');

const user = require('./controller/user');
const auth = require('./controller/auth');
const calendar = require('./controller/calendar');

router.route('/user')
  .post(user.postUser);

router.route('/calendar')
  .post(auth.authJwt, calendar.post);

router.route('/calendar/:calId')
  .get(auth.authJwt)
  .put(auth.authJwt, calendar.put)
  .delete(auth.authJwt, calendar.delete);

router.route('/calendar/:calId/user')
  .get(auth.authJwt)
  .post(auth.authJwt, calendar.addUser);

router.route('/calendar/:calId/user/:userId')
  .get(auth.authJwt)
  .put(auth.authJwt)
  .delete(auth.authJwt);

router.route('/auth/login')
  .post(auth.authBasic, auth.login);

router.route('/auth/authenticated')
  .get(auth.authJwt, (req, res) => res.json(req.user));

router.use(errorHandler);

module.exports = router;
