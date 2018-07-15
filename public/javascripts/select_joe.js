
// ---------------------------
// needed variables
let treeselection = {};
// rectangle view for historical data
let histrec;
// historical wind data
let histwind;
// tree translation
var treetrans = [];
histrec = 0;
let monthselection = {};
let locationselection = {};
var current_area_select = "NYC";
// Joe's Area selection

var Area_NYC_Select = function () {
	wwd.navigator.lookAtLocation.latitude = Location_USA_NewYork_Lat;
	wwd.navigator.lookAtLocation.longitude = Location_USA_NewYork_Long;
	wwd.navigator.range = 30e3;
	wwd.navigator.tilt = 45;
	current_area_select = "NYC";
	console.log("current area :" + current_area_select);
}
var Area_FF_Select = function () {
	wwd.navigator.lookAtLocation.latitude = Location_Germany_Frankfurt_Lat;
	wwd.navigator.lookAtLocation.longitude = Location_Germany_Frankfurt_Long;
	wwd.navigator.range = 10e3;
	wwd.navigator.tilt = 45;
	current_area_select = "FFM";
	console.log("current area :" + current_area_select);
}
// ----------------------------------
// Generation of the select structure

try {

	// --------------------------------------------
	// Generation of the selection for the Map Type

	$(document).ready(function () {
		// $("#month").hide();
		$("#Info").hide();
		$('#recentold-order1, #recentold-order2').on('change', function () {
			if ($("#recentold-order1").prop("checked") == true) {
				monthSelector.style.display = "none";
				histrec = 0;
				console.log("real-time mode activated");
			} else if ($("#recentold-order2").prop("checked") == true) {
				monthSelector.style.display = "block";
				console.log("historical mode activated");
			}
		});
		$('#recentold-order').on('change', function () {
			// if (this.value == '1') {
			// 	$("#month").show();
			// }
			// else {
			// 	$("#month").hide();
			// 	histrec = 0;
			// }
			// if (document.getElementById("recentold-order").value == "1"){
			// 	monthSelector.style.display = "block";
			// } else{
			// 	monthSelector.style.display = "none";
			// }

		});



	});


	// ----------------------------------
	// Generation of the month selection


	let treedata = {};
	$(document).ready(function () {
		var orderCount = 0;
		$('#example-order').multiselect({
			onChange: function (option, checked) {
				//if (checked) {
				//	orderCount++;
				$(option).data('order', orderCount);
				//}
				//else {
				//	$(option).data('order', '');
				//}
			},
			buttonText: function (options) {
				if (options.length === 0) {
					return 'Select month';
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

		$('#tree-order-button').on('click', function () {
			var selected = [];
			$('#month option:selected').each(function () {
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

			//alert(text);
			let monthselection_tmp = $('#month option:selected');


			for (i = 0; i < monthselection_tmp.length; i++) {
				monthselection[i] = monthselection_tmp[i].innerText;
			}

			//if (monthselection_tmp === undefined || monthselection_tmp.length == 0) {
			histrec = 1;
			//};
			histwind = "";
			histwind = monthselection[0];
			if (histwind == 'January') {
				histwind = 'jan';
			}
			else if (histwind == 'February') {
				histwind = 'feb';
			}
			else if (histwind == 'March') {
				histwind = 'mar';
			}
			else if (histwind == 'April') {
				histwind = 'apr';
			}
			else if (histwind == 'May') {
				histwind = 'may';
			}
			else if (histwind == 'June') {
				histwind = 'jun';
			}
			else if (histwind == 'July') {
				histwind = 'jul';
			}
			else if (histwind == 'August') {
				histwind = 'aug';
			}
			else if (histwind == 'September') {
				histwind = 'sep';
			}
			else if (histwind == 'October') {
				histwind = 'okt';
			}
			else if (histwind == 'November') {
				histwind = 'nov';
			}
			else if (histwind == 'December') {
				histwind = 'dec';
			}
			else {
				histwind = 'aug';
			}

		});
		//-----------------------------------------------------------
		//location selection


		$('#location-select-button').on('click', function () {
			// Navigate to the starting location
			let locationselection_tmp = $('#location option:selected');
			console.log(locationselection_tmp);

			for (i = 0; i < locationselection_tmp.length; i++) {
				locationselection[i] = locationselection_tmp[i].className;
			}

			console.log(locationselection[0])

			if (locationselection[0] == "FM") {
				wwd.navigator.lookAtLocation.latitude = Location_Germany_Frankfurt_Lat;
				wwd.navigator.lookAtLocation.longitude = Location_Germany_Frankfurt_Long;
				wwd.navigator.range = 10e3;
				wwd.navigator.tilt = 45;
			} else if (locationselection[0] == "NY") {
				wwd.navigator.lookAtLocation.latitude = Location_USA_NewYork_Lat;
				wwd.navigator.lookAtLocation.longitude = Location_USA_NewYork_Long;
				wwd.navigator.range = 30e3;
				wwd.navigator.tilt = 45;
			};

		});
	});



	// --------------------------------------
	// Generation of the tree multiselection

	$(document).ready(function () {
		var orderCount = 0;
		// $('#tree-order').multiselect({
		// 	maxHeight: 300,
		// 	onChange: function (option, checked) {
		// 		if (checked) {
		// 			orderCount++;
		// 			$(option).data('order', orderCount);

		// 			//alert($('select#tree-order').val());
		// 		}
		// 		else {
		// 			$(option).data('order', '');
		// 		}

		// 	},

		// 	buttonText: function (options) {
		// 		if (options.length === 0) {
		// 			return 'Select Trees';
		// 		}
		// 		else if (options.length > 3) {
		// 			return options.length + ' selected';
		// 		}
		// 		else {
		// 			var selected = [];
		// 			options.each(function () {
		// 				selected.push([$(this).text(), $(this).data('order')]);
		// 			});

		// 			selected.sort(function (a, b) {
		// 				return a[1] - b[1];
		// 			});

		// 			var text = '';
		// 			for (var i = 0; i < selected.length; i++) {
		// 				text += selected[i][0] + ', ';
		// 			}

		// 			return text.substr(0, text.length - 2);
		// 		}
		// 	}

		// });
		var selected;
		$('#tree-order-button').on('click', function () {
			selected = [];
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

			//alert(text);

			if (histrec == 2) {
				//let valuehis = $("#recentold-order").val();
				//alert ('balue' + valuehis);
				// if (valuehis == '1') {
				// 	histrec = 1;
				// } else {
				// 	histrec = 0;
				// };
				if ($("#recentold-order2").prop("checked") == true) {
					histrec = 1;
				} else {
					histrec = 0;
				}



			};

			// call button modul
			$("#myBtn").click();


			// ---- translate the treeselection for the database queries ----

			treeselection_tmp = $('#tree-order option:selected');

			for (i = 0; i < treeselection_tmp.length; i++) {
				if (treeselection_tmp[i].innerText == 'Birch') {
					treetrans[i] = 'Birke';
				} else if (treeselection_tmp[i].innerText == 'Alder') {
					treetrans[i] = 'Erle';
				} else if (treeselection_tmp[i].innerText == 'Hazel') {
					treetrans[i] = 'Hasel';
				} else if (treeselection_tmp[i].innerText == 'Maple') {
					treetrans[i] = 'Ahorn';
				} else if (treeselection_tmp[i].innerText == 'Apple') {
					treetrans[i] = 'Apfel';
				} else if (treeselection_tmp[i].innerText == 'Pear') {
					treetrans[i] = 'Birne';
				} else if (treeselection_tmp[i].innerText == 'Beech') {
					treetrans[i] = 'Buche';
				} else if (treeselection_tmp[i].innerText == 'Buchs') {
					treetrans[i] = 'Buchs';
				} else if (treeselection_tmp[i].innerText == 'Yew') {
					treetrans[i] = 'Eibe';
				} else if (treeselection_tmp[i].innerText == 'Oak') {
					treetrans[i] = 'Eiche';
				} else if (treeselection_tmp[i].innerText == 'Ash') {
					treetrans[i] = 'Esche';
				} else if (treeselection_tmp[i].innerText == 'Lilac') {
					treetrans[i] = 'Flieder';
				} else if (treeselection_tmp[i].innerText == 'Ailanthus') {
					treetrans[i] = 'Goetterbaum';
				} else if (treeselection_tmp[i].innerText == 'Elder') {
					treetrans[i] = 'Holunder';
				} else if (treeselection_tmp[i].innerText == 'Chestnut') {
					treetrans[i] = 'Kastanie';
				} else if (treeselection_tmp[i].innerText == 'Pine') {
					treetrans[i] = 'Kiefer';
				} else if (treeselection_tmp[i].innerText == 'Cherry') {
					treetrans[i] = 'Kirsche';
				} else if (treeselection_tmp[i].innerText == 'Linden') {
					treetrans[i] = 'Linde';
				} else if (treeselection_tmp[i].innerText == 'Plum') {
					treetrans[i] = 'Pflaume';
				} else if (treeselection_tmp[i].innerText == 'Robinie') {
					treetrans[i] = 'Robinie';
				} else if (treeselection_tmp[i].innerText == 'Sleeping-Tree') {
					treetrans[i] = 'Schlafbaum';
				} else if (treeselection_tmp[i].innerText == 'Schnur') {
					treetrans[i] = 'Schnur';
				} else if (treeselection_tmp[i].innerText == 'Fir') {
					treetrans[i] = 'Tanne';
				} else if (treeselection_tmp[i].innerText == 'Elm') {
					treetrans[i] = 'Ulme';
				} else if (treeselection_tmp[i].innerText == 'Walnut') {
					treetrans[i] = 'Walnuss';
				} else if (treeselection_tmp[i].innerText == 'Pasture') {
					treetrans[i] = 'Weide';
				} else if (treeselection_tmp[i].innerText == 'Cedar') {
					treetrans[i] = 'Zeder';
				} else if (treeselection_tmp[i].innerText == 'Cypress') {
					treetrans[i] = 'Zypresse';
				} else if (treeselection_tmp[i].innerText == 'other') {
					treetrans[i] = 'other';
				} else {
					treetrans[i] = 'Buche';
				}
			}

		});
	});

}
catch (err) {
	console.log('->  Generation of the selection lists failed!\n' + err);
}


// -------------------------------------------------------------------------
// Get all trees accoding to a defined rectangle and the selected tree types

// object with all the trees in the view
let viewTrees;

// This function delivers the coordinates of the current view and the selected trees
// INPUT:  coordinates of the rectangle corners (left bottom and right top)
// OUTPUT: viewTrees -> object with all the trees in the view 

function getTreeRecCurrent(latmin, latmax, lonmin, lonmax) {
	let treeselection = {};
	try {
		treeselection[0] = latmin;
		treeselection[1] = latmax;
		treeselection[2] = lonmin;
		treeselection[3] = lonmax;

		for (i = 4; i < treeselection_tmp.length + 4; i++) {
			treeselection[i] = treetrans[i - 4];
		}

		$.ajax({
			type: "POST",
			url: '/postTreeType',
			data: treeselection,
		}).done(function (treedata) { convertdata(treedata); });

		function convertdata(treedata) {
			viewTrees = treedata;
			console.log(viewTrees)
		}

		return viewTrees;
	}
	catch (err) {
		console.log('->  function getTreeRecCurrent() failed!\n' + err);
	}

}


// -------
// tooltip

$(document).ready(function () {
	$('.tooltipstuff').tooltipster(
		{
			theme: 'tooltipster-borderless',
			distance: 10,
			animation: 'grow'
		}
	);
});


// -----------------------------------------------------------
// Get the current trees and the corresponding blooming values
// INPUT:  the month
// OUTPUT: an object with the selected tree types 
//         and the corresponding blooming data for the current month

let resBlooming;

function getTreeBlooming(monthdata) {

	try {

		// object with the view coordinates,
		// the selected trees
		// and the current month
		let treeBlooming = {};
		// temporary count
		let tmp_cnt = 0;

		for (i = 0; i < treeselection_tmp.length; i++) {
			treeBlooming[i] = treetrans[i];
			tmp_cnt = tmp_cnt + 1;
		}
		treeBlooming[tmp_cnt] = monthdata;

		$.ajax({
			async: false,
			type: "POST",
			url: '/getBlooming',
			data: treeBlooming,
		}).done(function (dataBlooming) {
			convertdata(dataBlooming);
		});

		function convertdata(bloomingdata) {
			resBlooming = bloomingdata;
		}

		return resBlooming;
	}
	catch (err) {
		console.log('->  function getTreeBlooming() failed!\n' + err);
	}

}

function Clearall() {
	shapesLayer.removeAllRenderables();
	shapesLayer.refresh();
	placemarkLayer.removeAllRenderables();
	placemarkLayerend.removeAllRenderables();
	placemarkLayer.refresh();
	placemarkLayerend.refresh();
	hideNav()
	deleteLayer();
	histrec = 2;
	navMenu.style.display = "none";
	pollenMenu.style.display = "none";


};
// ---------------------------------------------------------------------
// Get the all trees and the corresponding blooming values for all month
// INPUT:  void
// OUTPUT: an object with the selected tree types and the corresponding blooming data 

let allBlooming;

function getTreeBloomingAll() {

	try {

		// an object with the selected trees for all month
		let treeBlooming = {};

		for (i = 0; i < treeselection_tmp.length; i++) {
			treeBlooming[i] = treetrans[i];
		}

		$.ajax({
			async: false,
			type: "POST",
			url: '/getBloomingAll',
			data: treeBlooming,
		}).done(function (dataBlooming) {
			convertdata(dataBlooming);
		});

		function convertdata(bloomingdata) {
			allBlooming = bloomingdata;
		}

		return allBlooming;
	}
	catch (err) {
		console.log('->  function getTreeBlooming() failed!\n' + err);
	}

}


// ---------------------------------------------------------------------
// Get the all trees and the corresponding blooming values for all month
// INPUT:  void
// OUTPUT: an object with the selected tree types and the corresponding blooming data 

let histBlooming;

function getTreeBloomingHist() {

	try {

		// object with the view coordinates,
		// the selected trees
		// and the current month
		let treeBlooming = {};

		// selected wind data
		let monthdata = histwind;

		// temporary count variable
		let tmp_cnt = 0;

		for (i = 0; i < treeselection_tmp.length; i++) {
			treeBlooming[i] = treetrans[i];
			tmp_cnt = tmp_cnt + 1;
		}
		treeBlooming[tmp_cnt] = monthdata;

		$.ajax({
			async: false,
			type: "POST",
			url: '/getBloomingHist',
			data: treeBlooming,
		}).done(function (dataBlooming) {
			convertdata(dataBlooming);
		});

		function convertdata(bloomingdata) {
			histBlooming = bloomingdata;
		}

		return histBlooming;
	}
	catch (err) {
		console.log('->  function getTreeBlooming() failed!\n' + err);
	}

}
