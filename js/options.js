document.addEventListener('DOMContentLoaded', function () {


    init_options();


    $('#googleAcc').html(google_id);
    $('#googleAccChange').html(chrome.i18n.getMessage("googleAccChange", 'https://www.google.com/accounts/Logout?continue=https://www.google.com/analytics/settings/'));


    $('[data-transid]').each(function () {
        var trans_id = $(this).data('transid');
        var trans = get_trans($(this).data('transid'), false);
        if (trans == '') {
            trans = '<s>Missing translation: ' + trans_id + '</s>';
        }
        $(this).html(trans);
    });


    $('#account_id').bind('change', function () {
        SetPickedAccountId(this.value);
        init_options();
    });


    $('#edit_account_button').bind('click', function () {
        edit_account();
        return false;
    });

    $('#edit_profile_button').bind('click', function () {
        edit_profile();
        return false;
    });


    $('#save_options_button').bind('click', function () {
        save_options();
        return false;
    });


});