// delete each one after each call

let dataset;
let routes;
let i;
var shapesLayer = new WorldWind.RenderableLayer("line");
var placemarkLayer = new WorldWind.RenderableLayer("Start");
var placemarkLayerend = new WorldWind.RenderableLayer("Finish");
//var placemarklabel = new WorldWind.RenderableLayer();
var mm = 0;
var placemarklabel = [];

var navResultLat,
    navResultLong;
var placemark, placemarkend, shape, placemarktxt;

function bike() {
    if (document.getElementById("bike").text == "bike") {
        document.getElementById("bike").text = "walk"
    } else if (document.getElementById("bike").text == "walk") {
        document.getElementById("bike").text = "bike"
    }
};
function toggleText() {
    var text = document.getElementById("bike").firstChild;
    text.data = text.data == "bike" ? "walk" : "bike";
}
function removeNav() {
    shapesLayer.removeAllRenderables();
    placemarkLayer.removeAllRenderables();
    placemarkLayerend.removeAllRenderables();
    //placemarklabel.removeAllRenderables();
    shapesLayer.refresh();
    placemarkLayer.refresh();
    placemarkLayerend.refresh();
    placemarklabel[mm].enabled = false;
    //placemarklabel.refresh();
    wwd.redraw();
};
function StartNav() {
    
    //shapesLayer.removeAllRenderables();
    //shapesLayer.refresh();
    //placemarkLayer.removeAllRenderables();
    //placemarkLayerend.removeAllRenderables();
    //placemarkLayer.refresh();
    //placemarkLayerend.refresh();
//var text_startingPoint = document.getElementById("searchTextStart").value;
//var text_endingPoint = document.getElementById("searchTextEnd").value;
var text_startingPoint = document.getElementById("pac-input").value;
var text_endingPoint = document.getElementById("pac-input2").value;
    //Text Renderable layer to be add instead
    placemarklabel[mm] = new WorldWind.RenderableLayer();
    if (mm > 0) {
        console.log("second request: Delete last layer");
        placemarklabel[mm-1].enabled = false;
    }
    shapesLayer.removeAllRenderables();
    placemarkLayer.removeAllRenderables();
    placemarkLayerend.removeAllRenderables();
    //placemarklabel.removeAllRenderables();
    shapesLayer.refresh();
    placemarkLayer.refresh();
    placemarkLayerend.refresh();
    //placemarklabel.refresh();
    wwd.redraw();
    setTimeout(function () {
        if (document.getElementById("bike").firstChild.data == "walk") {
            LoadJson("https://cors.io/?https://maps.googleapis.com/maps/api/directions/json?origin=" + text_startingPoint + "&destination=" + text_endingPoint + "&avoid=highways&mode=walking&key=AIzaSyAHKsTWBLNuyJ4-3zlG8GDkPQzVWtmvbtI");
        } else if (document.getElementById("bike").firstChild.data == "bike") {
            LoadJson("https://cors.io/?https://maps.googleapis.com/maps/api/directions/json?origin=" + text_startingPoint + "&destination=" + text_endingPoint + "&avoid=highways&mode=bicycling&key=AIzaSyAHKsTWBLNuyJ4-3zlG8GDkPQzVWtmvbtI");
        };
    }, 50);
    setTimeout(function () {
        wwd.goTo(new WorldWind.Position(navResultLat, navResultLong, 2500));
        // Add the placemark to the layer.
        
        //placemarkLayerend.addRenderable(placemarktxt);
        //placemarkLayerend.addRenderable(placemarktxt1);
        shapesLayer.addRenderable(shape);
        placemarkLayer.addRenderable(placemark);
        placemarkLayerend.addRenderable(placemarkend);
        placemarklabel[mm].addRenderable(placemarktxt);
        placemarklabel[mm].addRenderable(placemarktxt1);

        
        //placemarklabel.addRenderable(placemarktxt);
        // Add the placemarks layer to the WorldWindow's layer list.
        wwd.addLayer(placemarkLayer);
        wwd.addLayer(placemarkLayerend);
        wwd.addLayer(shapesLayer);
        wwd.addLayer(placemarklabel[mm]);
        //wwd.addLayer(placemarklabel);
        wwd.redraw();
        //mm=mm+1;
    }, 2000);
    setTimeout(function () {
        mm=mm+1;
    }, 2500);

    //console.log(dataset[0].legs.steps[0].start_location.lat)
};
var hideNav = function () {
    shapesLayer.enabled = false;
    placemarkLayer.enabled = false;
    placemarkLayerend.enabled = false;
    wwd.redraw();
};
var result_temporary;
function LoadJson(resourcesUrl) {


    $.getJSON(resourcesUrl, function (result) {
        result_temporary = result;
        $.each(result, function (i, field) {
            dataset = field;
            console.log(dataset)
            console.log(i)
            if (i == "routes") {
                routes = field
                console.log(routes)
                console.log(routes[0].legs[0].steps[0].start_location.lat)


                var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
                // Wrap the canvas created above in an ImageSource object to specify it as the placemarkAttributes image source.
                //placemarkAttributes.imageSource = new WorldWind.ImageSource(canvas);
                // Define the pivot point for the placemark at the center of its image source.
                placemarkAttributes.imageOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.5);
                placemarkAttributes.imageScale = 7;
                placemarkAttributes.imageColor = WorldWind.Color.RED;



                var placemarkAttributesend = new WorldWind.PlacemarkAttributes(null);
                // Wrap the canvas created above in an ImageSource object to specify it as the placemarkAttributes image source.
                //placemarkAttributes.imageSource = new WorldWind.ImageSource(canvas);
                // Define the pivot point for the placemark at the center of its image source.
                placemarkAttributesend.imageOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.5);
                placemarkAttributesend.imageScale = 7;
                placemarkAttributesend.imageColor = WorldWind.Color.GREEN;




                var lengthofit = routes[0].legs[0].steps.length
                lengthofit = lengthofit - 1;

                var placemarkPosition = new WorldWind.Position(routes[0].legs[0].steps[0].start_location.lat, routes[0].legs[0].steps[0].start_location.lng, 0);
                var placemarkPositionend = new WorldWind.Position(routes[0].legs[0].steps[lengthofit].end_location.lat, routes[0].legs[0].steps[lengthofit].end_location.lng, 0);
                placemark = new WorldWind.Placemark(placemarkPosition, false, placemarkAttributes);
                placemarkend = new WorldWind.Placemark(placemarkPositionend, false, placemarkAttributesend)
                boundary = [];
                var j = 0
                while (j < routes[0].legs[0].steps.length) {
                    boundary.push(new WorldWind.Location(routes[0].legs[0].steps[j].start_location.lat, routes[0].legs[0].steps[j].start_location.lng));
                    boundary.push(new WorldWind.Location(routes[0].legs[0].steps[j].end_location.lat, routes[0].legs[0].steps[j].end_location.lng));
                    j++;
                }
                //boundary.push(new WorldWind.Location(routes[0].legs[0].steps[0].start_location.lat, routes[0].legs[0].steps[0].start_location.lng));
                //boundary.push(new WorldWind.Location(routes[0].legs[0].steps[1].start_location.lat, routes[0].legs[0].steps[1].start_location.lng));
                //boundary.push(new WorldWind.Location(routes[0].legs[0].steps[2].start_location.lat, routes[0].legs[0].steps[2].start_location.lng));

                console.log(routes[0].legs[0].steps.length)
                attributes = new WorldWind.ShapeAttributes(null);
                attributes.outlineColor = new WorldWind.Color(0, 1, 1, 0.9);

                highlightAttributes = new WorldWind.ShapeAttributes(attributes);
                highlightAttributes.outlineColor = new WorldWind.Color(1, 1, 1, 1);

                shape = new WorldWind.SurfacePolyline(boundary, attributes);
                shape.highlightAttributes = highlightAttributes;


                //Label
                var textAttributes = new WorldWind.TextAttributes(null);
                textAttributes.depthTest = true;
                var textPosition = new WorldWind.Position(routes[0].legs[0].steps[0].start_location.lat, routes[0].legs[0].steps[0].start_location.lng, 30);
                placemarktxt = new WorldWind.GeographicText(textPosition, "Start - " + routes[0].legs[0].start_address + "\n"
                    + "Lat " + routes[0].legs[0].steps[0].start_location.lat.toPrecision(4).toString() + "\n"
                    + "Lon " + routes[0].legs[0].steps[0].start_location.lng.toPrecision(5).toString());
                textAttributes.color = WorldWind.Color.RED;
                placemarktxt.attributes = textAttributes;

                var textAttributes1 = new WorldWind.TextAttributes(null);
                textAttributes1.depthTest = true;
                var textPosition1 = new WorldWind.Position(routes[0].legs[0].steps[lengthofit].end_location.lat, routes[0].legs[0].steps[lengthofit].end_location.lng, 30);
                placemarktxt1 = new WorldWind.GeographicText(textPosition1, "Finish - " + routes[0].legs[0].end_address + "\n"
                    + "Lat " + routes[0].legs[0].steps[0].end_location.lat.toPrecision(4).toString() + "\n"
                    + "Lon " + routes[0].legs[0].steps[0].end_location.lng.toPrecision(5).toString());
                textAttributes1.color = WorldWind.Color.GREEN;
                placemarktxt1.attributes = textAttributes1;

                // placemarkend.label = "Finish - " + routes[0].legs[0].end_address + "\n"
                //     + "Lat " + routes[0].legs[0].steps[0].start_location.lat.toPrecision(4).toString() + "\n"
                //     + "Lon " + routes[0].legs[0].steps[0].start_location.lng.toPrecision(5).toString();
                // placemarkend.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
                // placemarkend.label.Color = WorldWind.Color.GREEN;

                navResultLat = routes[0].legs[0].steps[0].start_location.lat;
                navResultLong = routes[0].legs[0].steps[0].start_location.lng;

            };

            //                
        });
    });




};