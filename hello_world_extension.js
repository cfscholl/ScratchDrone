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
    }

    ext.land = function(callback) {
	    $.ajax({
		url: 'http://localhost:4730/land',
		success: function( result  ) {
                  console.log(result);
                  callback();
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
        ]
    };

    // Register the extension
    ScratchExtensions.register('Parrot Drone', descriptor, ext);
})({});
