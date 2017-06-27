// ---------------------------
// needed variables
let treeselection = {};
let histrec;
histrec = 0;

// ----------------------------------
// Generation of the select structure

try {

	// --------------------------------------------
	// Generation of the selection for th Map Type

	$(document).ready(function () {
		$("#month").hide();
		$('#recentold-order').on('change', function () {
			if (this.value == '1') {
				$("#month").show();
			}
			else {
				$("#month").hide();
				histrec = 0;
			}
		});
	});


	// ----------------------------------
	// Generation of the month selection

	let histwind = {};
	let treedata = {};
	$(document).ready(function () {
		var orderCount = 0;
		$('#example-order').multiselect({
			onChange: function (option, checked) {
				if (checked) {
					orderCount++;
					$(option).data('order', orderCount);
				}
				else {
					$(option).data('order', '');
				}
			},
			buttonText: function (options) {
				if (options.length === 0) {
					return 'None selected';
				}
				else if (options.length > 1) {
					return 'Please only select one!';
				}
				else {
					var selected = [];
					options.each(function () {
						selected.push([$(this).text(), $(this).data('order')]);
					});

					selected.sort(function (a, b) {
						return a[1] - b[1];
					});

					var text = '';
					for (var i = 0; i < selected.length; i++) {
						text += selected[i][0] + ', ';
					}

					return text.substr(0, text.length - 2);
				}
			}
		});

		$('#example-order-button').on('click', function () {
			var selected = [];
			$('#example-order option:selected').each(function () {
				selected.push([$(this).val(), $(this).data('order')]);
			});

			selected.sort(function (a, b) {
				return a[1] - b[1];
			});

			var text = '';
			for (var i = 0; i < selected.length; i++) {
				text += selected[i][0] + ', ';
			}
			text = text.substring(0, text.length - 2);

			alert(text);
			let monthselection_tmp = $('#example-order option:selected');
			let monthselection = {};

			for (i = 0; i < monthselection_tmp.length; i++) {
				monthselection[i] = monthselection_tmp[i].innerText;
			}

			//if (monthselection_tmp === undefined || monthselection_tmp.length == 0) {
				histrec = 1;
			//};
			
			$.ajax({
					type: "POST",
					url: '/postMonth',
					data: monthselection,
			}).done(function (monthdata) { Test(monthdata); });
			function Test(monthdata) {
				histwind = monthdata;
			};
						   
		});
	});

	// --------------------------------------
	// Generation of the tree multiselection

	$(document).ready(function () {
		var orderCount = 0;
		$('#tree-order').multiselect({
			maxHeight: 300,
			onChange: function (option, checked) {
				if (checked) {
					orderCount++;
					$(option).data('order', orderCount);
				}
				else {
					$(option).data('order', '');
				}

			},

			buttonText: function (options) {
				if (options.length === 0) {
					return 'None selected';
				}
				else if (options.length > 3) {
					return options.length + ' selected';
				}
				else {
					var selected = [];
					options.each(function () {
						selected.push([$(this).text(), $(this).data('order')]);
					});

					selected.sort(function (a, b) {
						return a[1] - b[1];
					});

					var text = '';
					for (var i = 0; i < selected.length; i++) {
						text += selected[i][0] + ', ';
					}

					return text.substr(0, text.length - 2);
				}
			}

		});

		$('#tree-order-button').on('click', function () {
			var selected = [];
			$('#tree-order option:selected').each(function () {
				selected.push([$(this).val(), $(this).data('order')]);
			});

			selected.sort(function (a, b) {
				return a[1] - b[1];
			});

			var text = '';
			for (var i = 0; i < selected.length; i++) {
				text += selected[i][0] + ', ';
			}
			text = text.substring(0, text.length - 2);

			alert(text);

			
			let lat_min = 50.127444;
			let lat_max = 50.139964;
			let lon_min = 8.36417;
			let lon_max = 8.608373;
			
			let treeselection_tmp = $('#tree-order option:selected');
			//let treeselection = {};
			
			treeselection[0] = lat_min;
			treeselection[1] = lat_max;
			treeselection[2] = lon_min;
			treeselection[3] = lon_max;
			for (i = 0; i < treeselection_tmp.length; i++) {
				treeselection[i+4] = treeselection_tmp[i].innerText;
				//treeselection[i] = treeselection_tmp[i].innerText;  
			}
			
			let currentWind = {};
			$.get("/currentWind", function(data, status){
				currentWind = data; 
			});
			
			$.ajax({
				type: "POST",
				url: '/postTreeType',
				data: treeselection,
			}).done(function (treedata) {/*callPollen(treedata);*/});	//
			
		});  
	});

}
catch(err) {
	console.log('->  Generation of the selection lists failed!\n' + err);
}


// -------------------------------------------------------------------------
// Get all trees accoding to a defined rectangle and the selected tree types

// object with all the trees in the view
let viewTrees;

// INPUT:  coordinates of the rectangle corners (left bottom and right top)
// OUTPUT: viewTrees -> object with all the trees in the view 
function getTreeRecCurrent(latmin, latmax, lonmin, lonmax) {
	try {
		treeselection[0] = latmin;
		treeselection[1] = latmax;
		treeselection[2] = lonmin;
		treeselection[3] = lonmax;
		
		$.ajax({
			type: "POST",
			url: '/postTreeType',
			data: treeselection,
		}).done(function (treedata) {convertdata(treedata);});	//
		
		
		function convertdata(treedata) {
			viewTrees = treedata;	 
		}
		
		return viewTrees; 
	}
	catch(err) {
		console.log('->  function getTreeRecCurrent() failed!\n' + err);
	}
	
}
//###################################################################################
