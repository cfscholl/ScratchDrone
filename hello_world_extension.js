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
	    console.log(action[2]);
	    ext[action[2]] = function() {
		//build the url
		var url = BASE_URL + action[2];
		for( var i = 0; i < arguments.length-1; i++ ) {
			url = url+'/'+arguments[i].toString();
		}
		console.log(url);
	    	$.ajax({
			url:  url,
			type: 'GET',
			success: function(result) {
				console.log(result);
				//last argument is the callback
				arguments[arguments.length]();
			}});
	    }});

    // Register the extension
    ScratchExtensions.register('Parrot Drone', descriptor, ext);
})({});
