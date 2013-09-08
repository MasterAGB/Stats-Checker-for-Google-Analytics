/*var bannnerImages = [
    'img/banners/1100AD_1_468x60.jpg',
    'img/banners/1100AD_2_468x60.jpg',
    'img/banners/1100AD_3_468x60.jpg'];*/
var bannnerImages = [
    'img/AngryFarmer.MadSword.com/angryfarmer468x60.png'];


document.addEventListener('DOMContentLoaded', function () {




    $('#bannerImg').attr('src', bannnerImages[getRandomInt(0, 2)]);


    $('#bannerImg').bind("click",function(){_gaq.push(['_trackEvent', 'banner_click', 'bannerImg']);});
    $('.angryfarmer').bind("click",function(){_gaq.push(['_trackEvent', 'banner_click', 'angryfarmer']);});
    $('.angryfarmer_small').bind("click",function(){_gaq.push(['_trackEvent', 'banner_click', 'angryfarmer_small']);});
    $('.angryfarmer_icon').bind("click",function(){_gaq.push(['_trackEvent', 'banner_click', 'angryfarmer_small']);});



    $("#real_table th .search_input input").change(function (e) {
        console.log("Real:"+this.value);
        searchValue=this.value;

        $('#account_id').val("all").change();
    });


    $("#real_table").tablesorter({
        // define a custom text extraction function
        textExtraction:"complex"
    });




    init_popup();


    $("table").bind("sortStart",
        function () {
            $("#loading_new_account_table").show();
        }).bind("sortEnd", function () {
            $("#loading_new_account_table").hide();
            adjustTable('sort');
        });
    adjustTable('start');




    $('#googleAcc').html(google_id);

    $('#googleAccChange').html(chrome.i18n.getMessage("googleAccChange", 'https://www.google.com/accounts/Logout?continue=https://www.google.com/analytics/settings/'));


    $('.trans').each(function(){
        $(this).html(get_trans($(this).data('transid'), false));
    })


    $('#account_id').bind('change', function () {
        init_popup(this.value);
    });

    $('#gdf_nth_realtime').bind('click', function () {
        changeDateFormat('realtime');
        return false;
    });
    $('#gdf_nth_day').bind('click', function () {
        changeDateFormat('day');
        return false;
    });
    $('#gdf_nth_yesterday').bind('click', function () {
        changeDateFormat('yesterday');
        return false;
    });
    $('#gdf_nth_week').bind('click', function () {
        changeDateFormat('week');
        return false;
    });
    $('#gdf_nth_month').bind('click', function () {
        changeDateFormat('month');
        return false;
    });
    $('#open_options').bind('click', function () {
        openOptions();
        return false;
    });
    $('#open_full').bind('click', function () {
        openFull();
        return false;
    });

    pickDateFormatButton();


    $('.unstarred_icon').live('click', function () {
        togglefavourite(this, $(this).data('profileid'));
        return false;
    })



    $('.graph_icon').live('click', function () {
        showGraph($(this).data('profileid'),this,$(this).data('token'));
        return false;
    })

    $('.starred_icon').live('click', function () {
        togglefavourite(this, $(this).data('profileid'));
        return false;
    })
    $('.save_options_radio').live('click', function () {
        save_options_radio($(this).data('key'), $(this).data('picked_account_id'));
    })


    $('.td-radio').live('click', function () {
        $(this).parent().find('.save_options_radio').click();
    })


    $(window).resize(function() {
        adjustTable("resize");
    });



});