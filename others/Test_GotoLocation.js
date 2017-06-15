        // The common gesture-handling function.
        var handleClick = function (recognizer) {
            // Obtain the event location.
            var x = recognizer.clientX,
                y = recognizer.clientY;

            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.
            var pickList = wwd.pick(wwd.canvasCoordinates(x, y));

            // If only one thing is picked and it is the terrain, tell the world window to go to the picked location.
            if (pickList.objects.length == 1 && pickList.objects[0].isTerrain) {
                var position = pickList.objects[0].position;
                //wwd.goTo(new WorldWind.Location(position.latitude, position.longitude));
				wwd.goTo(new WorldWind.Position(position.latitude, position.longitude,2000));
            }
        };