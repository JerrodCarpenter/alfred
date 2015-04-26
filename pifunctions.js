// app/pifunctions.js

//Objects Created
// var raspi = require('raspi');
// //var PWM = require('raspi-pwn').PWM;
// var GPIO = require('onoff').Gpio,
// 	winOut = new gpio(17, 'out', 'high'),
// 	winIn = new gpio(27, 'in', 'falling'),
// 	doorOut = new gpio(10, 'out', 'high'),
// 	doorIn = new gpio(9, 'in', 'falling'),
// 	garageOut = new gpio(4, 'out', 'low');
// 	//Servo pin is auto set to gpio 18

module.exports = function(passport) {

  //Variables
  var MAX = 100;
  var CENTER, LOCKED = 60;
  var MIN, UNLOCKED = 20;
  var garageIsOpen = false;

  /////////Lock Door Function
  function lockDoor() {
    raspi.init(function() {
    	var pwm = new PWM();
    	pwm.write(LOCKED);
    	console.log("Door Locked");
    });
  };

  /////////Unlock Door Function
  function unlockDoor() {
    raspi.init(function() {
    	var pwm = new PWM();
    	pwm.write(UNLOCKED);
    	console.log("Door Unlocked");
    });
  };

  /////////Unauthed Door Open Function
  function watchDoor() {
    console.log("Watching Door");
    doorIn.watch(function(err, value){
    	if (err)
    		throw err;

    	console.log("Door Breached");
    	return true;
    });
  };

  /////////Check Door Status
  function checkDoor() {
    if(doorIn.readSync())
      return true;

    return false;
  };

  /////////Unauthed Window Open Function
  function watchWindow() {
    console.log("Watching Window");
    winIn.watch(function (err, value) {
    	if(err){
    		throw err;
    	}
    	console.log("Window Breached");
    	return true;
    });
  };

  ////////Check Window Status
  function checkWindow(){
    if (winIn.readSync())
      return true;

    return false;
  };

  /////////Operate Garage Function
  //sets pin to 1 for 1000 miliseconds and then sets to 0
  function operateGarage(){
    garageOut.writeSync(1);

    setTimeout(function() {
      garageOut.writeSync(0);
    }, 1000);

    console.log("Opening Garage Door");

    //maintain knowledge of the garage position
    if (garageIsOpen) {
      garageIsOpen = false;
    } else {
      garageIsOpen = true;
    }
  };

  ////////Check Garage Function
  //NOTE only works if you start the server with the door closed. :P
  function checkGarage(){
    if (garageIsOpen)
      return true;

    return false;
  };
};

  //PINS ARE AS FOLLOWS:
  //window	out	gpio 17	physical 11
  //window	in	gpio 27	physical 13
  //door		out	gpio 10	physical 19
  //door		in	gpio  9	physical 21
  //garage	out	gpio  4	physical  7
  //lock		out	gpio 18	physical 12

  //FUNCTIONLIST
  //void	lockDoor()
  //void	unlockDoor()
  //bool	watchDoor()
  //bool	checkDoor()
  //bool	watchWindow()
  //bool	checkWindow()
  //void	operateGarage()
  //bool	checkGarage()
