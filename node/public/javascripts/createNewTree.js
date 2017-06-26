
function openDialog() {
	$("#dialog_addTree").dialog({
		open: function() {
			$("#dialog_addTree").html(dialogHTML);
		},
		//height: 500,
		width: 630,
		resizable: false,
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
		/*
		multiselect
		*/
		'<tr>' +
			'<form class="form-inline">' +
				'<div class="form-group">' +
					'<label>Treetype</label>' +
					'<select id="dialogTree-order dropdown-toggle btn btn-default" class="input">' +
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
					'<label>Select the type of tree you want to add</label>' +
				'</div>' +
			'</form>' +			
		'</tr>' +
		'<tr>' +
			'<form class="form-inline">' +
				'<div class="form-group">' +
					'<label>Diameter</label>' +
					'<input id="dialogDia" class="input" type="text" name="dialogDia">' +
					'<label>Enter the diameter of the tree crown</label>' +
				'</div>' +
			'</form>' +	
		'</tr>' +
		'<tr>' +
			'<form class="form-inline">' +
				'<div class="form-group">' +
					'<label>Latitude</label>' +
					'<input id="dialogLat" class="input" type="text" name="dialogLat">' +
					'<label>Select the coordinates by clicking on the map</label>' +
				'</div>' +
			'</form>' +	
		'</tr>' +
		'<tr>' +
			'<form class="form-inline">' +
				'<div class="form-group">' +
					'<label>Longitude</label>' +
					'<input id="dialogLon" class="input" type="text" name="dialogLon">' +
					'<label>Select the coordinates by clicking on the map</label>' +
				'</div>' +
			'</form>' +	
		'</tr>' +
        '<tr>' +
			'<form class="form-inline">' +
				'<div class="form-group">' +
					'<label>Age</label>' +
					'<input id=dialogAge" class="input" type="text" name="dialogAge">' +
					'<label>Enter the Year the tree was planted in</label>' +
				'</div>' +
			'</form>' +	
        '</tr>' +
	'</tbody>' +
'</table>';