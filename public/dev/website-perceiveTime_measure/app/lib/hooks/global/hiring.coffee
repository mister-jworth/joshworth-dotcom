require 'custom-event-polyfill' # Needed for devtools-detect or IE will start spilling exceptions like crazy
require 'devtools-detect'

alreadyOpened  = false

isSaneBrowser = ->
  /(chrome|firefox)/.test(navigator.userAgent.toLowerCase())

GROUP_TITLE = "Stay awhile and listen"
TITLE = "   What are you waiting for? Join us!"
TITLE_CSS = "background-image: url('/app/images/logo-big.png');
             background-repeat: no-repeat;
             background-size: 45px 45px;
             font-size: 40px;
             line-height: 2;
             font-weight: bold;"

MSG     = "We are in a dire need of good people. Apply now! http://jobs.toggl.com"
MSG_CSS = "font-size:15px; line-height: 2"

# Display a "Toggl is hiring" message in the js console
module.exports = ->
  window.addEventListener 'devtoolschange', (e) ->
    return if alreadyOpened or not e.detail.open
    return unless isSaneBrowser()
    alreadyOpened = true
    console.group?(GROUP_TITLE)
    console.log("%c#{TITLE}", TITLE_CSS)
    console.log("%c#{MSG}", MSG_CSS)
    console.groupEnd?()
