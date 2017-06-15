// Function that is invoked by a mouse click.
var handleClick = function (recognizer) {
	// Obtain the event location.
	var x = recognizer.clientX,
		y = recognizer.clientY;

	var pickList = wwd.pick(wwd.canvasCoordinates(x, y));
	
	if (pickList.objects.length == 1 && pickList.objects[0].isTerrain) {
		var position = pickList.objects[0].position;
		$("#dialogLat").val(position.latitude.toFixed(6));
		$("#dialogLon").val(position.longitude.toFixed(6));
	}
};

// Listen for mouse clicks.
var clickRecognizer = new WorldWind.ClickRecognizer(wwd, handleClick);

function openDialog() {
	$("#dialog_addTree").dialog({
		open: function() {
			$("#dialog_addTree").html(dialogHTML);
		},
		//height: 500,
		width: 630,
		closeText: "cancel",
		buttons: [
			{
				text: "submit",
				icon: "ui-icon-heart",
				click: function () {
				    var mytable = document.getElementById('myTable');
				    var myinputs = mytable.getElementsByTagName('input');
				    var mytype = mytable.getElementsByTagName('select');
				    //for (var i = 0; i < myinputs.length; i++) {
				    //    alert(myinputs[i].value);
				    //}
				    

				        try {

				            let in_tree = {
				                lat: myinputs[1].value,
				                lon: myinputs[2].value,
				                treetype: mytype[0].value,
				                age: myinputs[3].value,
				                diameter: myinputs[0].value
				            }

				            console.log(in_tree);

				            $.ajax({
				                type: "POST",
				                url: '/insertTree',
				                data: in_tree,
				            }).done(function () { });

				        }
				        catch (err) {
				            console.log('delivering of the inserted tree data to the server failed!');
				        }


				    // Here the callback of the dialog has to happen!
					alert("Close the dialog and process the data.");
					$(this).dialog("close");
				}
			}
		]
	});
}






// Inner elements of the dialog box.
var dialogHTML = '<table id="myTable">' +
	'<tbody>' +
		//'<tr>' +
		//	'<td>Author</td>' +
		//	'<td><input id="dialogAut" type="text" name="dialogAut"></td>' +
		//	'<td>Enter your username</td>' +
		//'</tr>' +
		'<tr>' +
			'<td>Treetype</td>' +
			'<td>' +
				'<select id="dialogTree-order ">' +
					'<option value="Ulme">Ulme</option>' +
					'<option value="Buche">Buche</option>' +
					'<option value="Ahorn">Ahorn</option>' +
					'<option value="Pflaume">Pflaume</option>' +
					'<option value="Schnur">Schnur</option>' +
					'<option value="Esche">Esche</option>' +
					'<option value="Zeder">Zeder</option>' +
					'<option value="Zypresse">Zypresse</option>' +
					'<option value="Schlafbaum">Schlafbaum</option>' +
					'<option value="Eibe">Eibe</option>' +
					'<option value="other">other</option>' +
					'<option value="Kastanie">Kastanie</option>' +
					'<option value="Linde">Linde</option>' +
					'<option value="Goetterbaum">Goetterbaum</option>' +
					'<option value="Walnuss">Walnuss</option>' +
					'<option value="Tanne">Tanne</option>' +
					'<option value="Buchs">Buchs</option>' +
					'<option value="Flieder">Flieder</option>' +
					'<option value="Beere">Beere</option>' +
					'<option value="Hasel">Hasel</option>' +
					'<option value="Weide">Weide</option>' +
					'<option value="Robinie">Robinie</option>' +
					'<option value="Erle">Erle</option>' +
					'<option value="Birne">Birne</option>' +
					'<option value="Birke">Birke</option>' +
					'<option value="Holunder">Holunder</option>' +
					'<option value="Apfel">Apfel</option>' +
					'<option value="Kiefer">Kiefer</option>' +
					'<option value="Kirsche">Kirsche</option>' +
					'<option value="Eiche">Eiche</option>' +
				'</select>' +
			'</td>' +
			'<td>Select the type of tree you want to add</td>' +
		'</tr>' +
		'<tr>' +
			'<td>Diameter</td>' +
			'<td><input id="dialogDia" type="text" name="dialogDia"></td>' +
			'<td>Enter the diameter of the tree crown</td>' +
		'</tr>' +
		'<tr>' +
			'<td>Latitude</td>' +
			'<td><input id="dialogLat" type="text" name="dialogLat"></td>' +
			'<td>Select the coordinates by clicking on the map</td>' +
		'</tr>' +
		'<tr>' +
			'<td>Longitude</td>' +
			'<td><input id="dialogLon" type="text" name="dialogLon"></td>' +
			'<td>Select the coordinates by clicking on the map</td>' +
		'</tr>' +
        '<tr>' +
            '<td>Age</td>' +
            '<td><input id=dialogAge" type="text" name="dialogAge"></td>' +
            '<td>Enter the Age of the tree</td>' +
        '</tr>' +
	'</tbody>' +
'</table>';