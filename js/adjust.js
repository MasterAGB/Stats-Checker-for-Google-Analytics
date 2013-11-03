var $realtable;
var realTableOffsetTop;
var realTableOffsetLeft;
var $ths;
var $tfoot;
var $thead;
var $tbody;
var $tds;
var $tdsFoot;
var maxHeight
var keepAspectTimer = false;
var fixedAdded = false;

function adjustTableVars() {
    $realtable = $('#real_table');
    $ths = $realtable.find('th');
    $tfoot = $realtable.find('tfoot');
    $thead = $realtable.find('thead');
    $tbody = $realtable.find('tbody');
    $tdsFoot = $tfoot.find('tr:last-child td');
    realTableOffsetTop = $realtable.offset().top;
    realTableOffsetLeft = $realtable.offset().left;
    updateAdjustRows();
}

function updateAdjustRows() {
    $tds = $tbody.find('tr:first-child td');
    maxHeight = $('#table_scroll').height();
    updateAdjustHeaders();
}

function updateAdjustHeaders() {
    var tfootHeight = $tfoot.height();
    var theadHeight = $thead.height();
    var realWidth = $realtable.width();
    var windowScrollYOffset = $(window).scrollTop();
    var windowScrollXOffset = $(window).scrollLeft();

    //windowScrollYOffset

    $thead[0].style.cssText = "width:" + realWidth + "px; left:" + (realTableOffsetLeft - windowScrollXOffset) + "px; top:" + (realTableOffsetTop - windowScrollYOffset) + "px; opacity:1;";
    $tfoot[0].style.cssText = "width:" + realWidth + "px; left:" + (realTableOffsetLeft - windowScrollXOffset) + "px; top:" + (maxHeight - tfootHeight + realTableOffsetTop - windowScrollYOffset) + "px;opacity:1;";
    $tbody[0].style.cssText = "width:" + realWidth + "px; margin-top:" + (theadHeight) + "px;margin-bottom:" + (tfootHeight) + "px;";
    //$tfoot[0].style.opacity=1;
}

function scrollFunction() {
    updateAdjustHeaders();
}

window.onscroll = scrollFunction;



function removeTableFixed() {
    if (fixedAdded) {
        fixedAdded = false;

        $realtable[0].className = "profile_list_table";

        $ths.each(function () {
            $(this)[0].style = "";
        });
        $tds.each(function () {
            $(this)[0].style = "";
        });
        $tdsFoot.each(function () {
            $(this)[0].style = "";
        });
    }

}

function adjustTable(txt) {
    //logg(txt);

    //console.log(txt);

    if ($('#loading_table_profiles').is(":visible")) {
        //alert(txt+" "+$('#loading_table_profiles').is(":visible"));
        //updateAdjustHeaders();
        removeTableFixed();
        return;
    }


    // alert("adjustTable!!:"+txt);

    if (txt == "init_popup_start") {
        updateAdjustHeaders();
        removeTableFixed();
        return;
    }


    if (txt != "checkFullyFilled" && txt != "resizeTimeout" && txt != "resize" && txt != "sortEnd" && txt != "graph_open" && txt != "graph_close") {
        return;
    }

    if (txt == "resize") {
        removeTableFixed();
        return;
    }

    removeTableFixed();

    //console.log("adjustTable!!:"+txt);

    if (txt == "graph_open" || txt == "graph_close" || txt == "sortEnd" || txt == "resizeTimeout") {
        updateAdjustRows();
    }


    //alert(txt);


    updateAdjustHeaders();
    addTableFixed();

}

function addTableFixed() {
    if (!fixedAdded) {

        $ths.each(function () {
            //$(this).width($(this).width() + "px");
            $(this)[0].style.width = $(this).width() + "px";
        });
        $tds.each(function () {
            //$(this).width($(this).width() + "px");
            $(this)[0].style.width = $(this).width() + "px";
            //console.log($(this)[0].style.width);
        });
        $tdsFoot.each(function () {
            //$(this).width($(this).width() + "px");
            $(this)[0].style.width = $(this).width() + "px";
        });


        /* $tfoot.css({
         top: maxHeight - tfootHeight + realTableOffsetTop + 'px',
         opacity: 1
         });*/

        /* $tbody.css({
         marginTop: theadHeight + "px",
         marginBottom: tfootHeight + "px"
         });*/
        $realtable[0].className = "profile_list_table fixed";
        fixedAdded = true;
    }
}