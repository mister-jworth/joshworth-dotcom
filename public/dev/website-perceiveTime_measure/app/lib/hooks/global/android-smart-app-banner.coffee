$ = require 'jquery'
Handlebars = require 'handlebars'
templates = require('../../../templates')(Handlebars)

COOKIE_NAME = 'android_smart_banner_hidden'

# Show link to mobile app for mobile users
#
module.exports = ->
  if navigator.userAgent.match(/Android/i) and not $.cookie COOKIE_NAME
    meta = $('meta[name="google-play-app"]')
    appId = /app-id=([^\s,]+)/.exec(meta.attr('content'))
    $(document.body).prepend templates['component/android-smart-app-banner']()

    scale = $(window).width() / window.screen.width
    scale = 1 if scale < 1

    if scale > 1

      $('.smartbanner')
        .css
          top:    parseFloat($('.smartbanner').css('top')) * scale
          height: parseFloat($('.smartbanner').css('height')) * scale
        .hide()

      $('.smartbanner .sb-container')
        .css
          '-webkit-transform': 'scale(' + scale + ')'
          '-msie-transform':   'scale(' + scale + ')'
          '-moz-transform':    'scale(' + scale + ')'
          'width':             $(window).width() / scale

    $('.smartbanner .sb-close').on 'click', (e) ->
      $.cookie COOKIE_NAME, 1, {path: '/', expires: 60}
      $('.smartbanner').remove()

    $('.smartbanner .sb-cta').on 'click', (e) ->
      $.cookie COOKIE_NAME, 1, {path: '/', expires: 7}
