Backbone = require 'backbone'

class UserModel extends Backbone.Model
  endpoint: '/api/v9'
  path: '/me/logged'
  locationPath: '/me/location'

  defaults:
    location:
      country_name: ''
      state: ''
      city: ''

  getBestLocation: ->
    location = @get('location')
    return location.city || location.state || location.country_name

module.exports = new UserModel
