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
    //res.status(200).json( { answer : f() });
    f();
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
        res.status(200).json({answer: f.apply(client)});
      } else {
        res.status(200).json({answer: f.apply(client, data.split(","))});
      }
    });
  }
}

app.get('/connected', function(req, res, next) {
  res.status(200).json(connected);
});

// blink/animation => client.animateLeds(animation, 5, 5)
// e.g. blink/blinkRed => client.animateLeds(blinkRed, 5, 5)
app.get('/blink/:data', function(req, res, next) {
  var params = req.params.data + ",5,5";
  clientWhenConnected(req, res,'animateLeds', params);
});
// lightsOff => client.animateLeds(blank,5,5);
app.get('ligthsOff', function(req, res, next) {
   var params = "blank,5,5";
   clientWhenConnected(req, res,'animateLeds', params);
});

// light/animation/duration => client.animateLeds(animation, 5, duration)
// e.g. light/red,1 => client.animateLeds(red, 5, 1)
app.get('/light/:color/:duration', function(req, res, next) {
  var params = [req.params.color, 5, req.params.duration];
  var paramsAsString = params.reduce(function(p,c,i,a){return p+","+c});
  clientWhenConnected(req, res, 'animateLeds', paramsAsString);
});

//End user defines in seconds, but animate takes millisecs
// animate/action/duration => client.animate(action,duration*1000);
app.get('/animate/:action/:duration',  function(req, res, next) {
  var params = [req.params.action, parseInt(req.params.duration)*1000];
  var paramsAsString = params.reduce(function(p,c,i,a){return p+","+c});
  clientWhenConnected(req, res, 'animate', paramsAsString);
});

// turn/left/speed => client.counterClockwise(speed)
app.get('/turn/left/:data', function(req, res, next) {
   clientWhenConnected(req, res, 'counterClockwise', req.params.data);
});

// turn/right/speed => client.clockwise(speed)
app.get('/turn/right/:data', function(req, res, next) {
   clientWhenConnected(req, res, 'clockwise', req.params.data);
});

// move/forwards/speed => client.front(speed)
app.get('/move/forwards/:data', function(req, res, next) {
   clientWhenConnected(req, res, 'front', req.params.data);
});

// move/backwards/speed => client.back(speed)
app.get('/move/backwards/:data', function(req, res, next) {
   clientWhenConnected(req, res, 'back', req.params.data);
});

// roll/left/speed  => client.left(speed)
// roll/right/speed => client.right(speed)
app.get('/roll/:action/:data', function(req, res, next) {
   clientWhenConnected(req, res, req.params.action, req.params.data);
});

app.get('/:action', function(req, res, next) {
  clientWhenConnected(req, res, req.params.action);
});

app.get('/:action/:data', function(req, res, next) {
  clientWhenConnected(req, res, req.params.action, req.params.data);
});

app.listen(port, '0.0.0.0');
console.log("Rest API listing to "+port);
