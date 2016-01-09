var mqtt    = require('mqtt');
var msgsaver = require('./msgsaver.js');


var StartListeningToTopic = function(){

	var client  = mqtt.connect('tcp://broker.mqttdashboard.com:1883');
	var topic = 'home/test/ernestotest';
	client.on('connect', function () {
		client.subscribe(topic);
		console.log("subscribed to " + topic);
	});

	client.on('message', function (topic, message) {
		// message is Buffer 
		console.log(message.toString());
		msgsaver.SaveToDB(message.toString());
	});
}

exports.StartListeningToTopic = StartListeningToTopic;