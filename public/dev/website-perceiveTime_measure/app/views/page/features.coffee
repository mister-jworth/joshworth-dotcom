View = require '../../view'

class FeaturesView extends View
  template: 'page/features'
  title: 'Toggl Features: calculate work hours & billable hours, employee timesheets'
  meta: [
    name: 'description'
    content: 'Best time management tool for calculating employee work hours or billable client hours. Useful timer app for both freelancers and small businesses.'
  ]
  hooks: ['timer', 'piechart', 'reveal']

module.exports = FeaturesView
