$(document).ready(function(){
    // Mobile Menu
    $('#mobileMenu select').bind('change', function(){
        window.location = $(this).val();
    });

    // Link Beheer
    $('.lb_location').each(function(i, location) {
        var count = $(location).find('.lb_banner').length;
        $(location).find('.lb_banner.visible').removeClass('visible');
        $(location).find('.lb_banner:eq(' + getRandomArbitrary(0, count - 1) + ')').addClass('visible');
    });
});

function getRandomArbitrary(min, max)
{
    return Math.round(Math.random() * (max - min) + min);
}

/**
 * Break out of frame & show banner
 */
function FrameBreaker(domain, url, rnd)
{
    if (top.location != location) {
        var getDomainFromUrl = function(url)
        {
            if (!url) {
                return '';
            }

            url = url.replace('http://', '').replace('https://', '').replace('www.', '');
            return url.split('/')[0];
        };

        //var domain = getDomainFromUrl(document.referrer);
        //if (domain === 'google.com') {
        //    return;
        //}

        _gaq.push(['_trackEvent', 'Framebreaker', 'Detected domain', domain]);
        setTimeout(function()
        {
            top.location.href = document.location.href + '#__frame__';
        }, 500);
    }

    // Display "frame breaker" banner
    if (window.location.hash == '#__frame__') {
        var uniqid = function(range)
        {
            return Math.floor(Math.random() * (range ? range : 100000));
        };

        var displayFramebanner = function()
        {
            var banner = document.createElement('div');
            banner.id = 'framebanner_' + uniqid();
            $(banner).css({
                '-moz-box-shadow': '#888 2px 2px 12px',
                '-webkit-box-shadow': '#888 2px 2px 12px',
                'background-color': '#005692',
                'background-image': 'url("/images/default/sites/shared/gradient-popup.png")',
                'background-repeat': 'repeat-x',
                'border': 'none',
                'box-shadow': '#888 2px 2px 12px',
                'color': '#fff',
                'display': 'block',
                'float': 'none',
                'font-family': 'Arial, sans-serif',
                'font-size': '18px',
                'font-style': 'normal',
                'font-weight': 'normal',
                'left': '-1px',
                'margin': '0',
                'min-height': '60px',
                'padding': '0',
                'position': 'fixed',
                'text-align': 'left',
                'text-decoration': 'none',
                'text-transform': 'none',
                'top': '-10em',
                'visibility': 'visible',
                'white-space': 'normal',
                'width': '100%',
                'z-index': '999999'
            });

            // Wrapper
            var wrapper = document.createElement('div');
            $(wrapper).css({
            });
            banner.appendChild(wrapper);

            // Image
            img = document.createElement('img');
            img.src = '/images/default/jibr/nl/logo.png';
            $(img).css({
                'background': 'transparent',
                'border': 'none',
                'color': '#fff',
                'display': 'block',
                'float': 'left',
                'font-family': 'Arial, sans-serif',
                'font-size': '18px',
                'font-style': 'normal',
                'font-weight': 'normal',
                'height': '35px',
                'left': '0px',
                'line-height': '1.1em',
                'margin-bottom': '0',
                'margin-left': '.5em',
                'margin-right': '1em',
                'margin-top': '.5em',
                'padding': '0px',
                'position': 'relative',
                'text-align': 'left',
                'text-decoration': 'none',
                'text-transform': 'none',
                'top': '0px',
                'visibility': 'visible',
                'white-space': 'normal',
                'width': '170px',
                'z-index': '999999'
            });
            wrapper.appendChild(img);

            // Text
            var text = document.createElement('p');
            $(text).css({
                'background': 'transparent',
                'border': 'none',
                'color': '#fff',
                'display': 'block',
                'float': 'none',
                'font-family': 'Arial, sans-serif',
                'font-size': '18px',
                'font-style': 'normal',
                'font-weight': 'normal',
                'min-height': '40px',
                'left': '0px',
                'line-height': '1.1em',
                'margin': '18px 5px',
                'margin-left': '185px',
                'padding': '0px',
                'position': 'relative',
                'text-align': 'left',
                'text-decoration': 'none',
                'text-transform': 'none',
                'top': '0px',
                'visibility': 'visible',
                'white-space': 'normal',
                'width': '100%',
                'z-index': '999999'
            });

            text.innerHTML = 'Er is nog geen domeinnaam gekoppeld aan deze gratis Webklik website.<br />';

            var a = document.createElement('a');
            a.href = url + '?utm_source=' + domain.replace('http://', '') + '&utm_medium=link&utm_campaign=framebreaker';
            a.innerHTML = 'Lees hier hoe een domein aan een Webklik website gekoppeld kan worden.';
            $(a).css({
                'background': 'transparent',
                'border': 'none',
                'color': '#fff',
                'display': 'inline',
                'float': 'none',
                'font-family': 'Arial, sans-serif',
                'font-size': '18px',
                'font-style': 'normal',
                'font-weight': 'bold',
                'left': '0px',
                'line-height': '1.1em',
                'margin': '0px',
                'padding': '0px',
                'position': 'relative',
                'text-align': 'left',
                //'text-decoration': 'none',
                'text-transform': 'none',
                'top': '0px',
                'visibility': 'visible',
                'white-space': 'normal',
                'width': '100%',
                'z-index': '999999'
            });
            $(a).hover(function()
            {
                $(this).css({'text-decoration': 'underline'});
            },
            function()
            {
                $(this).css({'text-decoration': 'none'});
            });

            text.appendChild(a);
            text.innerHTML += '<br />';

            var span = document.createElement('span');
            span.innerHTML = '* We tonen deze melding omdat deze website in een Frame werd geladen. Dit is niet toegestaan bij gratis websites.';
            $(span).css({
                'fontSize': '.7em'
            });
            text.appendChild(span);

            wrapper.appendChild(text);

            document.body.appendChild(banner);

            $(banner).animate({
                'top': '0px'
            }, 400);

            $('body').animate({
                'paddingTop': '80px'
            }, 400);
            
        };

        setTimeout(displayFramebanner, 500);
    }
}
