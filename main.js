'use strict';

// Process
const process = require('process');

// Serial Port
const serialport = require('serialport');
const SerialPort = serialport.SerialPort;
let serialPort = new SerialPort('/dev/ttyACM0', {
	baudrate: 9600,
	parser: serialport.parsers.readline('\r\n'),
});

// Parse
const Parse = require('parse/node');
Parse.initialize(
	'9sMhGuNUapuBzG4HePZSNUmfRyDegxsXXoAjttUk',  // Application ID
	'D9fEaIKZDPaB9mocOj1xv9OPusKGi1AAvKu2rPi2',  // JavaScript key
	'L39Hjb2HSJGnXfk3Utc9CvfxO2eCZKqvgjR62luw'   // Master key
);

// Pusher
const Pusher = require('pusher');

let pusher = new Pusher({
	appId: '166171',
	key: 'ae0834efadeb12c41af8',
	secret: '824920ca47ce9f9c6722',
	authEndpoint: 'https://sensenet.bbh-labs.com.sg/pusher/auth',
	encrypted: true,
});

process.on('SIGINT', function() {
	process.exit(0);
});

serialPort.on('open', function() {
	serialPort.on('data', function(rawData) {
		try {
			let data = JSON.parse(rawData);
			pusher.trigger('private-client-reading', 'client-reading', {
				deviceID: data.deviceID,
				data: data,
				//coordinate: coordinate,
			});
		} catch (error) {
			console.log(error);
			// do nothing
		}
	});
});
