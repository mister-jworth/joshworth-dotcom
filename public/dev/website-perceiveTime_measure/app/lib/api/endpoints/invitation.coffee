module.exports = (api) ->
  # Creates a new user with the email, password, and timezone.
  get: (code) ->
    return api.request 'get', "invitations/#{code}",
      processData: false
      url: "/api/v9/invitations/#{code}"
      dataType: 'json'
