e = chrome.browserAction;
var google_id = localStorage["google_id"];
var account_id = localStorage["account_id"];
var account_name = localStorage["account_name"];
var profile_id = localStorage["profile_id"];
var profile_name = localStorage["profile_name"];
var display_id = localStorage["display_id"];
var selected_period = localStorage["selected_period"];
var new_analytics = localStorage["new_analytics"];
var update_interval = localStorage["update_interval"];
var show_ads = localStorage["show_ads"];
//Cannot set booleans to localstorage :(
if (typeof show_ads == 'string' && show_ads == 'false') {
	show_ads = false;
} else {
	show_ads = true;
}
var show_footer = localStorage["show_footer"];
//Cannot set booleans to localstorage :(
if (typeof show_footer == 'string' && show_footer == 'false') {
	show_footer = false;
} else {
	show_footer = true;
}

var name_array = new Array();
var profile_parents = new Array();
var profile_count_array = new Array();


var ga = new Object()
ga.webanalytics = new Object();
ga.webanalytics.header = new Object();
ga.webanalytics.header.setLoadBaseData = function(n) {
	//alert(n)
}
ga.webanalytics.header.setHeaderInfo = function(n) {
	//alert(n)
}
ga.webanalytics.header.main = function(n) {
	//alert(n)
}

$.ajaxSetup({ cache: false });
$.ajaxSetup({ async: true });


if (localStorage['favouriteProfiles'] != undefined) {
	var favouriteProfiles = JSON.parse(localStorage['favouriteProfiles']);
} else {
	var favouriteProfiles = new Array();
}

function addfavourite(starbutton, profile_id_to_fav) {
	favouriteProfiles.push(profile_id_to_fav);
	localStorage['favouriteProfiles'] = JSON.stringify(favouriteProfiles);
	$(starbutton).addClass('starred_icon');
	$(starbutton).removeClass('unstarred_icon');
	$(starbutton).parent().parent().parent().parent().addClass('favorited');

}
function removefavourite(starbutton, profile_id_to_fav) {

	favouriteProfiles = jQuery.grep(favouriteProfiles, function(value) {
		return value != profile_id_to_fav;
	});
	localStorage['favouriteProfiles'] = JSON.stringify(favouriteProfiles);

	$(starbutton).addClass('unstarred_icon');
	$(starbutton).removeClass('starred_icon');
	$(starbutton).parent().parent().parent().parent().removeClass('favorited');
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
	show_ads = localStorage["show_ads"];
	if (!show_ads) {
		show_ads = true;
	}
	if (typeof show_ads == 'string' && show_ads == 'false') {
		show_ads = false;
	} else {
		show_ads = true;
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

refreshdates();


function refreshdates() {
	switch (selected_period) {
		case 'day':
			var checkperiod = 1000 * 60 * 60 * 24 * (1 - 1);
			break;
		case 'week':
			var checkperiod = 1000 * 60 * 60 * 24 * (7 - 1);
			break;
		case 'month':
			var checkperiod = 1000 * 60 * 60 * 24 * (30 - 1);
			break;
	}

	currentTime = new Date();
	month = currentTime.getMonth() + 1;
	if (month < 10) month = "0" + month;
	day = currentTime.getDate();
	if (day < 10) day = "0" + day;
	year = currentTime.getFullYear();
	today = year + '' + month + '' + day;


	oldcurrentTime = new Date(currentTime - checkperiod);
	oldmonth = oldcurrentTime.getMonth() + 1;
	if (oldmonth < 10) oldmonth = "0" + oldmonth;
	oldday = oldcurrentTime.getDate();
	if (oldday < 10) oldday = "0" + oldday;
	oldyear = oldcurrentTime.getFullYear();
	oldtoday = oldyear + '' + oldmonth + '' + oldday;

	monthagocurrentTime = new Date(currentTime - 1000 * 60 * 60 * 24 * 30);
	monthagomonth = monthagocurrentTime.getMonth() + 1;
	if (monthagomonth < 10) monthagomonth = "0" + monthagomonth;
	monthagoday = monthagocurrentTime.getDate();
	if (monthagoday < 10) monthagoday = "0" + monthagoday;
	monthagoyear = monthagocurrentTime.getFullYear();
	monthagotoday = monthagoyear + '' + monthagomonth + '' + monthagoday;
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
	value = value.replace(",", '');
	value = value.replace(String.fromCharCode(160), '');
	value = value.split(String.fromCharCode(160)).join('');
	return value;
}


function goOffline() {
	e.setBadgeBackgroundColor({"color":[128,128,128,128]});
	e.setIcon({path:"img/logo.offline.png"});
	e.setBadgeText({"text":"?"});
	e.setTitle({title: chrome.i18n.getMessage("loginToTheSystem")});
}

function PleaseLogin(timerlength) {
	chrome.tabs.create({url: 'https://www.google.com/analytics/web/'});
	goOffline();
	$("#loading_new_account_table").hide();
	$('#googleAcc').html('<a href="https://www.google.com/analytics/web/" target="_blank">' + chrome.i18n.getMessage("loginToTheSystem") + '</a>');
	$('#loading_table_profiles td').html('<a href="https://www.google.com/analytics/web/" target="_blank">' + chrome.i18n.getMessage("loginToTheSystem") + '</a>');
	setTimeout(function() {
		//checkRatio();
		init_popup();
	}, 3000);
}

function logg(text) {
	//console.log(text);
}

function checkRatio() {
	load_storage_variables();
	refreshdates();


	e.setIcon({path:"img/spinner16.gif"});


	//if(profile_id!=''){

	$.ajax({
		url: "https://www.google.com/analytics/web/",
		data: '',
		method: 'get',
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			logg('error');
			goOffline();
			return false;
		},
		success: function(data) {
			//$('#texta').val(data);


			if ((data.split('window.preload').length - 1) > 0) {

				var account_options = $(data);
				account_options.each(function() {
					var script_contents = $(this).html();

					if ((script_contents.split('window.preload').length - 1) > 0) {
						script_contents = script_contents.split('window.').join('window_');
						//alert(script_contents);
						eval(script_contents);
						token = window_preload.token.value;

						name_array = new Array();
						for (var account_key in window_preload.accounts) {
							var account_val = window_preload.accounts[account_key];
							for (var profile_key in account_val.wprops) {
								var profile_val = account_val.wprops[profile_key];
								name_array[profile_val.profiles[0].id] = profile_val.profiles[0].name;
							}


						}
						//alert(window_preload.accounts[0].wprops[0].profiles[0].id);
						if (typeof name_array[profile_id] == 'undefined') {
							profile_id = window_preload.accounts[0].wprops[0].profiles[0].id;
							//account_id=window_preload.accounts[0].id;
							//alert(account_id);
						}


						var url = "https://www.google.com/analytics/web/getPage?_.date00=" + today + "&_.date01=" + today + "&id=visitors-overview&ds=" + profile_id + "&cid=reportHeader%2Coverview&hl=en_US";

						$.ajax({
							url: url,
							type: "POST",
							data: "token=" + token,
							cache: false,
							beforeSend: function(xhr) {
								xhr.overrideMimeType('text/plain; charset=x-user-defined');
							},
							success: function(data, textStatus, jqXHR) {
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

								m_today = null;


								//alert(xmlData);
								//alert(($(xmlData).text()));
								//alert(removecrap($(xmlData).find('ProfileName').text()));
								//alert(removecrap($(xmlData).find('ItemSummary[id="VisitsSummary"]:first').text()));


								profile_name = name_array[profile_id];
								localStorage["profile_name"] = profile_name;


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

									e.setBadgeText({"text":badge_number});
									e.setBadgeBackgroundColor({"color":[255,127,0,255]});
									e.setIcon({path:"img/logo.32.png"});
									e.setTitle({title: chrome.i18n.getMessage("visitsToday", [m_today, profile_name, get_trans('text' + display_id, false)])});
								} else {
									logg('m_today=null');
									goOffline();
								}
							}
						});
						/*
						 } else {
						 e.setBadgeText({"text":"?"});
						 goOffline();
						 e.setTitle({title: 'Введите идентификатор'});
						 }
						 */
					}
				});
			} else {
				logg('window.preload menjshe 0');
				goOffline();
			}

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
	intervalID = setInterval("checkRatio()", update_interval);


	//setInterval("checkRatio()", 10000);

	chrome.extension.onRequest.addListener(function(req, sender, resp) {
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


	if(show_ads){
		$('.ads').show();
	} else {
		$('.ads').hide();
	}

	if(!show_footer){
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
	if(show_footer)
	$('#clone_footer').hide().html('');
	$('#real_table thead').clone().appendTo('#clone_header');
	if(show_footer)
	$('#real_table tfoot').clone().appendTo('#clone_footer');


	var numb = 1;
	$('#real_table thead th').each(function() {
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

	if(show_footer){
	var numb = 1;
	$('#real_table tfoot tr:last-child td').each(function() {
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


	$('#clone_header th').bind("click", function() {
		var nr = $(this).index() + 1;
		$('#real_table thead th:nth-child(' + nr + ')').click();

	});


	$('#clone_header').css('width', $('#real_table').width() + 'px').show();
	if(show_footer)
	$('#clone_footer').css('width', $('#real_table').width() + 'px').css('margin-top', '-' + $('#clone_footer').height() + 'px').show();
	//alert('a '+txt);



}


jQuery.fn.fadeToggle = function(speed, easing, callback) {
	return this.animate({opacity: 'toggle'}, speed, easing, callback);
};


function toggleclones() {
	$('#clone_header').fadeToggle();
	$('#clone_footer').fadeToggle();


}
function fill_info(cur_profile_id, jrow, token) {


	var url = "https://www.google.com/analytics/web/getPage?_.date00=" + oldtoday + "&_.date01=" + today + "&id=visitors-overview&ds=" + cur_profile_id + "&cid=reportHeader%2Coverview&hl=en_US";

	$.ajax({
		url: url,
		type: "POST",
		data: "token=" + token,
		cache: false,
		beforeSend: function(xhr) {
			xhr.overrideMimeType('text/plain; charset=x-user-defined');
		},
		success: function(data, textStatus, jqXHR) {
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
			$('.info_name', jrow).html(name_array[cur_profile_id]);
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
				$(".profile_list_table").trigger("update");
			}
			if (info_visits == 0) {
				$(jrow).addClass('empty_tr');
			}
			adjustTable('fillinfo');
		}
	});


}

function init_popup(picked_account_id) {
	checkRatio();
	$('#clone_header').html('');
	$('#clone_footer').html('');

	_gaq.push(['_trackEvent', 'init_popup', 'clicked']);
	//alert(picked_account_id);
	if (picked_account_id == undefined) {
		if (findfavourite(profile_id)) {
			picked_account_id = 'favorited';
		} else {
			picked_account_id = account_id;
		}
	}


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


	var token = '';

	$.ajax({
		url: "https://www.google.com/analytics/web/",
		data: '',
		method: 'get',
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			PleaseLogin();
			return false;
		},
		success: function(data) {

			//$('#texta').val(data);
			var account_options = $(data);
			account_options.each(function() {
				var script_contents = $(this).html();
				if ((script_contents.split('window.preload').length - 1) > 0) {
					script_contents = script_contents.split('window.').join('window_');
					//alert(script_contents);
					eval(script_contents);
					token = window_preload.token.value;

				}

				if ((script_contents.split('ga.webanalytics.header.setHeaderInfo').length - 1) > 0) {
					script_contents = script_contents.split('ga.webanalytics.header.main();').join('');
					script_contents = script_contents.split('ga.webanalytics.header.setHeaderInfo').join('window_header = ');
					eval(script_contents);


				}

			});


			if (typeof window_preload == 'undefined') {
				PleaseLogin();
				return false;
			}

			$("#account_id").html('');
			name_array = new Array();
			profile_parents = new Array();
			for (var account_key in window_preload.accounts) {
				var account_val = window_preload.accounts[account_key];


				var selected_option = '';
				if (account_val.id == picked_account_id) {
					selected_option = 'selected="selected"';
				}

				$("#account_id").append(
						'<option ' + selected_option +
								' value="' + account_val.id +
								'">' +
								account_val.name +
								"</option>"
				);
				if (picked_account_id == '')picked_account_id = account_val.id;
				profile_count_array[account_val.id] = account_val.wprops.length;
				for (var profile_key in account_val.wprops) {
					var profile_val = account_val.wprops[profile_key];
					name_array[profile_val.profiles[0].id] = profile_val.profiles[0].name;
					profile_parents[profile_val.profiles[0].id] = account_val.id;
				}
			}

				//alert(favouriteProfiles);
				var favouriteProfiles2 = favouriteProfiles;
				for (var fprofile_key in favouriteProfiles) {
					var fprofile_val = favouriteProfiles[fprofile_key];
					if (typeof profile_parents[fprofile_val] == 'undefined') {
						favouriteProfiles2 = jQuery.grep(favouriteProfiles2, function(value) {
							return value != fprofile_val;
						});
					}
					//name_array[profile_val.profiles[0].id] = profile_val.profiles[0].name;
					//profile_parents[profile_val.profiles[0].id] = account_val.id;
				}
				//alert(favouriteProfiles2);
				favouriteProfiles = favouriteProfiles2;
				//profile_parents

				if (typeof name_array[profile_id] == 'undefined') {
					//profile_id=window_preload.accounts[0].wprops[0].profiles[0].id;
					//alert(window_preload.accounts[0].id);
					//account_id=window_preload.accounts[0].id;
					//picked_account_id=window_preload.accounts[0].id;
				}

			var selected_option = '';
			if ('favorited' == picked_account_id) {
				selected_option = 'selected="selected"';
			}

			$("#account_id").append(
					'<option class="option_fav" ' +
							selected_option +
							' value="favorited">&lowast; Favorited</option>'
			);
			var selected_option = '';
			if ('all' == picked_account_id) {
				selected_option = 'selected="selected"';
			}
			$("#account_id").append(
					'<option class="option_fav" ' +
							selected_option +
							' value="all">&lowast; All</option>'
			);


			var email = window_header.email;
			if (email != '') {
				$('#googleAcc').html(email);
			}


			if (picked_account_id != 'favorited') {

				if (picked_account_id != 'all')
				if (typeof profile_count_array[picked_account_id] == 'undefined') {
					picked_account_id = window_preload.accounts[0].id;
				}

				//alert(picked_account_id);

				var tr_array = new Array();
				for (var account_key in window_preload.accounts) {
					var account_val = window_preload.accounts[account_key];


					//{"id":"3109102","name":"Analytics Account","accessLevel":"OWNER","wprops":


					//alert (account_key+' = '+account_val);

					if (account_val.id == picked_account_id || picked_account_id=='all') {

						for (var profile_key in account_val.wprops) {
							var profile_val = account_val.wprops[profile_key];
							//TODO: sjuda zhe nado pihatj i raznije profili
							tr_array.push(profile_val.profiles[0].id);
						}

					}


				}
				insert_rows_to_popup(tr_array, picked_account_id, token);


			} else {
				//_gaq.push(['_trackEvent', 'init_popup_favorites', 'clicked']);

				insert_rows_to_popup(favouriteProfiles, picked_account_id, token);
			}


		}
	});


}


function insert_rows_to_popup(tr_array, picked_account_id, token) {
	var favorited_tr = '';
	var nonfavorited_tr = '';

//tr_array=sortObj(tr_array);

	//alert(tr_array.length);
	if (tr_array.length > 0) {
		for (var numb in tr_array) {
			var key = tr_array[numb];
			var val = 'Loading...';

			if (name_array[key] != undefined) {
				val = name_array[key];
			}

			if (findfavourite(key)) {
				var favico = '<a href="#" onclick="togglefavourite(this,\'' + key + '\');return false;" class="starred_icon"></a>';
				var trclass = 'favorited';
			} else {
				var favico = '<a href="#" onclick="togglefavourite(this,\'' + key + '\');return false;" class="unstarred_icon"></a>';
				var trclass = '';
			}
			var radiobox = '<input id="profile_id_radio_' + key + '" onchange="save_options_radio(\'' + key + '\',\'' + picked_account_id + '\');" type="radio" name="profile_id_radio" value="' + key + '"';
			if (key == profile_id) {
				radiobox += ' checked="checked" ';
			}
			radiobox += '/>';

			if (new_analytics) {
				var reportingurl = 'https://www.google.com/analytics/web/#report/visitors-overview/' + key + '/_.date00=' + monthagotoday + '&_.date01=' + today + '';
				var profileurl = 'https://www.google.com/analytics/web/#management/Property/' + key + '/propertyComposite-profilesTab-profilesComposite-tabControl.tabId=editProfile';
			} else {
				var reportingurl = 'https://www.google.com/analytics/reporting/?reset=1&id=' + key + '&pdr=' + monthagotoday + '-' + today + '';
				var profileurl = 'https://www.google.com/analytics/settings/profile_summary?id=' + key + '';
			}


			var another_tr = '<tr class="' + trclass + '" rel_profile="' + key + '">' +
					'<td class="value profile_name" align="left"><div>' +
					'<a title="Edit" class="edit_icon" target="_blank" href="' + profileurl + '"><img src="img/pencil_icon.gif"></a>' +
					'<div class="profile_name_div">' + favico + '' + radiobox + '<a class="info_name" target="_blank" href="' + reportingurl + '">' + val + '</a></div>' +
					'</div></td>' +

					'<td onclick="$(\'#profile_id_radio_' + key + '\').click();" class="value info_visits" align="left"><div class="loading_cell">&nbsp;</div></td>' +
					'<td onclick="$(\'#profile_id_radio_' + key + '\').click();" class="value info_uniqvisitors" align="left"><div class="loading_cell">&nbsp;</div></td>' +
					'<td onclick="$(\'#profile_id_radio_' + key + '\').click();" class="value info_pageviews" align="left"><div class="loading_cell">&nbsp;</div></td>' +
					'<td onclick="$(\'#profile_id_radio_' + key + '\').click();" class="value info_averagepageviews" align="left"><div class="loading_cell">&nbsp;</div></td>' +
					'<td onclick="$(\'#profile_id_radio_' + key + '\').click();" class="value info_timeonsite" align="left"><div class="loading_cell">&nbsp;</div></td>' +
					'<td onclick="$(\'#profile_id_radio_' + key + '\').click();" class="value info_bounce" align="left"><div class="loading_cell">&nbsp;</div></td>' +
					'<td onclick="$(\'#profile_id_radio_' + key + '\').click();" class="value info_newvisits" align="left"><div class="loading_cell">&nbsp;</div></td>' +
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


		$("#profiles_table_list").find('tr').each(function() {
			//alert($(this).attr('rel_profile'));
			fill_info($(this).attr('rel_profile'), this, token);
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
	localStorage["profile_name"] = $('tr[rel_profile=' + prof_id + '] a.info_name').html();
	google_id = localStorage["google_id"];
	account_id = localStorage["account_id"];
	profile_id = localStorage["profile_id"];
	profile_name = localStorage["profile_name"];


	$('tr.selected_tr').removeClass('selected_tr');
	$('tr[rel_profile=' + prof_id + ']').addClass('selected_tr');

	$('#loading_new_account_table').show();
	setTimeout(function() {
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
	if ($('#show_ads').attr('checked') == 'checked') {
		_gaq.push(['_trackEvent', 'show_ads', 'true']);
		localStorage["show_ads"] = true;
	} else {
		_gaq.push(['_trackEvent', 'show_ads', 'false']);
		localStorage["show_ads"] = false;
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
	show_footer = localStorage["show_footer"];
	if (typeof show_footer == 'string' && show_footer == 'false') {
		show_footer = false;
	} else {
		show_footer = true;
	}
	$('#status').show();
	$('#status').html(chrome.i18n.getMessage("saved"));
	setTimeout(function() {
		$('#status').hide('slow');
	}, 150);
	//init_background();

	chrome.extension.getBackgroundPage().location.reload();
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
	_gaq.push(['_trackEvent', 'init_options', 'clicked']);

	//alert(picked_account_id);
	if (picked_account_id == undefined) {
		picked_account_id = account_id;
	}


	$('#loading_profile_id').show();
	var token = '';
	$.ajax({
		url: "https://www.google.com/analytics/web/",
		data: '',
		method: 'get',
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			$('#loading_profile').html('<a href="https://www.google.com/analytics/web/" target="_blank">' + chrome.i18n.getMessage("loginToTheSystem") + '</a>');
			setTimeout(function() {
				init_options();
			}, 5000);
			return false;
		},
		success: function(data) {

			//$('#texta').val(data);
			var account_options = $(data);
			account_options.each(function() {
				var script_contents = $(this).html();
				if ((script_contents.split('window.preload').length - 1) > 0) {
					script_contents = script_contents.split('window.').join('window_');
					//alert(script_contents);
					eval(script_contents);
					token = window_preload.token.value;

				}

				if ((script_contents.split('ga.webanalytics.header.setHeaderInfo').length - 1) > 0) {
					script_contents = script_contents.split('ga.webanalytics.header.main();').join('');
					script_contents = script_contents.split('ga.webanalytics.header.setHeaderInfo').join('window_header = ');
					eval(script_contents);


				}

			});


			if (typeof window_preload == 'undefined') {
				$('#loading_profile').html('<a href="https://www.google.com/analytics/web/" target="_blank">' + chrome.i18n.getMessage("loginToTheSystem") + '</a>');
				setTimeout(function() {
					init_options();
				}, 5000);
				return false;
			}

			$("#account_id").html('');
			$("#profile_id").html('');
			name_array = new Array();
			profile_parents = new Array();
			for (var account_key in window_preload.accounts) {
				var account_val = window_preload.accounts[account_key];


				var selected_option = '';
				if (account_val.id == picked_account_id) {
					selected_option = 'selected="selected"';
				}

				$("#account_id").append(
						'<option ' + selected_option +
								' value="' + account_val.id +
								'">' +
								account_val.name +
								"</option>"
				);
				if (picked_account_id == '')picked_account_id = account_val.id;
				profile_count_array[account_val.id] = account_val.wprops.length;
				for (var profile_key in account_val.wprops) {
					var profile_val = account_val.wprops[profile_key];
					name_array[profile_val.profiles[0].id] = profile_val.profiles[0].name;
					profile_parents[profile_val.profiles[0].id] = account_val.id;
				}


			}

				//alert(favouriteProfiles);
				var favouriteProfiles2 = favouriteProfiles;
				for (var fprofile_key in favouriteProfiles) {
					var fprofile_val = favouriteProfiles[fprofile_key];
					if (typeof profile_parents[fprofile_val] == 'undefined') {
						favouriteProfiles2 = jQuery.grep(favouriteProfiles2, function(value) {
							return value != fprofile_val;
						});
					}
					//name_array[profile_val.profiles[0].id] = profile_val.profiles[0].name;
					//profile_parents[profile_val.profiles[0].id] = account_val.id;
				}
				//alert(favouriteProfiles2);
				favouriteProfiles = favouriteProfiles2;
				//profile_parents


				if (typeof name_array[profile_id] == 'undefined') {
					//profile_id=window_preload.accounts[0].wprops[0].profiles[0].id;
					//alert(window_preload.accounts[0].id);
					//account_id=window_preload.accounts[0].id;
					//picked_account_id=window_preload.accounts[0].id;
				}

			var email = window_header.email;
			if (email != '') {
				$('#googleAcc').html(email);
			}


			if (typeof profile_count_array[picked_account_id] == 'undefined') {
				picked_account_id = window_preload.accounts[0].id;
			}


			$("#display_id").val(display_id);
			$("#update_interval").val(update_interval);
			$("#show_ads").attr('checked', show_ads);
			$("#show_footer").attr('checked', show_footer);


			for (var account_key in window_preload.accounts) {
				var account_val = window_preload.accounts[account_key];


				//{"id":"3109102","name":"Analytics Account","accessLevel":"OWNER","wprops":


				//alert (account_key+' = '+account_val);

				if (account_val.id == picked_account_id) {
					var tr_array = new Array();
					for (var profile_key in account_val.wprops) {
						var profile_val = account_val.wprops[profile_key];
						var selected_option = '';
						if (profile_val.profiles[0].id == profile_id) selected_option = 'selected="selected"';

						$("#profile_id").append(
								'<option ' +
										selected_option +
										' value="' +
										profile_val.profiles[0].id +
										'">' +
										profile_val.profiles[0].name +
										"</option>"
						);
						$('#loading_profile').hide();
						$('#loading_profile_id').hide();

						$('#edit_profile').show();
					}

				}


			}


		}
	});


}


function openOptions(){
	chrome.tabs.create({'url': chrome.extension.getURL('options_analytics.html')}, function(tab) {
	  // Tab opened.
	});
}