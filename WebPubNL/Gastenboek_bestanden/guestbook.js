$(document).ready(initGuestbook);

function initGuestbook()
{
    var showForm = function()
    {
        jQuery.ajax({
            'type': 'post',
            'url': '/form/get-guestbook-form',
            'data': {
                'name': $('#JS_SHW_FRM').attr('data-name'),
                'website': $('#JS_SHW_FRM').attr('data-website'),
                'entry': $('#JS_SHW_FRM').attr('data-entry')
            },
            'success': function(data)
            {
                $('.guestbookForm .flt_lft').before(data);
                $('#frm').show();
                setTimeout(function(){ $('#frm').removeClass('initial_hidden') }, 500);
                $('#entry').wysiwyg();
            }
        });

        $('#JS_SHW_FRM').unbind('click', showForm);
        $('#JS_SHW_FRM').remove();
        return false;
    };

    $('#JS_SHW_FRM').bind('click', showForm)
}

function insert_smiley(smiley)
{
    var currentData = $('#entry').val();
    var control     = $.data( $('#entry')[0], 'wysiwyg' );
    control.setContent(currentData + smiley );
}
