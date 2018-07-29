// -------------------------------------------------------------------
// set needed parameters and dependencies

var trees;
// Tell World Wind to log only warnings.
WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);
// Create the World Window.
var wwd = new WorldWind.WorldWindow("canvasOne");

//Define Location on each City
var Location_Germany_Frankfurt_Lat = 50.090142;
var Location_Germany_Frankfurt_Long = 8.617049;
var Location_USA_NewYork_Lat = 40.690142;
var Location_USA_NewYork_Long = -73.917049;
// Navigate to the starting location
wwd.navigator.lookAtLocation.latitude = Location_USA_NewYork_Lat;
wwd.navigator.lookAtLocation.longitude = Location_USA_NewYork_Long;
wwd.navigator.range = 30e3;
wwd.navigator.tilt = 45;


// Add imagery layers.
var layers = [

	{ layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true },
	{ layer: new WorldWind.CompassLayer(), enabled: true },

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
		maxLat = position.latitude + 0.007,
		maxLong = position.longitude + 0.015,
		minLat = position.latitude - 0.007,
		minLong = position.longitude - 0.015;

	// recenter the view 
	wwd.goTo(new WorldWind.Position(position.latitude, position.longitude, 2500));
	deleteLayer();

	// query current wind data (speed, direction, date)
	var currentWind = {};
	var histwindnumb = 0;
	function translatehistwind() {
		if (histwind == 'jan') {
			histwindnumb = 1;
		}
		else if (histwind == 'feb') {
			histwindnumb = 2;
		}
		else if (histwind == 'mar') {
			histwindnumb = 3;
		}
		else if (histwind == 'apr') {
			histwindnumb = 4;
		}
		else if (histwind == 'may') {
			histwindnumb = 5;
		}
		else if (histwind == 'jun') {
			histwindnumb = 6;
		}
		else if (histwind == 'jul') {
			histwindnumb = 7;
		}
		else if (histwind == 'aug') {
			histwindnumb = 8;
		}
		else if (histwind == 'sep') {
			histwindnumb = 9;
		}
		else if (histwind == 'okt') {
			histwindnumb = 10;
		}
		else if (histwind == 'nov') {
			histwindnumb = 11;
		}
		else if (histwind == 'dez') {
			histwindnumb = 12;
		}
		else {
			histwindnumb = 8;
		}

	};

	//alert(current_area_select)
	//alert(current_hist_wind)
	if (current_area_select == "NYC" && current_hist_wind == "CUR") {
		$.get("/currentWindNY", function (data, status) {
			currentWind = data;
			async: false;
		});
	} else if (current_area_select == "FFM" && current_hist_wind == "CUR") {
		$.get("/currentWind", function (data, status) {
			currentWind = data;
			async: false;
		});
	} else if (current_area_select == "FFM" && current_hist_wind == "HIS") {

		translatehistwind();

		currentWind = HistWindData();
		//alert(currentWind)
		function HistWindData() {

			try {

				let monthdata = {};

				monthdata[0] = histwindnumb;
				monthdata[1] = "frankfurt"
				$.ajax({
					async: false,
					type: "POST",
					url: '/getWindHist',
					data: monthdata,
				}).done(function (histwinddata) {
					convertdata(histwinddata);
				});

				function convertdata(histwinddt) {
					currentwind = histwinddt;
				}

				return currentwind;
			}
			catch (err) {
				console.log('->  function gethistWind() failed!\n' + err);
			}

		}

	} else if (current_area_select == "NYC" && current_hist_wind == "HIS") {
		translatehistwind();
		currentWind = HistWindData();
		//alert(currentWind)
		function HistWindData() {

			try {

				let monthdata = {};

				monthdata[0] = histwindnumb;
				monthdata[1] = "newyork"
				$.ajax({
					async: false,
					type: "POST",
					url: '/getWindHist',
					data: monthdata,
				}).done(function (histwinddata) {
					convertdata(histwinddata);
				});

				function convertdata(histwinddt) {
					currentwind = histwinddt;
				}

				return currentwind;
			}
			catch (err) {
				console.log('->  function gethistWind() failed!\n' + err);
			}

		}
	};

	// get the trees which are in the rectangle and which are selected
	// getTreeRecCurrent form select js will be called.
	// -> in this function the trees will be requested and the multiselect list is readed out

	// the function which draws the ellipses, will be called
	// after a delay to wait for the required ajax requests ()

	if (current_hist_wind == "CUR") {
		setTimeout(function () { callDrawPollen() }, 500);
	} else if (current_hist_wind == "HIS") {
		setTimeout(function () { callPollenHistory() }, 500);
	}
	;

	//


	// *** call the current pollen ellipses ***
	function callDrawPollen() {

		try {
			// get the month number (mm) from the current date
			var month = currentWind[0].in_date.slice(5, 7);
			// get the blooming valuesl
			var blooming = getTreeBlooming(month);
			// defines the blooming value of the tree
			var bloomFactor;
			// ellipse color factor 
			var color = 1;
			var bloomFactorText;

			if (viewTrees.length > 0) {
				for (i = 0; i < viewTrees.length; i++) {

					for (var k = 0; k < blooming.length; k++) {
						if (blooming[k].tree_type == viewTrees[i].treetype) {
							if (blooming[k].month == 0) {
								bloomFactor = 0.01;
								bloomFactorText = "no pollen";
							}
							else if (blooming[k].month == 1) {
								bloomFactor = 1;
								bloomFactorText = "Highest";
							}
							else if (blooming[k].month == 0.66) {
								bloomFactor = 0.66;
								bloomFactorText = "Medium";
							}
							else if (blooming[k].month == 0.33) {
								bloomFactor = 0.33;
								bloomFactorText = "Low";
							}
							else {
								bloomFactor = blooming[k].month;
							}
							// set the color
							if (viewTrees[i].treetype == 'Birke') {
								color = 21;
							}
							else if (viewTrees[i].treetype == 'Erle') {
								color = 31;
							}
							else if (viewTrees[i].treetype == 'Hasel') {
								color = 41;
							}
							else {
								color = 51;
							}
						}
					}

					drawPollenSpread(currentWind[0].speed, currentWind[0].direction, viewTrees[i].lat, viewTrees[i].lon, 250, bloomFactor, color, viewTrees[i].treetype, bloomFactorText);
				}
			}

		}
		catch (err) {
			console.log('->  function callDrawPollen() failed!\n' + err);
		}

	}

	// *** draw historical pollen ellipses ***
	function callPollenHistory() {

		try {

			// history blooming
			var blooming = getTreeBloomingHist();
			// get the blooming valuesl
			//var blooming = getTreeBloomingHist();
			// defines the blooming value of the tree
			var bloomFactor;
			// ellipse color factor 
			var color = 1;
			var bloomFactorText;
			if (viewTrees.length > 0) {
				for (i = 0; i < viewTrees.length; i++) {

					for (var k = 0; k < blooming.length; k++) {
						if (blooming[k].tree_type == viewTrees[i].treetype) {
							// set the blooming
							if (blooming[k].month == 0) {
								bloomFactor = 0.01;
								bloomFactorText = "no pollen";
							}
							else if (blooming[k].month == 1) {
								bloomFactor = 1;
								bloomFactorText = "Highest";
							}
							else if (blooming[k].month == 0.66) {
								bloomFactor = 0.66;
								bloomFactorText = "Medium";
							}
							else if (blooming[k].month == 0.33) {
								bloomFactor = 0.33;
								bloomFactorText = "Low";
							}
							else {
								bloomFactor = blooming[k].month;
							}
							// set the color
							if (viewTrees[i].treetype == 'Birke') {
								color = 22;
							}
							else if (viewTrees[i].treetype == 'Erle') {
								color = 32;
							}
							else if (viewTrees[i].treetype == 'Hasel') {
								color = 42;
							}
							else {
								color = 52;
							}

						}
					}
					drawPollenSpread(currentWind[0].speed, currentWind[0].direction, viewTrees[i].lat, viewTrees[i].lon, 250, bloomFactor, color, viewTrees[i].treetype, bloomFactorText);
				}
			}

		}
		catch (err) {
			console.log('->  function callPollenHistory() failed!\n' + err);
		}

	}
	let numberofTreetypes = [];

	viewTrees = getTreeRecCurrent(minLat, maxLat, minLong, maxLong);
	setTimeout(function () {
		getnumberofTrees();
	}, 500);
	//getnumberofTrees();
	chartcontainerLoading.style.display = "block";
	chartcontainerMessage.style.display = "none";

	function getnumberofTrees() {
		//console.log("TreeTransOLD" + treeselection_tmp)
		// for (i = 0; i<numberofTreetypes.length; i++){
		// 	delete numberofTreetypes[i]
		// };
		
		for (j = 0; j < treetrans.length; j++) {
			var amount = 0;
			for (i = 0; i < viewTrees.length; i++) {
				if (viewTrees[i].treetype == treeselection_tmp[j].className) {
					amount += 1
					//console.log(amount);

				};
			};
			var objTree = { name: treeselection_tmp[j].className, y: amount };
			numberofTreetypes.push(objTree);
			//console.log(numberofTreetypes);
			//console.log(chartdata);
			//for (var i = 0; numberofTreetypes.length; i ++) {
			//	var test = translate_treeype_de_en(numberofTreetypes[i].name)
			//  };
			for (t = 0; t < numberofTreetypes.length; t ++){
				numberofTreetypes[t].name = translate_treeype_de_en(numberofTreetypes[t].name)
			};
			//console.log(numberofTreetypes);
			treechart(numberofTreetypes);
			
			showPieChart();
			setTimeout(function () {
				chartcontainerLoading.style.display = "none";
			}, 500);

		};
	};
};



// Listen for mouse clicks.
var clickRecognizer = new WorldWind.ClickRecognizer(wwd, handleClick);

// Listen for taps on mobile devices.
var tapRecognizer = new WorldWind.TapRecognizer(wwd, handleClick);


//---------------------------------------------------------------------
// Generation of a surface elipses according to the wind and tree data	

var rend = new WorldWind.RenderableLayer();
var rendme = new WorldWind.RenderableLayer();  //Layer for medium ellispe
var rendse = new WorldWind.RenderableLayer();  //Layer for small ellispe
var rendtop = new WorldWind.RenderableLayer(); //Tree Point will always be on top
var rendtext = new WorldWind.RenderableLayer(); //Tree Point will always be on top
var text;
var PollenOutline = false;
// Now set up to handle highlighting.
var highlightController = new WorldWind.HighlightController(wwd);

// generation of the surface elipse
// INPUT: - wind strength 
//		  - wind direction
//		  - latitude and longitude of the tree
//		  - strenght parameter (polen blooming value)
function drawPollenSpread(windStr, windDeg, TreeLat, TreeLong, StrenghtPara, bloomingF, p_color, TreeType, bloomingT) {

	try {

		var trans = 0.2;
		// define color
		// new WorldWind.Color(1, 1, 1, trans);
		var boundary_big;
		var boundary_inner;
		var color_start, color_low, color_mid, color_out
		if (p_color == 1) {
			// other (not low and high risk)
			// real time
			color_start = new WorldWind.Color(1, 1, 1, 0.1);
			color_low = new WorldWind.Color(1, 1, 1, 0.1);
			color_mid = new WorldWind.Color(1, 1, 1, 0.1);
			color_out = new WorldWind.Color(1, 1, 1, 0.1);
			boundary_inner = WorldWind.Color.BLUE;
			boundary_big = WorldWind.Color.WHITE;
		}
		else if (p_color == 21) {
			// purple 85 % with Trans value
			// High effect : Birke **real-time**
			color_start = new WorldWind.Color(0.85, 0, 0.85, trans);
			color_low = new WorldWind.Color(0.85, 0, 0.85, trans);
			color_mid = new WorldWind.Color(0.85, 0, 0.85, trans);
			color_out = new WorldWind.Color(0.85, 0, 0.85, trans);
			boundary_inner = WorldWind.Color.BLUE;
			boundary_big = WorldWind.Color.RED;
		}
		else if (p_color == 31) {
			// Red 85 % with Trans value
			// High effect : Erle **real-time**
			color_start = new WorldWind.Color(0.85, 0, 0, trans);
			color_low = new WorldWind.Color(0.85, 0, 0, trans);
			color_mid = new WorldWind.Color(0.85, 0, 0, trans);
			color_out = new WorldWind.Color(0.85, 0, 0, trans);
			boundary_inner = WorldWind.Color.BLUE;
			boundary_big = WorldWind.Color.RED;
		}
		else if (p_color == 41) {
			//  Blue 100 % with Trans value 
			// High effect : Hasel **real-time**
			color_start = new WorldWind.Color(0, 0, 1, trans);
			color_low = new WorldWind.Color(0, 0, 1, trans);
			color_mid = new WorldWind.Color(0, 0, 1, trans);
			color_out = new WorldWind.Color(0, 0, 1, trans);
			boundary_inner = WorldWind.Color.BLUE;
			boundary_big = WorldWind.Color.RED;
		}
		else if (p_color == 51) {
			// Green
			// Low effect : others types **real-time**
			color_start = new WorldWind.Color(0, 1, 0, trans);
			color_low = new WorldWind.Color(0, 1, 0, trans);
			color_mid = new WorldWind.Color(0, 1, 0, trans);
			color_out = new WorldWind.Color(0, 1, 0, trans);
			boundary_inner = WorldWind.Color.BLUE;
			boundary_big = WorldWind.Color.YELLOW;
		}
		else if (p_color == 22) {
			// purple 85 % with Trans value 
			// High effect : Birke **Past Data**
			color_start = new WorldWind.Color(0.85, 0, 0.85, trans);
			color_low = new WorldWind.Color(0.85, 0, 0.85, trans);
			color_mid = new WorldWind.Color(0.85, 0, 0.85, trans);
			color_out = new WorldWind.Color(0.85, 0, 0.85, trans);
			boundary_inner = WorldWind.Color.BLUE;
			boundary_big = WorldWind.Color.YELLOW;
		}
		else if (p_color == 32) {
			// Orange (0.3G + 1B) with Trans value
			// High effect : Erle **Past Data**
			color_start = new WorldWind.Color(0.85, 0, 0, trans);
			color_low = new WorldWind.Color(0.85, 0, 0, trans);
			color_mid = new WorldWind.Color(0.85, 0, 0, trans);
			color_out = new WorldWind.Color(0.85, 0, 0, trans);
			boundary_inner = WorldWind.Color.BLUE;
			boundary_big = WorldWind.Color.YELLOW;
		}
		else if (p_color == 42) {
			//  Blue 100 % with Trans value
			// High effect : Hasel **Past Data**
			color_start = new WorldWind.Color(0, 0, 1, trans);
			color_low = new WorldWind.Color(0, 0, 1, trans);
			color_mid = new WorldWind.Color(0, 0, 1, trans);
			color_out = new WorldWind.Color(0, 0, 1, trans);
			boundary_inner = WorldWind.Color.BLUE;
			boundary_big = WorldWind.Color.YELLOW;
		}
		else if (p_color == 52) {
			// Green
			// Low effect : others types **Past Data**
			color_start = new WorldWind.Color(0, 1, 0, trans);
			color_low = new WorldWind.Color(0, 1, 0, trans);
			color_mid = new WorldWind.Color(0, 1, 0, trans);
			color_out = new WorldWind.Color(0, 1, 0, trans);
			boundary_inner = WorldWind.Color.BLUE;
			boundary_big = WorldWind.Color.YELLOW;
		}
		else {
			// other (not low and high risk)
			// historical data
			color_start = new WorldWind.Color(1, 1, 1, 0.1);
			color_low = new WorldWind.Color(1, 1, 1, 0.1);
			color_mid = new WorldWind.Color(1, 1, 1, 0.1);
			color_out = new WorldWind.Color(1, 1, 1, 0.1);
			boundary_inner = WorldWind.Color.BLUE;
			boundary_big = WorldWind.Color.WHITE;
		}


		// input Wind attribute and Tree location
		var windDegR = windDeg * Math.PI / 180.0;
		var R_earth = 6371000.0; // Earth's Radius in Meters
		var TreeLatR = TreeLat * Math.PI / 180.0;
		var TreeLongR = TreeLong * Math.PI / 180.0;

		// var StrenghtPara = 100.0;	 // Default Is 5.0
		// computeNewCenter of the Big Ellipse
		var St = StrenghtPara * bloomingF;// * windStr
		windDeg = windDeg + 90.0;
		var EllispeCenterLATR = Math.asin(Math.sin(TreeLatR) * Math.cos(St / R_earth) + Math.cos(TreeLatR) * Math.sin(St / R_earth) * Math.cos(windDegR));
		var EllispeCenterLONGR = TreeLongR + Math.atan2(Math.sin(windDegR) * Math.sin(St / R_earth) * Math.cos(TreeLatR), Math.cos(St / R_earth) - Math.sin(TreeLatR) * Math.sin(EllispeCenterLATR));
		var EllispeCenterLAT = EllispeCenterLATR * 180 / Math.PI;
		var EllispeCenterLONG = EllispeCenterLONGR * 180 / Math.PI;

		// computeNewCenter of the Small Ellipse
		var StrenghtParas = StrenghtPara * 0.3;	//
		var St = StrenghtParas * bloomingF;// * windStr
		var EllispeCenterLATRs = Math.asin(Math.sin(TreeLatR) * Math.cos(St / R_earth) + Math.cos(TreeLatR) * Math.sin(St / R_earth) * Math.cos(windDegR));
		var EllispeCenterLONGRs = TreeLongR + Math.atan2(Math.sin(windDegR) * Math.sin(St / R_earth) * Math.cos(TreeLatR), Math.cos(St / R_earth) - Math.sin(TreeLatR) * Math.sin(EllispeCenterLATR));
		var EllispeCenterLATs = EllispeCenterLATRs * 180 / Math.PI;
		var EllispeCenterLONGs = EllispeCenterLONGRs * 180 / Math.PI;

		// computeNewCenter of the Medium Ellipse
		var StrenghtParaM = StrenghtPara * 0.5;	//
		var St = StrenghtParaM * bloomingF;// * windStr
		var EllispeCenterLATRm = Math.asin(Math.sin(TreeLatR) * Math.cos(St / R_earth) + Math.cos(TreeLatR) * Math.sin(St / R_earth) * Math.cos(windDegR));
		var EllispeCenterLONGRm = TreeLongR + Math.atan2(Math.sin(windDegR) * Math.sin(St / R_earth) * Math.cos(TreeLatR), Math.cos(St / R_earth) - Math.sin(TreeLatR) * Math.sin(EllispeCenterLATR));
		var EllispeCenterLATm = EllispeCenterLATRm * 180 / Math.PI;
		var EllispeCenterLONGm = EllispeCenterLONGRm * 180 / Math.PI;

		// make the ShapeAttributes for Big Ellispe
		var att = new WorldWind.ShapeAttributes(null);
		att.drawInterior = true;

		att.outlineColor = boundary_big;
		att.interiorColor = color_start;
		att.outerWidth = 0.1;

		// make the ShapeAttributes for small Ellispe
		var att2 = new WorldWind.ShapeAttributes(null);
		att2.drawInterior = true;

		att2.outlineColor = boundary_big;
		att2.interiorColor = color_low;
		att.outerWidth = 0.1;

		// make the ShapeAttributes for medium Ellispe
		var attm = new WorldWind.ShapeAttributes(null);
		attm.drawInterior = true;

		attm.outlineColor = boundary_big;
		attm.interiorColor = color_mid;
		att.outerWidth = 0.1;
		// Set outline parameter
		if (PollenOutline) {
			att.drawOutline = true;
			att2.drawOutline = true;
			attm.drawOutline = true;
		} else {
			att.drawOutline = false;
			att2.drawOutline = false;
			attm.drawOutline = false;
		};
		// make the ShapeAttributes for the circle
		var attc = new WorldWind.ShapeAttributes(null);
		attc.drawInterior = true;
		attc.drawOutline = true;
		attc.outlineColor = boundary_inner;
		attc.interiorColor = color_out;

		//------------Draw Big Ellipse----------------
		var SE_a_axe = StrenghtPara * 2 * bloomingF; //*windStr
		var SE_b_axe = SE_a_axe / 2;
		var el_lo = new WorldWind.Position(EllispeCenterLAT, EllispeCenterLONG, 1e5);
		var SE = new WorldWind.SurfaceEllipse(el_lo, SE_a_axe, SE_b_axe, windDeg, att);
		rend.addRenderable(SE);

		//------------Draw Medium Ellipse----------------
		var SEm_a_axe = StrenghtPara * 1.2 * bloomingF; //*windStr
		var SEm_b_axe = SEm_a_axe / 2;
		var el_lom = new WorldWind.Position(EllispeCenterLATm, EllispeCenterLONGm, 1e5);
		var SEm = new WorldWind.SurfaceEllipse(el_lom, SEm_a_axe, SEm_b_axe, windDeg, attm);
		if (LoadOnlyOutSwitch == false) {
			rendme.addRenderable(SEm); // add Big ellispe to the globe
		}

		//------------Draw Small Ellipse----------------
		var SEs_a_axe = StrenghtPara * 0.8 * bloomingF; //*windStr
		var SEs_b_axe = SEs_a_axe / 2;
		var el_los = new WorldWind.Position(EllispeCenterLATs, EllispeCenterLONGs, 1e5);
		var SEs = new WorldWind.SurfaceEllipse(el_los, SEs_a_axe, SEs_b_axe, windDeg, att2);
		if (LoadOnlyOutSwitch == false) {
			rendse.addRenderable(SEs);
		}
		//------------Draw Circle at Tree Position-------------------
		var cir = new WorldWind.Position(TreeLat, TreeLong, 1e5);
		var Circle = new WorldWind.SurfaceCircle(cir, 2, attc);
		rendtop.addRenderable(Circle);
		//rend.opacity = 0.3;	

		//-----------Draw Text Attribute at the tree location --------
		//Compute back the Wind direction to meteorological axis
		windDeg = windDeg - 90;

		var textAttributes = new WorldWind.TextAttributes(null);
		textAttributes.depthTest = false;
		var textPosition = new WorldWind.Position(TreeLat, TreeLong, 30);
		var Tree_Type = translate_treeype_de_en(TreeType)

		if ((p_color == 21) || (p_color == 31) || (p_color == 41) || (p_color == 22) || (p_color == 32) || (p_color == 42)) {
			//set text for High risk trees
			textAttributes.color = WorldWind.Color.YELLOW;
			text = new WorldWind.GeographicText(textPosition, "\u2663 " + Tree_Type + "\n" + "Wind Info: Deg " + windDeg + "\xB0 " + "Speed: " + windStr + "m/s\n" + "Type: High allergenic\n" + "Season Effect: " + bloomingT + "(" + bloomingF + "%)");
		}
		else {
			//set text for Low risk & other trees
			textAttributes.color = WorldWind.Color.CYAN;
			text = new WorldWind.GeographicText(textPosition, "\u2663 " + Tree_Type + "\n" + "Wind Info: Deg " + windDeg + "\xB0 " + "Speed: " + windStr + "m/s \n" + "Type: Low allergenic\n" + "Season Effect: " + bloomingT + "(" + bloomingF + "%)");
		}
		text.attributes = textAttributes;
		rendtext.addRenderable(text);
		//rendtext.enabled = false;
	}
	catch (err) {
		console.log('->  generate elipse failed!\n' + err);
	}

}
wwd.addLayer(rend);    //draw big ellipse (Lowest)
wwd.addLayer(rendme);  //draw medium ellipse
wwd.addLayer(rendse);  //draw small ellipse
wwd.addLayer(rendtext);
wwd.addLayer(rendtop); //draw circle points of tree last (top)
var showLabel = function () {
	//rendtext.refresh();
	rendtext.enabled = true;
	//wwd.addLayer(rendtext);
	wwd.redraw();
};
var hideLabel = function () {
	rendtext.enabled = false;
	// rendtext.removeAllRenderables();
	//rendtext.refresh();
	wwd.redraw();
};
// delete layer function
function deleteLayer() {

	try {
		// remove layer
		rend.removeAllRenderables();
		rendme.removeAllRenderables();
		rendse.removeAllRenderables();
		rendtop.removeAllRenderables();
		rendtext.removeAllRenderables();

		rend.refresh();
		rendme.refresh();
		rendse.refresh();
		rendtop.refresh();
		rendtext.refresh();

		wwd.redraw();
	}
	catch (err) {
		console.log('->  delete layer failed!\n' + err);
	}

};





function translate_treeype_de_en(tree_type) {

	var ttype = ''
	if (tree_type == 'Birke') {
		ttype = 'Birch';
	} else if (tree_type == 'Erle') {
		ttype = 'Alder';
	} else if (tree_type == 'Hasel') {
		ttype = 'Hazel';
	} else if (tree_type == 'Ahorn') {
		ttype = 'Maple';
	} else if (tree_type == 'Apfel') {
		ttype = 'Apple';
	} else if (tree_type == 'Birne') {
		ttype = 'Pear';
	} else if (tree_type == 'Buche') {
		ttype = 'Beech';
	} else if (tree_type == 'Buchs') {
		ttype = 'Buchs';
	} else if (tree_type == 'Eibe') {
		ttype = 'Yew';
	} else if (tree_type == 'Eiche') {
		ttype = 'Oak';
	} else if (tree_type == 'Esche') {
		ttype = 'Ash';
	} else if (tree_type == 'Flieder') {
		ttype = 'Lilac';
	} else if (tree_type == 'Goetterbaum') {
		ttype = 'Ailanthus';
	} else if (tree_type == 'Holunder') {
		ttype = 'Elder';
	} else if (tree_type == 'Kastanie') {
		ttype = 'Chestnut';
	} else if (tree_type == 'Kiefer') {
		ttype = 'Pine';
	} else if (tree_type == 'Kirsche') {
		ttype = 'Cherry';
	} else if (tree_type == 'Linde') {
		ttype = 'Linden';
	} else if (tree_type == 'Pflaume') {
		ttype = 'Plum';
	} else if (tree_type == 'Robinie') {
		ttype = 'Robinie';
	} else if (tree_type == 'Schlafbaum') {
		ttype = 'Sleeping-Tree';
	} else if (tree_type == 'Schnur') {
		ttype = 'Schnur';
	} else if (tree_type == 'Tanne') {
		ttype = 'Fir';
	} else if (tree_type == 'Ulme') {
		ttype = 'Elm';
	} else if (tree_type == 'Walnuss') {
		ttype = 'Walnut';
	} else if (tree_type == 'Weide') {
		ttype = 'Pasture';
	} else if (tree_type == 'Zeder') {
		ttype = 'Cedar';
	} else if (tree_type == 'Zypresse') {
		ttype = 'Cypress';
	} else if (tree_type == 'other') {
		ttype = 'other';
	} else {
		ttype = tree_type;
	}

	return ttype;
}





