function window__s4Object() {
}

function _s4Object() {
}


e = chrome.browserAction;
var current_version = "0";


var googleToken = "";
var googleEmail = "";
var google_id = localStorage["google_id"];
var account_id = localStorage["account_id"];
var account_name = localStorage["account_name"];
var profile_id = localStorage["profile_id"];
var profile_name = localStorage["profile_name"];
var display_id = localStorage["display_id"];
var selected_period = localStorage["selected_period"];
var new_analytics = localStorage["new_analytics"];
var update_interval = localStorage["update_interval"];
var date_range = localStorage["date_range"];
var show_ads = localStorage["show_ads"];
var show_properynames = localStorage["show_properynames"];
//Cannot set booleans to localstorage :(
if (typeof show_ads == 'string' && show_ads == 'false') {
    show_ads = false;
} else {
    show_ads = true;
}
if (typeof show_properynames == 'string' && show_properynames == 'false') {
    show_properynames = false;
} else {
    show_properynames = true;
}
var show_footer = localStorage["show_footer"];
//Cannot set booleans to localstorage :(
if (typeof show_footer == 'string' && show_footer == 'false') {
    show_footer = false;
} else {
    show_footer = true;
}

var profile_data = new Array();
var profile_search_array = new Object();
var profile_name_array = new Object();
var property_name_array = new Object();
var property_url_array = new Object();
var profile_url_array = new Object();
var account_name_array = new Object();

var property_tracking_code = new Object();
var profile_tracking_code = new Object();
var property_parents = new Object();
var profile_parents = new Object();
var profile_count_array = new Object();
var property_count_array = new Object();
var searchValue = "";


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
}

$.ajaxSetup({ cache: false });
$.ajaxSetup({ async: true });


if (localStorage['favouriteProfiles'] != undefined) {
    var favouriteProfiles = JSON.parse(localStorage['favouriteProfiles']);
} else {
    var favouriteProfiles = new Array();
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addfavourite(starbutton, profile_id_to_fav, sync) {
    if (typeof(sync) == "undefined") {
        sync = true;
    }
    if (!findfavourite(profile_id_to_fav)) {
        favouriteProfiles.push(profile_id_to_fav);
    }
    localStorage['favouriteProfiles'] = JSON.stringify(favouriteProfiles);
    if (typeof(starbutton) == "object") {
        $(starbutton).addClass('starred_icon');
        $(starbutton).removeClass('unstarred_icon');
        $(starbutton).parent().parent().parent().parent().addClass('favorited');
    }
    if (sync) {
        $.ajax({
            url: "https://www.google.com/analytics/web/submitForm?key=" + profile_id_to_fav + "&entityName=profile&currentState=false&ds=a0w0p0&sid=starForm&hl=en_US&authuser=0",
            data: {token: googleToken},
            type: "POST",
            dataType: "json",
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            },
            success: function (data) {
            }
        });
    }

}
function removefavourite(starbutton, profile_id_to_fav, sync) {
    if (typeof(sync) == "undefined") {
        sync = true;
    }
    favouriteProfiles = jQuery.grep(favouriteProfiles, function (value) {
        return value != profile_id_to_fav;
    });
    localStorage['favouriteProfiles'] = JSON.stringify(favouriteProfiles);
    if (typeof(starbutton) == "object") {
        $(starbutton).addClass('unstarred_icon');
        $(starbutton).removeClass('starred_icon');
        $(starbutton).parent().parent().parent().parent().removeClass('favorited');
    }
    if (sync) {
        $.ajax({
            url: "https://www.google.com/analytics/web/submitForm?key=" + profile_id_to_fav + "&entityName=profile&currentState=true&ds=a0w0p0&sid=starForm&hl=en_US&authuser=0",
            data: {token: googleToken},
            type: "POST",
            dataType: "json",
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            },
            success: function (data) {
            }
        });
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
    google_id = localStorage["google_id"];
    if (!google_id) {
        google_id = '';
    }
    account_id = localStorage["account_id"];
    if (!account_id) {
        account_id = '';
    }
    account_name = localStorage["account_name"];
    if (!account_name) {
        account_name = 'Your Account';
    }
    profile_id = localStorage["profile_id"];
    if (!profile_id) {
        profile_id = '';
    }
    profile_name = localStorage["profile_name"];
    if (!profile_name) {
        profile_name = 'Your Website';
    }
    display_id = localStorage["display_id"];
    if (!display_id) {
        display_id = 'DisplayVisitsSummary';
    }

    selected_period = localStorage["selected_period"];
    if (!selected_period) {
        selected_period = 'day';
    }
    new_analytics = localStorage["new_analytics"];
    if (!new_analytics) {
        new_analytics = true;
    }
    update_interval = localStorage["update_interval"];
    if (!update_interval) {
        update_interval = 300000;
    }
    date_range = localStorage["date_range"];
    if (!date_range) {
        date_range = '30days';
    }
    show_ads = localStorage["show_ads"];
    if (!show_ads) {
        show_ads = true;
    }
    if (typeof show_ads == 'string' && show_ads == 'false') {
        show_ads = false;
    } else {
        show_ads = true;
    }
    show_properynames = localStorage["show_properynames"];
    if (!show_properynames) {
        show_properynames = true;
    }
    if (typeof show_properynames == 'string' && show_properynames == 'false') {
        show_properynames = false;
    } else {
        show_properynames = true;
    }
    show_footer = localStorage["show_footer"];
    if (!show_footer) {
        show_footer = true;
    }
    if (typeof show_footer == 'string' && show_footer == 'false') {
        show_footer = false;
    } else {
        show_footer = true;
    }
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

    localStorage["selected_period"] = newformat;
    selected_period = localStorage["selected_period"];
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
        e.setBadgeBackgroundColor({"color": [128, 128, 128, 128]});
        e.setIcon({path: "img/logo.offline.png"});
        e.setBadgeText({"text": "?"});
        e.setTitle({title: chrome.i18n.getMessage("loginToTheSystem")});
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
    //chrome.tabs.create({url: 'https://www.google.com/analytics/web/'});

    openErrorPopup();
    goOffline();
    $("#loading_new_account_table").hide();
    $('#googleAcc').html('<a href="https://www.google.com/analytics/web/" target="_blank">' + chrome.i18n.getMessage("loginToTheSystem") + '</a>');
    $('#loading_profile').html('<a href="https://www.google.com/analytics/web/" target="_blank">' + chrome.i18n.getMessage("loginToTheSystem") + '</a>');
    $('#loading_table_profiles td').html('<a href="https://www.google.com/analytics/web/" target="_blank">' + chrome.i18n.getMessage("loginToTheSystem") + '</a>');
    setTimeout(function () {
        //checkRatio();
        init_popup();
    }, 3000);
}

function logg(text) {
    console.log(text);
}


function getGoogleToken(onCompleteFunction) {


    $.ajax({
        url: "https://www.google.com/analytics/web/",
        data: '',
        method: 'get',
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
            logg('Error getting token');
            //goOffline();
            PleaseLogin();
            return false;
        },
        success: function (data) {
            //$('#texta').val(data);
            if ((data.split('window.preload').length - 1) > 0) {


                var account_options = $(data);
                account_options.each(function () {
                    var script_contents = $(this).html();

                    if ((script_contents.split('"token":{"value":"').length - 1) > 0) {
                        googleToken = script_contents.split('"token":{"value":"')[1].split('","valid"')[0];
                        //console.log(googleToken);
                        onCompleteFunction();
                    }

                });

            }
        }
    });
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
    localStorage["show_ads"] = true;
    if (isExtension()) {
        _gaq.push(['_trackEvent', 'Ext small version change', localStorage['version'] + ' - ' + current_version]);
    } else {
        _gaq.push(['_trackEvent', 'App small version change', localStorage['version'] + ' - ' + current_version]);
    }
}

function onUpdate() {
    console.log("Extension Updated");
    if (isExtension()) {
        _gaq.push(['_trackEvent', 'Ext version change', localStorage['version'] + ' - ' + current_version]);
        chrome.tabs.create({'url': 'http://mystatschecker.com/?updated=' + current_version + '&from=' + localStorage['version'] + '&type=ext'}, function (tab) {
        });
    } else {
        _gaq.push(['_trackEvent', 'App version change', localStorage['version'] + ' - ' + current_version]);
        chrome.tabs.create({'url': 'http://mystatschecker.com/?updated=' + current_version + '&from=' + localStorage['version'] + '&type=app'}, function (tab) {
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
    var prevVersion = localStorage['version'];


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
        localStorage['version'] = currVersion;
    }


    load_storage_variables();
    refreshdates();
    getGoogleToken(function () {





        //if(profile_id!=''){
        $.ajax({
            //url: "https://www.google.com/analytics/web/getAccountHeaders?accountIds=3109102%2C18564272%2C32556808%2C27199950%2C22089342%2C19234060%2C2040881%2C346332%2C1568495&_u.date00=" + oldtoday + "&_u.date01=" + today + "&homeAccountsTable-tableControl.searchTerm=&homeAccountsTable.viewType=FLAT&hl=en_US&authuser=0",
            //url:"https://www.google.com/analytics/web/getPage?homeAccountsTable-tableControl.searchTerm=&homeAccountsTable.viewType=HIERARCHICAL&id=home-page&cid=homeAccountsTable%2CtimestampMessage&hl=en_US&authuser=0",
            url: "https://www.google.com/analytics/web/getPage?_u.date00=" + oldtoday + "&_u.date01=" + today + "&homeAccountsTable-tableControl.searchTerm=&homeAccountsTable.viewType=FLAT&id=home-page&cid=homeAccountsTable%2CtimestampMessage&hl=en_US&authuser=0",
            data: {token: googleToken},
            type: "POST",
            dataType: "json",
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                logg('Error getting page!');
                //goOffline();
                PleaseLogin();
                return false;
            },
            success: function (data) {


                profile_name_array = new Object();
                profile_search_array = new Object();
                account_name_array = new Object();
                property_name_array = new Object();
                property_url_array = new Object();
                profile_url_array = new Object();
                for (var entityId in data.components[0].row) {
                    var entity = data.components[0].row[entityId]


                    if (entity.entityName == "account") {
                        account_name_array[entity.id] = entity.label;
                        profile_count_array[entity.id] = 0;
                        property_count_array[entity.id] = 0;
                    }
                    if (entity.entityName == "property") {
                        property_url_array[entity.id] = entity.value[1].toolTip;
                        entity.label = entity.label.replace('http://', '');
                        entity.label = entity.label.replace('https://', '');
                        property_name_array[entity.id] = entity.label;
                        property_count_array[entity.parentId]++;
                        property_parents[entity.id] = entity.parentId;
                        property_tracking_code[entity.id] = entity.value[1].jsonData.json.subTitle.text;
                    }
                    if (entity.entityName == "profile") {

                        profile_search_array[entity.id] = entity.label + " " + property_name_array[entity.parentId] + " " + property_url_array[entity.parentId] + " " + entity.value[1].jsonData.json.subTitle.text;

                        entity.label = entity.label.replace('http://', '');
                        entity.label = entity.label.replace('https://', '');


                        if (show_properynames && entity.label != property_name_array[entity.parentId]) {
                            if (
                                entity.label == "All Web Site Data" ||
                                    entity.label == "Все данные по веб-сайту"
                                ) {
                                profile_name_array[entity.id] = property_name_array[entity.parentId];
                            } else {
                                profile_name_array[entity.id] = entity.label + " (" + property_name_array[entity.parentId] + ")";
                            }
                        } else {
                            profile_name_array[entity.id] = entity.label;
                        }


                        profile_count_array[property_parents[entity.parentId]]++;
                        profile_parents[entity.id] = property_parents[entity.parentId];
                        profile_tracking_code[entity.id] = property_tracking_code[entity.parentId];
                        profile_url_array[entity.id] = property_url_array[entity.parentId];

                        profile_data[entity.id] = new Array();
                        profile_data[entity.id]["visits"] = 0;
                        profile_data[entity.id]["timeonsite"] = 0;
                        profile_data[entity.id]["bounce"] = 0;
                        profile_data[entity.id]["conversion"] = 0;

                        if (entity.starred == true) {
                            addfavourite('', entity.id, false);
                        } else {
                            removefavourite('', entity.id, false);
                        }


                        if (entity.value.length > 2) {
                            profile_data[entity.id]["visits"] = removecrap(entity.value[2].jsonData.json.data.formattedValue);
                            profile_data[entity.id]["timeonsite"] = removecrap(entity.value[3].jsonData.json.data.formattedValue);
                            profile_data[entity.id]["bounce"] = removecrap(entity.value[4].jsonData.json.data.formattedValue);
                            profile_data[entity.id]["conversion"] = removecrap(entity.value[5].jsonData.json.data.formattedValue);
                        }
                        //}
                        //break;

                    }

                }
                if (profile_id == "" || typeof profile_name_array[profile_id] == 'undefined') {
                    for (var k in profile_name_array) {
                        profile_id = k;
                        break
                    }
                }
                /*
                 logg("Found accounts:");
                 logg(account_name_array);
                 logg("Found properties:");
                 logg(property_name_array);
                 logg("Found profiles:");
                 logg(profile_name_array);
                 logg("My profile id:");
                 logg(profile_id);
                 logg("Property count in accounts:");
                 logg(property_count_array);
                 logg("Profile count in accounts:");
                 logg(profile_count_array);
                 */

                if (typeof(onCompleteFunction) != "undefined") {
                    onCompleteFunction();
                }

            }
        });
    });

}

function getRealtimeData(key, completeFunction, errorFunction) {
    $.ajax({
        url: "https://www.google.com/analytics/realtime/realtime/getData?key=" + key + "&ds=" + key + "&pageId=RealtimeReport/rt-overview&q=t:0|:1|:0:&hl=en_US",
        type: "GET",
        dataType: "json",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            errorFunction(textStatus);
        },
        success: function (data) {
            //console.log(data["t:0|:1|:0:"].metricTotals[0]);
            completeFunction(data["t:0|:1|:0:"].metricTotals[0] + "");
        }});
}


function getTodayData(key, completeFunction, errorFunction) {


    var url = "https://www.google.com/analytics/web/getPage?_u.date00=" + today + "&_u.date01=" + today + "&id=visitors-overview&ds=" + key + "&cid=overview%2CprofileExperiments%2CreportHeader%2CtimestampMessage&hl=en_US&authuser=0";
    $.ajax({
        url: url,
        type: "POST",
        data: "token=" + googleToken,
        cache: false,
        dataType: "json",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            errorFunction(textStatus);
        },
        success: function (data) {
            var jsonArray = data;
            var comp_nr = 1;
            if (jsonArray.components[0].id == 'overview')comp_nr = 0;


            for (var metric_key in jsonArray.components[comp_nr].sparkline.metricGroup) {
                var metric_val = jsonArray.components[comp_nr].sparkline.metricGroup[metric_key];
                var metric_value = removecrap(metric_val.group[0].line[0].value);

                switch (metric_val.metric.conceptName) {
                    case 'analytics.visits':
                        var info_visits = metric_value;
                        break;
                    case 'analytics.totalVisitors':
                        var info_uniqvisitors = metric_value;
                        break;
                    case 'analytics.pageviews':
                        var info_pageviews = metric_value;
                        break;
                    case 'analytics.avgPageviews':
                        var info_averagepageviews = metric_value;
                        break;
                    case 'analytics.avgSessionTime':
                        var info_timeonsite = metric_value;
                        break;
                    case 'analytics.bounceRate':
                        var info_bounce = metric_value;
                        break;
                    case 'analytics.percentNewVisits':
                        var info_newvisits = metric_value;
                        break;
                }
            }

            m_today = null;


            //alert(xmlData);
            //alert(($(xmlData).text()));
            //alert(removecrap($(xmlData).find('ProfileName').text()));
            //alert(removecrap($(xmlData).find('ItemSummary[id="VisitsSummary"]:first').text()));


            switch (display_id) {
                case 'DisplayVisitsSummary':
                    m_today = info_visits;
                    break;
                case 'DisplayVisitorsSummary':
                    m_today = info_uniqvisitors;
                    break;
                case 'DisplayPageviewsSummary':
                    m_today = info_pageviews;
                    break;
                case 'DisplayAvgPageviewsSummary':
                    m_today = info_averagepageviews;
                    break;
                case 'DisplayTimeOnSiteSummary':
                    m_today = info_timeonsite;
                    break;
                case 'DisplayBounceRateSummary':
                    m_today = info_bounce;
                    break;
                case 'DisplayNewVisitsSummary':
                    m_today = info_newvisits;
                    break;
                default:
                    m_today = null;
                    break;
            }

            completeFunction(m_today);
        }});
}


function checkRatio() {


    if (isExtension()) {
        e.setIcon({path: "img/spinner16.gif"});
    }

    getAccountProfiles(function () {


        if (display_id == "RealTime") {

            getRealtimeData(profile_id, function (badge_number) {

                profile_name = profile_name_array[profile_id];
                localStorage["profile_name"] = profile_name;

                if (isExtension()) {
                    e.setBadgeText({"text": badge_number});
                    e.setBadgeBackgroundColor({"color": [255, 127, 0, 255]});
                    e.setIcon({path: "img/logo.32.png"});
                    e.setTitle({title: chrome.i18n.getMessage("visitsToday", [badge_number, profile_name, get_trans('text' + display_id, false)])});
                }
            }, function (data) {

                logg('m_realtime=' + data);
                goOffline();
            });


        } else {

            getTodayData(profile_id, function (m_today) {

                profile_name = profile_name_array[profile_id];
                localStorage["profile_name"] = profile_name;


                if (m_today != null) {
                    m_today = removecrap(m_today);
                    m_today = m_today.replace(".", '');
                    //alert('-'+m_today+'-');
                    //alert('-'+m_today+'-');

                    var badge_number = '0';
                    if (m_today > 9999) {
                        var module = m_today / 1000;
                        badge_number = Math.floor(module) + 'K';
                    } else {
                        badge_number = m_today;
                    }

                    if (isExtension()) {
                        e.setBadgeText({"text": badge_number});
                        e.setBadgeBackgroundColor({"color": [255, 127, 0, 255]});
                        e.setIcon({path: "img/logo.32.png"});
                        e.setTitle({title: chrome.i18n.getMessage("visitsToday", [m_today, profile_name, get_trans('text' + display_id, false)])});
                    }

                }


            }, function (data) {

                logg('m_realtime=' + data);
                goOffline();
            });


            //var url = "https://www.google.com/analytics/web/getPage?_.date00=" + today + "&_.date01=" + today + "&id=visitors-overview&ds=" + profile_id + "&cid=reportHeader%2Coverview&hl=en_US";


        }


    });

}


var intervalID;
function init_background() {
    goOffline();

    checkRatio();


    clearInterval(intervalID);
    if (update_interval < 30000) {
        update_interval = 30000;
    }
    logg('init interval:' + update_interval);
    intervalID = setInterval(
        function () {
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

function hmsToSeconds(string) {
    R = /(.*):(.*):(.*)/
    var arr = string.match(R);
    return (arr[1] * 60 * 60 - (-arr[2] * 60) - (-arr[3]))
}

function adjustTable(txt) {


    if (show_ads) {
        $('.ads').show();
        $('.not_ads').hide();
        $('.angryfarmer_small').show();
        $('.angryfarmer').show();
    } else {
        $('.ads').hide();
        $('.not_ads').show();
        $('.angryfarmer_small').hide();
        $('.angryfarmer').hide();
    }

    if (!show_footer) {
        $('#total_row').hide();
        $('#avg_row').hide();
        $('#clone_footer').hide();
        $('#bottom_footer_row').show();
    } else {
        $('#bottom_footer_row').hide();

        $('#total_row').show();
        $('#avg_row').show();

    }
    //return true;
    $('#clone_header').hide().html('');
    if (show_footer)
        $('#clone_footer').hide().html('');

    $('#real_table thead').clone().appendTo('#clone_header');


    $('#clone_header').mousedown(function () {
        this.onselectstart = function () {
            return false
        };
    });

    if (show_footer)
        $('#real_table tfoot').clone().appendTo('#clone_footer');


    var numb = 1;
    $('#real_table thead th').each(function () {
        if (numb > 0) {
            if (numb == 1) {
                var forwidth = ($(this).width() + 1) + 'px';
            } else {
                var forwidth = ($(this).width()) + 'px';
            }
            $('#clone_header thead th:nth-child(' + numb + ')').css('width', forwidth);
        }
        numb++;
    })

    if (show_footer) {
        var numb = 1;
        $('#real_table tfoot tr:last-child td').each(function () {
            if (numb > 0) {
                if (numb == 1) {
                    var forwidth = ($(this).width() + 1) + 'px';
                } else {
                    var forwidth = ($(this).width()) + 'px';
                }
                $('#clone_footer tfoot tr:last-child td:nth-child(' + numb + ')').css('width', forwidth);
            }
            numb++;
        })
    }


    $('#clone_header th').bind("click", function (e) {
        var nr = $(this).index() + 1;
        $('#real_table thead th:nth-child(' + nr + ')').click();
    });

    $("#clone_header th .search_icon").bind('click', function (e) {
        $(".search_input").toggle();
        $(".profile_header").toggle();
        $("#clone_header th .search_input input").val("").focus();
        $("#real_table th .search_input input").val("");
        e.preventDefault();
        return false;
    });
    $("#clone_header th .search_input").bind('click', function (e) {
        e.preventDefault();
        return false;
    });
    $("#clone_header th .search_input input").change(function (e) {
        $("#real_table th .search_input input").val(this.value).change();
        e.preventDefault();
        return false;
    });


    $('#clone_header').css('width', $('#real_table').width() + 'px').show();
    if (show_footer)
        $('#clone_footer').css('width', $('#real_table').width() + 'px').css('margin-top', '-' + $('#clone_footer').height() + 'px').show();
    //alert('a '+txt);


}


jQuery.fn.fadeToggle = function (speed, easing, callback) {
    return this.animate({opacity: 'toggle'}, speed, easing, callback);
};


function toggleclones() {
    $('#clone_header').fadeToggle();
    $('#clone_footer').fadeToggle();


}


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


function showGraph(cur_profile_id, jrow, token) {


    if ($(jrow).parent().parent().parent().next().hasClass('chart_tr')) {
        $(jrow).parent().parent().parent().next().remove();
        adjustTable('graph_close');
        return true;
    } else {
        $(jrow).parent().parent().parent().after('<tr class="chart_tr"><td colspan="10"><div class="chart_div" id="chart_div_' + cur_profile_id + '">Loading chart...</div></td></tr>');
    }


    var dateArray = getDates(weekagocurrentTime, currentTime);


    var chart;
    var GraphName = '';
    var GraphSubName = '';
    var GraphSeries = new Array();


    var url = "https://www.google.com/analytics/web/getPage?_.date00=" + weekagotoday + "&_.date01=" + today + "&id=visitors-overview&ds=" + cur_profile_id + "&cid=reportHeader%2Coverview&hl=en_US";

    $.ajax({
        url: url,
        type: "POST",
        data: "token=" + googleToken,
        cache: false,
        beforeSend: function (xhr) {
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
        },
        success: function (data, textStatus, jqXHR) {
            var jsonArray = JSON.parse(data);


            var sparklineComponent = null;
            for (componentId in jsonArray.components) {

                if (typeof(jsonArray.components[componentId].sparkline) != 'undefined') {

                    sparklineComponent = jsonArray.components[componentId];
                    break;
                }

            }

            for (metricId in sparklineComponent.sparkline.metricGroup) {
                var currentMetric = sparklineComponent.sparkline.metricGroup[metricId];

                var metricName = currentMetric.metric.displayName + ' ' + currentMetric.groupName[0];
                var metricName2 = currentMetric.group[0].displayName + ' ' + currentMetric.group[0].groupId;
                var metricLine = currentMetric.group[0].line[0].point;


                /*
                 logg(metricName);
                 logg(metricName2);
                 logg(metricLine.length);
                 logg(metricLine);
                 */

                GraphName = currentMetric.group[0].displayName;
                GraphSubName = currentMetric.group[0].groupId;

                GraphSeries.push({
                    name: GraphName,
                    data: metricLine
                })


                break;


            }


            /**
             * Grid theme for Highcharts JS
             * @author Torstein Hønsi
             */

            Highcharts.theme = {
                colors: [
                    '#058dc7'],
                yAxis: {
                    gridLineColor: '#efefef',
                    gridLineWidth: 1

                },
                plotOptions: {
                    area: {
                        fillOpacity: 0.1,
                        lineWidth: 4,
                        marker: {
                            enabled: true,
                            radius: 6,
                            states: {
                                hover: {
                                    enabled: true,
                                    radius: 7
                                }
                            }
                        },
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 4
                            }
                        }
                    }
                }

            };

// Apply the theme
            var highchartsOptions = Highcharts.setOptions(Highcharts.theme);


            chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'chart_div_' + cur_profile_id + '',
                    type: 'area',
                    marginTop: 45,
                    marginLeft: 0,
                    marginRight: 0,
                    marginBottom: 30
                },
                title: {
                    text: GraphName,
                    x: -20 //center
                },
                subtitle: {
                    text: GraphSubName,
                    x: -20
                },
                xAxis: {
                    categories: dateArray
                },
                yAxis: {
                    title: {
                        text: GraphName
                    },
                    plotLines: [
                        {
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }
                    ]
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': <b>' + this.y + '</b>';
                    }
                },
                plotOptions: {
                    area: {
                        marker: {
                            enabled: true,
                            symbol: 'circle',
                            radius: 4,
                            states: {
                                hover: {
                                    enabled: true
                                }
                            }
                        }
                    }
                },

                legend: {
                    layout: 'horizontal',
                    align: 'left',
                    verticalAlign: 'top',
                    y: -10,
                    x: 10,
                    borderWidth: 0
                },


                series: GraphSeries
            });

            adjustTable('graph_open');

        }
    });


}


function fill_info(cur_profile_id, jrow, token) {


    var url = "https://www.google.com/analytics/web/getPage?_.date00=" + oldtoday + "&_.date01=" + today + "&id=visitors-overview&ds=" + cur_profile_id + "&cid=reportHeader%2Coverview&hl=en_US";

    $.ajax({
        url: url,
        type: "POST",
        data: "token=" + googleToken,
        cache: false,
        beforeSend: function (xhr) {
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
        },
        success: function (data, textStatus, jqXHR) {
            var jsonArray = JSON.parse(data);
            var comp_nr = 1;
            if (jsonArray.components[0].id == 'overview')comp_nr = 0;
            for (var metric_key in jsonArray.components[comp_nr].sparkline.metricGroup) {
                var metric_val = jsonArray.components[comp_nr].sparkline.metricGroup[metric_key];
                var metric_value = removecrap(metric_val.group[0].line[0].value);
                switch (metric_val.metric.conceptName) {
                    case 'analytics.visits':
                        var info_visits = metric_value;
                        break;
                    case 'analytics.totalVisitors':
                        var info_uniqvisitors = metric_value;
                        break;
                    case 'analytics.pageviews':
                        var info_pageviews = metric_value;
                        break;
                    case 'analytics.avgPageviews':
                        var info_averagepageviews = metric_value;
                        break;
                    case 'analytics.avgSessionTime':
                        var info_timeonsite = metric_value;
                        break;
                    case 'analytics.bounceRate':
                        var info_bounce = metric_value;
                        break;
                    case 'analytics.percentNewVisits':
                        var info_newvisits = metric_value;
                        break;
                }
            }
            $('.info_name', jrow).html(profile_name_array[cur_profile_id] + " <span>" + profile_tracking_code[cur_profile_id] + "</span>");
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
            adjustTable('fillinfo');
        }
    });


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


function init_popup(picked_account_id) {


    if (isExtension()) {
        $('.extenstionInfo').hide();
    }
    _gaq.push(['_trackEvent', 'init_popup', 'clicked']);


    $('#clone_header').html('');
    $('#clone_footer').html('');

    $('.headerSortDown').removeClass('headerSortDown');
    $('.headerSortUp').removeClass('headerSortUp');

    $('#loading_table_profiles').show();
    $('#loading_new_account_table').show();
    $("#profiles_table_list").html('');


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


    // return false;
    adjustTable('init_popup start');


    getAccountProfiles(function () {
        //alert(picked_account_id);
        if (picked_account_id == undefined) {
            if (findfavourite(profile_id)) {
                picked_account_id = 'favorited';
            } else {
                picked_account_id = account_id;
            }
        }


        $.ajax({
            url: "https://www.google.com/analytics/web/",
            data: '',
            method: 'get',
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                PleaseLogin();
                return false;
            },
            success: function (data) {


                var window_preload = undefined;
                var window_header = undefined;
                //$('#texta').val(data);
                var account_options = $(data);
                account_options.each(function () {
                    var script_contents = $(this).html();

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
                    PleaseLogin();
                    return false;
                }

                $("#account_id").html('');

                for (var i_account_id in account_name_array) {
                    var i_account_name = account_name_array[i_account_id];


                    var i_selected_option = '';
                    if (i_account_id == picked_account_id) {
                        i_selected_option = 'selected="selected"';
                    }

                    $("#account_id").append(
                        '<option ' + i_selected_option +
                            ' value="' + i_account_id +
                            '">' +
                            i_account_name +
                            "</option>"
                    );
                    if (picked_account_id == '')picked_account_id = i_account_id;
                }

                //alert(favouriteProfiles);
                var favouriteProfiles2 = favouriteProfiles;
                for (var fprofile_key in favouriteProfiles) {
                    var fprofile_val = favouriteProfiles[fprofile_key];
                    if (typeof profile_parents[fprofile_val] == 'undefined') {
                        favouriteProfiles2 = jQuery.grep(favouriteProfiles2, function (value) {
                            return value != fprofile_val;
                        });
                    }
                }
                favouriteProfiles = eliminateDuplicates(favouriteProfiles2);


                var selected_option = '';
                if ('favorited' == picked_account_id) {
                    selected_option = 'selected="selected"';
                }

                $("#account_id").append(
                    '<option class="option_fav" ' +
                        selected_option +
                        ' value="favorited">&lowast; ' + get_trans('favoritedProfiles', false) + '</option>'
                );
                var selected_option = '';
                if ('all' == picked_account_id) {
                    selected_option = 'selected="selected"';
                }
                $("#account_id").append(
                    '<option class="option_fav" ' +
                        selected_option +
                        ' value="all">&lowast; ' + get_trans('allProfiles', false) + '</option>'
                );


                googleEmail = window_header.email;
                if (googleEmail != '') {
                    $('#googleAcc').html(googleEmail);
                }


                if (searchValue == "") {


                    if (picked_account_id != 'favorited') {

                        //if (picked_account_id != 'all')
                        /*  if (typeof profile_count_array[picked_account_id] == 'undefined') {
                         picked_account_id = window_preload.accounts[0].id;
                         }
                         */
                        //alert(profile_count_array[picked_account_id]);

                        var tr_array = new Array();

                        for (var i_profile_id in profile_name_array) {
                            if (profile_parents[i_profile_id] == picked_account_id || picked_account_id == 'all') {
                                tr_array.push(i_profile_id);
                            }
                        }
                        insert_rows_to_popup(tr_array, picked_account_id);
                    } else {
                        insert_rows_to_popup(favouriteProfiles, picked_account_id);
                    }

                } else {


                    if (picked_account_id != 'favorited') {
                        var tr_array = new Array();

                        for (var i_profile_id in profile_name_array) {
                            if (substrFound(profile_search_array[i_profile_id], searchValue)) {
                                tr_array.push(i_profile_id);
                            }
                        }
                        insert_rows_to_popup(tr_array, picked_account_id);
                    } else {

                        var tr_array = new Array();


                        for (var favKey in favouriteProfiles) {
                            i_profile_id=favouriteProfiles[favKey];

                            if(profile_name_array[i_profile_id]!=undefined){

                                console.log(profile_search_array[i_profile_id]);
                                if (substrFound(profile_search_array[i_profile_id], searchValue)) {
                                    tr_array.push(i_profile_id);
                                }
                            }
                        }

                        insert_rows_to_popup(tr_array, picked_account_id);
                    }


                }
                closeErrorPopup();


            }
        });

    });
}
function substrFound(string, word) {
    var n=string.toLowerCase().indexOf(word.toLowerCase());
    return (n>=0);
}

function insert_rows_to_popup(tr_array, picked_account_id) {
    var favorited_tr = '';
    var nonfavorited_tr = '';

//tr_array=sortObj(tr_array);

    //alert(tr_array.length);
    if (tr_array.length > 0) {
        for (var numb in tr_array) {
            var key = tr_array[numb];
            var val = 'Loading...';

            if (profile_name_array[key] != undefined) {
                val = profile_name_array[key] + " " + profile_tracking_code[key];
            }
            if (findfavourite(key)) {
                var favico = '<a href="#" data-profileid="' + key + '" class="starred_icon"></a>';
                var trclass = 'favorited';
            } else {
                var favico = '<a href="#" data-profileid="' + key + '" class="unstarred_icon"></a>';
                var trclass = '';
            }
            var radiobox = '<input id="profile_id_radio_' + key + '" class="save_options_radio" data-key="' + key + '" data-picked_account_id="' + picked_account_id + '" type="radio" name="profile_id_radio" value="' + key + '"';
            if (key == profile_id) {
                radiobox += ' checked="checked" ';
            }
            radiobox += '/>';


            switch (date_range) {
                case '7days':
                    var reportingurl = 'https://www.google.com/analytics/web/#report/visitors-overview/' + key + '/' + escape('?_.date00=' + weekagotoday + '&_.date01=' + today + '/');
                    break;
                case 'today':
                    var reportingurl = 'https://www.google.com/analytics/web/#report/visitors-overview/' + key + '/' + escape('?_.date00=' + today + '&_.date01=' + today + '/');
                    break;
                case 'realtime':
                    var reportingurl = 'https://www.google.com/analytics/web/#realtime/rt-overview/' + key + '/';
                    break;
                case '30days':
                default:
                    var reportingurl = 'https://www.google.com/analytics/web/#report/visitors-overview/' + key + '/' + escape('?_.date00=' + monthagotoday + '&_.date01=' + today + '/');
                    break;


            }


            var profileurl = 'https://www.google.com/analytics/web/#management/Profile/' + key + '/%3FpropertyComposite-profilesTab-profilesComposite.tabId%3DeditProfile%26profile.tabId%3DeditProfile/';
            var propertyurl = 'https://www.google.com/analytics/web/#management/Property/' + key + '/%3FpropertyComposite.tabId%3DpropertySettingsTab/';
            var accounturl = 'https://www.google.com/analytics/web/#management/Account/' + key + '/%3FaccountComposite.tabId%3DeditAccountSettings/';


            var another_tr = '<tr class="' + trclass + '" rel_profile="' + key + '">' +
                '<td class="value profile_name" align="left"><div>' +
                '<a title="Edit" class="edit_icon" target="_blank" href="' + profileurl + '"><img src="../img/pencil_icon.gif"></a>' +
                ((profile_url_array[key] == '-') ? '' : '<a target="_blank" title="Go to: ' + profile_url_array[key] + '" class="url_icon" target="_blank" href="' + profile_url_array[key] + '"><img src="../img/web_profile.png"></a>') +
                '<a title="Show graph" class="graph_icon" target="_blank" hhref="' + reportingurl + '" data-profileid="' + key + '" data-token="' + googleToken + '"><img src="../img/line_graph.png"></a>' +
                '<div class="profile_name_div">' + favico + '' + radiobox + '<a class="info_name" title="' + val + '" target="_blank" href="' + reportingurl + '">' + profile_name_array[key] + " <span>" + profile_tracking_code[key] + "</span>" + '</a></div>' +
                '</div></td>' +

                '<td class="value info_visits td-radio" align="left"><div class="loading_cell">' + profile_data[key]["visits"] + '</div></td>' +
                '<td class="value info_uniqvisitors td-radio" align="left"><div class="loading_cell">&nbsp;</div></td>' +
                '<td class="value info_pageviews td-radio" align="left"><div class="loading_cell">&nbsp;</div></td>' +
                '<td class="value info_averagepageviews td-radio" align="left"><div class="loading_cell">&nbsp;</div></td>' +
                '<td class="value info_timeonsite td-radio" align="left"><div class="loading_cell">' + profile_data[key]["timeonsite"] + '</div></td>' +
                '<td class="value info_bounce td-radio" align="left"><div class="loading_cell">' + profile_data[key]["bounce"] + '</div></td>' +
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
        $("#profiles_table_list").append(favorited_tr);
        $("#profiles_table_list").append(nonfavorited_tr);
        adjustTable('insert_rows_to_popup');


        $("#profiles_table_list").find('tr').each(function () {
            //alert($(this).attr('rel_profile'));
            fill_info($(this).attr('rel_profile'), this);
        });

        $('tr[rel_profile=' + profile_id + ']').addClass('selected_tr');

    } else {


        var another_tr = '<tr><td class="value info_uniqvisitors" colspan=20 align="left">Empty</td>' +
            "</tr>";
        $("#profiles_table_list").append(another_tr);
        $("#loading_table_profiles").hide();
        $("#loading_new_account_table").hide();
        adjustTable('insert_rows_to_popup');
    }
}


function save_options_radio(prof_id, acc_id) {
    _gaq.push(['_trackEvent', 'save_options_radio', 'clicked']);

    localStorage["google_id"] = $('#googleAcc').html();
    if (acc_id != 'favorited')
        localStorage["account_id"] = acc_id;
    localStorage["profile_id"] = prof_id;
    localStorage["profile_name"] = profile_name_array[prof_id];
    google_id = localStorage["google_id"];
    account_id = localStorage["account_id"];
    profile_id = localStorage["profile_id"];
    profile_name = localStorage["profile_name"];


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

    localStorage["google_id"] = $('#googleAcc').html();
    localStorage["account_id"] = $('#account_id').val();
    localStorage["account_name"] = $('#account_id').find('option:selected').html();
    localStorage["profile_id"] = $('#profile_id').val();
    localStorage["profile_name"] = $('#profile_id').find('option:selected').html();
    localStorage["display_id"] = $('#display_id').val();
    localStorage["update_interval"] = $('#update_interval').val();
    localStorage["date_range"] = $('#date_range').val();
    if ($('#show_ads').attr('checked') == 'checked') {
        _gaq.push(['_trackEvent', 'show_ads', 'true']);
        localStorage["show_ads"] = true;
    } else {
        _gaq.push(['_trackEvent', 'show_ads', 'false']);
        localStorage["show_ads"] = false;
    }
    if ($('#show_properynames').attr('checked') == 'checked') {
        _gaq.push(['_trackEvent', 'show_properynames', 'true']);
        localStorage["show_properynames"] = true;
    } else {
        _gaq.push(['_trackEvent', 'show_properynames', 'false']);
        localStorage["show_properynames"] = false;
    }
    if ($('#show_footer').attr('checked') == 'checked') {
        _gaq.push(['_trackEvent', 'show_footer', 'true']);
        localStorage["show_footer"] = true;
    } else {
        _gaq.push(['_trackEvent', 'show_footer', 'false']);
        localStorage["show_footer"] = false;
    }
    //alert($('#show_ads').attr('checked')+localStorage["show_ads"]);
    google_id = localStorage["google_id"];
    account_id = localStorage["account_id"];
    account_name = localStorage["account_name"];
    profile_id = localStorage["profile_id"];
    profile_name = localStorage["profile_name"];
    display_id = localStorage["display_id"];
    show_ads = localStorage["show_ads"];
    if (typeof show_ads == 'string' && show_ads == 'false') {
        show_ads = false;
    } else {
        show_ads = true;
    }
    show_properynames = localStorage["show_properynames"];
    if (typeof show_properynames == 'string' && show_properynames == 'false') {
        show_properynames = false;
    } else {
        show_properynames = true;
    }
    show_footer = localStorage["show_footer"];
    if (typeof show_footer == 'string' && show_footer == 'false') {
        show_footer = false;
    } else {
        show_footer = true;
    }
    $('#status').show();
    $('#status').html(chrome.i18n.getMessage("saved"));
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
}

function edit_account() {
    document.location.href = "https://www.google.com/analytics/settings/edit_account?scid=" + $("#account_id").val();
}
function edit_profile() {
    document.location.href = "https://www.google.com/analytics/settings/edit_profile?id=" + $("#profile_id").val();
}


function init_options(picked_account_id) {
    if (!isExtension()) {
        $('#row_update_interval').hide();
        $('#row_display_id').hide();
    }

    getAccountProfiles(function () {
        _gaq.push(['_trackEvent', 'init_options', 'clicked']);

        //alert(picked_account_id);
        if (picked_account_id == undefined) {
            picked_account_id = account_id;
        }


        $('#loading_profile_id').show();
        $.ajax({
            url: "https://www.google.com/analytics/web/",
            data: '',
            method: 'get',
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('#loading_profile').html('<a href="https://www.google.com/analytics/web/" target="_blank">' + chrome.i18n.getMessage("loginToTheSystem") + '</a>');
                setTimeout(function () {
                    init_options();
                }, 5000);
                return false;
            },
            success: function (data) {

                var window_preload = undefined;
                var window_header = undefined;
                //$('#texta').val(data);
                var account_options = $(data);
                account_options.each(function () {
                    var script_contents = $(this).html();

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
                    $('#loading_profile').html('<a href="https://www.google.com/analytics/web/" target="_blank">' + chrome.i18n.getMessage("loginToTheSystem") + '</a>');
                    setTimeout(function () {
                        init_options();
                    }, 5000);
                    return false;
                }

                $("#account_id").html('');
                $("#profile_id").html('');

                for (var i_account_id in account_name_array) {
                    var i_account_name = account_name_array[i_account_id];


                    var i_selected_option = '';
                    if (i_account_id == picked_account_id) {
                        i_selected_option = 'selected="selected"';
                    }

                    $("#account_id").append(
                        '<option ' + i_selected_option +
                            ' value="' + i_account_id +
                            '">' +
                            i_account_name +
                            "</option>"
                    );
                    if (picked_account_id == '')picked_account_id = i_account_id;
                }

                //alert(favouriteProfiles);
                var favouriteProfiles2 = favouriteProfiles;
                for (var fprofile_key in favouriteProfiles) {
                    var fprofile_val = favouriteProfiles[fprofile_key];
                    if (typeof profile_parents[fprofile_val] == 'undefined') {
                        favouriteProfiles2 = jQuery.grep(favouriteProfiles2, function (value) {
                            return value != fprofile_val;
                        });
                    }
                    //profile_name_array[profile_val.profiles[0].id] = profile_val.profiles[0].name;
                    //profile_parents[profile_val.profiles[0].id] = account_val.id;
                }
                //alert(favouriteProfiles2);
                favouriteProfiles = favouriteProfiles2;
                //profile_parents


                if (typeof profile_name_array[profile_id] == 'undefined') {
                    //profile_id=window_preload.accounts[0].wprops[0].profiles[0].id;
                    //alert(window_preload.accounts[0].id);
                    //account_id=window_preload.accounts[0].id;
                    //picked_account_id=window_preload.accounts[0].id;
                }

                googleEmail = window_header.email;
                if (googleEmail != '') {
                    $('#googleAcc').html(googleEmail);
                }


                if (typeof profile_count_array[picked_account_id] == 'undefined') {
                    picked_account_id = window_preload.accounts[0].id;
                }


                $("#display_id").val(display_id);
                $("#update_interval").val(update_interval);
                $("#date_range").val(date_range);
                $("#show_ads").attr('checked', show_ads);
                $("#show_properynames").attr('checked', show_properynames);
                $("#show_footer").attr('checked', show_footer);


                for (var i_profile_id in profile_name_array) {
                    if (profile_parents[i_profile_id] == picked_account_id || picked_account_id == 'all') {


                        var selected_option = '';
                        if (i_profile_id == profile_id) selected_option = 'selected="selected"';

                        $("#profile_id").append(
                            '<option ' +
                                selected_option +
                                ' value="' +
                                i_profile_id +
                                '">' +
                                profile_name_array[i_profile_id] +
                                "</option>"
                        );
                        $('#loading_profile').hide();
                        $('#loading_profile_id').hide();

                        $('#edit_profile').show();


                    }


                }
            }
        });

    });

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
