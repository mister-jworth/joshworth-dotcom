View               = require '../../view'
API                = require '../../lib/api'
formData           = require '../../lib/form-data'
redirectToApp      = require '../../lib/redirect-to-app'
$                  = require 'jquery'
_                  = require 'lodash'
showAlert          = require '../../lib/show-alert'
pendingButtonMixin = require '../../lib/mixins/pending-button-mixin'


class ResetPasswordView extends View
  template: 'page/reset-password'
  title: 'Reset your Toggl password'

  initialize: ({@token}) -> super

  events:
    submit: 'resetPassword'

  showError: (msg) =>
    @errorMessage.html(msg).show()

  hideError: =>
    @errorMessage.hide()

  resetSuccess: =>
    @showError 'Your password has now been reset.'

  resetError: (err) =>
    @showError err.responseText || "Failed to reset password. Please make sure you're online."

  loginErr: (err) =>
    @showError err?.responseText || 'Couldn\'t log you in. Please try again manually!'

  loginUser: ({email}) =>
    data = formData @$el.find 'form'
    new API('dev', null, null)
      .auth.session email, data.password
      .then redirectToApp, @loginErr
      .catch @loginErr

  resetPassword: (e) =>
    e.preventDefault()
    @hideError()
    data = formData(@$el.find 'form')
    data.user_id = @user_id

    if not data.password?.length
      @showError 'Please enter a new password for your account'
      return

    match = data.password is data.passwordConfirm
    if  not match
      @showError 'Passwords do not match'
      return

    @updateStatus('pending')

    $.ajax '/api/v9/me/lost_passwords/confirm',
      type: 'POST'
      data: JSON.stringify data
      contentType: "application/json"
      dataType: "json"
      success: @loginUser
      error: @resetError
      complete: => @updateStatus('done')

  showRedirectAlert: (seconds, callback) ->
    showAlert {
      title: "Invalid token."
      text: "You will be redirected to our homepage in <strong>#{seconds}</strong> second#{if seconds is 1 then '' else 's'}..."
      mobileText: "You will be redirected to our homepage..."
      type: 'error'
      html: true
    }, callback

  showInvalidTokenError: =>
    countDown = null
    secondsLeft = 5

    redirect = =>
      clearInterval countDown
      document.location = '/'

    @showRedirectAlert(secondsLeft, redirect)

    unless showAlert.usingMobile()
      countDown = setInterval =>
        @showRedirectAlert --secondsLeft, redirect
        redirect() unless secondsLeft
      , 1000

  preRender: ->
    $.ajax
      url: "/api/v9/me/lost_passwords/#{@token}"
      method: 'GET'
      success: ({@user_id}) =>
      error: @showInvalidTokenError

  postRender: ->
    setTimeout => @$el.find("[name=password]").select()
    @errorMessage = $ '.signup-form__error', @$el
    @$el.find('#reset_code').val @token
    @submitButton = @$ '.signup-form__submit button'

_.extend(ResetPasswordView.prototype, pendingButtonMixin)

module.exports = ResetPasswordView
