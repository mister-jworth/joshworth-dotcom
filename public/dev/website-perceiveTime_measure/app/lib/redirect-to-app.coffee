# Redirects to the web application if on a desktop browser, otherwise redirects
# to the platform's App Store (Google Play or Apple's App Store)
#
exports = module.exports = ->
    if /iPhone|iPod/i.test(navigator.userAgent) and
       confirm('Redirecting to the App Store')
      window.open('http://itunes.apple.com/us/app/toggl-timer/id885767775?mt=8', '_top')
      setTimeout((-> document.location.href = ''), 1000)
      return
    else if /Android/i.test(navigator.userAgent) and
       confirm("Our web application doesn't support mobile devices.
               Would you like to be redirected to download our mobile App?")
      window.open('https://play.google.com/store/apps/details?id=com.toggl.timer&hl=en', '_top')
      setTimeout((-> document.location.href = ''), 1000)
      return
    document.location = '/app'

exports.hasMobileApp = ->
    /iPhone|iPod|Android/i.test(navigator.userAgent)

