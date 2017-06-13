
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
				click: function() { // Here the callback of the dialog has to happen!
					alert("Close the dialog and process the data.");
					$(this).dialog("close");
				}
			}
		]
	});
}

// Inner elements of the dialog box.
var dialogHTML = '<table>' +
	'<tbody>' +
		'<tr>' +
			'<td>Author</td>' +
			'<td><input id="dialogAut" type="text" name="dialogAut"></td>' +
			'<td>Enter your username</td>' +
		'</tr>' +
		'<tr>' +
			'<td>Treetype</td>' +
			'<td>' +
				'<select id="dialogTree-order" multiple="multiple">' +
					'<option value="1">Ulme</option>' +
					'<option value="2">Buche</option>' +
					'<option value="3">Ahorn</option>' +
					'<option value="4">Pflaume</option>' +
					'<option value="5">Schnur</option>' +
					'<option value="6">Esche</option>' +
					'<option value="7">Zeder</option>' +
					'<option value="8">Zypresse</option>' +
					'<option value="9">Schlafbaum</option>' +
					'<option value="10">Eibe</option>' +
					'<option value="11">other</option>' +
					'<option value="12">Kastanie</option>' +
					'<option value="13">Linde</option>' +
					'<option value="14">Goetterbaum</option>' +
					'<option value="15">Walnuss</option>' +
					'<option value="16">Tanne</option>' +
					'<option value="17">Buchs</option>' +
					'<option value="18">Flieder</option>' +
					'<option value="19">Beere</option>' +
					'<option value="20">Hasel</option>' +
					'<option value="21">Weide</option>' +
					'<option value="22">Robinie</option>' +
					'<option value="23">Erle</option>' +
					'<option value="24">Birne</option>' +
					'<option value="25">Birke</option>' +
					'<option value="26">Holunder</option>' +
					'<option value="27">Apfel</option>' +
					'<option value="28">Kiefer</option>' +
					'<option value="29">Kirsche</option>' +
					'<option value="30">Eiche</option>' +
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
			'<td><input id="dialogLat" type="text" name="dialogLat" readonly></td>' +
			'<td>Select the coordinates by clicking on the map</td>' +
		'</tr>' +
		'<tr>' +
			'<td>Longitude</td>' +
			'<td><input id="dialogLon" type="text" name="dialogLon" readonly></td>' +
			'<td>Select the coordinates by clicking on the map</td>' +
		'</tr>' +
	'</tbody>' +
'</table>';