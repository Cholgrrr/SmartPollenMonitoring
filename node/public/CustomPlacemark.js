// -------------------------------------------------------------------
// set needed parameters and dependencies

var trees;
// Tell World Wind to log only warnings.
WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);
// Create the World Window.
var wwd = new WorldWind.WorldWindow("canvasOne");
// World Window.
wwd.navigator.lookAtLocation.latitude = 50.090142; //50.11;  
wwd.navigator.lookAtLocation.longitude = 8.617049; //8.68;
wwd.navigator.range = 10e3; // 2 million meters above the ellipsoid
// Add imagery layers.
var layers = [

      {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
      {layer: new WorldWind.CompassLayer(), enabled: true},

];

for (var l = 0; l < layers.length; l++) {
    layers[l].layer.enabled = layers[l].enabled;
    wwd.addLayer(layers[l].layer);
}


// ---------------------------------------------------------------------
// adjust the view and focus according to a mouse click and display the 
// the trees in that view

// The common gesture-handling function.
var handleClick = function (recognizer) {
	// Obtain the event location.
	
	// Add the coordinates on the cursor to the dialog
	var x = recognizer.clientX,
		y = recognizer.clientY;

	var pickList = wwd.pick(wwd.canvasCoordinates(x, y));
	
	if (pickList.objects.length == 1 && pickList.objects[0].isTerrain) {
		var position = pickList.objects[0].position;
		$("#dialogLat").val(position.latitude.toFixed(6));
		$("#dialogLon").val(position.longitude.toFixed(6));
	}
	
	// delete the previous layer
	deleteLayer();
  
	// calculate the rectangle of the new view + a litle buffer around it
	var x = recognizer.clientX,
		y = recognizer.clientY,
		pickList = wwd.pick(wwd.canvasCoordinates(x, y)),
		position = pickList.objects[0].position,
		maxLat = position.latitude + 0.00295,
		maxLong = position.longitude + 0.00882,
		minLat = position.latitude - 0.00295,
		minLong = position.longitude - 0.00882;
	
	// recenter the view 
	wwd.goTo(new WorldWind.Position(position.latitude, position.longitude,1000));
	deleteLayer();
	
	// query current wind data (speed, direction, date)
	var currentWind = {};
	$.get("/currentWind", function(data, status){
		//console.log('wind:');
		//console.log(data);
		//console.log('speed: ' + data[0].speed);
		currentWind = data; 
	});

	
	// get the trees which are in the rectangle and which are selected
	// getTreeRecCurrent form select js will be called.
	// -> in this function the trees will be requested and the multiselect list is readed out
	viewTrees = getTreeRecCurrent(minLat, maxLat, minLong, maxLong);
	
	// the function which draws the ellipses, will be called
	// after a delay to wait for the required ajax requests ()
	setTimeout(function(){callDrawPollen()}, 200);

	function callDrawPollen() {
		var rend = new WorldWind.RenderableLayer();
<<<<<<< HEAD
		console.log('wind:');
		console.log(currentWind); 
		console.log(currentWind[0].in_date); 
		if (viewTrees.length > 1) {
			for(i=0; i<viewTrees.length; i++) { 
=======
	
		// get the month number (mm) from the current date
		var month = currentWind[0].in_date.slice(5, 7);
		// get the blooming values
		var blooming = getTreeBlooming(month);
		// pull the month out of the daters
		var month = (currentWind[0].in_date.slice(5, 7));
		if (viewTrees.length > 15) {
			for(i=0; i<15; i++) { 
>>>>>>> 9cf92b03e8b9733504a303701fcbf9c1ac4a7cff
				drawPollenSpread(currentWind[0].speed, currentWind[0].direction, viewTrees[i].lat, viewTrees[i].lon, 5);
			}
		}
	}
	
};
//wwd.addLayer(rend);
//wwd.addLayer(mesh3D);
// Listen for mouse clicks.
var clickRecognizer = new WorldWind.ClickRecognizer(wwd, handleClick);
// Listen for taps on mobile devices.
var tapRecognizer = new WorldWind.TapRecognizer(wwd, handleClick);
 
		
//---------------------------------------------------------------------
// Generation of a surface elipses according to the wind and tree data	

var rend = new WorldWind.RenderableLayer();
var mesh3D = new WorldWind.RenderableLayer();
	mesh3D.displayName = "3D-Mesh";
// Now set up to handle highlighting.
var highlightController = new WorldWind.HighlightController(wwd);

// generation of the surface elipse
// INPUT: - wind strength 
//		  - wind direction
//		  - latitude and longitude of the tree
//		  - strenght parameter (polen blooming value)

function drawPollenSpread(windStr, windDeg, TreeLat, TreeLong, StrenghtPara) {
		
	try {
		// input Wind attribute and Tree location
		var windDegR = windDeg * Math.PI / 180.0;
		var R_earth = 6371000.0; // Earth's Radius in Meters
		var TreeLatR = TreeLat * Math.PI / 180.0;
		var TreeLongR = TreeLong * Math.PI / 180.0;
		// var StrenghtPara = 100.0;	 // Default Is 5.0
		// computeNewCenter of the Big Ellipse
		var St = StrenghtPara * windStr;
		windDeg = windDeg + 90.0;
		var EllispeCenterLATR = Math.asin( Math.sin(TreeLatR)*Math.cos(St/R_earth) + Math.cos(TreeLatR)*Math.sin(St/R_earth)*Math.cos(windDegR) );
		var EllispeCenterLONGR = TreeLongR + Math.atan2(Math.sin(windDegR)*Math.sin(St/R_earth)*Math.cos(TreeLatR),Math.cos(St/R_earth)-Math.sin(TreeLatR)*Math.sin(EllispeCenterLATR));
		var EllispeCenterLAT = EllispeCenterLATR * 180 / Math.PI;
		var EllispeCenterLONG = EllispeCenterLONGR * 180 / Math.PI;
		// computeNewCenter of the Small Ellipse
		var StrenghtParas = StrenghtPara*0.3;	//
		var St = StrenghtParas * windStr;
		var EllispeCenterLATRs = Math.asin( Math.sin(TreeLatR)*Math.cos(St/R_earth) + Math.cos(TreeLatR)*Math.sin(St/R_earth)*Math.cos(windDegR) );
		var EllispeCenterLONGRs = TreeLongR + Math.atan2(Math.sin(windDegR)*Math.sin(St/R_earth)*Math.cos(TreeLatR),Math.cos(St/R_earth)-Math.sin(TreeLatR)*Math.sin(EllispeCenterLATR));
		var EllispeCenterLATs = EllispeCenterLATRs* 180 / Math.PI;
		var EllispeCenterLONGs = EllispeCenterLONGRs * 180 / Math.PI;
		// computeNewCenter of the Medium Ellipse
		var StrenghtParaM = StrenghtPara*0.5;	//
		var St = StrenghtParaM * windStr;
		var EllispeCenterLATRm = Math.asin( Math.sin(TreeLatR)*Math.cos(St/R_earth) + Math.cos(TreeLatR)*Math.sin(St/R_earth)*Math.cos(windDegR) );
		var EllispeCenterLONGRm = TreeLongR + Math.atan2(Math.sin(windDegR)*Math.sin(St/R_earth)*Math.cos(TreeLatR),Math.cos(St/R_earth)-Math.sin(TreeLatR)*Math.sin(EllispeCenterLATR));
		var EllispeCenterLATm = EllispeCenterLATRm* 180 / Math.PI;
		var EllispeCenterLONGm = EllispeCenterLONGRm * 180 / Math.PI;
		// make the ShapeAttributes for Big Ellispe
		var att = new WorldWind.ShapeAttributes(null);
		att.drawInterior = true;
		att.drawOutline = true;
		att.outlineColor = WorldWind.Color.GREEN;
		att.interiorColor = new WorldWind.Color(0, 0.8, 0, 0.5);
		
		// make the ShapeAttributes for small Ellispe
		var att2 = new WorldWind.ShapeAttributes(null);
		att2.drawInterior = true;
		att2.drawOutline = true;
		att2.outlineColor = WorldWind.Color.RED;
		att2.interiorColor = new WorldWind.Color(1, 0, 0, 0.5);
		// make the ShapeAttributes for medium Ellispe
		var attm = new WorldWind.ShapeAttributes(null);
		attm.drawInterior = true;
		attm.drawOutline = true;
		attm.outlineColor = WorldWind.Color.RED;
		attm.interiorColor = new WorldWind.Color(1, 1, 0, 0.5);
		
		// make the ShapeAttributes for the circle
		var attc = new WorldWind.ShapeAttributes(null);
		attc.drawInterior = true;
		attc.drawOutline = true;
		attc.outlineColor = WorldWind.Color.RED;
		attc.interiorColor = new WorldWind.Color(1, 1, 1, 1);
		//------------Draw Big Ellipse----------------
		var SE_a_axe = windStr * StrenghtPara * 2;
		var SE_b_axe = SE_a_axe / 2;
		var el_lo = new WorldWind.Position(EllispeCenterLAT, EllispeCenterLONG,1e5);
		var SE = new WorldWind.SurfaceEllipse(el_lo, SE_a_axe, SE_b_axe, windDeg, att);
		SE.displayName = "EllispeBig" // make the ellispe selectable
		rend.addRenderable(SE);

		//------------Draw Medium Ellipse----------------
		var SEm_a_axe = windStr * StrenghtPara * 1.2;
		var SEm_b_axe = SEm_a_axe / 2;
		var el_lom = new WorldWind.Position(EllispeCenterLATm, EllispeCenterLONGm,1e5);
		var SEm = new WorldWind.SurfaceEllipse(el_lom, SEm_a_axe, SEm_b_axe, windDeg, attm);
		//rend.addRenderable(SEm); // add Big ellispe to the globe
		SEm.displayName = "EllispeMedium" // make the ellispe selectable
		rend.addRenderable(SEm); // add Big ellispe to the globe

		//------------Draw Small Ellipse----------------
		var SEs_a_axe = windStr * StrenghtPara * 0.8;
		var SEs_b_axe = SEs_a_axe / 2 ;
		var el_los = new WorldWind.Position(EllispeCenterLATs, EllispeCenterLONGs,1e5);
		var SEs = new WorldWind.SurfaceEllipse(el_los, SEs_a_axe, SEs_b_axe, windDeg, att2);
		SEs.displayName = "EllispeSmall"
		rend.addRenderable(SEs);

		//------------Draw Circle at Tree Position-------------------
		var cir = new WorldWind.Position(TreeLat, TreeLong,1e5);
		var Circle = new WorldWind.SurfaceCircle(cir, 5, attc);
		Circle.displayName = "Tree-Location";

		rend.addRenderable(Circle);	
		rend.opacity = 0.6;
		//wwd.addLayer(rend);
		//wwd.addLayer(Circle);
		}
	catch(err) {
		console.log('->  generate elipse failed!\n' + err);
	}
		
}
		/*//Draw 3D 
		var canvas = document.createElement("canvas"),
            ctx2d = canvas.getContext("2d"),
            size = 64, c = size / 2, innerRadius = 5, outerRadius =40;
        canvas.width = size;
        canvas.height = size;
        var gradient = ctx2d.createRadialGradient(c, c, innerRadius, c, c, outerRadius);
        gradient.addColorStop(0, 'rgb(255, 0, 0)');
		gradient.addColorStop(0.9, 'rgb(0, 255, 0)');
		gradient.addColorStop(1, 'rgb(0, 0, 0)');
		var ang = 90*Math.PI /180;
        ctx2d.fillStyle = gradient;
        ctx2d.arc(c+c*Math.sin(ang), c-c*Math.cos(ang), outerRadius, 0, 2 * Math.PI, false);
        ctx2d.fill();
        // Create the mesh's positions.
        
		var meshPositions = [];
		var shift = 0.001;
        for (var lat = TreeLat-shift; lat <= TreeLat+shift; lat += 0.00005) {
            var row = [];
            for (var lon = TreeLong-shift; lon <= TreeLong+shift; lon += 0.00005) {
				var elevationScale =
					Math.sqrt(Math.pow(lat-TreeLat,2) + Math.pow(lon-TreeLong,2));
                row.push(new WorldWind.Position(lat, lon,130- elevationScale*10000)) //130 is the elevation
            }
            meshPositions.push(row);
        }
        // Create the mesh.
        var mesh = new WorldWind.GeographicMesh(meshPositions, null);
        // Create and assign the mesh's attributes.
        var meshAttributes = new WorldWind.ShapeAttributes(null);
        meshAttributes.outlineColor = new WorldWind.Color(1, 1, 1, 0);
        meshAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 0.7);
        meshAttributes.imageSource = new WorldWind.ImageSource(canvas);
        meshAttributes.applyLighting = false;
        mesh.attributes = meshAttributes;
        // Create and assign the mesh's highlight attributes.
        var highlightAttributes = new WorldWind.ShapeAttributes(meshAttributes);
        highlightAttributes.outlineColor = WorldWind.Color.WHITE;
        mesh.highlightAttributes = highlightAttributes;
        // Add the shape to the layer.
		mesh3D.addRenderable(mesh);
	*/
wwd.addLayer(rend);
//wwd.addLayer(mesh3D);

// ------------------------------------
// call this function to remove a layer
function deleteLayer() {
	try {
		// remove layer
		rend.removeAllRenderables();
		mesh3D.removeAllRenderables();
		rend.refresh();
		mesh3D.refresh();
		wwd.redraw();
	}
	catch(err) {
		console.log('->  delete layer failed!\n' + err);
	}
};
