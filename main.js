'use strict';

// Process
const process = require('process');

// Serial Port
const serialport = require('serialport');
const SerialPort = serialport.SerialPort;

// Parse
const Parse = require('parse/node');
Parse.initialize(
	'9sMhGuNUapuBzG4HePZSNUmfRyDegxsXXoAjttUk',  // Application ID
	'D9fEaIKZDPaB9mocOj1xv9OPusKGi1AAvKu2rPi2',  // JavaScript key
	'L39Hjb2HSJGnXfk3Utc9CvfxO2eCZKqvgjR62luw'   // Master key
);

// Pusher
const Pusher = require('pusher');

let pusher = new Pusher('ae0834efadeb12c41af8', {
	authEndpoint: 'https://sensenet.bbh-labs.com.sg/pusher/auth',
	encrypted: true,
});

let serialPort = new SerialPort('/dev/ttyACM0', {
	baudrate: 9600,
	parser: serialport.parsers.readline('\r\n'),
});

process.on('SIGINT', function() {
	
});

serialPort.on('open', function() {
	serialPort.on('data', function(data) {
		try {
			let reading = JSON.parse(data);
			console.log(reading);
		} catch (error) {
			// do nothing
		}
	});
});
