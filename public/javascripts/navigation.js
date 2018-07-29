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
var placemark, placemarkend, shape, placemarktxt, placemarktxt1;
var deleteplacemarklabel_error;
var dfd_NavigationRequest = $.Deferred();
var boundaryPG = [];

var NavModeSelected = "Walking";
$(document).ready(function () {

    $('#navMode1, #navMode2, #navMode3,#navMode4').on('change', function () {
        if ($("#navMode1").prop("checked") == true) {
            NavModeSelected = "Bike";
            console.log("Bike activated");
        } else if ($("#navMode2").prop("checked") == true) {
            NavModeSelected = "Walking";
            console.log("Walking activated");
        } else if ($("#navMode3").prop("checked") == true) {
            NavModeSelected = "PG_Routing";
            console.log("PG_Routing activated");
        } else if ($("#navMode4").prop("checked") == true) {
            NavModeSelected = "PG_Routing_AvoidPollen";
            console.log("PG_Routing_AvoidPollen activated");
            alert("Current Select tree types to avoid: \n"+ treetrans + "\n You can select or change the tree-type to avoid from Pollen-Simulation menu");
        }
    });
    
}
);
function removeNav() {
    shapesLayer.removeAllRenderables();
    placemarkLayer.removeAllRenderables();
    placemarkLayerend.removeAllRenderables();
    //placemarklabel.removeAllRenderables();
    shapesLayer.refresh();
    placemarkLayer.refresh();
    placemarkLayerend.refresh();

    //Check to completely delete the Navigation [mm] correctly
    try {
        placemarklabel[mm].enabled = false;
    } catch (e) {
        deleteplacemarklabel_error = e;
        if (deleteplacemarklabel_error == null) {
            console.log("no error");
        } else {
            placemarklabel[mm - 1].enabled = false;
        }
    }
    //placemarklabel.refresh();
    wwd.redraw();
};
function lightRefresh() {

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
};

function AddNAVtoWW() {
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
}
function MoveToNavLocation() {
    wwd.goTo(new WorldWind.Position(navResultLat, navResultLong, 10000));
}
//********** StartNav old version *******************
function StartNav() {
    var text_startingPoint = document.getElementById("pac-input").value;
    var text_endingPoint = document.getElementById("pac-input2").value;
    //--------------------------------------------
    console.log("Nav_Step..1..Light Refresh")
    lightRefresh();
    //--------------------------------------------
    console.log("Nav_Step..2..Load Navigation Request")
    NavRequest_GoogleOrPG(text_startingPoint, text_endingPoint);
    //--------------------------------------------
    setTimeout(function () {

        console.log("Nav_Step..3..Add Nav Layer to Map")
        AddNAVtoWW()
        MoveToNavLocation();

        setTimeout(function () {
            mm = mm + 1;
        }, 50);
    }, 2000);
};
//********** StartNav cb version *******************
//********** Still Unuse for some reasons *******************
function StartNavCB() {
    var text_startingPoint = document.getElementById("pac-input").value;
    var text_endingPoint = document.getElementById("pac-input2").value;
    //setTimeout(function () {
    console.log("1");
    lightRefresh_cb(() => {
        //setTimeout(function () {
        console.log("2");
        NavRequest_Google_cb(text_startingPoint, text_endingPoint, () => {
            //setTimeout(function () {
            console.log("3");
            AddNAVtoWW_cb(() => {
                console.log("4");
            });
            //}, 1500);
        });
        //}, 150);
    });
    //}, 50);
};


var hideNav = function () {
    shapesLayer.enabled = false;
    placemarkLayer.enabled = false;
    placemarkLayerend.enabled = false;
    wwd.redraw();
};

var routeStandartDevinition, routePG_Input;
function LoadJson(resourcesUrl, requestMode) {
    // Initial Setting for all mode
    //Setting for Placemark Starting Point
    var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
    placemarkAttributes.imageOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.5);
    placemarkAttributes.imageScale = 7;
    placemarkAttributes.imageColor = WorldWind.Color.RED;
    //Setting for Placemark Ending Point
    var placemarkAttributesend = new WorldWind.PlacemarkAttributes(null);
    placemarkAttributesend.imageOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.5);
    placemarkAttributesend.imageScale = 7;
    placemarkAttributesend.imageColor = WorldWind.Color.GREEN;

    //Setting for PolyShape Attribute 
    attributes = new WorldWind.ShapeAttributes(null);
    attributes.outlineColor = new WorldWind.Color(0, 1, 1, 0.9);
    highlightAttributes = new WorldWind.ShapeAttributes(attributes);
    highlightAttributes.outlineColor = new WorldWind.Color(1, 1, 1, 1);

    //Mode PG Routing
    if (requestMode == "PG_Routing_AvoidPollen") {
        alert("PG_Routing_AvoidPollen is Underconstruction!");
    }
    if (requestMode == "PG_Routing") {
        console.log("Mode: Routing with PG_Routing");
        // -------------------------------------------------
        // call postgres routing function
        $.getJSON(resourcesUrl, function (result) {
            $.each(result, function (i, field) {
                dataset = field;
                console.log("Dataset :" + dataset);
                console.log("i :" + i);
                if (i == "routes") {
                    routes = field
                    // define start and end points
                    var lengthofit = routes[0].legs[0].steps.length - 1;
                    var start_point_lat = routes[0].legs[0].steps[0].start_location.lat;
                    var start_point_lng = routes[0].legs[0].steps[0].start_location.lng;
                    var end_point_lat = routes[0].legs[0].steps[lengthofit].end_location.lat;
                    var end_point_lng = routes[0].legs[0].steps[lengthofit].end_location.lng;
                    var placemarkPosition = new WorldWind.Position(start_point_lat, start_point_lng, 0);
                    var placemarkPositionend = new WorldWind.Position(end_point_lat, end_point_lng, 0);
                    placemark = new WorldWind.Placemark(placemarkPosition, false, placemarkAttributes);
                    placemarkend = new WorldWind.Placemark(placemarkPositionend, false, placemarkAttributesend)
                    navResultLat = (start_point_lat + end_point_lat) / 2;
                    navResultLong = (start_point_lng + end_point_lng) / 2;

                    //---Label/Text Starting Point
                    var textPosition = new WorldWind.Position(start_point_lat, start_point_lng, 30);
                    placemarktxt = new WorldWind.GeographicText(textPosition, "Start - " + routes[0].legs[0].start_address + "\n"
                        + "Lat " + routes[0].legs[0].steps[0].start_location.lat.toPrecision(4).toString() + "\n"
                        + "Lon " + routes[0].legs[0].steps[0].start_location.lng.toPrecision(5).toString());
                    var textAttributes = new WorldWind.TextAttributes(null);
                    textAttributes.depthTest = true;
                    textAttributes.color = WorldWind.Color.RED;
                    placemarktxt.attributes = textAttributes;

                    //---Label/Text Ending Point
                    var textPosition1 = new WorldWind.Position(end_point_lat, end_point_lng, 30);
                    placemarktxt1 = new WorldWind.GeographicText(textPosition1, "Finish - " + routes[0].legs[0].end_address + "\n"
                        + "Lat " + routes[0].legs[0].steps[0].end_location.lat.toPrecision(4).toString() + "\n"
                        + "Lon " + routes[0].legs[0].steps[0].end_location.lng.toPrecision(5).toString());
                    var textAttributes1 = new WorldWind.TextAttributes(null);
                    textAttributes1.depthTest = true;
                    textAttributes1.color = WorldWind.Color.GREEN;
                    placemarktxt1.attributes = textAttributes1;

                    // routeStandartDevinition = {
                    //     // latStart: "40.60468",
                    //     // lonStart: "-73.99052",
                    //     // latEnd: "40.62804",
                    //     // lonEnd: "-74.00175"
                    //     latStart: start_point_lat.toString(),
                    //     lonStart: start_point_lng.toString(),
                    //     latEnd: end_point_lat.toString(),
                    //     lonEnd: end_point_lng.toString()
                    // };
                    routePG_Input = {
                        // latStart: "40.60468",
                        // lonStart: "-73.99052",
                        // latEnd: "40.62804",
                        // lonEnd: "-74.00175"
                        latStart: start_point_lat.toString(),
                        lonStart: start_point_lng.toString(),
                        latEnd: end_point_lat.toString(),
                        lonEnd: end_point_lng.toString()
                    };

                    $.ajax({
                        async: false,
                        type: "POST",
                        url: '/routeStandard',
                        data: routePG_Input,
                    }).done(function (routeStandartDevinition) {
                        console.log("POSTGRES ROUTE INPUT:" + routePG_Input);
                        console.log("POSTGRES ROUTE:");
                        console.log(routeStandartDevinition);
                        boundaryPG = routeStandartDevinition;
                        boundary = [];
                        var jj = 0;
                        while (jj < boundaryPG.length) {
                            boundary.push(new WorldWind.Location(parseFloat(boundaryPG[jj]["lat"]), parseFloat(boundaryPG[jj]["lon"])));
                            jj++;
                        }
                        shape = new WorldWind.SurfacePolyline(boundary, attributes);
                        shape.highlightAttributes = highlightAttributes;
                    });
                };

                //                
            });
        });


        // --------------------------------------------------

        //Mode Google API
    } else if (requestMode == "Google") {
        console.log("Mode: Routing wiht Google API");
        $.getJSON(resourcesUrl, function (result) {
            $.each(result, function (i, field) {
                dataset = field;
                console.log("Dataset :" + dataset);
                console.log("i :" + i);
                if (i == "routes") {
                    routes = field
                    console.log("routes :" + routes)
                    // define start and end points
                    var lengthofit = routes[0].legs[0].steps.length - 1;
                    var start_point_lat = routes[0].legs[0].steps[0].start_location.lat;
                    var start_point_lng = routes[0].legs[0].steps[0].start_location.lng;
                    var end_point_lat = routes[0].legs[0].steps[lengthofit].end_location.lat;
                    var end_point_lng = routes[0].legs[0].steps[lengthofit].end_location.lng;
                    var placemarkPosition = new WorldWind.Position(start_point_lat, start_point_lng, 0);
                    var placemarkPositionend = new WorldWind.Position(end_point_lat, end_point_lng, 0);
                    placemark = new WorldWind.Placemark(placemarkPosition, false, placemarkAttributes);
                    placemarkend = new WorldWind.Placemark(placemarkPositionend, false, placemarkAttributesend)
                    navResultLat = (start_point_lat + end_point_lat) / 2;
                    navResultLong = (start_point_lng + end_point_lng) / 2;

                    //---Label/Text Starting Point
                    var textPosition = new WorldWind.Position(start_point_lat, start_point_lng, 30);
                    placemarktxt = new WorldWind.GeographicText(textPosition, "Start - " + routes[0].legs[0].start_address + "\n"
                        + "Lat " + routes[0].legs[0].steps[0].start_location.lat.toPrecision(4).toString() + "\n"
                        + "Lon " + routes[0].legs[0].steps[0].start_location.lng.toPrecision(5).toString());
                    var textAttributes = new WorldWind.TextAttributes(null);
                    textAttributes.depthTest = true;
                    textAttributes.color = WorldWind.Color.RED;
                    placemarktxt.attributes = textAttributes;

                    //---Label/Text Ending Point
                    var textPosition1 = new WorldWind.Position(end_point_lat, end_point_lng, 30);
                    placemarktxt1 = new WorldWind.GeographicText(textPosition1, "Finish - " + routes[0].legs[0].end_address + "\n"
                        + "Lat " + routes[0].legs[0].steps[0].end_location.lat.toPrecision(4).toString() + "\n"
                        + "Lon " + routes[0].legs[0].steps[0].end_location.lng.toPrecision(5).toString());
                    var textAttributes1 = new WorldWind.TextAttributes(null);
                    textAttributes1.depthTest = true;
                    textAttributes1.color = WorldWind.Color.GREEN;
                    placemarktxt1.attributes = textAttributes1;


                    boundary = [];
                    var j = 0
                    while (j < routes[0].legs[0].steps.length) {
                        boundary.push(new WorldWind.Location(routes[0].legs[0].steps[j].start_location.lat, routes[0].legs[0].steps[j].start_location.lng));
                        boundary.push(new WorldWind.Location(routes[0].legs[0].steps[j].end_location.lat, routes[0].legs[0].steps[j].end_location.lng));
                        j++;
                    }
                    shape = new WorldWind.SurfacePolyline(boundary, attributes);
                    shape.highlightAttributes = highlightAttributes;


                };

                //                
            });
        });
    };




};