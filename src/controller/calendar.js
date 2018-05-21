const Calendar = require('../model/calendar');
const User = require('../model/user');

module.exports.post = (req, res) => {

  Calendar.create({ ...req.body })
    .then(cal => res.send(cal))
    .catch(err => res.send(err));
};

module.exports.delete = (req, res) => {
  var calId = req.params.calId;
  res.json(calId);
};

module.exports.put = (req, res) => {};

module.exports.addUser = async (req, res) => {

  const userId = req.params.userId;
  const calId = req.params.calId;

  try {

    const user = await User.findOne({ where: { id: userId } });
    const cal = await Calendar.findOne({ where: { id: calId } });


    if (!user) return res.send('user not found');
    if (!cal) return res.send('cal not found');

    await cal.addUser(user, { through: { role: 'user' } });

    return res.send(cal);

  } catch (err) {

    return res.send(err);
  }

};
