_ = require 'lodash'

# Returns the name of the event that's trigger for the current browser
# when an animation ends. Results are cached using _.once.
module.exports = _.once ->
  fakeElement = document.createElement 'fake'
  animationEventNames =
    animation: 'animationend'
    OAnimation: 'OAnimationEnd'
    MozAnimation: 'animationend'
    WebkitAnimation: 'webkitAnimationEnd'

  for style, name of animationEventNames
    if fakeElement.style[style]?
      return name
