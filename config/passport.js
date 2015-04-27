// config/passport.js

// Load the passport strategy and our user model.
var LocalStrategy = require('passport-local').Strategy;
var User          = require('../app/models/user');
var sanitizer     = require('sanitizer');

// Export the function to the rest of our app.
module.exports = function(passport) {

  // Set up passport sessions; passport must be able to serialize and unserialize users.
  // Serialize the user for the session.
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  // Unserialize the user for the session.
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // Sign-Up function.
  passport.use('local-signup', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',

    // Allows us to pass back the entire request to the callback.
    passReqToCallback : true
  },
  function(req, username, password, done) {

    // User.findOne wont fire unless data is sent back.
    process.nextTick(function() {

      username = sanitizer.escape(username);
      password = sanitizer.escape(password);

      User.count(function(err, count) {
        if (err)
          return done(err);

        if (!req.body.access && count > 0) {
          return done(null, false, req.flash('signupMessage', "You don't have permissions for this."));
        };
      });

      // Attempt to find a user with the provided username in the database.
      User.findOne({ 'username' : username }, function(err, user) {

        // If error, return error.
        if (err)
          return done(err);

        // If a user exists, return an appropriate message.
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
        } else {

          // Else there is no user with that name, so create one.
          var newUser = new User();

          // Set the username and password, being sure to hash the password.
          newUser.username = username;
          newUser.password = newUser.generateHash(password);

          // Check if admin or not.
          if (req.body.access && req.body.access != "admin") {

            // Set time for 1 day.
            time = new Date();
            time.setDate(time.getDate() + 1);
            newUser.access = time;

          } else {
            newUser.access = null;
          }

          // Save the newUser to the database.
          newUser.save(function(err) {
            if (err)
              throw err;

            return done(null, newUser);
          });
        }
      });
    });
  }));

  // Login function
  passport.use('local-login', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',

    // Allows us to pass back the entire request to the callback.
    passReqToCallback : true
  },
  function(req, username, password, done) {

    username = sanitizer.escape(username);
    password = sanitizer.escape(password);

    // Check to see if the user trying to log in exists in the database.
    User.findOne({ 'username' : username }, function(err, user) {

      time = new Date();

      // If error, return error.
      if (err)
        return done(err);

      // If no user is found, return appropriate message.
      if (!user)
        return done(null, false, req.flash('loginMessage', 'No user with that username exists.'));

      // If the password isn't valid, return appropriate message.
      if (!user.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Incorrect password for supplied username.'));

      if (user.access && user.access < time)
        return done(null, false, req.flash('loginMessage', 'Your access has been revoked.'));

      // Else, correct credentials were supplied, return user.
      return done(null, user);
    });
  }));
};
