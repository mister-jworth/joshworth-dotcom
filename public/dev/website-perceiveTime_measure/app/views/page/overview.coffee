View = require '../../view'

# Overview page with a summary of Toggl's feature.
# It is shown to users after Sign Up. Mobile users
# get redirected to the App Store instead of being
# shown this overview.
#
class Overview extends View
  className: 'page overview-page'
  template: 'page/overview'
  title: 'Overview — Toggl, The Simplest Time Tracker'

module.exports = Overview
