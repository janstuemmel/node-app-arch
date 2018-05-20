const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: e => /^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(e)
  },
  password: {
    type: String,
    // select: false, // TODO: dont send password
    required: true,
    // minimum eight characters, at least one letter and one number
    validate: e => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(e)
  },
  calendars: [{ type: mongoose.Schema.ObjectId, ref: 'Calendar' }]
});

UserSchema.pre('validate', function(next) {

  // if password has not change, skip validator
  if (!this.isModified('password')) {
    this.$ignore('password');
  };

  next();
});

UserSchema.pre('save', function(next) {

  // password hasnt changed
  if (!this.isModified('password')) {
    return next();
  };

  // hash password
  bcrypt.hash(this.password, 5, (err, hash) => {

    if (err) return next(err);

    this.password = hash;

    return next();
  });
});

UserSchema.methods.verifyPassword = function(password, cb) {

  bcrypt.compare(password, this.password, (err, isMatch) => {

    if (err) return cb(err);

    cb(null, isMatch);
  });
};

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
