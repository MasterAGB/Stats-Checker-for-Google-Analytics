var googleToken = "";
var googleEmail = "";


function SendAddToFavourites(profile_id_to_fav) {
    $.ajax({
        url: "https://analytics.google.com/analytics/web/submitForm?key=" + profile_id_to_fav + "&entityName=profile&currentState=false&ds=a0w0p0&sid=starForm&hl=en_US&authuser=0",
        data: {token: googleToken},
        type: "POST",
        dataType: "html",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        },
        success: function (data) {
        }
    });
}

function SendRemoveFromFavourites(profile_id_to_fav) {

    $.ajax({
        url: "https://analytics.google.com/analytics/web/submitForm?key=" + profile_id_to_fav + "&entityName=profile&currentState=true&ds=a0w0p0&sid=starForm&hl=en_US&authuser=0",
        data: {token: googleToken},
        type: "POST",
        dataType: "html",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        },
        success: function (data) {
        }
    });
}


function getGoogleToken(afterOnCompleteFunction) {

//logg("Getting google token");
    $.ajax({
        url: "https://analytics.google.com/analytics/web/",
        data: '',
        method: 'get',
        dataType: "html",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
            logg('Error getting token - error');
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
                        fillProfilesAndAccountsData(afterOnCompleteFunction, data);
                    }

                });

            } else {

                //console.log(data);
                logg('Error getting token');
                //goOffline();
                PleaseLogin();
                return false;
            }
        }
    });
}


function fillProfilesAndAccountsData(onCompleteFunction, data2) {


    var split = data2.split("<script type='text/javascript'>window.preload=")[1];
    //var jsonString = split.split("]}};")[0] + "]}}";
    var jsonString = split.split("; window.helpCenterUri")[0];
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

                profileEntity.name = removeLastSlash(profileEntity.name);
                property_name_array[propertyEntity.id] = removeLastSlash(property_name_array[propertyEntity.id]);


                var propertyLower = property_name_array[propertyEntity.id].toLowerCase();
                var profileLower = profileEntity.name.toLowerCase();


                //please, show domain name without WWW, if there is one with and one without...
                if (profileLower.replace('www.', '') == propertyLower.replace('www.', '')) {

                    if (profileEntity.name.indexOf("www.") > -1 || profileEntity.name.indexOf("WWW.") > -1) {
                        profileEntity.name = property_name_array[propertyEntity.id];
                    } else {
                        property_name_array[propertyEntity.id] = profileEntity.name;
                    }

                    propertyLower = property_name_array[propertyEntity.id].toLowerCase();
                    profileLower = profileEntity.name.toLowerCase();
                }


                if (profileEntity.name == "") {
                    profileEntity.name = property_name_array[propertyEntity.id];
                }


                if (show_propertynames && profileLower != propertyLower) {


                    if (
                        profileEntity.name == "Default view" ||
                        profileEntity.name == "All Web Site Data" ||
                        profileEntity.name == "All Mobile App Data" ||
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
            //url: "https://analytics.google.com/analytics/web/getAccountHeaders?accountIds=3109102%2C18564272%2C32556808%2C27199950%2C22089342%2C19234060%2C2040881%2C346332%2C1568495&_u.date00=" + oldtoday + "&_u.date01=" + today + "&homeAccountsTable-tableControl.searchTerm=&homeAccountsTable.viewType=FLAT&hl=en_US&authuser=0",
            //url:"https://analytics.google.com/analytics/web/getPage?homeAccountsTable-tableControl.searchTerm=&homeAccountsTable.viewType=HIERARCHICAL&id=home-page&cid=homeAccountsTable%2CtimestampMessage&hl=en_US&authuser=0",
            //url: "https://analytics.google.com/analytics/web/getPage?_u.date00=" + oldtoday + "&_u.date01=" + today + "&homeAccountsTable-tableControl.searchTerm=&homeAccountsTable.viewType=FLAT&id=home-page&cid=homeAccountsTable%2CtimestampMessage&hl=en_US&authuser=0",
            //url: "https://analytics.google.com/analytics/web/getPage?_u.date00=" + oldtoday + "&_u.date01=" + today + "&homeAccountsTable-tableControl.searchTerm=&homeAccountsTable.viewType=FLAT&id=home-page&cid=homeAccountsTable%2CtimestampMessage&hl=en_US&authuser=0",
            //url: "https://analytics.google.com/analytics/web/getPage?_u.date00=" + oldtoday + "&_u.date01=" + today + "&homeAccountsTable.viewType=FLAT&id=home-page&hl=ru&authuser=0",
            url: "https://analytics.google.com/analytics/web/getBaseData?_u.date00=" + oldtoday + "&_u.date01=" + today + "&homeAccountsTable.viewType=FLAT&hl=ru&authuser=0",
            //url: "https://analytics.google.com/analytics/web/management/getPage?id=Settings&ds=a38120388w66682935p68582681&hl=ru&authuser=0",
            data: {token: googleToken},
            type: "POST",
            dataType: "html",
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                logg('Error getting page!');
                //goOffline();
                PleaseLogin();
                return false;
            },
            success: function (data) {


                data = fixData(data);
                data = JSON.parse(data);

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
}


function getRealtimeData(key, completeFunction, errorFunction) {
    var url = "https://analytics.google.com/analytics/realtime/realtime/getData?key=" + key + "&ds=" + key + "&pageId=RealtimeReport/rt-overview&q=t:0|:1|:0:&hl=en_US";

    $.ajax({
        url: url,
        type: "GET",
        dataType: "html",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            errorFunction(textStatus);
        },
        success: function (data) {
            data = fixData(data);
            data = JSON.parse(data);
            //console.log(data["t:0|:1|:0:"].metricTotals[0]);
            completeFunction(data["t:0|:1|:0:"].metricTotals[0] + "", data);
        }
    });
}


function getRealtimeAdditionalData(key, completeFunction, errorFunction) {

    //q="t:0|:1|:0:,t:11|:1|:5:,ot:0:0:4:,ot:0:0:3:,t:7|:1|:5:6==REFERRAL;,t:7|:1|:5:6==SOCIAL;,t:10|:1|:10:,t:18|:1|:10:,t:4|5|2|:1|:10:2!=zz;,";
    q = "t:0|:1|:0:,t:11|:1|:5:,ot:0:0:4:,ot:0:0:3:";

    //t:0|:1|:0: - sdkoka sha online
    //ot:0:0:3: - posekundnij otchot
    //ot:0:0:4: - pominutnij otchot

    $.ajax({
        url: "https://analytics.google.com/analytics/realtime/realtime/getData?key=" + key + "&ds=" + key + "&pageId=RealtimeReport/rt-overview&q=" + q + "&hl=en_US",
        type: "GET",
        dataType: "html",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            errorFunction(textStatus);
        },
        success: function (data) {
            data = fixData(data);
            data = JSON.parse(data);


            //skoka sej4as:
            var info_visits = data["t:0|:1|:0:"].metricTotals[0];
            //za etu minutu
            var info_pageviews = data["ot:0:0:4:"].overTimeData[0]['values'][0];
            //console.log(data["t:0|:1|:0:"].metricTotals[0]);
            completeFunction(info_visits, info_pageviews, data);
        }
    });
}


function getTodayData(key, completeFunction, errorFunction) {


    if (profile_data[key]["app"]) {
        var url = "https://analytics.google.com/analytics/web/getPage?_u.date00=" + today + "&_u.date01=" + today + "&id=app-visitors-overview&ds=" + key + "&cid=overview%2CprofileExperiments%2CreportHeader%2CtimestampMessage&hl=en_US&authuser=0";

    } else {
        var url = "https://analytics.google.com/analytics/web/getPage?_u.date00=" + today + "&_u.date01=" + today + "&id=visitors-overview&ds=" + key + "&cid=overview%2CprofileExperiments%2CreportHeader%2CtimestampMessage&hl=en_US&authuser=0";

    }
    $.ajax({
        url: url,
        type: "POST",
        data: "token=" + googleToken,
        cache: false,
        dataType: "html",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(url);
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
            errorFunction(textStatus);
        },
        success: function (data) {

            data = fixData(data);


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
                //console.log(metric_val.metric.conceptName);
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
        }
    });
}


function GetDataAndSetRatio() {


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


        //var url = "https://analytics.google.com/analytics/web/getPage?_.date00=" + today + "&_.date01=" + today + "&id=visitors-overview&ds=" + profile_id + "&cid=reportHeader%2Coverview&hl=en_US";


    }


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
        var url = "https://analytics.google.com/analytics/web/getPage?_.date00=" + weekagotoday + "&_.date01=" + today + "&id=app-visitors-overview&ds=" + cur_profile_id + "&cid=reportHeader%2Coverview&hl=en_US";
    } else {
        var url = "https://analytics.google.com/analytics/web/getPage?_.date00=" + weekagotoday + "&_.date01=" + today + "&id=visitors-overview&ds=" + cur_profile_id + "&cid=reportHeader%2Coverview&hl=en_US";
    }
    $.ajax({
        url: url,
        type: "POST",
        data: "token=" + googleToken,
        cache: false,
        dataType: "html",
        beforeSend: function (xhr) {
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
        },
        success: function (data, textStatus, jqXHR) {


            data = fixData(data);
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
             * @author Torstein H?nsi
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
    adjustTable('graph_open')


}

function fixData(data) {
    var bugString = ")]}'";
    if (data.lastIndexOf(bugString, 0) === 0) {
        data = data.substr(bugString.length);
        //var jsonArray = JSON.parse(data);
        //console.log("Error found!:");
        //console.log(url);
        //console.log(jsonArray);
    } else {
        //console.log("Error not found!:");
    }
    return data;
}


function FillAllRows(jrow, cur_profile_id) {


    if (profile_data[cur_profile_id]["app"]) {
        var url = "https://analytics.google.com/analytics/web/getPage?_.date00=" + oldtoday + "&_.date01=" + today + "&id=app-visitors-overview&ds=" + cur_profile_id + "&cid=reportHeader%2Coverview&hl=en_US";
    } else {
        var url = "https://analytics.google.com/analytics/web/getPage?_.date00=" + oldtoday + "&_.date01=" + today + "&id=visitors-overview&ds=" + cur_profile_id + "&cid=reportHeader%2Coverview&hl=en_US";

    }
    $.ajax({
        url: url,
        type: "POST",
        data: "token=" + googleToken,
        cache: false,
        dataType: "html",
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


            data = fixData(data);

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


function PrepareTable(data) {

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
        if (i_account_id == account_id) {
            i_selected_option = 'selected="selected"';
        }

        $("#account_id").append(
            '<option ' + i_selected_option +
            ' value="' + i_account_id +
            '">' +
            i_account_name +
            "</option>"
        );
        if (account_id == '')account_id = i_account_id;
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
    if ('all' == account_id) {
        selected_option = 'selected="selected"';
    }
    $("#account_id").append(
        '<option class="option_fav" ' +
        selected_option +
        ' value="all">&lowast; ' + get_trans('allProfiles', false) + '</option>'
    );


    if (typeof(window_header) != 'undefined') {
        googleEmail = window_header.email;
    }
    if (googleEmail != '') {
        $('#googleAcc').html(googleEmail);
    }


    if (searchValue == "") {


        if (onlyFav) {

            tr_all_fav_array = getAllFavProfiles();
            if (tr_all_fav_array.length == 0) {
                logg("No Favs found in this account, taking all profiles for this acc");
                AddCustomRowToTable("NoFavProfilesFound", "info_td");
                tr_all_fav_array = getAllProfiles();
            }
            if (tr_all_fav_array.length == 0) {
                logg("No profiles for this acc. Pick another acc!");
                AddCustomRowToTable("NoProfilesFound", "info_td");
            }
            insert_rows_to_popup(tr_all_fav_array);


        } else {

            tr_array = getAllProfiles();

            if (tr_array.length == 0) {
                AddCustomRowToTable("NoProfilesFound", "info_td");
                logg("No profiles for this acc. Pick another acc!");
            }
            insert_rows_to_popup(tr_array);
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
                tr_all_fav_array = getAllFavProfiles();
            }
            if (tr_all_fav_array.length == 0) {
                logg("No Favs found in this account, taking all profiles for this acc");

                AddCustomRowToTable("NoFavProfilesFound", "info_td");
                tr_all_fav_array = getAllProfiles();
            }
            if (tr_all_fav_array.length == 0) {
                AddCustomRowToTable("NoProfilesFound", "info_td");
                logg("No profiles for this acc. Pick another acc!");
            }
            insert_rows_to_popup(tr_all_fav_array);

        } else {
            var tr_array = getAllSearchProfiles(searchValue);
            if (tr_array.length == 0) {
                AddCustomRowToTable("NoAllSearchProfilesFound", "info_td");
                logg("Nothing found, taking all profiles for this acc");
                tr_array = getAllProfiles();
            }
            if (tr_array.length == 0) {
                AddCustomRowToTable("NoProfilesFound", "info_td");
                logg("No profiles for this acc. Pick another acc!");
            }
            insert_rows_to_popup(tr_array);
        }
    }
    closeErrorPopup();


};