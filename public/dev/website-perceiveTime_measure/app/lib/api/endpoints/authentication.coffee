require('es6-promise').polyfill()
userState = require '../../user-state-model'

module.exports = (api) ->
  # Sets the API's username and password up. Hits /me so it's
  # the same as session-based auth.
  basic: (username, password) ->
    return api
      .setAuth username, password
      .request 'get', 'me'

  # Attempts a cookie-based authentication for the session.
  session: (username, password, remember_me = false) ->
    return api
      .setAuth username, password
      .request 'post', 'sessions',
        contentType: 'application/json'
        data: JSON.stringify(
          remember_me: remember_me
          created_with: api.name
        )
      .then (args...) =>
        # on successful responses we no longer need auth data,
        # so remove it from the API
        userState.set({
          logged: true
          data: args[0]?.data
        })
        try
          @saveToSessionStorage(args[0]?.data)
        api.auth = null
        Promise.resolve args...

  saveToSessionStorage: (data) ->
    return unless sessionStorage?
    return unless data?
    sessionStorage.setItem('/api/v8/me', JSON.stringify(data))

  clearSessionStorage: (data) ->
    return unless sessionStorage?
    return unless data?
    sessionStorage.removeItem('/api/v8/me')

  # Clears a cookie-based session
  destroy: ->
    api.request 'delete', 'sessions'
    userState.set logged: false
    @clearSessionStorage(userState.get('data'))
