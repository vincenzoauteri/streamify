/*
 * ASCII Camera
 * http://idevelop.github.com/ascii-camera/
 *
 * Copyright 2013, Andrei Gheorghe (http://github.com/idevelop)
 * Released under the MIT license
 */

(function() {
	var streamContainer = document.getElementById("stream");
	var capturing = false;

	camera.init({
		width: 160,
		height: 120,
		fps: 30,
		mirror: true,

		onFrame: function(canvas) {
            console.log("OnFrame");

		},

		onSuccess: function() {
            console.log("Ok");
			document.getElementById("info").style.display = "none";

			capturing = true;
			document.getElementById("pause").style.display = "block";
			document.getElementById("pause").onclick = function() {
				if (capturing) {
					camera.pause();
				} else {
					camera.start();
				}
				capturing = !capturing;
			};
		},

		onError: function(error) {
                     console.log("Error init camera");
			// TODO: log error
		},

		onNotSupported: function() {
			document.getElementById("info").style.display = "none";
			streamContainer.style.display = "none";
            console.log("Not Supported");
			document.getElementById("notSupported").style.display = "block";
		}
	});
})();
