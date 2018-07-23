function toggleSearchBox(e) {


    $(".search_input").toggle();
    $(".profile_header").toggle();
    adjustTable("toggleSearchBox");
    $(".search_input input").val("").focus();

    searchValue = "";
    $(".search_icon").removeClass("active");



    e.preventDefault();
    return false;


}

window.addEventListener("keydown", function (e) {
    if (e.keyCode == 114 || e.keyCode == 27 || (e.ctrlKey && e.keyCode == 70)) {
        //alert("a");
        //e.preventDefault();
        toggleSearchBox(e);
    }
})


var current_version = "0";


//localStorage:
var google_id = "";
var account_id = "";
//to zhe samoje?
var account_name = "";
var profile_id = "";
var profile_name = "";
var display_id = "";
var selected_period = "";
var update_interval = "";
var date_range = "";
var showAds = true;
var showSocial = true;
var show_propertynames = true;
var favouriteProfiles = [];
var show_footer = true;
var onlyFav = false;


var profile_data = [];
var profile_search_array = new Object();
var profile_name_array = new Object();
var property_name_array = new Object();
var property_url_array = {};
var profile_url_array = {};
var account_name_array = [];

var property_tracking_code = new Object();
var profile_tracking_code = new Object();
var property_parents = new Object();
var profile_parents = new Object();
var profile_count_array = new Object();
var property_count_array = new Object();
var searchValue = "";

/*
 var ga = new Object()
 ga.webanalytics = new Object();
 ga.webanalytics.header = new Object();
 ga.webanalytics.header.setLoadBaseData = function (n) {
 //alert(n)
 }
 ga.webanalytics.header.setHeaderInfo = function (n) {
 //alert(n)
 }
 ga.webanalytics.header.main = function (n) {
 //alert(n)
 }*/

$.ajaxSetup({ cache: false });
$.ajaxSetup({ async: true });


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addfavourite(starbutton, profile_id_to_fav, sync) {
    if (typeof(sync) == "undefined") {
        sync = true;
    }
    if (!findfavourite(profile_id_to_fav)) {
        console.log(typeof(favouriteProfiles));
        favouriteProfiles.push(profile_id_to_fav);
    }
    favouriteProfiles = SaveStorage("favouriteProfiles", favouriteProfiles, false);

    if (typeof(starbutton) == "object") {
        $(starbutton).addClass('starred_icon');
        $(starbutton).removeClass('unstarred_icon');
        $(starbutton).parent().parent().parent().parent().addClass('favorited');
    }
    if (sync) {
        SendAddToFavourites(profile_id_to_fav);
    }

}
function removefavourite(starbutton, profile_id_to_fav, sync) {
    if (typeof(sync) == "undefined") {
        sync = true;
    }
    favouriteProfiles = jQuery.grep(favouriteProfiles, function (value) {
        return value != profile_id_to_fav;
    });
    favouriteProfiles = SaveStorage("favouriteProfiles", favouriteProfiles, false);

    if (typeof(starbutton) == "object") {
        $(starbutton).addClass('unstarred_icon');
        $(starbutton).removeClass('starred_icon');
        $(starbutton).parent().parent().parent().parent().removeClass('favorited');
    }
    if (sync) {
        SendRemoveFromFavourites(profile_id_to_fav);
    }
}

function togglefavourite(starbutton, profile_id_to_fav) {
    if (findfavourite(profile_id_to_fav)) {
        removefavourite(starbutton, profile_id_to_fav);
    } else {
        addfavourite(starbutton, profile_id_to_fav);
    }
}
function findfavourite(profile_id_to_fav) {
    if (jQuery.inArray(profile_id_to_fav, favouriteProfiles) == -1) {
        return false;
    } else {
        return true;
    }
}


function load_storage_variables() {
    //console.log("load_storage_variables");
    google_id = LoadStorage("google_id");
    account_id = LoadStorage("account_id");
    account_name = LoadStorage("account_name");
    profile_id = LoadStorage("profile_id");
    profile_name = LoadStorage("profile_name");
    display_id = LoadStorage("display_id", "string", "DisplayVisitsSummary");
    selected_period = LoadStorage("selected_period", "string", "day");
    update_interval = LoadStorage("update_interval", "string", 300000);
    date_range = LoadStorage("date_range", "string", "30days");
    showAds = LoadStorage("showAds", 'bool', true);
    showSocial = LoadStorage("showSocial", 'bool', true);
    show_propertynames = LoadStorage("show_propertynames", 'bool');
    favouriteProfiles = LoadStorage('favouriteProfiles', 'json');
    show_footer = LoadStorage("show_footer", 'bool');
    onlyFav = LoadStorage("onlyFav", 'bool', false);
}


load_storage_variables();


var currentTime = '';
var month = '';
var day = '';
var year = '';
var today = '';

var checkperiod = 0;

var oldcurrentTime = '';
var oldmonth = '';
var oldday = '';
var oldyear = '';
var oldtoday = '';


var monthagocurrentTime = '';
var monthagomonth = '';
var monthagoday = '';
var monthagoyear = '';
var monthagotoday = '';

var weekagocurrentTime = '';
var weekagomonth = '';
var weekagoday = '';
var weekagoyear = '';
var weekagotoday = '';

refreshdates();


function refreshdates() {
    var checkperiodStart = 0;

    switch (selected_period) {
        case 'realtime':
            var checkperiod = 0;
            break;
        case 'day':
            var checkperiod = 1000 * 60 * 60 * 24 * (1 - 1);
            break;
        case 'yesterday':
            checkperiodStart = 1000 * 60 * 60 * 24 * (2 - 1);
            var checkperiod = 1000 * 60 * 60 * 24 * (2 - 1);
            break;
        case 'week':
            var checkperiod = 1000 * 60 * 60 * 24 * (7 - 1);
            break;
        case 'month':
            var checkperiod = 1000 * 60 * 60 * 24 * (30 - 1);
            break;
    }

    currentTimeReal = new Date();


    currentTime = new Date(currentTimeReal - checkperiodStart);
    month = currentTime.getMonth() + 1;
    if (month < 10) month = "0" + month;
    day = currentTime.getDate();
    //alert(day);
    if (day < 10) day = "0" + day;
    year = currentTime.getFullYear();
    today = year + '' + month + '' + day;


    oldcurrentTime = new Date(currentTimeReal - checkperiod);
    oldmonth = oldcurrentTime.getMonth() + 1;
    if (oldmonth < 10) oldmonth = "0" + oldmonth;
    oldday = oldcurrentTime.getDate();
    //alert(oldday);
    if (oldday < 10) oldday = "0" + oldday;
    oldyear = oldcurrentTime.getFullYear();

    oldtoday = oldyear + '' + oldmonth + '' + oldday;
    //oldtoday="NaNNaNNaN";

    monthagocurrentTime = new Date(currentTimeReal - 1000 * 60 * 60 * 24 * 30);
    monthagomonth = monthagocurrentTime.getMonth() + 1;
    if (monthagomonth < 10) monthagomonth = "0" + monthagomonth;
    monthagoday = monthagocurrentTime.getDate();
    if (monthagoday < 10) monthagoday = "0" + monthagoday;
    monthagoyear = monthagocurrentTime.getFullYear();
    monthagotoday = monthagoyear + '' + monthagomonth + '' + monthagoday;


    weekagocurrentTime = new Date(currentTimeReal - 1000 * 60 * 60 * 24 * 7);
    weekagomonth = weekagocurrentTime.getMonth() + 1;
    if (weekagomonth < 10) weekagomonth = "0" + weekagomonth;
    weekagoday = weekagocurrentTime.getDate();
    if (weekagoday < 10) weekagoday = "0" + weekagoday;
    weekagoyear = weekagocurrentTime.getFullYear();
    weekagotoday = weekagoyear + '' + weekagomonth + '' + weekagoday;
}


function pickDateFormatButton(newformat) {
    if (newformat == undefined)newformat = selected_period;
    $('.gdf_nth').removeClass('selected').addClass('active');
    $('#gdf_nth_' + newformat).addClass('selected');
}

function changeDateFormat(newformat) {
    _gaq.push(['_trackEvent', 'changeDateFormat', 'clicked']);

    pickDateFormatButton(newformat);


    selected_period = SaveStorage("selected_period", newformat);
    refreshdates();
    $('#account_id').change();
}

function removecrap(value) {
    value = value.replace("&nbsp;", '');
    value = value.replace("&nbsp;", '');
    value = value.replace("&nbsp;", '');
    value = value.replace("	", '');
    value = value.replace(" ", '');
    value = value.replace(" ", '');
    value = value.replace("	", '');
    value = value.replace(String.fromCharCode(160), '');
    value = value.split(',').join('');
    value = value.split(String.fromCharCode(160)).join('');
    return value;
}


function goOffline() {
    if (isExtension()) {
        chrome.browserAction.setBadgeBackgroundColor({"color": [128, 128, 128, 128]});
        chrome.browserAction.setIcon({path: "img/logo.offline.png"});
        chrome.browserAction.setBadgeText({"text": "?"});
        chrome.browserAction.setTitle({title: chrome.i18n.getMessage("loginToTheSystem")});
    }
}


function openErrorPopup() {
    $('.error_popup_fade').show();
    $('.error_popup').show();
    $('#error_popup_button_close').hide().bind('click', closeErrorPopup);
}
function closeErrorPopup() {
    $('.error_popup_fade').hide();
    $('.error_popup').hide();
}


function PleaseLogin(timerlength) {
    //chrome.tabs.create({url: 'https://analytics.google.com/analytics/web/'});

    openErrorPopup();
    goOffline();
    $("#loading_new_account_table").hide();
    $('#googleAcc').html('<a href="https://analytics.google.com/analytics/web/" target="_blank">' + chrome.i18n.getMessage("loginToTheSystem") + '</a>');
    $('#loading_profile').html('<a href="https://analytics.google.com/analytics/web/" target="_blank">' + chrome.i18n.getMessage("loginToTheSystem") + '</a>');
    $('#loading_table_profiles td').html('<a href="https://analytics.google.com/analytics/web/" target="_blank">' + chrome.i18n.getMessage("loginToTheSystem") + '</a>');
    setTimeout(function () {
        //checkRatio();
        init_popup();
    }, 3000);
}

function logg(text) {
    console.log(text);
    //$('body').append(text+"<br>");
}


function onInstall() {
    console.log("Extension Installed");
    if (isExtension()) {
        _gaq.push(['_trackEvent', 'Ext install', current_version]);
        chrome.tabs.create({'url': 'http://mystatschecker.com/?installed=' + current_version + '&type=ext'}, function (tab) {
        });
    } else {
        _gaq.push(['_trackEvent', 'App install', current_version]);
        chrome.tabs.create({'url': 'http://mystatschecker.com/?installed=' + current_version + '&type=app'}, function (tab) {
        });
    }
}

function onSmallUpdate() {
    console.log("Extension Updated (Small version)");
    showAds = SaveStorage("showAds", true);

    if (isExtension()) {
        _gaq.push(['_trackEvent', 'Ext small version change', LoadStorage('version') + ' - ' + current_version]);
    } else {
        _gaq.push(['_trackEvent', 'App small version change', LoadStorage('version') + ' - ' + current_version]);
    }
}

function onUpdate() {
    console.log("Extension Updated");
    if (isExtension()) {
        _gaq.push(['_trackEvent', 'Ext version change', LoadStorage('version') + ' - ' + current_version]);
        chrome.tabs.create({'url': 'http://mystatschecker.com/?updated=' + current_version + '&from=' + LoadStorage('version') + '&type=ext'}, function (tab) {
        });
    } else {
        _gaq.push(['_trackEvent', 'App version change', LoadStorage('version') + ' - ' + current_version]);
        chrome.tabs.create({'url': 'http://mystatschecker.com/?updated=' + current_version + '&from=' + LoadStorage('version') + '&type=app'}, function (tab) {
        });
    }
}
function getManifestVersion() {
    var details = chrome.app.getDetails();
    current_version = details.version;
    return details.version;
}

function isExtension() {
    return typeof(chrome.app.getDetails().background) != "undefined";
}


function getAccountProfiles(onCompleteFunction) {


    if (isExtension()) {
        $('#open_mystats').attr('href', 'http://mystatschecker.com/?ext');
    } else {
        $('#open_mystats').attr('href', 'http://mystatschecker.com/?app');
    }

    var currVersion = getManifestVersion();
    var prevVersion = LoadStorage('version');


    if (currVersion != prevVersion) {


        //TODO: elsi nomer versii osobo ne otlichajecca
        //reklama na mystatschecker!!!
        // Check if we just installed this extension.
        if (typeof prevVersion == 'undefined') {
            onInstall();
        } else {
            var parts_cur = currVersion.split('.');
            var parts_prev = prevVersion.split('.');
            for (var i = 0; i < 4; i++) {
                if (typeof(parts_cur[i]) == "undefined")parts_cur[i] = 0;
                if (typeof(parts_prev[i]) == "undefined")parts_prev[i] = 0;
            }
            if (
                parts_cur[0] == parts_prev[0] &&
                    parts_cur[1] == parts_prev[1] &&
                    parts_cur[2] == parts_prev[2] &&
                    parts_cur[3] != parts_prev[3]
                ) {
                onSmallUpdate();
            } else {
                onUpdate();
            }

        }

        SaveStorage("version", currVersion);
    }


    load_storage_variables();
    refreshdates();
    getGoogleToken(onCompleteFunction);


}


function checkRatio() {

    //console.log("checkRatio");
    if (isExtension()) {
        chrome.browserAction.setIcon({path: "img/spinner16.gif"});
    }

    getAccountProfiles(GetDataAndSetRatio);

}


var intervalID;
function init_background() {
    goOffline();
    //console.log("init_background");
    checkRatio();


    clearInterval(intervalID);
    if (typeof(update_interval) == "undefined" || update_interval < 30000 || isNaN(update_interval)) {
        update_interval = 30000;
    }

    //logg('init interval:' + update_interval);
    intervalID = setInterval(
        function () {

            //console.log("update_interval"+update_interval);
            checkRatio()
        },
        update_interval);


    //setInterval("checkRatio()", 10000);

    chrome.extension.onRequest.addListener(function (req, sender, resp) {
        if (req.id) checkRatio();
    });
}


function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return (
        (h > 0 ? (h < 10 ? "0" : "") + h : "00") + ':' +
            (m > 0 ? (m < 10 ? "0" : "") + m : "00") + ':' +
            (s > 0 ? (s < 10 ? "0" : "") + s : "00")
        );

}

function hmsToSeconds(secstring) {
    if (typeof(secstring) == "number") {
        return secstring;
    }
    var R = /(.*):(.*):(.*)/
    var arr = secstring.match(R);
    return (arr[1] * 60 * 60 - (-arr[2] * 60) - (-arr[3]))
}


jQuery.fn.fadeToggle = function (speed, easing, callback) {
    return this.animate({opacity: 'toggle'}, speed, easing, callback);
};


function addDays(currentDate, days) {
    var dat = new Date(currentDate);
    dat.setDate(dat.getDate() + days);
    return dat;
}


function getDates(startDate, stopDate) {

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(months[currentDate.getMonth()] + ' ' + currentDate.getDate());
        currentDate = addDays(currentDate, 1);
    }
    return dateArray;
}


function fill_row(jrow, cur_profile_id, info_visits, info_uniqvisitors, info_pageviews, info_averagepageviews, info_timeonsite, info_bounce, info_newvisits) {

    if (typeof(info_bounce) == "undefined")info_bounce = "0.00%";


    var appicon = "";
    if (profile_data[cur_profile_id]["app"] == true) {
        appicon = "<span class='app'></span>";
    }


    $('.info_name', jrow).html(appicon + profile_name_array[cur_profile_id] + " <span>" + profile_tracking_code[cur_profile_id] + "</span>");

    $('.info_visits', jrow).html(info_visits);
    $('.info_uniqvisitors', jrow).html(info_uniqvisitors);
    $('.info_pageviews', jrow).html(info_pageviews);
    $('.info_averagepageviews', jrow).html(info_averagepageviews);
    $('.info_timeonsite', jrow).html(info_timeonsite);
    $('.info_bounce', jrow).html(info_bounce);
    $('.info_newvisits', jrow).html(info_newvisits);

    $('#total_visits').html(($('#total_visits').html() - (-info_visits)).toFixed(2) * 1);
    $('#total_uniqvisitors').html(($('#total_uniqvisitors').html() - (-info_uniqvisitors)).toFixed(2) * 1);
    $('#total_pageviews').html(($('#total_pageviews').html() - (-info_pageviews)).toFixed(2) * 1);
    $('#total_averagepageviews').html(($('#total_averagepageviews').html() - (-info_averagepageviews)).toFixed(2) * 1);
    $('#total_timeonsite').html(secondsToHms((hmsToSeconds($('#total_timeonsite').html()) - (-hmsToSeconds(info_timeonsite))).toFixed(2) * 1));
    $('#total_bounce').html((parseFloat($('#total_bounce').html()) - (-parseFloat(info_bounce))).toFixed(2) * 1 + '%');
    $('#total_newvisits').html((parseFloat($('#total_newvisits').html()) - (-parseFloat(info_newvisits))).toFixed(2) * 1 + '%');

    var profiles_count = profile_count_array[profile_parents[cur_profile_id]];
    $('#avg_visits').html(($('#total_visits').html() / profiles_count).toFixed(2) * 1);
    $('#avg_uniqvisitors').html(($('#total_uniqvisitors').html() / profiles_count).toFixed(2) * 1);
    $('#avg_pageviews').html(($('#total_pageviews').html() / profiles_count).toFixed(2) * 1);
    $('#avg_averagepageviews').html(($('#total_averagepageviews').html() / profiles_count).toFixed(2) * 1);
    $('#avg_timeonsite').html(secondsToHms((hmsToSeconds($('#total_timeonsite').html()) / profiles_count).toFixed(2) * 1));
    $('#avg_bounce').html((parseFloat($('#total_bounce').html()) / profiles_count).toFixed(2) * 1 + '%');
    $('#avg_newvisits').html((parseFloat($('#total_newvisits').html()) / profiles_count).toFixed(2) * 1 + '%');

    if ($("#profiles_table_list").find('.loading_cell').length == 0) {
        $("#loading_new_account_table").hide();
        $("#real_table").trigger("update");
    }
    if (info_visits == 0) {
        $(jrow).addClass('empty_tr');
    }
    adjustTable('fill_row');
}


function fill_info(cur_profile_id, jrow, token) {


    if (selected_period == "realtime") {


        getRealtimeAdditionalData(cur_profile_id, function (info_visits, info_uniqvisitors, data) {


            fill_row(jrow, cur_profile_id, info_visits, info_uniqvisitors, 0, 0, 0, 0, 0);
            checkFullyFilled();

        }, function (data) {

            logg('m_realtime=' + data);
            goOffline();
            checkFullyFilled();
        });


    } else {

        FillAllRows(jrow,cur_profile_id);
    }

}


function removeLastSlash(str){

    if(str.charAt(str.length-1)=="/") {
        str = str.substring(0, str.length - 1);
    }
    return str;
}

function eliminateDuplicates(arr) {
    var i,
        len = arr.length,
        out = [],
        obj = {};

    for (i = 0; i < len; i++) {
        obj[arr[i]] = 0;
    }
    for (i in obj) {
        out.push(i);
    }
    return out;
}


function SaveStorage(key, storageVal, log) {
    if (typeof(log) != "undefined" && log == true) {
        _gaq.push(['_trackEvent', key, storageVal]);
    }
    if (typeof(storageVal) != "undefined") {

        var type = typeof(storageVal);

        if (type != "string" && type != "object") {

            console.log("Saving to storage: " + key + " type " + typeof(storageVal) + " = ");
        }

        switch (typeof(storageVal)) {
            case "object":
                var storageValString = JSON.stringify(storageVal);
                //console.log(storageValString);

                localStorage[key] = storageValString;
                return storageVal;

                break;
            case "boolean":
                var storageValString = storageVal;
                console.log(storageValString);
                localStorage[key] = storageValString;
                return storageVal;

                break;
            default:
                localStorage[key] = storageVal;
                //console.log(storageVal);
                return localStorage[key];

                break;

        }


    } else {
        //console.log("NOT Saving to storage: " + key + " = " + showAds);
        return storageVal;
    }
}

function LoadStorage(key, type, def) {

    if (typeof(type) == "undefined") {
        type = "string";
    }


    var storageVal = localStorage[key];
    switch (type) {
        case "bool":

            if (typeof(def) == "undefined") {
                def = true;
            }

            if (!storageVal) {
                storageVal = def;
            }
            if (typeof storageVal == 'string' && storageVal == 'false') {
                storageVal = false;
            } else {
                storageVal = true;
            }

            //console.log("Getting :" + key + " = " + storageVal);
            break;
        case "string":

            if (typeof(def) == "undefined") {
                def = "";
            }


            if (!storageVal) {
                storageVal = def;
            }
            break;
        case "json":
            if (storageVal != undefined) {
                //console.log("Json parse" + storageVal);
                storageVal = JSON.parse(storageVal);
            } else {
                storageVal = new Array();
            }
            break;

    }

    return storageVal;


}


function checkAds() {

    if (showAds) {
        $('.ads').show();
        $('.not_ads').hide();
        $('.angryfarmer_small').show();
        $('.angryfarmer').show();
        $('.steamdefense_small').show();
        $('.steamdefense').show();
    } else {
        $('.ads').hide();
        $('.not_ads').show();
        $('.angryfarmer_small').hide();
        $('.angryfarmer').hide();
        $('.steamdefense_small').hide();
        $('.steamdefense').hide();
    }


    if (showSocial) {
        $('.socialTop').show();
        $('.facebook-social').attr("src", $('.facebook-social').data("src"));
        $('.plusone-social').addClass("g-plusone");
    } else {
        $('.socialTop').remove();
    }
}

function getAllFavProfiles() {
    var tr_all_fav_array = new Array();
    for (var i_profile_id2 in favouriteProfiles) {
        var i_profile_id = favouriteProfiles[i_profile_id2];
        if (profile_parents[i_profile_id] == account_id || account_id == 'all') {
            tr_all_fav_array.push(i_profile_id);
        }
    }
    return tr_all_fav_array;
}
function getAllFavSearchProfiles(searchValueText) {
    var tr_array = new Array();
    for (var favKey in favouriteProfiles) {
        var i_profile_id = favouriteProfiles[favKey];

        if (profile_name_array[i_profile_id] != undefined) {
            console.log(profile_search_array[i_profile_id]);
            if (substrFound(profile_search_array[i_profile_id], searchValueText)) {
                tr_array.push(i_profile_id);
            }
        }
    }
    return tr_array;
}

function getAllProfiles() {
    var tr_array = new Array();
    for (var i_profile_id in profile_name_array) {
        if (profile_parents[i_profile_id] == account_id || account_id == 'all') {
            tr_array.push(i_profile_id);
        }
    }
    return tr_array;
}


function getAllSearchProfiles(searchValue) {
    var tr_array = new Array();
    for (var i_profile_id in profile_name_array) {
        if (substrFound(profile_search_array[i_profile_id], searchValue)) {
            tr_array.push(i_profile_id);
        }
    }
    return tr_array;
}
function init_popup() {


    var $profilestablelist = $("#profiles_table_list");
    if ($profilestablelist.length == 0) {
        if ($("#edit_profile").length > 0) {
            init_options();
        }
        return;
    }


    if (onlyFav) {
        $('#favToggleFav').addClass("favToggleActive");
        $('#favToggleAll').removeClass("favToggleActive");
    } else {
        $('#favToggleAll').addClass("favToggleActive");
        $('#favToggleFav').removeClass("favToggleActive");
    }


    if (isExtension()) {
        $('.extenstionInfo').hide();
    }
    _gaq.push(['_trackEvent', 'init_popup', 'clicked']);


    $('.headerSortDown').removeClass('headerSortDown');
    $('.headerSortUp').removeClass('headerSortUp');

    $('#loading_table_profiles').show();
    $('#loading_new_account_table').show();
    $profilestablelist.html('');


    $('#total_visits').html('0');
    $('#total_uniqvisitors').html('0');
    $('#total_pageviews').html('0');
    $('#total_averagepageviews').html('0');
    $('#total_timeonsite').html('00:00:00');
    $('#total_bounce').html('0%');
    $('#total_newvisits').html('0%');


    $('#avg_visits').html('0');
    $('#avg_uniqvisitors').html('0');
    $('#avg_pageviews').html('0');
    $('#avg_averagepageviews').html('0');
    $('#avg_timeonsite').html('00:00:00');
    $('#avg_bounce').html('0%');
    $('#avg_newvisits').html('0%');

    checkAds();

    if (!show_footer) {
        $('#total_row').hide();
        $('#avg_row').hide();
        $('#bottom_footer_row').show();
    } else {
        $('#bottom_footer_row').hide();
        $('#total_row').show();
        $('#avg_row').show();
    }


    $("#customInfo").hide();

    adjustTableVars();
    // return false;
    adjustTable('init_popup_start');


    getAccountProfiles(PrepareTable);
}


function substrFound(string, word) {
    var n = string.toLowerCase().indexOf(word.toLowerCase());
    return (n >= 0);
}

function insert_rows_to_popup(tr_array) {


    var favorited_tr = '';
    var nonfavorited_tr = '';


    //console.log("Sdelatj proverku na to, 4tobi pokazivalisj toka nuzhnije favoriti!");
//tr_array=sortObj(tr_array);

    //alert(tr_array.length);
    if (tr_array.length > 0) {
        for (var numb in tr_array) {
            var key = tr_array[numb];
            var val = 'Loading...';

            if (profile_name_array[key] != undefined) {
                val = profile_name_array[key] + " " + profile_tracking_code[key];
            }
            var favico = '';
                            var trclass = '';
            if (findfavourite(key)) {
                 favico = '<a href="#" data-profileid="' + key + '" class="starred_icon"></a>';
                 trclass = 'favorited';
            } else {
                 favico = '<a href="#" data-profileid="' + key + '" class="unstarred_icon"></a>';
                 trclass = '';
            }
            var radiobox = '<input id="profile_id_radio_' + key + '" class="save_options_radio" data-key="' + key + '" data-picked_account_id="' + account_id + '" type="radio" name="profile_id_radio" value="' + key + '"';
            if (key == profile_id) {
                radiobox += ' checked="checked" ';
            }
            radiobox += '/>';

            var reportingurl='';
            if (profile_data[key]["app"]) {
                switch (date_range) {
                    case '7days':
                         reportingurl = 'https://analytics.google.com/analytics/web/#report/app-visitors-overview/' + key + '/' + escape('?_.date00=' + weekagotoday + '&_.date01=' + today + '/');
                        break;
                    case 'today':
                         reportingurl = 'https://analytics.google.com/analytics/web/#report/app-visitors-overview/' + key + '/' + escape('?_.date00=' + today + '&_.date01=' + today + '/');
                        break;
                    case 'realtime':
                         reportingurl = 'https://analytics.google.com/analytics/web/#realtime/rt-app-overview/' + key + '/';
                        break;
                    case '30days':
                    default:
                         reportingurl = 'https://analytics.google.com/analytics/web/#report/app-visitors-overview/' + key + '/' + escape('?_.date00=' + monthagotoday + '&_.date01=' + today + '/');
                        break;
                }

            } else {
                switch (date_range) {
                    case '7days':
                         reportingurl = 'https://analytics.google.com/analytics/web/#report/visitors-overview/' + key + '/' + escape('?_.date00=' + weekagotoday + '&_.date01=' + today + '/');
                        break;
                    case 'today':
                         reportingurl = 'https://analytics.google.com/analytics/web/#report/visitors-overview/' + key + '/' + escape('?_.date00=' + today + '&_.date01=' + today + '/');
                        break;
                    case 'realtime':
                         reportingurl = 'https://analytics.google.com/analytics/web/#realtime/rt-overview/' + key + '/';
                        break;
                    case '30days':
                    default:
                         reportingurl = 'https://analytics.google.com/analytics/web/#report/visitors-overview/' + key + '/' + escape('?_.date00=' + monthagotoday + '&_.date01=' + today + '/');
                        break;
                }

            }


            var profileurl = 'https://analytics.google.com/analytics/web/#management/Profile/' + key + '/%3FpropertyComposite-profilesTab-profilesComposite.tabId%3DeditProfile%26profile.tabId%3DeditProfile/';
            var propertyurl = 'https://analytics.google.com/analytics/web/#management/Property/' + key + '/%3FpropertyComposite.tabId%3DpropertySettingsTab/';
            var accounturl = 'https://analytics.google.com/analytics/web/#management/Account/' + key + '/%3FaccountComposite.tabId%3DeditAccountSettings/';


            var appicon = "";
            if (profile_data[key]["app"] == true) {
                appicon = "<span class='app'></span>";
            }


            var another_tr = '<tr class="' + trclass + '" rel_profile="' + key + '">' +
                '<td class="value profile_name" align="left"><div>' +
                '<a title="Edit" class="edit_icon" target="_blank" href="' + profileurl + '"><img src="../img/pencil_icon.gif"></a>' +
                ((profile_url_array[key] == '-') ? '' : '<a target="_blank" title="Go to: ' + profile_url_array[key] + '" class="url_icon" target="_blank" href="' + profile_url_array[key] + '"><img src="../img/web_profile.png"></a>') +
                '<a title="Show graph" class="graph_icon" target="_blank" hhref="' + reportingurl + '" data-profileid="' + key + '" data-token="' + googleToken + '"><img src="../img/line_graph.png"></a>' +
                '<div class="profile_name_div">' + favico + '' + radiobox + '<a class="info_name" title="' + val + '" target="_blank" href="' + reportingurl + '">' + appicon + '' + profile_name_array[key] + " <span>" + profile_tracking_code[key] + "</span>" + '</a></div>' +
                '</div></td>' +

                '<td class="value info_visits td-radio" align="left"><div class="loading_cell">' + getProfileData(key, "visits") + '</div></td>' +
                '<td class="value info_uniqvisitors td-radio" align="left"><div class="loading_cell">&nbsp;</div></td>' +
                '<td class="value info_pageviews td-radio" align="left"><div class="loading_cell">&nbsp;</div></td>' +
                '<td class="value info_averagepageviews td-radio" align="left"><div class="loading_cell">&nbsp;</div></td>' +
                '<td class="value info_timeonsite td-radio" align="left"><div class="loading_cell">' + getProfileData(key, "timeonsite") + '</div></td>' +
                '<td class="value info_bounce td-radio" align="left"><div class="loading_cell">' + getProfileData(key, "bounce") + '</div></td>' +
                '<td class="value info_newvisits td-radio" align="left"><div class="loading_cell">&nbsp;</div></td>' +
                //'<td class="value info_conversion td-radio" align="left"><div class="loading_cell">'+profile_data[key]["conversion"]+'</div></td>' +
                "</tr>"


            if (findfavourite(key)) {
                favorited_tr += another_tr;
            } else {
                nonfavorited_tr += another_tr;
            }

        }

        $("#loading_table_profiles").hide();
        var $profilestablelist = $("#profiles_table_list");
        $profilestablelist.append(favorited_tr);
        $profilestablelist.append(nonfavorited_tr);
        adjustTable('insert_rows_to_popup');


        var $trs = $profilestablelist.find('tr');
        SetFullyFilled($trs.length);
        $trs.each(function () {
            //alert($(this).attr('rel_profile'));
            if (typeof($(this).attr('rel_profile')) != "undefined") {
                fill_info($(this).attr('rel_profile'), this);
            }
        });

        $('tr[rel_profile=' + profile_id + ']').addClass('selected_tr');

    } else {
        AddCustomRowToTable("NoProfilesFound", "info_uniqvisitors");
        $("#loading_table_profiles").hide();
        $("#loading_new_account_table").hide();
        adjustTable('insert_rows_to_popup');
    }
}

function AddCustomRowToTable(TransKey, TdClass) {
    //"NoProfilesFound"
    //info_uniqvisitors
    //var another_tr = '<tr><td class="value ' + TdClass + '" colspan=20 align="left">' + get_trans(TransKey, false) + '</td></tr>';
    var innerHtml='<span class="starred_icon"></span>' + get_trans(TransKey, false) + '';
    var another_tr = '<div id="customInfo" class="' + TdClass + '">'+innerHtml+'</div>';

    if($("#customInfo").length==0) {
        $("#googleAccChange").after(another_tr);
    } else {
        $("#customInfo").html(innerHtml);
    }
    $("#customInfo").show();
    adjustTableVars();
    adjustTable("addedInfoRow");
    //$("#profiles_table_list").append(another_tr);
}


function getProfileData(profileKey, metric) {
    if (typeof(profile_data[profileKey]) != "undefined") {
        return profile_data[profileKey][metric];
    } else {
        console.log("Undefined metric" + metric + " for profile: " + profileKey)
        return "0";
    }
}

var totalTr = 0;
function SetFullyFilled(total) {
    totalTr = total;
}

function checkFullyFilled() {
    totalTr--;
    if (totalTr == 0) {
        updateAdjustRows();
        adjustTable("checkFullyFilled")
    }
}


function save_options_radio(prof_id, acc_id) {
    _gaq.push(['_trackEvent', 'save_options_radio', 'clicked']);

    SetPickedAccountId(acc_id);
    google_id = SaveStorage("google_id", $('#googleAcc').html());
    profile_id = SaveStorage("profile_id", prof_id);
    profile_name = SaveStorage("profile_name", profile_name_array[prof_id]);


    $('tr.selected_tr').removeClass('selected_tr');
    $('tr[rel_profile=' + prof_id + ']').addClass('selected_tr');

    $('#loading_new_account_table').show();
    setTimeout(function () {
        $('#loading_new_account_table').hide();
    }, 550);
    checkRatio();
}

function save_options() {
    _gaq.push(['_trackEvent', 'save_options', 'clicked']);


    google_id = SaveStorage("google_id", $('#googleAcc').html());
    display_id = SaveStorage("display_id", $('#display_id').val());
    update_interval = SaveStorage("update_interval", $('#update_interval').val());
    date_range = SaveStorage("date_range", $('#date_range').val());
    showAds = SaveStorage("showAds", $('#show_ads').is(':checked'), true);
    showSocial = SaveStorage("showSocial", $('#show_social').is(':checked'), true);
    show_propertynames = SaveStorage("show_propertynames", $('#show_propertynames').is(':checked'), true);
    show_footer = SaveStorage("show_footer", $('#show_footer').is(':checked'), true);


    $('#status').show().html(chrome.i18n.getMessage("saved"));
    setTimeout(function () {
        $('#status').hide('slow');
    }, 150);

    checkRatio();
}


function get_trans(translation_id, document_write) {
    if (document_write == undefined) {
        document_write = true;
    }
    if (document_write) {
        document.write(chrome.i18n.getMessage(translation_id));
    } else {
        return chrome.i18n.getMessage(translation_id);
    }
    return "";
}

function edit_account() {
    document.location.href = "https://analytics.google.com/analytics/settings/edit_account?scid=" + $("#account_id").val();
}
function edit_profile() {
    document.location.href = "https://analytics.google.com/analytics/settings/edit_profile?id=" + $("#profile_id").val();
}

function SetPickedAccountId(new_picked_account_id) {
    if (new_picked_account_id == undefined) {
        new_picked_account_id = account_id;
    }
    account_id = new_picked_account_id;
    SaveStorage('account_id', account_id);

}
function init_options() {
    if (!isExtension()) {
        $('#row_update_interval').hide();
        $('#row_display_id').hide();
    }
    checkAds();
    getAccountProfiles(prepareOptions);

}


function getHtml(jObject){
    if(typeof(jObject)==='undefined') {
        return '';
    }
    var script_contents = $(jObject).html();
    if(typeof(script_contents)==='undefined') {
        return '';
    }
    return script_contents;
}


function prepareOptions(data) {
    _gaq.push(['_trackEvent', 'init_options', 'clicked']);
     //console.log("data"+data);


    var window_header = undefined;
    //$('#texta').val(data);
    var account_options = $(data);


    account_options.each(function () {
        var script_contents = getHtml(this);

        if ((script_contents.split('"token":{"value":"').length - 1) > 0) {
            googleToken = script_contents.split('"token":{"value":"')[1].split('","valid"')[0];
        }


        if ((script_contents.split('ga.webanalytics.header.setHeaderInfo').length - 1) > 0) {
            script_contents = script_contents.split('ga.webanalytics.header.main();').join('');
            script_contents = script_contents.split('ga.webanalytics.header.setHeaderInfo').join('window_header = ');
            script_contents = script_contents.split(');')[0];
            script_contents = script_contents.split('window_header = (')[1];
            window_header = JSON.parse(script_contents);
        }

    });


    if (typeof googleToken == 'undefined') {
        $('#loading_profile').html('<a href="https://analytics.google.com/analytics/web/" target="_blank">' + chrome.i18n.getMessage("loginToTheSystem") + '</a>');
        setTimeout(function () {
            init_options();
        }, 5000);
        return false;
    }

    if(typeof(window_header)!='undefined') {
        googleEmail = window_header.email;
    }
    if (googleEmail != '') {
        $('#googleAcc').html(googleEmail);
    }


    if (typeof profile_count_array[account_id] == 'undefined') {
        //TODO
        console.log("?")
        //account_id = window_preload.accounts[0].id;
    }


    $("#display_id").val(display_id);
    $("#update_interval").val(update_interval);
    $("#date_range").val(date_range);
    $("#show_ads").attr('checked', showAds);
    $("#show_social").attr('checked', showSocial);
    $("#show_propertynames").attr('checked', show_propertynames);
    $("#show_footer").attr('checked', show_footer);
    $("#onlyFav").attr('checked', onlyFav);


    $('#loading_profile').hide();

    $('#edit_profile').show();

    closeErrorPopup();

}


function openOptions() {
    chrome.tabs.create({'url': chrome.extension.getURL('options.html')}, function (tab) {
        // Tab opened.
    });
}
function openFull() {
    chrome.tabs.create({'url': chrome.extension.getURL('app.html')}, function (tab) {
        // Tab opened.
    });
}
