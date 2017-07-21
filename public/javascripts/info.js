function Info() {
    if ($("#dialog_addTree").hasClass('ui-dialog-content')) {
        // do whatever
        $("#dialog_addTree").dialog("close")
        //$("#dialog_addTree").dialog("destroy");
       
    } else {
        // it is not initialized yet
    }
    // Add a cancel button
    
    //$("#info").dialog({ autoOpen: false });
    $("#Info").dialog({
        width: 400,
        height: 500,
        resizable: false,
        open: function () {
            
            var btnCancel = $("button[class='ui-dialog-titlebar-close']");
            btnCancel.attr("title", "Cancel");
            btnCancel.addClass("btn btn-default tooltipstuff");
            btnCancel.append("<img src='images/abort.png' style='float:right;' title='Cancel' alt='...' height='25px' width='25px'/>");
            btnCancel.css({ 'position': 'relative', 'float': 'right', 'width': '25px', 'height': '25px', 'border-radius': '50%', 'margin': '0px', 'border': '0px', 'padding': '0px' });

        }
    });
    //$("#Info").dialog("open");
};