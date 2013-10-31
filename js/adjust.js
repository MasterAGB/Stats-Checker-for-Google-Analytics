

var $realtable;
var realTableOffsetTop;
var $ths;
var $tfoot;
var $thead;
var $tbody;
var $tds;
var $tdsFoot;
var maxHeight
var keepAspectTimer = false;

function adjustTableVars(){
    $realtable = $('#real_table');
    $ths = $realtable.find('th');
    $tfoot = $realtable.find('tfoot');
    $thead = $realtable.find('thead');
    $tbody = $realtable.find('tbody');
    $tdsFoot = $tfoot.find('tr:last-child td');
    realTableOffsetTop = $realtable.offset().top;
    updateAdjustRows();
}

function updateAdjustRows(){
    $tds = $tbody.find('tr:first-child td');
    maxHeight = $('#table_scroll').height();
    updateAdjustHeaders();
}

function updateAdjustHeaders(){
    var tfootHeight = $tfoot.height();
    var theadHeight = $thead.height();
    var realWidth = $realtable.width();

    $thead[0].style.cssText="width:"+realWidth+"px; opacity:1;";
    $tfoot[0].style.cssText="width:"+realWidth+"px; top:"+(maxHeight - tfootHeight + realTableOffsetTop) + 'px;opacity:1;';
    $tbody[0].style.cssText="width:"+realWidth+"px; margin-top:"+(theadHeight) + "px;margin-bottom:"+(tfootHeight) + "px;";
    //$tfoot[0].style.opacity=1;
}




function removeTableFixed(){
    $realtable[0].className="profile_list_table";

    $ths.each(function () {
        $(this)[0].style="";
    });
    $tds.each(function () {
        $(this)[0].style="";
    });
    $tdsFoot.each(function () {
        $(this)[0].style="";
    });

}

function adjustTable(txt) {





    if (txt == "init_popup_start" || txt=="resizeTimeout") {
        updateAdjustHeaders();
        removeTableFixed();
        return;
    }

    if (txt != "checkFullyFilled" && txt != "resizeTimeout" && txt != "resize") {
        return;
    }

    if (txt == "resize") {
        return;
    }


    //alert(txt);
    //console.log(txt);


    console.log("adjustTable!!");
    updateAdjustHeaders();

    removeTableFixed();






    $ths.each(function () {
        //$(this).width($(this).width() + "px");
        $(this)[0].style.width=$(this).width() + "px";
    });
    $tds.each(function () {
        //$(this).width($(this).width() + "px");
        $(this)[0].style.width=$(this).width() + "px";
    });
    $tdsFoot.each(function () {
        //$(this).width($(this).width() + "px");
        $(this)[0].style.width=$(this).width() + "px";
    });



   /* $tfoot.css({
        top: maxHeight - tfootHeight + realTableOffsetTop + 'px',
        opacity: 1
    });*/

   /* $tbody.css({
        marginTop: theadHeight + "px",
        marginBottom: tfootHeight + "px"
    });*/
    $realtable[0].className="profile_list_table fixed";
}