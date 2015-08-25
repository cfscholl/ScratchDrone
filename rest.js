var express = require('express');
var arDrone = require('ar-drone');

var app = express();
var client  = arDrone.createClient();
var port = process.env.PORT || 4730; // REST port (unless env.PORT is set)
var connected = false; // Whether drone is connected or not
var refreshed = false; // Timer var for refreshing connectivity

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:"+port);
    res.setHeader('Access-Control-Allow-Origin', "http://scratchx.org");

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

// Keep track of connectivity with drone
client.on('navdata', function(data) {
  refreshed = true;
});

setInterval(function() {
  if (!refreshed) {
    console.log("Drone _NOT_ connected!");
    connected = false;
  } else {
    connected = true;
    refreshed = false;
  }
}, 1000);



function executeWhenConnected(req, res, f) {
  if (connected) {
    console.log(req.path);
    res.status(200).json( { answer : f() });
  } else {
    setTimeout(function() { executeWhenConnected(req, res, f); }, 10);
  }
}

function clientWhenConnected(req, res, action, data) {
  var f = client[action];
  if (!f) {
    res.status(404).json("No such function: "+action);
  } else {
    executeWhenConnected(req, res, function() {
      if (!data) {
        res.status(200).json(f.call(client));
      } else {
        res.status(200).json(f.call(client, data));
      }
    });
  }
}

app.get('/connected', function(req, res, next) {
  res.status(200).json(connected);
});

app.get('/blinkRed', function(req, res, next) {
  executeWhenConnected(req, res, function() {
    client.animateLeds('blinkRed', 5, 5);
  });
});

app.get('/:action', function(req, res, next) {
  clientWhenConnected(req, res, req.params.action);
});

app.get('/:action/:data', function(req, res, next) {
  clientWhenConnected(req, res, req.params.action, req.params.data);
});



app.listen(port, '0.0.0.0');
console.log("Rest API listing to "+port);
