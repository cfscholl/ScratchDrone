(function(ext) {

	var face = "";

    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.parrot_up = function(x,y) {
        // Code that gets executed when the block is run
	$.ajax({
              url: 'http://localhost:4730/drone/up',
              dataType: 'jsonp',
              success: function( result ) {
                  console.log(result);
				  callback();
              }
        });
    };

    ext.takeoff = function(callback) {
		$.ajax({
			url: 'http://localhost:4730/takeoff',
			type: 'GET',
            success: function(result) {
                  console.log(result);
				  callback();
              }});
    };

    ext.land = function(callback) {
		$.ajax({
			url: 'http://localhost:4730/land',
			type: 'GET',
            success: function(result) {
                  console.log(result);
				  callback();
              }});
    };
	
    ext.up = function(speed, callback) {
		$.ajax({
			url: 'http://localhost:4730/up/'+speed.toString(),
			type: 'GET',
            success: function(result) {
                  console.log(result);
				  callback();
              }});
    };
	
    ext.down = function(speed, callback) {
		$.ajax({
			url: 'http://localhost:4730/down/'+speed.toString(),
			type: 'GET',
            success: function(result) {
                  console.log(result);
				  callback();
              }});
    };
	
    ext.clockwise = function(speed, callback) {
		$.ajax({
			url: 'http://localhost:4730/clockwise/'+speed.toString(),
			type: 'GET',
            success: function(result) {
                  console.log(result);
				  callback();
              }});
    };
	
    ext.counterclockwise = function(speed, callback) {
		$.ajax({
			url: 'http://localhost:4730/counterclockwise/'+speed.toString(),
			type: 'GET',
            success: function(result) {
                  console.log(result);
				  callback();
              }});
    };
	
    ext.front = function(speed, callback) {
		$.ajax({
			url: 'http://localhost:4730/front/'+speed.toString(),
			type: 'GET',
            success: function(result) {
                  console.log(result);
				  callback();
              }});
    };
	
    ext.back = function(speed, callback) {
		$.ajax({
			url: 'http://localhost:4730/back/'+speed.toString(),
			type: 'GET',
            success: function(result) {
                  console.log(result);
				  callback();
              }});
    };
	
    ext.left = function(speed, callback) {
		$.ajax({
			url: 'http://localhost:4730/left/'+speed.toString(),
			type: 'GET',
            success: function(result) {
                  console.log(result);
				  callback();
              }});
    };
	
    ext.right = function(speed, callback) {
		$.ajax({
			url: 'http://localhost:4730/right/'+speed.toString(),
			type: 'GET',
            success: function(result) {
                  console.log(result);
				  callback();
              }});
    };
	
    ext.stop = function(speed, callback) {
		$.ajax({
			url: 'http://localhost:4730/stop',
			type: 'GET',
            success: function(result) {
                  console.log(result);
				  callback();
              }});
    };

    ext.calibrate = function(callback) {
	    $.ajax({
		url: 'http://localhost:4730/calibrate',
		success: function(result) {
                  console.log(result);
                  callback();
		}
	   });
    };

	window.setInterval(function() {
	    $.ajax({
			url: 'http://localhost:4730/get_face',
			//url: 'http://192.168.1.15:5000/faces',
			success: function(result) {
                  console.log(result);
                  face = result;
		}});
	}, 1000);
	
    ext.get_face = function(value) {
		//console.log("Verify face: "+value+" with "+face+" -- "+(face==value));
        return face == value;
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            ['w', 'takeoff', 'takeoff'],
            ['w', 'land', 'land'],
            ['w', 'move up %n', 'up', 0.3],
            ['w', 'move down %n', 'down', 0.3],
            ['w', 'turn clockwise %n', 'clockwise', 0.5],
            ['w', 'turn counterclockwise %n', 'counterclockwise', 0.5],
            ['w', 'front %n', 'front', 0.3],
            ['w', 'back %n', 'back', 0.3],
            ['w', 'left %n', 'left', 0.3],
            ['w', 'right %n', 'right', 0.3],
            ['w', 'stop %n', 'stop', 0.3],
            ['w', 'calibrate', 'calibrate', 0.3],
			['h', 'when %m.faces detected', 'get_face', 'Peter'],
        ],
		menus: {
			faces: ['Peter', 'Yann-Michael', 'Ivan', 'Lode', 'Christophe'],
		},
    };

    // Register the extension
    ScratchExtensions.register('Parrot Drone', descriptor, ext);
})({});
