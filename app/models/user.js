// get instance of mongoose and mongoose Schema
var mongoose = require('mongoose');

//set up a mongoose model and pass it using module exports
var userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
      type: String,
      required: true
  },
  admin: {
    type: Boolean,
    required: true
  }
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.getUsers = function(callback, limit) {
  User.find(callback).limit(limit);
}
