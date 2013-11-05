function window__s4Object() {
}

function _s4Object() {
}


function toggleSearchBox(e) {


    $(".search_input").toggle();
    $(".profile_header").toggle();
    adjustTable("toggleSearchBox");
    $(".search_input input").val("").focus();

    searchValue = "";
    $(".search_icon").removeClass("active");


    setTimeout(function () {
        var $cloneinput = $(".search_input input");
        $cloneinput.focus();
    }, 100);
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


var googleToken = "";
var googleEmail = "";
//localStorage:
var google_id = "";
var account_id = "";
var account_name = "";
var profile_id = "";
var profile_name = "";
var display_id = "";
var selected_period = "";
var update_interval = "";
var date_range = "";
var showAds = true;
var show_propertynames = true;
var favouriteProfiles = new Array();
var show_footer = true;
var onlyFav = false;


var profile_data = new Array();
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
    favouriteProfiles = SaveStorage("favouriteProfiles", favouriteProfiles, false);

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
    //$('body').append(text+"<br>");
}


function getGoogleToken(onCompleteFunction) {

//logg("Getting google token");
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


            if ((data.split('window.preload').length - 1) > 0) {


                var account_options = $(data);


                account_options.each(function () {
                    var script_contents = $(this).html();
                    // logg(script_contents);
                    if ((script_contents.split('"token":{"value":"').length - 1) > 0) {
                        googleToken = script_contents.split('"token":{"value":"')[1].split('","valid"')[0];
                        console.log("Token fetched: " + googleToken);
                        //console.log(googleToken);
                        onCompleteFunction(data);
                    }

                });

            } else {

                console.log(data);
                logg('Error getting token');
                //goOffline();
                PleaseLogin();
                return false;
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
    getGoogleToken(function (data2) {


        var split = data2.split("<script type='text/javascript'>window.preload=")[1];
        var jsonString = split.split("]}};")[0] + "]}}";
        var message = JSON.parse(jsonString);


        profile_name_array = new Object();
        profile_search_array = new Object();
        account_name_array = new Array();
        property_name_array = new Object();
        property_url_array = new Object();
        profile_url_array = new Object();

        //console.log();
        //Updating google Token
        googleToken = message.token.value;

        var row = message.accounts;
        var rowData = message.home_page_data.components[1].viewData;


        //var row = data.components[0].accountColumn.picker.pickerSettings.options;
        for (var accountEntityId in  row) {
            var accountEntity = row[accountEntityId]


            account_name_array.push([accountEntity.id, accountEntity.name]);

            profile_count_array[accountEntity.id] = 0;
            property_count_array[accountEntity.id] = 0;


            for (var propertyEntityId in  accountEntity.wprops) {
                var propertyEntity = accountEntity.wprops[propertyEntityId]

                property_url_array[propertyEntity.id] = propertyEntity.url;
                propertyEntity.name = propertyEntity.name.replace('http://', '');
                propertyEntity.name = propertyEntity.name.replace('https://', '');
                property_name_array[propertyEntity.id] = propertyEntity.name;
                property_count_array[accountEntity.id]++;
                property_parents[propertyEntity.id] = accountEntity.id;
                //todo: lazha!
                //console.log();
                property_tracking_code[propertyEntity.id] = "UA-" + propertyEntity.searchName.split("ua-")[1];


                for (var profileEntityId in  propertyEntity.profiles) {
                    var profileEntity = propertyEntity.profiles[profileEntityId]

                    profile_search_array[profileEntity.id] = profileEntity.name + " " + profileEntity.searchName + " " + property_name_array[propertyEntity.id] + " " + property_url_array[propertyEntity.id] + " " + property_tracking_code[propertyEntity.id];

                    profileEntity.name = profileEntity.name.replace('http://', '');
                    profileEntity.name = profileEntity.name.replace('https://', '');


                    if (show_propertynames && profileEntity.name.toLowerCase() != property_name_array[propertyEntity.id].toLowerCase()) {
                        if (
                            profileEntity.name == "All Web Site Data" ||
                                profileEntity.name == "Все данные по веб-сайту" ||
                                profileEntity.name == "Все данные по мобильному приложению"
                            ) {
                            profile_name_array[profileEntity.id] = property_name_array[propertyEntity.id];
                        } else {
                            profile_name_array[profileEntity.id] = profileEntity.name + " (" + property_name_array[propertyEntity.id] + ")";
                        }
                    } else {
                        profile_name_array[profileEntity.id] = profileEntity.name;
                    }


                    profile_count_array[property_parents[propertyEntity.id]]++;
                    profile_parents[profileEntity.id] = property_parents[propertyEntity.id];
                    profile_tracking_code[profileEntity.id] = property_tracking_code[propertyEntity.id];
                    profile_url_array[profileEntity.id] = property_url_array[propertyEntity.id];

                    profile_data[profileEntity.id] = new Array();
                    profile_data[profileEntity.id]["app"] = profileEntity.isAppProfile;
                    profile_data[profileEntity.id]["visits"] = 0;
                    profile_data[profileEntity.id]["timeonsite"] = 0;
                    profile_data[profileEntity.id]["bounce"] = 0;
                    profile_data[profileEntity.id]["conversion"] = 0;

                    if (profileEntity.starred == true) {
                        addfavourite('', profileEntity.id, false);
                    } else {
                        removefavourite('', profileEntity.id, false);
                    }

                    /*
                     if (profileEntity.value.length > 2) {
                     //tashim dannije!!
                     profile_data[profileEntity.id]["visits"] = removecrap(accountEntity.value[2].jsonData.json.data.formattedValue);
                     profile_data[profileEntity.id]["timeonsite"] = removecrap(accountEntity.value[3].jsonData.json.data.formattedValue);
                     profile_data[profileEntity.id]["bounce"] = removecrap(accountEntity.value[4].jsonData.json.data.formattedValue);
                     profile_data[profileEntity.id]["conversion"] = removecrap(accountEntity.value[5].jsonData.json.data.formattedValue);
                     }*/
                    //}
                    //break;

                }


            }


        }


        if (profile_id == "" || typeof profile_name_array[profile_id] == 'undefined') {
            for (var k in profile_name_array) {
                profile_id = k;
                break
            }
        }

        if (selected_period == "realtime" || selected_period == "day" || selected_period == "yesterday") {
            //console.log("Not using pre-data");
            if (typeof(onCompleteFunction) != "undefined") {
                onCompleteFunction(data2);
            }

        } else if (selected_period == "month") {
            console.log("Using month pre-data");
            //console.log(rowData);
            /*
             0: "Посещения"
             1: "Ср. продолж. посещ."
             2: "Показатель отказов"
             3: "Коэффициент конверсии цели"
             */
            //dannije za mesjac:
            for (var profileDataNumb in  rowData) {
                var profileData = rowData[profileDataNumb];
                profile_data[profileData.datasetId]["visits"] = removecrap(profileData.data[0].value);
                profile_data[profileData.datasetId]["timeonsite"] = removecrap(profileData.data[1].value);
                profile_data[profileData.datasetId]["bounce"] = removecrap(profileData.data[2].value);
                profile_data[profileData.datasetId]["conversion"] = removecrap(profileData.data[3].value);
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
                onCompleteFunction(data2);
            }

        } else {
            console.log("Getting misc days pre-data from " + oldtoday + " to " + today);
            //alert(oldtoday);
            $.ajax({
                //url: "https://www.google.com/analytics/web/getAccountHeaders?accountIds=3109102%2C18564272%2C32556808%2C27199950%2C22089342%2C19234060%2C2040881%2C346332%2C1568495&_u.date00=" + oldtoday + "&_u.date01=" + today + "&homeAccountsTable-tableControl.searchTerm=&homeAccountsTable.viewType=FLAT&hl=en_US&authuser=0",
                //url:"https://www.google.com/analytics/web/getPage?homeAccountsTable-tableControl.searchTerm=&homeAccountsTable.viewType=HIERARCHICAL&id=home-page&cid=homeAccountsTable%2CtimestampMessage&hl=en_US&authuser=0",
                //url: "https://www.google.com/analytics/web/getPage?_u.date00=" + oldtoday + "&_u.date01=" + today + "&homeAccountsTable-tableControl.searchTerm=&homeAccountsTable.viewType=FLAT&id=home-page&cid=homeAccountsTable%2CtimestampMessage&hl=en_US&authuser=0",
                //url: "https://www.google.com/analytics/web/getPage?_u.date00=" + oldtoday + "&_u.date01=" + today + "&homeAccountsTable-tableControl.searchTerm=&homeAccountsTable.viewType=FLAT&id=home-page&cid=homeAccountsTable%2CtimestampMessage&hl=en_US&authuser=0",
                //url: "https://www.google.com/analytics/web/getPage?_u.date00=" + oldtoday + "&_u.date01=" + today + "&homeAccountsTable.viewType=FLAT&id=home-page&hl=ru&authuser=0",
                url: "https://www.google.com/analytics/web/getBaseData?_u.date00=" + oldtoday + "&_u.date01=" + today + "&homeAccountsTable.viewType=FLAT&hl=ru&authuser=0",
                //url: "https://www.google.com/analytics/web/management/getPage?id=Settings&ds=a38120388w66682935p68582681&hl=ru&authuser=0",
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


                    var rowData = data.home_page_data.components[1].viewData;

                    for (var profileDataNumb in  rowData) {
                        var profileData = rowData[profileDataNumb];
                        profile_data[profileData.datasetId]["visits"] = removecrap(profileData.data[0].value);
                        profile_data[profileData.datasetId]["timeonsite"] = removecrap(profileData.data[1].value);
                        profile_data[profileData.datasetId]["bounce"] = removecrap(profileData.data[2].value);
                        profile_data[profileData.datasetId]["conversion"] = removecrap(profileData.data[3].value);
                    }

                    if (typeof(onCompleteFunction) != "undefined") {
                        onCompleteFunction(data2);
                    }

                }
            });
        }
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
            completeFunction(data["t:0|:1|:0:"].metricTotals[0] + "", data);
        }});
}

function getRealtimeAdditionalData(key, completeFunction, errorFunction) {

    //q="t:0|:1|:0:,t:11|:1|:5:,ot:0:0:4:,ot:0:0:3:,t:7|:1|:5:6==REFERRAL;,t:7|:1|:5:6==SOCIAL;,t:10|:1|:10:,t:18|:1|:10:,t:4|5|2|:1|:10:2!=zz;,";
    q = "t:0|:1|:0:,t:11|:1|:5:,ot:0:0:4:,ot:0:0:3:";

    //t:0|:1|:0: - sdkoka sha online
    //ot:0:0:3: - posekundnij otchot
    //ot:0:0:4: - pominutnij otchot

    $.ajax({
        url: "https://www.google.com/analytics/realtime/realtime/getData?key=" + key + "&ds=" + key + "&pageId=RealtimeReport/rt-overview&q=" + q + "&hl=en_US",
        type: "GET",
        dataType: "json",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            errorFunction(textStatus);
        },
        success: function (data) {


            //skoka sej4as:
            var info_visits = data["t:0|:1|:0:"].metricTotals[0];
            //za etu minutu
            var info_pageviews = data["ot:0:0:4:"].overTimeData[0]['values'][0];
            //console.log(data["t:0|:1|:0:"].metricTotals[0]);
            completeFunction(info_visits, info_pageviews, data);
        }});
}


function getTodayData(key, completeFunction, errorFunction) {


    if (profile_data[key]["app"]) {
        var url = "https://www.google.com/analytics/web/getPage?_u.date00=" + today + "&_u.date01=" + today + "&id=app-visitors-overview&ds=" + key + "&cid=overview%2CprofileExperiments%2CreportHeader%2CtimestampMessage&hl=en_US&authuser=0";

    } else {
        var url = "https://www.google.com/analytics/web/getPage?_u.date00=" + today + "&_u.date01=" + today + "&id=visitors-overview&ds=" + key + "&cid=overview%2CprofileExperiments%2CreportHeader%2CtimestampMessage&hl=en_US&authuser=0";

    }
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
                console.log(metric_val.metric.conceptName);
                //if(profile_data[key]["app"]){
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

    //console.log("checkRatio");
    if (isExtension()) {
        chrome.browserAction.setIcon({path: "img/spinner16.gif"});
    }

    getAccountProfiles(function () {


        if (display_id == "RealTime") {

            getRealtimeData(profile_id, function (badge_number) {


                profile_name = SaveStorage("profile_name", profile_name_array[profile_id]);

                if (isExtension()) {
                    chrome.browserAction.setBadgeText({"text": badge_number});
                    chrome.browserAction.setBadgeBackgroundColor({"color": [255, 127, 0, 255]});
                    chrome.browserAction.setIcon({path: "img/logo.32.png"});
                    chrome.browserAction.setTitle({title: chrome.i18n.getMessage("visitsToday", [badge_number, profile_name, get_trans('text' + display_id, false)])});
                }
            }, function (data) {

                logg('m_realtime=' + data);
                goOffline();
            });


        } else {

            getTodayData(profile_id, function (m_today) {


                profile_name = SaveStorage("profile_name", profile_name_array[profile_id]);


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
                        chrome.browserAction.setBadgeText({"text": badge_number});
                        chrome.browserAction.setBadgeBackgroundColor({"color": [255, 127, 0, 255]});
                        chrome.browserAction.setIcon({path: "img/logo.32.png"});
                        chrome.browserAction.setTitle({title: chrome.i18n.getMessage("visitsToday", [m_today, profile_name, get_trans('text' + display_id, false)])});
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
    //console.log("init_background");
    checkRatio();


    clearInterval(intervalID);
    if (update_interval < 30000) {
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


    if (profile_data[cur_profile_id]["app"]) {
        var url = "https://www.google.com/analytics/web/getPage?_.date00=" + weekagotoday + "&_.date01=" + today + "&id=app-visitors-overview&ds=" + cur_profile_id + "&cid=reportHeader%2Coverview&hl=en_US";
    } else {
        var url = "https://www.google.com/analytics/web/getPage?_.date00=" + weekagotoday + "&_.date01=" + today + "&id=visitors-overview&ds=" + cur_profile_id + "&cid=reportHeader%2Coverview&hl=en_US";
    }
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


        }
    });
    adjustTable('graph_open');

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
        if (profile_data[cur_profile_id]["app"]) {
            var url = "https://www.google.com/analytics/web/getPage?_.date00=" + oldtoday + "&_.date01=" + today + "&id=app-visitors-overview&ds=" + cur_profile_id + "&cid=reportHeader%2Coverview&hl=en_US";
        } else {
            var url = "https://www.google.com/analytics/web/getPage?_.date00=" + oldtoday + "&_.date01=" + today + "&id=visitors-overview&ds=" + cur_profile_id + "&cid=reportHeader%2Coverview&hl=en_US";

        }
        $.ajax({
            url: url,
            type: "POST",
            data: "token=" + googleToken,
            cache: false,
            beforeSend: function (xhr) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                logg('Error getting page!');
                //goOffline();
                PleaseLogin();
                return false;
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
                        case 'analytics.appviews':
                            //APP
                            var info_pageviews = metric_value;
                            break;
                        case 'analytics.avgAppviews':
                            //APP
                            var info_averagepageviews = metric_value;
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
                        default:
                            console.log("New metric!" + metric_val.metric.conceptName + ": " + metric_value);
                            break;
                    }


                }

                fill_row(jrow, cur_profile_id, info_visits, info_uniqvisitors, info_pageviews, info_averagepageviews, info_timeonsite, info_bounce, info_newvisits);
                checkFullyFilled();

            }
        });
    }

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
    //_gaq.push(['_trackEvent', key, picked_account_id]);
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
                // console.log(storageValString);
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
}

function getAllFavProfiles(picked_account_id) {
    var tr_all_fav_array = new Array();
    for (var i_profile_id2 in favouriteProfiles) {
        var i_profile_id = favouriteProfiles[i_profile_id2];
        if (profile_parents[i_profile_id] == picked_account_id || picked_account_id == 'all') {
            tr_all_fav_array.push(i_profile_id);
        }
    }
    return tr_all_fav_array;
}
function getAllFavSearchProfiles(searchValue) {
    var tr_array = new Array();
    for (var favKey in favouriteProfiles) {
        var i_profile_id = favouriteProfiles[favKey];

        if (profile_name_array[i_profile_id] != undefined) {
            console.log(profile_search_array[i_profile_id]);
            if (substrFound(profile_search_array[i_profile_id], searchValue)) {
                tr_array.push(i_profile_id);
            }
        }
    }
    return tr_array;
}

function getAllProfiles(picked_account_id) {
    var tr_array = new Array();
    for (var i_profile_id in profile_name_array) {
        if (profile_parents[i_profile_id] == picked_account_id || picked_account_id == 'all') {
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
function init_popup(picked_account_id) {


    if ($("#profiles_table_list").length == 0) {
        if ($("#edit_profile").length > 0) {
            init_options();
        }
        return;
    }

    //account_id = SaveStorage("account_id", picked_account_id);


    //alert(picked_account_id);
    if (picked_account_id == undefined) {
        //TODO: teperj vsegda pokazivajem vsjo?
        picked_account_id = account_id;
    }
    picked_account_id = SaveStorage("picked_account_id", picked_account_id);
    account_id = SaveStorage("account_id", picked_account_id);


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


    adjustTableVars();
    // return false;
    adjustTable('init_popup_start');


    getAccountProfiles(function (data) {

        //logg("Filling info");


        //console.log("getAccountProfiles - success!");

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


        for (var i in account_name_array) {
            var i_account_id = account_name_array[i][0];
            var i_account_name = account_name_array[i][1];


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


        /* $("#account_id").append(
         '<option class="option_fav" ' +
         selected_option +
         ' value="favorited">&lowast; ' + get_trans('favoritedProfiles', false) + '</option>'
         );*/
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


            if (onlyFav) {

                tr_all_fav_array = getAllFavProfiles(picked_account_id);
                if (tr_all_fav_array.length == 0) {
                    logg("No Favs found in this account, taking all profiles for this acc");
                    AddCustomRowToTable("NoFavProfilesFound", "info_td");
                    tr_all_fav_array = getAllProfiles(picked_account_id);
                }
                if (tr_all_fav_array.length == 0) {
                    logg("No profiles for this acc. Pick another acc!");
                    AddCustomRowToTable("NoProfilesFound", "info_td");
                }
                insert_rows_to_popup(tr_all_fav_array, picked_account_id);


            } else {

                tr_array = getAllProfiles(picked_account_id);

                if (tr_array.length == 0) {
                    AddCustomRowToTable("NoProfilesFound", "info_td");
                    logg("No profiles for this acc. Pick another acc!");
                }
                insert_rows_to_popup(tr_array, picked_account_id);
            }


        } else {


            if (onlyFav) {
                var tr_all_fav_array = getAllFavSearchProfiles(searchValue);
                if (tr_all_fav_array.length == 0) {
                    logg("Nothing found!!,searching in all profiles");

                    AddCustomRowToTable("NoFavSearchProfilesFound", "info_td");
                    tr_all_fav_array = getAllSearchProfiles(searchValue);
                }
                if (tr_all_fav_array.length == 0) {
                    logg("Nothing found!!, taking all fav profiles for this acc");

                    AddCustomRowToTable("NoFavSearchAllProfilesFound", "info_td");
                    tr_all_fav_array = getAllFavProfiles(picked_account_id);
                }
                if (tr_all_fav_array.length == 0) {
                    logg("No Favs found in this account, taking all profiles for this acc");

                    AddCustomRowToTable("NoFavProfilesFound", "info_td");
                    tr_all_fav_array = getAllProfiles(picked_account_id);
                }
                if (tr_all_fav_array.length == 0) {
                    AddCustomRowToTable("NoProfilesFound", "info_td");
                    logg("No profiles for this acc. Pick another acc!");
                }
                insert_rows_to_popup(tr_all_fav_array, picked_account_id);

            } else {
                var tr_array = getAllSearchProfiles(searchValue);
                if (tr_array.length == 0) {
                    AddCustomRowToTable("NoAllSearchProfilesFound", "info_td");
                    logg("Nothing found, taking all profiles for this acc");
                    tr_array = getAllProfiles(picked_account_id);
                }
                if (tr_array.length == 0) {
                    AddCustomRowToTable("NoProfilesFound", "info_td");
                    logg("No profiles for this acc. Pick another acc!");
                }
                insert_rows_to_popup(tr_array, picked_account_id);
            }
        }
        closeErrorPopup();


    });
}
function substrFound(string, word) {
    var n = string.toLowerCase().indexOf(word.toLowerCase());
    return (n >= 0);
}

function insert_rows_to_popup(tr_array, picked_account_id) {


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

            if (profile_data[key]["app"]) {
                switch (date_range) {
                    case '7days':
                        var reportingurl = 'https://www.google.com/analytics/web/#report/app-visitors-overview/' + key + '/' + escape('?_.date00=' + weekagotoday + '&_.date01=' + today + '/');
                        break;
                    case 'today':
                        var reportingurl = 'https://www.google.com/analytics/web/#report/app-visitors-overview/' + key + '/' + escape('?_.date00=' + today + '&_.date01=' + today + '/');
                        break;
                    case 'realtime':
                        var reportingurl = 'https://www.google.com/analytics/web/#realtime/rt-app-overview/' + key + '/';
                        break;
                    case '30days':
                    default:
                        var reportingurl = 'https://www.google.com/analytics/web/#report/app-visitors-overview/' + key + '/' + escape('?_.date00=' + monthagotoday + '&_.date01=' + today + '/');
                        break;
                }

            } else {
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

            }


            var profileurl = 'https://www.google.com/analytics/web/#management/Profile/' + key + '/%3FpropertyComposite-profilesTab-profilesComposite.tabId%3DeditProfile%26profile.tabId%3DeditProfile/';
            var propertyurl = 'https://www.google.com/analytics/web/#management/Property/' + key + '/%3FpropertyComposite.tabId%3DpropertySettingsTab/';
            var accounturl = 'https://www.google.com/analytics/web/#management/Account/' + key + '/%3FaccountComposite.tabId%3DeditAccountSettings/';


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
        $("#profiles_table_list").append(favorited_tr);
        $("#profiles_table_list").append(nonfavorited_tr);
        adjustTable('insert_rows_to_popup');


        SetFullyFilled($("#profiles_table_list").find('tr').length);
        $("#profiles_table_list").find('tr').each(function () {
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
    var another_tr = '<tr><td class="value ' + TdClass + '" colspan=20 align="left">' + get_trans(TransKey, false) + '</td>' +
        "</tr>";
    $("#profiles_table_list").append(another_tr);
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


    google_id = SaveStorage("google_id", $('#googleAcc').html());
    account_id = SaveStorage("account_id", acc_id);
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
    showAds = SaveStorage("showAds", $('#show_ads').attr('checked') == 'checked', true);
    show_propertynames = SaveStorage("show_propertynames", $('#show_propertynames').attr('checked') == 'checked', true);
    show_footer = SaveStorage("show_footer", $('#show_footer').attr('checked') == 'checked', true);


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
    checkAds();
    getAccountProfiles(function (data) {
        _gaq.push(['_trackEvent', 'init_options', 'clicked']);
        // console.log("data"+data);


        //alert(picked_account_id);
        if (picked_account_id == undefined) {
            picked_account_id = account_id;
        }


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

        googleEmail = window_header.email;
        if (googleEmail != '') {
            $('#googleAcc').html(googleEmail);
        }


        if (typeof profile_count_array[picked_account_id] == 'undefined') {
            //TODO
            //picked_account_id = window_preload.accounts[0].id;
        }


        $("#display_id").val(display_id);
        $("#update_interval").val(update_interval);
        $("#date_range").val(date_range);
        $("#show_ads").attr('checked', showAds);
        $("#show_propertynames").attr('checked', show_propertynames);
        $("#show_footer").attr('checked', show_footer);
        $("#onlyFav").attr('checked', onlyFav);


        $('#loading_profile').hide();

        $('#edit_profile').show();

        closeErrorPopup();

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
