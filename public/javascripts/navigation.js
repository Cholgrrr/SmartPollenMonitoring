let dataset;
let routes;
let i;
var shapesLayer = new WorldWind.RenderableLayer("line");

function bike() {
    if (document.getElementById("bike").text == "bike") {
        document.getElementById("bike").text = "walk"
    }else if(document.getElementById("bike").text == "walk"){
        document.getElementById("bike").text = "bike"
}
};
function toggleText()  {
    var text = document.getElementById("bike").firstChild;
    text.data = text.data == "bike" ? "walk" : "bike";
 }

function StartNav() {
alert(document.getElementById("searchTextStart").value)
alert(document.getElementById("searchTextEnd").value)
//loadKML("https://cors.io/?https://maps.googleapis.com/maps/api/directions/xml?origin=Toronto&destination=Montreal&avoid=highways&mode=walking&key=AIzaSyAHKsTWBLNuyJ4-3zlG8GDkPQzVWtmvbtI");
//https://cors.io/?
if (document.getElementById("bike").firstChild.data == "walk"){
    LoadJson("https://cors.io/?https://maps.googleapis.com/maps/api/directions/json?origin=" + document.getElementById("searchTextStart").value + "&destination=" + document.getElementById("searchTextEnd").value + "&avoid=highways&mode=walking&key=AIzaSyAHKsTWBLNuyJ4-3zlG8GDkPQzVWtmvbtI");
}else if (document.getElementById("bike").firstChild.data == "bike") {
    LoadJson("https://cors.io/?https://maps.googleapis.com/maps/api/directions/json?origin=" + document.getElementById("searchTextStart").value + "&destination=" + document.getElementById("searchTextEnd").value + "&avoid=highways&mode=bicycling&key=AIzaSyAHKsTWBLNuyJ4-3zlG8GDkPQzVWtmvbtI");
};


//console.log(dataset[0].legs.steps[0].start_location.lat)
};

function LoadJson(resourcesUrl){
    //$.ajax({ 
    //    url: resourcesUrl,
    //    data: data,
    //    type: 'post',
    //    success: function(response) {
    //        var s = $.parseJSON(response.responseText);
    //        data = s;// prints the value of name
    //    }
    //});

    $.getJSON(resourcesUrl, function(result){
            $.each(result, function(i, field){
                dataset = field;
                console.log(dataset)
                console.log(i)
                if (i == "routes") {
                    routes = field
                    console.log(routes)
                    console.log(routes[0].legs[0].steps[0].start_location.lat)


                    //var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
                    // Wrap the canvas created above in an ImageSource object to specify it as the placemarkAttributes image source.
                    //placemarkAttributes.imageSource = new WorldWind.ImageSource(canvas);
                    // Define the pivot point for the placemark at the center of its image source.
                    //placemarkAttributes.imageOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.5);
                    //placemarkAttributes.imageScale = 1;
                    //placemarkAttributes.imageColor = WorldWind.Color.WHITE;


                    //var placemarkPosition = new WorldWind.Position(routes[0].legs[0].steps[0].start_location.lat, routes[0].legs[0].steps[0].start_location.lng, 0);
                    //var placemark = new WorldWind.Placemark(placemarkPosition, false, placemarkAttributes);
                    
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

                    var shape = new WorldWind.SurfacePolyline(boundary, attributes);
                    shape.highlightAttributes = highlightAttributes;
                    
                    shapesLayer.addRenderable(shape);
                    
                    // Create a layer manager for controlling layer visibility.
                    

                    // Now set up to handle highlighting.
                    wwd.addLayer(shapesLayer);

                   

                    //placemark.label = "Placemark " + i.toString() + "\n"
                    //+ "Lat " + routes[0].legs[0].steps[0].start_location.lat.toPrecision(4).toString() + "\n"
                    //+ "Lon " + routes[0].legs[0].steps[0].start_location.lng.toPrecision(5).toString();
                    //placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

                    // Create the renderable layer for placemarks.
                    //var placemarkLayer = new WorldWind.RenderableLayer("Custom Placemark");

                    // Add the placemark to the layer.
                    //placemarkLayer.addRenderable(placemark);

                    // Add the placemarks layer to the WorldWindow's layer list.
                    //wwd.addLayer(placemarkLayer);

                };
                
//                
            });
    });




};