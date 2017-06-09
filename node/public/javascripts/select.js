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
        }).done(function (treedata) {ttt(treedata);});	//
		console.log(treedata);
		
		function ttt (dat) {
			console.log(dat);
			console.log(currentWind);
		}

		
		
		/*
		$.get("/postTreeType", function(data, status){
			
			console.log(data);
		});
		*/
		
    });  
});



