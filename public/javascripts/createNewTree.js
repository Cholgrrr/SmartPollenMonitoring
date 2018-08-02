
// This function opens a jquery dialog window.
function openDialog() {
    if ($("#Info").hasClass('ui-dialog-content')) {
        // do whatever
        $("#Info").dialog("destroy");
    } else {
        // it is not initialized yet
    }
    
	$("#dialog_addTree").dialog({
		open: function() {
			
		    // Following steps are necessary to customize the dialog.
			$("#dialog_addTree").html(dialogHTML);
			$("div[class='ui-dialog-titlebar ui-corner-all ui-widget-header ui-helper-clearfix ui-draggable-handle']").css('background', '#333333');
			$("span[id='ui-id-1']").css('color', '#9d9d9d');
			$("#dialog_addTree").css('background', '#333333');
			$("#dialog_addTree").css('background', 'none');
			$("div[class='ui-dialog ui-corner-all ui-widget ui-widget-content ui-front ui-dialog-buttons ui-draggable']").css('background', 'transparent');
			$("#dialog_addTree").css('background', 'rgba(178,178,178,0.8)');
		    $("#dialog_addTree").css('color', '#000000');
			$("div[class='ui-dialog-buttonpane ui-widget-content ui-helper-clearfix']").css('background', 'rgba(178,178,178,0.8)');
			$("select[dialogTree-order]").css('width','400px');
			
			// Add a cancel button
			var btnCancel = $("button[class='ui-dialog-titlebar-close']");
			btnCancel.attr("title", "Cancel");
			btnCancel.addClass("btn btn-default tooltipstuff");
			btnCancel.append("<img src='images/abort.png' style='float:right;' title='Cancel' alt='...' height='25px' width='25px'/>");			
			btnCancel.css({'position':'relative','float':'right','width':'25px','height':'25px','border-radius':'50%','margin':'0px','border':'0px','padding':'0px'});
			
			// Add a submit button
			var btnSubmit = $("div[class='ui-dialog-buttonset'] > button");
			btnSubmit.addClass("btn btn-default");
			btnSubmit.css('position', 'relative');
			btnSubmit.css('background-color', '#449d44');
			btnSubmit.css('border-color', '#4cae4c');
            btnSubmit.css('color','white');
			
			// Add an info button style='float:right;'
			//$("#ui-id-1").css('width', '172');
			//if ($('#imgInfoDialog').length) {
			//} else {
			//	$("#ui-id-1").after("<img id='imgInfoDialog' src='images/info.png' title='info' class='tooltipstuff' style='cursor:pointer;' alt='...' onclick='openInfo()' height='25px' width='25px'/>");
			//}
			
			// Format all tooltips of the dialog
			$('.tooltipstuff').tooltipster({
				theme: 'tooltipster-borderless',
				distance: 10,
				animation:'grow'}
			);
		},
		width: 290,
		resizable: false,
		buttons: [
			{
				text: "Submit",
				icon: "ui-icon-heart",
				// This function is invoked by submitting the dialog.
				click: function () {
					
					var inTyp = $("#dialogTree-order").val();
					
						if (inTyp == 'Birch') {
							inTyp = 'Birke';
						} else if (inTyp == 'Alder') {
							inTyp = 'Erle';
						} else if (inTyp == 'Hazel') {
							inTyp = 'Hasel';
						} else if (inTyp == 'Maple') {
							inTyp = 'Ahorn';
						} else if (inTyp == 'Apple') {
							inTyp = 'Apfel';
						} else if (inTyp == 'Pear') {
							inTyp = 'Birne';
						} else if (inTyp == 'Beech') {
							inTyp = 'Buche';
						} else if (inTyp == 'Buchs') {
							inTyp = 'Buchs';
						} else if (inTyp == 'Yew') {
							inTyp = 'Eibe';
						} else if (inTyp == 'Oak') {
							inTyp = 'Eiche';
						} else if (inTyp == 'Ash') {
							inTyp = 'Esche';
						} else if (inTyp == 'Lilac') {
							inTyp = 'Flieder';
						} else if (inTyp == 'Ailanthus') {
							inTyp = 'Goetterbaum';
						} else if (inTyp == 'Elder') {
							inTyp = 'Holunder';
						} else if (inTyp == 'Chestnut') {
							inTyp = 'Kastanie';
						} else if (inTyp == 'Pine') {
							inTyp = 'Kiefer';
						} else if (inTyp == 'Cherry') {
							inTyp = 'Kirsche';
						} else if (inTyp == 'Linden') {
							inTyp = 'Linde';
						} else if (inTyp == 'Plum') {
							inTyp = 'Pflaume';
						} else if (inTyp == 'Robinie') {
							inTyp = 'Robinie';
						} else if (inTyp == 'Sleeping-Tree') {
							inTyp = 'Schlafbaum';
						} else if (inTyp == 'Schnur') {
							inTyp = 'Schnur';
						} else if (inTyp == 'Fir') {
							inTyp = 'Tanne';
						} else if (inTyp == 'Elm') {
							inTyp = 'Ulme';
						} else if (inTyp == 'Walnut') {
							inTyp = 'Walnuss';
						} else if (inTyp == 'Pasture') {
							inTyp = 'Weide';
						} else if (inTyp == 'Cedar') {
							inTyp = 'Zeder';
						} else if (inTyp == 'Cypress') {
							inTyp = 'Zypresse';
						} else if (inTyp == 'other') {
							inTyp = 'other';
						} else {
							inTyp = 'Buche';
						}	
					
					var inLat = $("#dialogLat").val();
					var inLon = $("#dialogLon").val();
					var inDia = $("#dialogDia").val();
					var inAge = $("#dialogAge").val();
					
					// If input isn't valid, then break up and return to the dialog.
					if (checkInput(inLat, inLon, inAge) != true) {
						return;
					};
					inAge = 2018 - inAge;
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
				        //$(this).dialog("destroy");
					$(this).dialog("close");
				}
			}
		]
	});
	//$("#dialog_addTree").dialog("open");
}

//function openInfo() {
//	console.log("Now, an info window should open up.");
//}

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
				'<div class="form-group tooltipstuff" title="Select the type of tree you want to add.">' +
					'<label style="width: 76px">Treetype</label>' +
					'<select style="width: 150px; height: 26px" id="dialogTree-order" class="">' +
						'<option value="Ailanthus">Ailanthus</option>' +
						'<option value="Alder">Alder</option>' +
						'<option value="Apple">Apple</option>' +
						'<option value="Ash">Ash</option>' +
						'<option value="Beech">Beech</option>' +
						'<option value="Birch">Birch</option>' +
						'<option value="Buchs">Buchs</option>' +
						'<option value="Cedar">Cedar</option>' +
						'<option value="Cherry">Cherry</option>' +
						'<option value="Chestnut">Chestnut</option>' +
						'<option value="Cypress">Cypress</option>' +
						'<option value="Elder">Elder</option>' +
						'<option value="Elm">Elm</option>' +
						'<option value="Fir">Fir</option>' +
						'<option value="Hazel">Hazel</option>' +
						'<option value="Lilac">Lilac</option>' +
						'<option value="Lime">Lime</option>' +
						'<option value="Maple">Maple</option>' +
						'<option value="Oak">Oak</option>' +
						'<option value="Pasture">Pasture</option>' +
						'<option value="Pear">Pear</option>' +
						'<option value="Pine">Pine</option>' +
						'<option value="Plum">Plum</option>' +
						'<option value="Robinie">Robinie</option>' +
						'<option value="Schnur">Schnur</option>' +
						'<option value="Sleeping-Tree">Sleeping-Tree</option>' +
						'<option value="Walnut">Walnut</option>' +
						'<option value="Yew">Yew</option>' +
						'<option value="other">other</option>' +
					'</select>' +
				'</div>' +
			'</form>' +			
		'</tr>' +
		'<tr>' +
			'<form class="form-inline">' +
				'<div class="form-group tooltipstuff" title="Enter the diameter of the tree crown.">' +
					'<label style="width: 76px">Diameter</label>' +
					'<input id="dialogDia" class="input" type="text" style="width:90px;" name="dialogDia" readonly>' +
					'<button id="dialogDiaUp" class="input" style="position:relative;width:25px;height:25px;border-radius:50%;margin-left:5px;border:0px;padding:0px;" name="dialogDiaUp" onclick="diamCountUp()">' +
						'<img src="images/up.png" title="Increase" alt="..." height="25px" width="25px"/>' +
					'</button>' +
					'<button id="dialogDiaDown" class="input" style="position:relative;width:25px;height:25px;border-radius:50%;margin-left:5px;border:0px;padding:0px;" name="dialogDiaDown" onclick="diamCountDown()">' +
						'<img src="images/down.png" title="Decrease" alt="..." height="25px" width="25px"/>' +
					'</button>' +
				'</div>' +
			'</form>' +	
		'</tr>' +
		'<tr>' +
			'<form class="form-inline">' +
				'<div class="form-group tooltipstuff" title="Select the coordinates by clicking on the map.">' +
					'<label style="width: 76px">Latitude</label>' +
					'<input id="dialogLat" class="input" type="text" name="dialogLat">' +
				'</div>' +
			'</form>' +	
		'</tr>' +
		'<tr>' +
			'<form class="form-inline">' +
				'<div class="form-group tooltipstuff" title="Select the coordinates by clicking on the map.">' +
					'<label style="width: 76px">Longitude</label>' +
					'<input id="dialogLon" class="input" type="text" name="dialogLon">' +
				'</div>' +
			'</form>' +	
		'</tr>' +
        '<tr>' +
			'<form class="form-inline">' +
				'<div class="form-group tooltipstuff" title="Enter the age of the tree.">' +
					'<label style="width: 76px">Age</label>' +
					'<input id="dialogAge" class="input" type="text" name="dialogAge">' +
				'</div>' +
			'</form>' +	
        '</tr>' +
	'</tbody>' +
'</table>';