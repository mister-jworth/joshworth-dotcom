$   = require 'jquery'
API = require '../../../lib/api'

module.exports = (view) ->
  view.$('.js-logout-button').on 'click', (e) ->
    e.preventDefault()
    new API('TogglNext', null, null).auth.destroy()
