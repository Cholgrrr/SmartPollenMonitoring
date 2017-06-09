/*
 * This function gets the center of the view and converts it into geographic coordinates (lat, lon, alt).
 * 					Set the wwd variable and the HTML element to make it fully functional.
 
 * These variables will be overwritten each time the mouse moves.
 * var navState;
 * var eyePoint;
 * var pos = new WorldWind.Position();
*/

// The parameters of this function are empty variables because they will be overwritten.
var handleMove = function(navState, eyePoint, pos, element) {
	// Get the current state of the navigator.
	navState = wwd.navigator.currentState();
	// Get the cartesian coordinates of the center point.
	eyePoint = navState.eyePoint;
	// Compute geographic position from cartesian coordinates.
	// Result will be stored in the Position variable.
	wwd.globe.computePositionFromPoint(eyePoint[0], eyePoint[1], eyePoint[2], pos);
}

/* Function should be executed when a mouse move event happens.
* That would look like this:
* wwd.addEventListener("mousemove", handleMove);
*/