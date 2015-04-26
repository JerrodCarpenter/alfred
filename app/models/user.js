// app/models/user.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// Define schema for user.
var userSchema = mongoose.Schema({
  username : String,
  password : String,
  access   : Date
});

// Generate hash of password for security.
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Check if password is valid.
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// Expose user model to the rest of our app.
module.exports = mongoose.model('User', userSchema);
