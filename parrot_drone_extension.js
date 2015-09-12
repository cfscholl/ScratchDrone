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
            ['w', 'calibrate', 'calibrate', 0],
            ['w', 'takeoff', 'takeoff'],
            ['w', 'land', 'land'],
            ['w', 'stop', 'stop'],
            ['w', 'blink %m.blinkAnimations','blink', 'blinkRed'],
            ['w', 'set lights %m.colorAnimations for %n seconds','light', 'red', 2],
            ['w', 'set lights off', 'ligthsOff'],
            ['w', 'move %m.moveDimension at %n speed', 'move','up',  0.3],
            ['w', 'turn %m.direction at %n speed', 'turn','left', 0.5],
            ['w', 'roll %m.direction at %n speed', 'roll','left',0.3],
            ['w', 'flip %m.flips for %n seconds', 'animate', 'flipAhead', 5],
            ['w', 'do %m.animations for %n seconds', 'animate', 'yawnDance', 5]
        ],
        menus: {
          moveDimension: ['up', 'down', 'forwards', 'backwards'],
          direction: ['left','right'],
          flips: ['flipAhead', 'flipBehind', 'flipLeft', 'flipRight'],
          animations:  ['phiM30Deg', 'phi30Deg', 'thetaM30Deg', 'theta30Deg',
          'theta20degYaw200deg', 'theta20degYawM200deg', 'turnaround', 'turnaroundGodown',
          'yawShake', 'yawDance', 'phiDance', 'thetaDance', 'vzDance', 'wave', 'phiThetaMixed',
          'doublePhiThetaMixed'],
          blinkAnimations: [ 'blinkGreen', 'blinkRed', 'blinkOrange','blinkGreenRed','snakeGreenRed', 'fire', 'redSnake', 'rightMissile',
          'leftMissile','doubleMissile'],
          colorAnimations: ['red','green','blank','frontLeftGreenOthersRed',
          'frontRightGreenOthersRed', 'rearRightGreenOthersRed',
          'rearLeftGreenOthersRed', 'leftGreenRightRed', 'leftRedRightGreen']
        }
    };

    descriptor.blocks.forEach(function(action) {
	    ext[action[2]] = function() {
	    	var cb = arguments[arguments.length-1];
		//build the url
		var url = BASE_URL + action[2];
		for( var i = 0; i < arguments.length-1; i++ ) {
			url = url+'/'+arguments[i].toString();
		}
    console.log(url);
		//send the ajax call
	    	$.ajax({
			url:  url,
			type: 'GET',
			error: function(xhr, status, error) {
  				console.log("(" + xhr.responseText + ")");
  				console.log(error.Message);
			},
			success: function(result) { cb(); }
			});
	    }});

    // Register the extension
    ScratchExtensions.register('Parrot Drone', descriptor, ext);
})({});
