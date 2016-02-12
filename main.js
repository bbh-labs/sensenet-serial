'use strict';

// Configurations
const DEBUG = true;

// Process
const process = require('process');

// Serial Port
const serialport = require('serialport');
const SerialPort = serialport.SerialPort;
let serialPort = new SerialPort('/dev/ttyACM0', {
	baudrate: 9600,
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

let buffer = new Buffer(0);

serialPort.on('open', function() {
	serialPort.on('data', function(data) {
		// Append data to global buffer
		buffer = Buffer.concat([buffer, data]);

		let start = 0;
		let end = buffer.indexOf('\r\n', start);
		let reading;

		while (end - start >= 28) {
			let workBuffer = buffer.slice(end - 28, end);
			let deviceID = workBuffer.toString('utf-8', 0, 10);
			let temperature = workBuffer.readFloatLE(10);
			let humidity = workBuffer.readFloatLE(14);
			let uv = workBuffer.readFloatLE(18);
			let particles = workBuffer.readFloatLE(22);
			let carbonMonoxide = workBuffer.readUInt16LE(26);
			reading = {
				deviceID: deviceID,
				temperature: temperature,
				humidity: humidity,
				uv: uv,
				particles: particles,
				carbonMonoxide: carbonMonoxide,
			};

			start = end + 2;
			end = buffer.indexOf('\r\n', start);
		}

		if (reading) {
			if (DEBUG) {
				console.log(reading);
			}
			sendData(reading);
		}

		// Remove processed data from global buffer
		if (end >= 0) {
			let newbuffer = new Buffer(end - start);
			buffer.copy(newbuffer, 0, start, end);
			buffer = newbuffer;
		}
	});
});

function sendData(data) {
	pusher.trigger('private-client-reading', 'client-reading', {
		deviceID: data.deviceID,
		data: data,
		//coordinate: coordinate,
	});
}
