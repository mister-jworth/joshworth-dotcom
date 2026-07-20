var Device = {
    detect: function(key) {
        if(this['_'+key] === undefined) { this['_'+key] = navigator.userAgent.match(new RegExp(key, 'i')); }
        return this['_'+key];
    },
    // check for android to find android tablets
    isMobile: function() { return navigator.userAgent.match(/mobile/i) || navigator.userAgent.match(/android/gi);},
    iDevice: function() { return this.detect('iPhone') || this.detect('iPod') || this.detect('iPad'); },
    iPad: function() { return this.detect('iPad'); },
    svg: function() { return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1"); }
};

$(function() {

    var setVideoContainer = function() {
        var ratio = 1.8,
            $c = $('#video-container'),
            w = $c.width(),
            h = $c.height();

        if (w/h > ratio) {
            $c.children('video').css({
                'width' : '100%',
                'height' : 'auto'
            });
        }
        else {
            $c.children('video').css({
                'height' : '100%',
                'width' : 'auto'
            });
        }
    };

    setVideoContainer();
    $(window).resize(setVideoContainer);


    var videoModal;
    $('.btn-video').click(function(event) {
        event.preventDefault();

        if (!videoModal) {
            videoModal = new $.modal({});
            videoModal.getContainer().on('hide', function() {
                videoModal.getContainer().find('.overlay-popup').empty();
            });
        }

        videoModal.setContent($('#video-modal-tpl').html());
        videoModal.show();
    });

    if (!Device.isMobile()) {
        $('#video-container video').show();
    }


});


(function() {

    var matched, browser;
    // Use of jQuery.browser is frowned upon.
    // More details: http://api.jquery.com/jQuery.browser
    // jQuery.uaMatch maintained for back-compat
    jQuery.uaMatch = function( ua ) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
            /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
            /(msie) ([\w.]+)/.exec( ua ) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
            [];
        return {
            browser: match[ 1 ] || "",
            version: match[ 2 ] || "0"
        };
    };
    matched = jQuery.uaMatch( navigator.userAgent );
    browser = {};
    if ( matched.browser ) {
        browser[ matched.browser ] = true;
        browser.version = matched.version;
    }

    // Chrome is Webkit, but Webkit is also Safari.
    if ( browser.chrome ) {
        browser.webkit = true;
    } else if ( browser.webkit ) {
        browser.safari = true;
    }

    jQuery.browser = browser;

})();


(function($) {
    'use strict';
    var $request   = $('.request-meeting'),
        $specifics = $('.request-specifics');

    function postRequest(location, email) {
        return $.ajax({
            type: 'POST',
            url: 'https://meet.toggl.com/request/',
            contentType: 'application/json; charset=utf-8',
            crossDomain: true,
            data: JSON.stringify({
                email: email,
                location: location
            })
        });
    }

    function fadeTransition($target, $el, cb) {
        var timeout = 100;
        $target.fadeOut(timeout, function() {
            $el.fadeIn(timeout, cb);
        });
    }

    function findFromClosest (e, selector) {
        return $(e.currentTarget).closest('.content').find(selector);
    }

    $request.on('click', 'a', function(e) {
        e.preventDefault();
        var $req = findFromClosest(e, '.request-meeting'),
            $spe = findFromClosest(e, '.request-specifics');

        fadeTransition($req, $spe, function() {
            $spe.find('input').select();
        });
    });

    $specifics.on('submit', function(e) {
        e.preventDefault();
        var $failed = findFromClosest(e, '.request-failed'),
            $done   = findFromClosest(e, '.request-done'),
            $spe    = $(this);

        var email    = $.trim($spe.find('input').val()),
            location = $(e.target).data('location');

        if (!email.length) { return; }

        postRequest(location, email).done(function() {
            fadeTransition($spe, $done);
        }).fail(function() {
            fadeTransition($spe, $failed);
        });
    });

}(window.jQuery));
