View = require '../../view'

class PricingView extends View
  className: 'page pricing-page'
  template: 'page/pricing'
  title: 'Toggl Pricing: free, Pro, Pro Plus & Business package prices'
  meta: [
    name: 'description'
    content: 'From free timer app to powerful business intelligence & time management tool. Pick the best time management package for your needs.'
  ]

module.exports = PricingView
