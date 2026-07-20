$ = require 'jquery'

# Stretch content behaviour
#
# Certain elements are given the height of the viewport on load and orientation change.
# Can't use CSS height: 100%, because it doesn't exclude browser chrome in iOS Safari
#
# TODO - only apply styles to appropriate media queries
module.exports = ->
  $(window).on 'load resize orientationchange', (e) ->
    width = window.innerWidth
    height = window.innerHeight
    heightify = (selector) -> $(selector).css 'height', height

    heightify '.hero--front'
    heightify '.hero--features'
    heightify '.fixed-vackground'
