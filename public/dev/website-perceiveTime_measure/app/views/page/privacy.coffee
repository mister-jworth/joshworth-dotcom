View = require '../../view'

class PrivacyView extends View
  template: 'page/privacy'
  title: 'Toggl Privacy: safe and secure time management tool'

  initialize: ({ simple }) ->
    super
    @attributes.simple = simple

module.exports = PrivacyView
