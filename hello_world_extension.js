
(function(ext) { 
	
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
              url: 'localhost:4730/drone/up',
              dataType: 'jsonp',
              success: function( result ) {
                  callback();
              }
        });
    };

    ext.takeoff = function(callback) {
	$.ajax({
              url: 'http://localhost:4730/takeoff',
              dataType: 'jsonp',
              success: function( result ) {
                  callback();
              }
        });
    };

    ext.land = function(callback) {
	    $.ajax({
		url: 'localhost/land',
		dataType: 'jsonp',
		success: function( result  ) {
                  callback(20);
		}
	   });
    };

	
       // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            ['w', 'go to x: %n y: %n', 'parrot_up', 0,0],
            ['w', 'takeoff', 'takeoff', 0,0],
            ['w', 'land', 'land', 0,0],
            ['h', 'when drone detects: %m.recognized', 'detected','Face']
        ],
	 menus: {
        	recognized: ['Face', 'Table']
    	}
    };

    // Register the extension
    ScratchExtensions.register('Parrot Drone', descriptor, ext);
})({});
