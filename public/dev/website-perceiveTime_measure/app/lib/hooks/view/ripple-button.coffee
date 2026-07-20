$ = require 'jquery'

# Ripple button behaviour
#
# span.js-ripple-button__ripple is appended to each .js-ripple-button element on page load.
# Clicking on .js-ripple-button positions the .js-ripple-button__ripple element under the cursor
# and adds a class that triggers a CSS animation.
#
# When the animation end event is fired, the class is removed from the .js-ripple-button__ripple.
module.exports = (view) ->
  view.$('.js-ripple-button').on 'click', (e) ->
    return if $(e.target).hasClass('disabled') || !!e.target.disabled

    rect = e.target.getBoundingClientRect()
    $('.js-ripple-button__ripple', this).remove()

    $ripple = $ '<span class="js-ripple-button__ripple js-ripple-button__ripple--active" />'
      .appendTo this
      .css
        top: e.clientY - rect.top
        left: e.clientX - rect.left
