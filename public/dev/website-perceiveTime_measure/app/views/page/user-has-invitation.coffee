View = require '../../view'

class UserHasInvitationView extends View
  className: 'page user-has-invitation-page'
  template: 'page/user-has-invitation'
  title: 'Toggl Signup: track your work hours!'
  meta: [
    name: 'description'
    content: 'Start now - use the timer app and calculate work hours. Analyze business profitability, personal productivity or keep track of employee timesheets.'
  ]

module.exports = UserHasInvitationView
