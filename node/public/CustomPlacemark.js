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
requirejs(['./src/WorldWind',
        './LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        // Tell World Wind to log only warnings.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);
		

        // Create the World Window.
        var wwd = new WorldWind.WorldWindow("canvasOne");
        // World Window.
        wwd.navigator.lookAtLocation.latitude = 50.11;
        wwd.navigator.lookAtLocation.longitude = 8.68;
        wwd.navigator.range = 10e2; // 2 million meters above the ellipsoid

        // Add imagery layers.
        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        var placemark,
            placemarkAttributes = new WorldWind.PlacemarkAttributes(null),
            highlightAttributes,
            placemarkLayer = new WorldWind.RenderableLayer("Placemarks"),
            latitude = 50.11,
            longitude = 8.68;

        // Set up the common placemark attributes.
        placemarkAttributes.imageScale = 1;
        placemarkAttributes.imageOffset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 0.5);
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;
		

	
		$.get("/test", function(data, status){
			//alert("Data: " + data + "\nStatus: " + status);
			//console.log(data);
			trees = data
			//console.log('test');
			//console.log(data[0].lat);
			//console.log(trees.length);
			
				//console.log(trees.length);
			for (var i=0; i<=trees.length-1; i++){
				//load from database
				//console.log(data[i].lat);
				
				// Create the placemark.
				
				placemark = new WorldWind.Placemark(new WorldWind.Position(trees[i].lat, trees[i].lon, 0), false, null);
				placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

				// Create the placemark attributes for the placemark.
				placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
				// Wrap the canvas created above in an ImageSource object to specify it as the placemark image source.
				placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/icon.png";
				placemark.attributes = placemarkAttributes;

				// Create the highlight attributes for this placemark. Note that the normal attributes are specified as
				// the default highlight attributes so that all properties are identical except the image scale. You could
				// instead vary the color, image, or other property to control the highlight representation.
				highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
				highlightAttributes.imageScale = 0.2;
				placemark.highlightAttributes = highlightAttributes;

				// Add the placemark to the layer.
				placemarkLayer.addRenderable(placemark);
			}
			// Add the placemarks layer to the World Window's layer list.
			wwd.addLayer(placemarkLayer);

			// Create a layer manager for controlling layer visibility.
			var layerManger = new LayerManager(wwd);

			// Now set up to handle highlighting.
			var highlightController = new WorldWind.HighlightController(wwd);
		});
    });