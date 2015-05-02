//addem.js

var User = require('./app/models/user');


var makeAdmin = function(username) {

  // Attempt to find a user with the provided username in the database.
  User.findOne({ 'username' : username }, function(err, user) {

    // If error, return error.
    if (err)
      return false;

    if (!user)
      return false;

    user.access = null;

    // Save the newUser to the database.
    user.save(function(err) {
      if (err)
        throw err;

      return true;
    });

  });
};

var giveAccess = function(username) {
  // Attempt to find a user with the provided username in the database.
  User.findOne({ 'username' : username }, function(err, user) {
    // If error, return error.
    if (err)
      return false;

    if (!user)
      return false;

    var currentTime = new Date();
    currentTime.setDate(currentTime.getDate() + 1);

    user.access = currentTime;

    // Save the newUser to the database.
    user.save(function(err) {
      if (err)
        throw err;

      return true;
    });

  });

}

module.exports = {
  // Functions.
  makeAdmin  : makeAdmin,
  giveAccess : giveAccess
};

//
// var currentTime = new Date();
// currentTime.setDate(currentTime.getDate() + 1);
