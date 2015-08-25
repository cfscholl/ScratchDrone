(function(ext) {
    var BASE_URL = "http://localhost:4730/";
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};
    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            ['w', 'takeoff', 'takeoff'],
            ['w','blink','blinkRed'],  
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
        ]
    };

    descriptor.blocks.forEach(function(action) {
	    ext[action[2]] = function() {
	    	var cb = arguments[arguments.length-1]();
		//build the url
		var url = BASE_URL + action[2];
		for( var i = 0; i < arguments.length-1; i++ ) {
			url = url+'/'+arguments[i].toString();
		}
		//send the ajax call
	    	$.ajax({
			url:  url,
			type: 'GET',
			error: function(xhr, status, error) {
  				console.log("(" + xhr.responseText + ")");
  				console.log(err.Message);
			},
			success: function(result) { cb(); }
			});
	    }});

    // Register the extension
    ScratchExtensions.register('Parrot Drone', descriptor, ext);
})({});
