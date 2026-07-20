Backbone = require 'backbone'
class SiteOptionsModel extends Backbone.Model
  url: '/site_options.json?' + Date.now()

  initialize: ->
    @fetch()

instance = null
module.exports = -> instance ?= new SiteOptionsModel()
