
// This function opens a jquery dialog window.
function openDialog() {
	$("#dialog_addTree").dialog({
		open: function() {
		    // Following steps are necessary to customize the dialog.
		    
			$("#dialog_addTree").html(dialogHTML);
			$("div[class='ui-dialog-titlebar ui-corner-all ui-widget-header ui-helper-clearfix ui-draggable-handle']").css('background', '#333333');
			$("span[id='ui-id-1']").css('color', '#9d9d9d');
			$("#dialog_addTree").css('background', '#333333');
			$("#dialog_addTree").css('background', 'none');
			$("div[class='ui-dialog ui-corner-all ui-widget ui-widget-content ui-front ui-dialog-buttons ui-draggable']").css('background', 'transparent')
			//$("div[class='ui-dialog ui-corner-all ui-widget ui-widget-content ui-front ui-dialog-buttons ui-draggable']").css('opacity', '0.8')
			$("#dialog_addTree").css('background', 'rgba(178,178,178,0.8)');
		    $("#dialog_addTree").css('color', '#000000');
			//$("#dialog_addTree").css('opacity', '0.9');
			$("div[class='ui-dialog-buttonpane ui-widget-content ui-helper-clearfix']").css('background', 'rgba(178,178,178,0.8)')
			//$("div[class='ui-dialog-buttonpane ui-widget-content ui-helper-clearfix']").css('opacity', '0.9')
			$("select[dialogTree-order]").css('width','400px')

			var btnCancel = $("button[class='ui-dialog-titlebar-close']");
			btnCancel.addClass("btn btn-default");
			btnCancel.append("<img src='images/abort.png' title='Cancel' alt='...' height='25px' width='25px'/>");			
			btnCancel.css({'position':'relative','width':'25px','height':'25px','border-radius':'50%','margin':'0px','border':'0px','padding':'0px'});
			
			var btnSubmit = $("div[class='ui-dialog-buttonset'] > button");
			btnSubmit.addClass("btn btn-default");
			btnSubmit.css('position', 'relative');
			btnSubmit.css('background-color', '#449d44')
			btnSubmit.css('border-color', '#4cae4c')
            btnSubmit.css('color','white')
		},
		width: 630,
		resizable: false,
		buttons: [
			{
				text: "Submit",
				icon: "ui-icon-heart",
				// This function is invoked by submitting the dialog.
				click: function () {
					
					var inTyp = $("#dialogTree-order").val();
					var inLat = $("#dialogLat").val();
					var inLon = $("#dialogLon").val();
					var inDia = $("#dialogDia").val();
					var inAge = $("#dialogAge").val();
					
					// If input isn't valid, then break up and return to the dialog.
					if (checkInput(inLat, inLon, inAge) != true) {
						return;
					};
					
					// If input is valid, then go on with sending the data to the server.
				        try {

				            let in_tree = {
				                lat: inLat,
				                lon: inLon,
				                treetype: inTyp,
				                age: inAge,
				                diameter: inDia
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

					$(this).dialog("close");
				}
			}
		]
	});
}

// Function for counting up the diameter of a tree crown.
function diamCountUp() {
	var i = Number($("#dialogDia").val());
	if (i <= 29) {
		i += 1;
		$("#dialogDia").val(i);
	}
}

// Function for counting down the diameter of a tree crown.
function diamCountDown() {
	var i = Number($("#dialogDia").val());
	if (i >= 2) {
		i -= 1;
		$("#dialogDia").val(i);
	}
}

// Function for varifying the input.
// INPUT: - latitude [Number]
//		  - longitude [Number]
//		  - age [Number]
//RETURN: - [Boolean]
function checkInput(lat, lon, age) {
	if (lat > 90) {
		$("#lblLat").text("Enter a value between -90 and 90!");
		$("#lblLat").css("color", "red");
		return;
	} else if (lat < -90) {
		$("#lblLat").text("Enter a value between -90 and 90!");
		$("#lblLat").css("color", "red");
		return;
	}
	
	if (lon > 180) {
		$("#lblLon").text("Enter a value between -180 and 180!");
		$("#lblLon").css("color", "red");
		return;
	} else if (lon < -180) {
		$("#lblLon").text("Enter a value between -180 and 180!");
		$("#lblLon").css("color", "red");
		return;
	}
	
	if (age > 999) {
		$("#lblAge").text("Enter a value between 1 and 999!");
		$("#lblAge").css("color", "red");
		return;
	} else if (age < 1) {
		$("#lblAge").text("Enter a value between 1 and 999!");
		$("#lblAge").css("color", "red");
		return;
	}
	
	return true;
}

// Inner elements of the dialog box.
var dialogHTML = '<table id="myTable">' +
	'<tbody>' +
		'<tr>' +
			'<form class="form-inline">' +
				'<div class="form-group">' +
					'<label style="width: 76px">Treetype</label>' +
					'<select style="width: 180px; height: 26px" id="dialogTree-order" class="">' +
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
					'<label style="margin-left: 5px">Select the type of tree you want to add</label>' +
				'</div>' +
			'</form>' +			
		'</tr>' +
		'<tr>' +
			'<form class="form-inline">' +
				'<div class="form-group">' +
					'<label style="width: 76px">Diameter</label>' +
<<<<<<< HEAD
					'<input id="dialogDia" class="input" type="text" style="width:90px;" name="dialogDia" readonly>' +
					'<button id="dialogDiaUp" class="input" style="position:relative;width:25px;height:25px;border-radius:50%;margin-left:5px;border:0px;padding:0px;" name="dialogDiaUp" onclick="diamCountUp()">' +
						'<img src="images/up.png" title="Cancel" alt="..." height="25px" width="25px"/>' +
					'</button>' +
					'<button id="dialogDiaDown" class="input" style="position:relative;width:25px;height:25px;border-radius:50%;margin-left:5px;border:0px;padding:0px;" name="dialogDiaDown" onclick="diamCountDown()">' +
						'<img src="images/down.png" title="Cancel" alt="..." height="25px" width="25px"/>' +
					'</button>' +
					'<label id="lblDia" style="margin-left: 5px">Enter the diameter of the tree crown</label>' +
=======
					'<input id="dialogDia" style="width: 180px; height: 26px" class="input" type="text" name="dialogDia">' +
					'<label style="margin-left: 5px">Enter the diameter of the tree crown</label>' +
>>>>>>> 575462588c54fc55253acc95d28cf35e9916e49f
				'</div>' +
			'</form>' +	
		'</tr>' +
		'<tr>' +
			'<form class="form-inline">' +
				'<div class="form-group">' +
					'<label style="width: 76px">Latitude</label>' +
<<<<<<< HEAD
					'<input id="dialogLat" class="input" type="text" name="dialogLat">' +
					'<label id="lblLat" style="margin-left: 5px">Select the coordinates by clicking on the map</label>' +
=======
					'<input id="dialogLat" style="width: 180px; height: 26px" class="input" type="text" name="dialogLat">' +
					'<label style="margin-left: 5px">Select the coordinates by clicking on the map</label>' +
>>>>>>> 575462588c54fc55253acc95d28cf35e9916e49f
				'</div>' +
			'</form>' +	
		'</tr>' +
		'<tr>' +
			'<form class="form-inline">' +
				'<div class="form-group">' +
					'<label style="width: 76px">Longitude</label>' +
<<<<<<< HEAD
					'<input id="dialogLon" class="input" type="text" name="dialogLon">' +
					'<label id="lblLon" style="margin-left: 5px">Select the coordinates by clicking on the map</label>' +
=======
					'<input id="dialogLon" style="width: 180px; height: 26px" class="input" type="text" name="dialogLon">' +
					'<label style="margin-left: 5px">Select the coordinates by clicking on the map</label>' +
>>>>>>> 575462588c54fc55253acc95d28cf35e9916e49f
				'</div>' +
			'</form>' +	
		'</tr>' +
        '<tr>' +
			'<form class="form-inline">' +
				'<div class="form-group">' +
					'<label style="width: 76px">Age</label>' +
<<<<<<< HEAD
					'<input id="dialogAge" class="input" type="text" name="dialogAg">' +
					'<label id="lblAge" style="margin-left: 5px">Enter the Year the tree was planted in</label>' +
=======
					'<input id=dialogAge" style="width: 180px; height: 26px" class="input" type="text" name="dialogAge">' +
					'<label style="margin-left: 5px">Enter the Year the tree was planted in</label>' +
>>>>>>> 575462588c54fc55253acc95d28cf35e9916e49f
				'</div>' +
			'</form>' +	
        '</tr>' +
	'</tbody>' +
'</table>';