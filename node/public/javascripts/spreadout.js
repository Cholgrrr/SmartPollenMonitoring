function drawPollenSpread(windStr, windDeg, TreeLat, TreeLong, StrenghtPara) {
		// =======================Start joe's Edited part================================
		// Set Starting point at HFT Stuttgart
		
		console.log('in spread out'); 
		var wwd = new WorldWind.WorldWindow("canvasOne");
		wwd.navigator.lookAtLocation.latitude = 48.779871;
		wwd.navigator.lookAtLocation.longitude = 9.173436;
		
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
		wwd.addLayer(SE); // add Big ellispe to the globe
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
		SE.displayName = "EllispeMedium" // make the ellispe selectable
		wwd.addLayer(SEm); // add Big ellispe to the globe
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
		wwd.addLayer(SEs);
		//------------Draw Circle at Tree Position-------------------
		var cir = new WorldWind.Position(TreeLat, TreeLong,1e5);
		var Circle = new WorldWind.SurfaceCircle(cir, 5, attc);
		Circle.displayName = "Tree-Location";
		wwd.addLayer(Circle);
		 }
		//-----------Test Drawing some points------------------------
	
	
