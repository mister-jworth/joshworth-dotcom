require('es6-promise').polyfill()
Base64    = require 'Base64'
$         = require 'jquery'
utf8      = require 'utf8'
_         = require 'lodash'
endpoints = require './endpoints'

DEFAULT_ENDPOINT = '/api/v8'

class TogglApi
  # Toggl API constructor. "Name" is required in several endpoints.
  # Username (or API token) and password (not necessary if using token)
  # can be passed here, or you can call auth.basic later.
  constructor: (name, username, password, endpoint = DEFAULT_ENDPOINT) ->
    @endpoint = endpoint
    @name = name
    @auth = null

    if !!username
      @setAuth username, password
    else if data = sessionStorage?.getItem('/api/v8/me')
      # use api_token from session storage for auth
      try
        user = JSON.parse(data)
        apiToken = user.api_token
      catch err
      @setAuth apiToken if apiToken?

    # attach endpoints to the api instance
    for key, module of endpoints
      @[key] = module this

  # Sets the authentication username (or API token) and password, if not
  # using the token, of the toggl API.
  setAuth: (username, password = 'api_token') ->
    @username = username
    @password = password
    return this

  # Constructs a new URL to the API endpoint, where `path` is relative.
  url: (path) ->
    # Don't do anything if the URL is already full.
    if path.slice(0, 4) is 'http'
      return path

    # Removing trailing slash from the endpoint and preceeding slash
    # from the path.
    if @endpoint.slice(-1) is '/'
      @endpoint = @endpoint.slice 0, -1
    if path.slice(0, 1) is '/'
      path = path.slice 1

    return [ @endpoint, path ].join '/'

  # Runs a request to the endpoint. Adds in authentication data if set.
  request: (method, path, options = {}) ->
    url = @url path

    # If we have auth settings, add the `Authorization` header
    if @username and @password
      {username, password} = this
      originalBeforeSend = options.beforeSend
      options.beforeSend = (xhr) ->
        authString = utf8.encode "#{username}:#{password}"
        authHeader = "Basic #{Base64.btoa(authString)}"
        xhr.setRequestHeader 'Authorization', authHeader
        originalBeforeSend(xhr) if originalBeforeSend

    # Create a new promise for a jquery xhr
    return new Promise (resolve, reject) ->
      $.ajax _.extend({
        type: method.toUpperCase()
        dataType: 'json'
        url: url
        success: resolve
        error: reject
      }, options)

module.exports = TogglApi
