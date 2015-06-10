var express = require('express');
var app = express();
var arDrone = require('ar-drone');
var client  = arDrone.createClient();
var sleep = require('sleep');
var face = "Lode";

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/takeoff', function(req, res, next) {
	console.log("Takeoff");
	//res.status(200).json(client.takeoff());
	//res.json(client.takeoff());
	client.takeoff(function(err) {
		console.log("Done takeoff");
		res.status(200).json("Done");
	});
});

app.get('/land', function(req, res, next) {
	console.log("Land");
	//res.status(200).json(client.land());
	//res.status(200).json("OK");
	//res.json(client.land());
	client.land(function(err) {
		console.log("Done landing");
		res.status(200).json("Done");
	});
});

app.get('/up/:data', function(req, res, next) {
	console.log("Up");
	res.status(200).json(client.up(req.params.data));
});

app.get('/down/:data', function(req, res, next) {
	console.log("Down");
	res.status(200).json(client.down(req.params.data));
});

app.get('/clockwise/:data', function(req, res, next) {
	console.log("Clockwise");
	res.status(200).json(client.clockwise(req.params.data));
});

app.get('/counterclockwise/:data', function(req, res, next) {
	console.log("Counterclockwise");
	res.status(200).json(client.counterClockwise(req.params.data));
});

app.get('/front/:data', function(req, res, next) {
	console.log("Front");
	res.status(200).json(client.front(req.params.data));
});

app.get('/back/:data', function(req, res, next) {
	console.log("Back");
	res.status(200).json(client.back(req.params.data));
});

app.get('/left/:data', function(req, res, next) {
	console.log("Left");
	res.status(200).json(client.left(req.params.data));
});

app.get('/right/:data', function(req, res, next) {
	console.log("Right");
	res.status(200).json(client.right(req.params.data));
});

app.get('/stop', function(req, res, next) {
	console.log("Stop");
	res.status(200).json(client.stop(req.params.data));
});

app.get('/calibrate', function(req, res, next) {
	console.log("Calibrate");
	res.status(200).json(client.calibrate(0));
});

app.get('/get_face', function(req, res, next) {
	console.log("Get face: "+face);
	res.status(200).json(face);
});

app.get('/set_face/:data', function(req, res, next) {
	face = req.params.data;
	console.log("Set face: "+face);
	res.status(200).json(face);
});


app.listen(process.env.PORT || 4730, '0.0.0.0');
