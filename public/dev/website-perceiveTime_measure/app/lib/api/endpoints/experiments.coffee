module.exports = (api) ->
  obmData: ->
    return api.request 'get', '/me/experiments',
      contentType: 'application/json'
