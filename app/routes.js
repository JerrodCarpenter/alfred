// app/routes.js

// Routes
// app.get are GET requests.
// app.post are POST requests.
// Generally all the rest verbs are suported.

// Export our routes so that they are available to the rest of the app.
module.exports = function(app, passport) {

  var alfred = require('../pifunctions.js');

  // Home page, load index.ejs when visited.
  app.get('/', function(req, res) {

    // Load profile page if logged in.
    if (req.isAuthenticated())
      res.redirect('/profile');

    res.render('index.ejs');
  });

  // Login page, load login.ejs when visited.
  app.get('/login', alreadyLoggedIn, function(req, res) {

    // Be sure to pass in any flash data that may exist.
    res.render('login.ejs', { message : req.flash('loginMessage') });
  });

  // When button is pressed on form, this route is selected.
  // Have seperate redirects for success or failure.
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile',
    failureRedirect : '/login',

    // Sends flash data with the failure so that messages may be sent to the user.
    failureFlash : true
  }));

  // User has pressed give access button, present form.
  app.get('/access', isAdmin, function(req, res) {
    res.render('access.ejs', {
      user : req.user
    });
  });

  // Sign-Up page, load signup.ejs when visted.
  app.get('/signup', alreadyLoggedIn, function(req, res) {

    // Be sure to pass in any flash data that may exist.
    res.render('signup.ejs', { message : req.flash('signupMessage') });
  });

  // When button is pressed on form, this route is selected.
  // Have seperate redirects for success or failure.
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/signup',

    // Sends flash data with the failure so that messages may be sent to the user.
    failureFlash : true
  }));

  // Profile page, load profile.ejs when visted.
  app.get('/profile', isLoggedIn, function(req, res) {
    if (req.query.error == 'perm') {
      req.flash('profileMessage', 'You lack the permisions to execute this function.');
    }

    res.render('profile.ejs', {
      user : req.user,
      message : req.flash('profileMessage'),
      info : req.flash('profileInfo')
    });
  });

  // User has pressed logout button, call logout function, redirect home.
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // Unlock door.
  app.get('/door', isLoggedIn, function(req, res) {
    alfred.unlockDoor();
    req.flash('profileInfo', 'The door has been unlocked.');

    res.render('profile.ejs', {
      user : req.user,
      message : req.flash('profileMessage'),
      info : req.flash('profileInfo')
    });
  });

  // Lock door.
  app.get('/lock', isLoggedIn, function(req, res) {
    alfred.lockDoor();
    req.flash('profileInfo', 'The door has been locked.');

    res.render('profile.ejs', {
      user : req.user,
      message : req.flash('profileMessage'),
      info : req.flash('profileInfo')
    });
  });

  // Open garage.
  app.get('/garage', isLoggedIn, function(req, res) {
    alfred.operateGarage();
    req.flash('profileInfo', 'The garage has been activated.');

    res.render('profile.ejs', {
      user    : req.user,
      message : req.flash('profileMessage'),
      info    : req.flash('profileInfo')
    });
  });

  app.get('/status', isLoggedIn, function(req, res) {
    var doorCheck = alfred.checkDoor();
    var windowCheck = alfred.checkWindow();

    res.render('status.ejs', {
      user : req.user,
      door : doorCheck,
      wind : windowCheck
    });
  });

};

// Route middleware that verifies a user is logged in.
function isLoggedIn(req, res, next) {

  // If authenticated, continue.
  if (req.isAuthenticated())
    return next();

  // Else, redirect home.
  res.redirect('/');
}

// Route middleware that verifies a user is logged in.
function alreadyLoggedIn(req, res, next) {

  // If not authenticated, continue.
  if (!req.isAuthenticated())
    return next();

  // Else, redirect to profile.
  res.redirect('/profile');
}

// Route middleware that verifies a user is of admin permissions.
function isAdmin(req, res, next) {

  // If authenticated, continue.
  if (req.isAuthenticated()) {
    if (!req.user.access)
      return next();
  }

  // Else, redirect to profile.
  res.redirect('/profile?error=perm');
}
