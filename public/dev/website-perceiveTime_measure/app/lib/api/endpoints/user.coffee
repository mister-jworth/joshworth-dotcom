module.exports = (api) ->
  # Creates a new user with the email, password, and timezone.
  signup: (data) ->
    data.created_with = api.name
    return api.request 'post', 'signups',
        processData: false
        contentType: 'application/json'
        data: JSON.stringify(user: data)

  # Initializes a google login
  initGoogleLogin: (remember) ->
    state = if remember then "login_remember" else "login"
    api
      .request 'get', "oauth_url?state=#{state}", dataType: undefined
      .then (result) -> document.location = result

  # Completes a google login
  completeGoogleLogin: (code, remember_me) ->
    api
      .setAuth code, 'oauth_code'
      .request 'post', 'sessions',
        contentType: 'application/json'
        data: JSON.stringify
          remember_me: remember_me
          created_with: api.name

  # Creates an user with Google OAuth. This will trigger a redirect to an
  # OAuth page, which redirect back to the app on success, and should be
  # handled with `completeGoogleSignup`.
  initGoogleSignup: ->
    api
      .request 'get', 'oauth_url?state=signup', dataType: undefined # The response isn't JSON; see SO question 6186770
      .then (result) -> document.location = result

  # Completes an OAuth Sign-up given a token (which should be available on
  # redirect).
  completeGoogleSignup: (code, tz) ->
    api
      .request 'post', 'signups',
        contentType: 'application/json'
        dataType: 'json'
        data: JSON.stringify
          code: code
          user:
            timezone: tz
            created_with: api.name
