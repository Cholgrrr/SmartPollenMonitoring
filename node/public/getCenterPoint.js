/*
 * Notice: 	This code snippet gets the center of the view and converts it into geographic coordinates (lat, lon, alt).
 * 			Set the wwd variable and the HTML element to make it fully functional.
 */
// These variables will be overwritten each time the mouse moves.
var navState;
var eyePoint;
var coords;
var pos = new WorldWind.Position();

// Function that is executed with every mousemove.
var handleMove = function() {
	// Get the current state of the navigator.
	navState = wwd.navigator.currentState();
	// Get the cartesian coordinates of the center point.
	eyePoint = navState.eyePoint;
	// Compute geographic position from cartesian coordinates.
	// Result will be stored in the Position variable.
	wwd.globe.computePositionFromPoint(eyePoint[0], eyePoint[1], eyePoint[2], pos);
	// Write the coordinates into an HTML element.
	document.getElementById("coords").innerHTML = "lat: " + pos.latitude + " | lon: " + pos.longitude + " | alt: " + pos.altitude;
}
      // Listen for mouse move.
wwd.addEventListener("mousemove", handleMove);