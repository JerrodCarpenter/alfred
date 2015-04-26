// server.js

// Load in necessary modules.
var express      = require('express');
var app          = express();

var mongoose     = require('mongoose');
var passport     = require('passport');
var flash        = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var jquery       = require('jquery');
var najax        = require('najax');

//Servo Variables
var MAX = 100;
var CENTER, LOCKED = 60;
var MIN, UNLOCKED = 20;
var raspi = require('raspi');
var PWM = require('raspi-pwm').PWM;

//garage variables
var ON = 1;

//PINS ARE AS FOLLOWS
//Window output pin  is gpio 17 physical pin 11
//Window input pin is gpio 27 physical pin 13
//Lock output in is gpio 18 physical pin 12
//port 4 = physical pin 7
var gpio         = require('onoff').Gpio,   // Constructor function for Gpio objects.
	port17 				 = new gpio(17, 'high'), // Export GPIO #14 as an output. Will need
 	port21         = new gpio(21, 'in', 'both'),
	port27         = new gpio(27, 'in', 'falling'),
	port25         = new gpio(25, 'out');
	port4 	       = new gpio(4, 'out');

// Require passport for authentication.
require('./config/passport')(passport);

// Load in configuration for database.
var configDB     = require('./config/database.js');

// Connect to our database.
mongoose.connect(configDB.url);

// Set up Express application.
var port = process.env.PORT || 3000; // Set port.
app.use(cookieParser());
app.use(bodyParser());
app.use(morgan('dev'));              // Morgan logs requests to the console.
app.set('view engine', 'ejs');       // EJS as our templating engine.

// Set up for Passport.
app.use(session({ secret: 'automateallthethings' })); // Session secret key.
app.use(passport.initialize());                       // Initialize passport.
app.use(passport.session());                          // Use persistent sessions.
app.use(flash());

// Needed in order to avoid a CORS error.
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

// Load our routes, this file is essentially our controller.
require('./app/routes.js')(app, passport);

// Start server.
app.listen(port);
console.log('Automata running on port: ' + port);

// // Get original value write to console.
// value = port17.readSync();
// value2 = port27.readSync();
// console.log("\nPort 17 is " + value);
// console.log("Port 27 is " + value2);

//port27.watch(function (err, value) {
//	if (err) {
//		throw err;
//	}
//	send_notification('window_broken');
//
//});

// // Write a value and write to console again.
// value = port17.readSync();
// value2 = port27.readSync();
// console.log("\nPort 17 is " + value);
// console.log("Port 27 is " + value2);

// port17.watch(function (err, value) {
//   if (err) {
//     throw err;
//   }
//
//   port21.writeSync(value);
// 	value1 = port21.readSync();
// 	console.log("Port 21 is " + value1)
// });

//while(true){
//	port25.writeSync(1);
//}

function send_notification(id) {
	najax({
 		url: 'http://babbage.cs.missouri.edu/~ajzvy4/test/simple.php',
 		type: 'POST',
 		data: {id:id},
 		success: function(data) {
 			console.log(data);
 		}
 	});
};

//send_notification('window_broken');
// board.on("ready", function()
// {
// 	var servo = new five.Servo({
// 		address: 0x40,
// 		controller: "PCA9685",
// 		pin: 22,
// 	});
// 	servo.sweep();
//
// 	servo.on("move", function( err, degrees ) {
//     console.log( "move", degrees );
//   });
//
// });

// //Moving servo to locked position
// raspi.init(function(){
// 	var pwm = new PWM();
// 	pwm.write(LOCKED);
// 	});
//
// //Moving servo to unlocked position
// raspi.init(function(){
// 	var pwm = new PWM();
// 	pwm.write(UNLOCKED);
// 	});

//garage door
//raspi.init(function(){
//	var pwm = new PWM();
//	pwm.write(ON);
//	});

function exit() {
  port17.unexport();
	port27.unexport();
  process.exit();
}

process.on('SIGINT', exit);
