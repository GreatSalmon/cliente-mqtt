var express = require('express'),
	app = express(),
	server = require('http').Server(app),
	bodyParser = require('body-parser'),
	favicon = require('serve-favicon'),
	path = require('path'),
	apiRoutes = require('./routes/api');
var mqtt_client = require('./routes/mqtt-client.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use('/api', apiRoutes);
app.use(express.static(__dirname + '/public'));

// app.use('/search', function(req, res){
// 	res.sendFile(__dirname + '/public/search.html');
// });

app.use('/*', function(req, res){
	res.sendFile(__dirname + '/public/404.html');
});

server.listen(3000, function() {
	mqtt_client.StartListeningToTopic();
	console.log('Listening on port %d', server.address().port);

});

module.exports = app;
