var NavRequest_GoogleOrPG = function(text_startingPoint,text_endingPoint) {
    if (NavModeSelected == "Walking" && startPnav == false && endPnav == false) {
        LoadJson("https://cors.io/?https://maps.googleapis.com/maps/api/directions/json?origin=" + text_startingPoint + "&destination=" + text_endingPoint + "&avoid=highways&mode=walking&key=AIzaSyAHKsTWBLNuyJ4-3zlG8GDkPQzVWtmvbtI", "Google");
        // } else if (document.getElementById("bike").firstChild.data == "bike") {
    } else if (NavModeSelected == "Walking" && startPnav == true && endPnav == true){
        startPnav = false;
        endPnav = false;
        LoadJson("https://cors.io/?https://maps.googleapis.com/maps/api/directions/json?origin=" + startxglob + "," + startyglob + "&destination=" + endxglob + "," + endyglob + "&avoid=highways&mode=walking&key=AIzaSyAHKsTWBLNuyJ4-3zlG8GDkPQzVWtmvbtI", "Google");
    } else if (NavModeSelected == "Bike" && startPnav == true && endPnav == true) {
        startPnav = false;
        endPnav = false;
        LoadJson("https://cors.io/?https://maps.googleapis.com/maps/api/directions/json?origin=" +  startxglob + "," + startyglob  + "&destination=" + endxglob + "," + endyglob + "&avoid=highways&mode=bicycling&key=AIzaSyAHKsTWBLNuyJ4-3zlG8GDkPQzVWtmvbtI", "Google");
    } else if (NavModeSelected == "Bike" && startPnav == false && endPnav == false) {

        LoadJson("https://cors.io/?https://maps.googleapis.com/maps/api/directions/json?origin=" + text_startingPoint + "&destination=" + text_endingPoint + "&avoid=highways&mode=bicycling&key=AIzaSyAHKsTWBLNuyJ4-3zlG8GDkPQzVWtmvbtI", "Google");
    } else if (NavModeSelected == "PG_Routing") {
        LoadJson("https://cors.io/?https://maps.googleapis.com/maps/api/directions/json?origin=" + text_startingPoint + "&destination=" + text_endingPoint + "&avoid=highways&mode=bicycling&key=AIzaSyAHKsTWBLNuyJ4-3zlG8GDkPQzVWtmvbtI", "PG_Routing");
    } else if (NavModeSelected == "PG_Routing_AvoidPollen") {
        // alert("PG_Routing_AvoidPollen is Underconstruction!");
        LoadJson("https://cors.io/?https://maps.googleapis.com/maps/api/directions/json?origin=" + text_startingPoint + "&destination=" + text_endingPoint + "&avoid=highways&mode=bicycling&key=AIzaSyAHKsTWBLNuyJ4-3zlG8GDkPQzVWtmvbtI", "PG_Routing_AvoidPollen");
    };
};


function lightRefresh_cb(callback) {

    placemarklabel[mm] = new WorldWind.RenderableLayer();
    if (mm > 0) {
        console.log("second request: Delete last layer");
        placemarklabel[mm - 1].enabled = false;
    }
    shapesLayer.removeAllRenderables();
    placemarkLayer.removeAllRenderables();
    placemarkLayerend.removeAllRenderables();
    shapesLayer.refresh();
    placemarkLayer.refresh();
    placemarkLayerend.refresh();
    wwd.redraw();
    callback();
};

function AddNAVtoWW_cb(callback) {
    shapesLayer.addRenderable(shape);
    placemarkLayer.addRenderable(placemark);
    placemarkLayerend.addRenderable(placemarkend);
    placemarklabel[mm].addRenderable(placemarktxt);
    placemarklabel[mm].addRenderable(placemarktxt1);
    wwd.addLayer(placemarkLayer);
    wwd.addLayer(placemarkLayerend);
    wwd.addLayer(shapesLayer);
    wwd.addLayer(placemarklabel[mm]);
    wwd.redraw();
    callback();
}

var NavRequest_Google_cb = function(text_startingPoint,text_endingPoint, callback) {
    if (NavModeSelected == "Walking") {
        LoadJson("https://cors.io/?https://maps.googleapis.com/maps/api/directions/json?origin=" + text_startingPoint + "&destination=" + text_endingPoint + "&avoid=highways&mode=walking&key=AIzaSyAHKsTWBLNuyJ4-3zlG8GDkPQzVWtmvbtI");
        callback();
        // } else if (document.getElementById("bike").firstChild.data == "bike") {
    } else if (NavModeSelected == "Bike") {

        LoadJson("https://cors.io/?https://maps.googleapis.com/maps/api/directions/json?origin=" + text_startingPoint + "&destination=" + text_endingPoint + "&avoid=highways&mode=bicycling&key=AIzaSyAHKsTWBLNuyJ4-3zlG8GDkPQzVWtmvbtI");
        
        callback();
    
    };
    
}