
let histrec;
histrec = 0;


//Javascript for the select Map Type
$(document).ready(function () {
    $("#month").hide();
    $('#recentold-order').on('change', function () {
        if (this.value == '1') {
            $("#month").show();
        }
        else {
            $("#month").hide();
        }
    });
});
// Javascript for the month select
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
            //treeselection[i] = treeselection_tmp[i].innerText;  
        }

        console.log(monthselection);

        if (monthselection_temp === undefined || monthselection_tmp.length == 0) {
            histrec = 1;
        };

        $.ajax({
            type: "POST",
            url: '/postMonth',
            data: monthselection,
        }).done(function (monthdata) { callPollenhist(monthdata); });	//
        console.log(monthdata);



        //function callPollenhist(treedata) {
        //    console.log(treedata);
        //    console.log(currentWind);

        //    for (var i = 0; i <= Object.keys(treedata).length - 1; i++) {
        //        drawPollenSpread(currentWind[0].speed, currentWind[0].direction, treedata[i].lat, treedata[i].lon, 5)
        //    }
        //}

    });
});
//Javascript function for the tree multiselect

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

        let treeselection_tmp = $('#tree-order option:selected');
        let treeselection = {};

        for (i = 0; i < treeselection_tmp.length; i++) {
            treeselection[i] = treeselection_tmp[i].innerText;
            //treeselection[i] = treeselection_tmp[i].innerText;  
        }

        console.log(treeselection);
		
		let currentWind = {};
		$.get("/currentWind", function(data, status){
			console.log(data);
			currentWind = data; 
		});
		

        $.ajax({
            type: "POST",
            url: '/postTreeType',
            data: treeselection,
        }).done(function (treedata) {callPollen(treedata);});	//
		console.log(treedata);
		
		function callPollen (treedata) {
			console.log(treedata);
			console.log(currentWind);
			if (histrec = 0) {

			    for (var i = 0; i <= Object.keys(treedata).length - 1; i++) {
			        drawPollenSpread(currentWind[0].speed, currentWind[0].direction, treedata[i].lat, treedata[i].lon, 5)
			    }
			} else {
			    for (var i = 0; i <= Object.keys(treedata).length - 1; i++) {
                    // choose the historic wind data......
			        drawPollenSpread(currentWind[0].speed, currentWind[0].direction, treedata[i].lat, treedata[i].lon, 5)
			    }

		}

		
		
		/*
		$.get("/postTreeType", function(data, status){
			
			console.log(data);
		});
		*/
		
    });  
});
