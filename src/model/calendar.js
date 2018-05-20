const mongoose = require('mongoose');
const { forEach } = require('lodash');

const User = require('./user');

const UserRoleSchema = new mongoose.Schema({
  role: String,
  user: { type: mongoose.Schema.ObjectId, ref: 'User' }
});

const CalendarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  users: [ UserRoleSchema ]
});


UserRoleSchema.pre('save', async function(next) {

  if(this.isNew) {

    // get calendar doc
    const calendar = this.parent();

    // push calendar doc to user
    this.user.calendars.push(calendar);

    // save
    await this.user.save();
  }

  next();
});


CalendarSchema.methods.removeUserRole = async function(userRole) {

  // populate users
  await this.populate('users.user').execPopulate();

  // save user
  const user = userRole.user;

  // remove userRole
  await userRole.remove();

  // populate user
  await user.populate('calendars').execPopulate();

  // remove reference in user
  // const cal = await user.calendars.id(this.id).pull();
  // user.calendars.id(this.id).remove();

  console.log(user)
  console.log(this)


};


const CalendarModel = mongoose.model('Calendar', CalendarSchema);

module.exports = CalendarModel;
