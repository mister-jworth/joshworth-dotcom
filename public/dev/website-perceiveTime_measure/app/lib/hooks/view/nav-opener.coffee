$ = require 'jquery'

# Navigation opening button behaviour
#
# Clicking on .nav-opener toggles 'nav-visible' class on the html element,
# when the html element has this class, main navigation is displayed
# in mobile view.
module.exports = (view) ->
  $body = $ 'body'
  $page = view.$el
  $main = view.$ '.main-nav'
  $btn = view.$ '.nav-opener'

  navOpenerClick = (e) ->
    e.stopPropagation()
    opened = $body.toggleClass('nav-visible').is('.nav-visible')

    if opened
      $page.on 'click', navSideClick
      $main.css 'height', window.innerHeight
    else
      $page.off 'click', navSideClick

  navSideClick = (e) ->
    $body.removeClass 'nav-visible'
    $page.off 'click', navSideClick

  $btn.on 'click', navOpenerClick
