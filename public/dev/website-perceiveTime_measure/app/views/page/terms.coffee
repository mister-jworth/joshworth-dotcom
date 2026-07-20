View = require '../../view'

class TermsView extends View
  template: 'page/terms'
  title: 'Toggl Terms of Service: safe and secure time tracker'
  
  initialize: ({ simple }) ->
    super
    @attributes.simple = simple


module.exports = TermsView
