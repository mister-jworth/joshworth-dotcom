View               = require '../../view'
API                = require '../../lib/api'
formData           = require '../../lib/form-data'
pendingButtonMixin = require '../../lib/mixins/pending-button-mixin'
redirectToApp      = require '../../lib/redirect-to-app'
$                  = require 'jquery'
_                  = require 'lodash'

isTogglLink = (str) ->
  if not str?
    return false
  # Local URL ("/app/reports/...")
  if str.charAt(0) is '/' and str.charAt(1) isnt '/'
    return true
  /^(https?:\/\/)?(www\.)?([^.]+\.)?toggl\.com/.exec(str)?

class LoginPage extends View
  template: 'page/login-page'

  initialize: (options) ->
    @returnTo = options?.returnTo
    @expired = options?.expired
    super

  setRememberMeCookie: (rememberMe) ->
    $.cookie 'remember_me', rememberMe, path: '/'

  googleLogin: ->
    form = formData @form
    @setRememberMeCookie form.remember_me
    new API('TogglNext', null, null).user.initGoogleLogin(form.remember_me)

  redirectToApp: =>
    if @returnTo? and isTogglLink(@returnTo)
      document.location = @returnTo
    else redirectToApp()

  showError: (msg) ->
    @errorMessage.html(msg).css('visibility', 'visible');

  submitLogin: (data) ->
    loginErr = (err) =>
      @showError err?.responseText || 'The email/password combination used was not found on the system.'

    return if @isPending()
    @updateStatus 'pending'

    # Stop listening to model changes so the login form isn't rerendered before
    # the redirect.
    @stopListening(@model, 'change')
    @setRememberMeCookie data.remember_me

    new API('TogglNext', null, null)
      .auth.session data.email, data.password, data.remember_me
      .then @redirectToApp
      .catch(=>
        loginErr()
        @listenTo @model, 'change', @render
      )
      .then(=> @updateStatus 'done')

  startSubmit: (e) =>
    e.preventDefault()
    @errorMessage?.css('visibility', 'hidden');

  showAnnouncement: ->
    @siteOptionsModel = require('../../lib/site-options-model')()
    @listenTo @siteOptionsModel, 'change', @renderAccouncement
    @renderAccouncement()

  renderAccouncement: ->
    return if not @siteOptionsModel.get('loginForm')
    onOff = !!@siteOptionsModel.get('loginForm').showAnnouncement
    @errorMessage.css('visibility', 'hidden') if onOff
    @announcementMessage.toggle onOff
    @announcementMessage.html @siteOptionsModel.get('loginForm').announcement

  # Then bind hooks appropriately.
  postRender: ->
    @errorMessage = @$ '.login__page--error'
    @form = @$ '.login__page--form'
    @submitButton = @$ '.login__page--submit button'
    @googleButton = @$ '.__google_login'

    @form.on 'submit', (e) =>
      e.preventDefault()
      @startSubmit e
      @submitLogin(formData @form)

    @googleButton.on 'click', (e) =>
      @startSubmit e
      @googleLogin()

    emailInput = @$ 'input[name="email"]', @form
    setTimeout (-> emailInput.focus()), 0

_.extend(LoginPage.prototype, pendingButtonMixin)

module.exports = LoginPage
