var NavRequest_Google = function(text_startingPoint,text_endingPoint) {
    if (NavModeSelected == "Walking") {
        LoadJson("https://cors.io/?https://maps.googleapis.com/maps/api/directions/json?origin=" + text_startingPoint + "&destination=" + text_endingPoint + "&avoid=highways&mode=walking&key=AIzaSyAHKsTWBLNuyJ4-3zlG8GDkPQzVWtmvbtI");
        // } else if (document.getElementById("bike").firstChild.data == "bike") {
    } else if (NavModeSelected == "Bike") {

        LoadJson("https://cors.io/?https://maps.googleapis.com/maps/api/directions/json?origin=" + text_startingPoint + "&destination=" + text_endingPoint + "&avoid=highways&mode=bicycling&key=AIzaSyAHKsTWBLNuyJ4-3zlG8GDkPQzVWtmvbtI");
    };
}