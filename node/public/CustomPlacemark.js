/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * Illustrates how to create a placemark with a dynamically created image.
 *
 * @version $Id: CustomPlacemark.js 3320 2015-07-15 20:53:05Z dcollins $
 */
var trees;
// Tell World Wind to log only warnings.
WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);
// Create the World Window.
var wwd = new WorldWind.WorldWindow("canvasOne");
// World Window.
wwd.navigator.lookAtLocation.latitude = 50.090142; //50.11;  
wwd.navigator.lookAtLocation.longitude = 8.617049; //8.68;
wwd.navigator.range = 10e2; // 2 million meters above the ellipsoid
// Add imagery layers.
var layers = [
     //{layer: new WorldWind.BMNGLayer(), enabled: true},
     //{layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
      {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
      {layer: new WorldWind.CompassLayer(), enabled: true},
      //{layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
      //{layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
];

for (var l = 0; l < layers.length; l++) {
    layers[l].layer.enabled = layers[l].enabled;
    wwd.addLayer(layers[l].layer);
}
//---------------------------------------------------------------------
        // The common gesture-handling function.
        var handleClick = function (recognizer) {
            // Obtain the event location.
          
			deleteLayer();
		  
			var x = recognizer.clientX,
                y = recognizer.clientY,
				pickList = wwd.pick(wwd.canvasCoordinates(x, y)),
			    position = pickList.objects[0].position,
				maxLat = position.latitude + 0.00295,
				maxLong = position.longitude + 0.00882,
				minLat = position.latitude - 0.00295,
				minLong = position.longitude - 0.00882;
			
			wwd.goTo(new WorldWind.Position(position.latitude, position.longitude,1000));
			deleteLayer();
			
			let currentWind = {};
			$.get("/currentWind", function(data, status){
				console.log(data);
				currentWind = data; 
			});
			console.log('wind');
			console.log(currentWind); 
				
			viewTrees = getTreeRecCurrent(minLat, maxLat, minLong, maxLong);
			setTimeout(function(){callDrawPollen()}, 200);
			
			function callDrawPollen() {
				var rend = new WorldWind.RenderableLayer();
				//if (viewTrees.length > 5) {
					for(i=0; i<5; i++) { 
						console.log('call function');
						console.log('lat: ' + viewTrees[i].lat);
						console.log('lon: ' + viewTrees[i].lon);
						drawPollenSpread(5, 45, viewTrees[i].lat, viewTrees[i].lon, 5);
					}
				//}
			}
			
        };

        // Listen for mouse clicks.
        var clickRecognizer = new WorldWind.ClickRecognizer(wwd, handleClick);

        // Listen for taps on mobile devices.
        var tapRecognizer = new WorldWind.TapRecognizer(wwd, handleClick);
//------------------------------------------------------------------------------------------
		var rend = new WorldWind.RenderableLayer();
		drawPollenSpread(10, 45.0, 50.090142, 8.617049, 5);





// Create a layer manager for controlling layer visibility.
//####################################################################

//var layerManger = new LayerManager(wwd);

//####################################################################
// Now set up to handle highlighting.
var highlightController = new WorldWind.HighlightController(wwd);
//var placemark,
//    placemarkAttributes = new WorldWind.PlacemarkAttributes(null),
//    highlightAttributes,
//    placemarkLayer = new WorldWind.RenderableLayer("Placemarks"),
//    latitude = 50.11,
//    longitude = 8.68;

//// Set up the common placemark attributes.
 //placemarkAttributes.imageScale = 1;
 //placemarkAttributes.imageOffset = new WorldWind.Offset(
 //    WorldWind.OFFSET_FRACTION, 0.5,
 //    WorldWind.OFFSET_FRACTION, 0.5);
 //placemarkAttributes.imageColor = WorldWind.Color.WHITE;


//--------------------------------------------------------------
//var rend = new WorldWind.RenderableLayer();
		
function drawPollenSpread(windStr, windDeg, TreeLat, TreeLong, StrenghtPara) {
		console.log('coordinates in drawPollenSpread')
		console.log('lat: ' + TreeLat);
		console.log('lon: ' + TreeLong);
	
		
		// =======================Start joe's Edited part================================
		// Set Starting point at HFT Stuttgart
		//wwd.navigator.lookAtLocation.latitude = 48.779871;
		//wwd.navigator.lookAtLocation.longitude = 9.173436;
		
		// input Wind attribute and Tree location
		//var windStr = 10.0; //      Wind Speed Strenght 10m/s2
		//var windDeg = 45.0; // 		Wind Degree
		var windDegR = windDeg * Math.PI / 180.0;
		//var TreeLat = 48.779871; //	Tree Location Lattitude
		//var TreeLong = 9.173436; // Tree Location Longtitude
		var R_earth = 6371000.0; // Earth's Radius in Meters
		var TreeLatR = TreeLat * Math.PI / 180.0;
		var TreeLongR = TreeLong * Math.PI / 180.0;
		//var StrenghtPara = 100.0;	 // Default Is 5.0
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
        att.interiorColor = new WorldWind.Color(0, 1, 0, 0.5);
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
		//wwd.addLayer(SE);

		//wwd.addLayer(SE); // add Big ellispe to the globe
			//SE.altitudeMode = WorldWind.ABSOLUTE;
			//SE.extrude = true;
			//att.drawVerticals = polygon.extrude;
			//att.applyLighting = true;
			//SE.ShapeAttributes = att;
		//------------Draw Medium Ellipse----------------
		var SEm_a_axe = windStr * StrenghtPara * 1.2;
		var SEm_b_axe = SEm_a_axe / 2;
		var el_lom = new WorldWind.Position(EllispeCenterLATm, EllispeCenterLONGm,1e5);
		var SEm = new WorldWind.SurfaceEllipse(el_lom, SEm_a_axe, SEm_b_axe, windDeg, attm);
		//rend.addRenderable(SEm); // add Big ellispe to the globe
		SEm.displayName = "EllispeMedium" // make the ellispe selectable
		rend.addRenderable(SEm); // add Big ellispe to the globe
		//wwd.addLayer(SEm);

			//SE.altitudeMode = WorldWind.ABSOLUTE;
			//SE.extrude = true;
			//att.drawVerticals = polygon.extrude;
			//att.applyLighting = true;
			//SE.ShapeAttributes = att;
		//------------Draw Small Ellipse----------------
		var SEs_a_axe = windStr * StrenghtPara * 0.8;
		var SEs_b_axe = SEs_a_axe / 2 ;
		var el_los = new WorldWind.Position(EllispeCenterLATs, EllispeCenterLONGs,1e5);
		var SEs = new WorldWind.SurfaceEllipse(el_los, SEs_a_axe, SEs_b_axe, windDeg, att2);
		SEs.displayName = "EllispeSmall"

		
		//wwd.addLayer(SEs);

		rend.addRenderable(SEs);

		//------------Draw Circle at Tree Position-------------------
		var cir = new WorldWind.Position(TreeLat, TreeLong,1e5);
		var Circle = new WorldWind.SurfaceCircle(cir, 5, attc);
		Circle.displayName = "Tree-Location";

		rend.addRenderable(Circle);	
		//rend.opacity = 0.3;
		wwd.addLayer(rend);
		//wwd.addLayer(Circle);
		

}
		//-----------Test Drawing some points------------------------

		
		
		
		
		//$.get("/treeLoad", function(data, status){
		//	//alert("Data: " + data + "\nStatus: " + status);
		//	//console.log(data);
		//	trees = data
		//	//console.log('test');
		//	//console.log(data[0].lat);
		//	//console.log(trees.length);
			
		//		//console.log(trees.length);
		//	for (var i=0; i<=2; i++){
		//		//load from database
		//		//console.log(data[i].lat);
				
		//		// Create the placemark.

				
		//		placemark = new WorldWind.Placemark(new WorldWind.Position(trees[i].lat, trees[i].lon, 0), false, null);
		//		placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

		//		// Create the placemark attributes for the placemark.
		//		placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
		//		// Wrap the canvas created above in an ImageSource object to specify it as the placemark image source.
		//		placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/icon.png";
		//		placemark.attributes = placemarkAttributes;

		//		// Create the highlight attributes for this placemark. Note that the normal attributes are specified as
		//		// the default highlight attributes so that all properties are identical except the image scale. You could
		//		// instead vary the color, image, or other property to control the highlight representation.
		//		highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
		//		highlightAttributes.imageScale = 0.2;
		//		placemark.highlightAttributes = highlightAttributes;

		//		// Add the placemark to the layer.
		//		placemarkLayer.addRenderable(placemark);
		//	}
			// Add the placemarks layer to the World Window's layer list.
			//wwd.addLayer(placemarkLayer);


		//});

//};




function deleteLayer() {
    
    // remove layer

    rend.removeAllRenderables();
	wwd.addLayer(rend);
    wwd.redraw();

	//rend.enabled = false;
	//SEs.enabled = false;
	rend.removeAllRenderables();
	rend.refresh();
	wwd.redraw();
    //wwd.redraw();


};
