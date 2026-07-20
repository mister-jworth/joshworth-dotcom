View               = require '../../view'
formData           = require '../../lib/form-data'
pendingButtonMixin = require '../../lib/mixins/pending-button-mixin'
$                  = require 'jquery'
_                  = require 'lodash'

class ForgotPasswordView extends View
  template: 'page/forgot-password'
  title: 'Forgot Toggl password?'

  events:
    'submit': 'forgotPassword'

  showInfo: (msg) =>
    @errorMessage.fadeOut =>
      @infoMessage.html(msg).fadeIn()

  showError: (msg) =>
    @infoMessage.fadeOut =>
      @errorMessage.html(msg).fadeIn()

  forgotSuccess: =>
    @showInfo 'An email containing instructions to reset your password has been sent.'

  forgotError: (err) =>
    @showError switch err.responseText
      when 'E-mail address does not exist'
        'Unknown email, please check that it\'s entered correctly!'
      else
        if err.responseText
          err.responseText
        else
          'Failed to trigger a password reset.\n\
          Make sure you\'re connected to the internet'

  forgotPassword: (e) =>
    e.preventDefault()
    data = formData @$el.find 'form'
    return @showError 'Please enter an email below.' unless data.email

    return if @isPending()
    @updateStatus('pending')

    req = $.ajax
      url: '/api/v9/me/lost_passwords'
      method: 'POST'
      contentType: 'application/json'
      success: @forgotSuccess
      error: @forgotError
      data: JSON.stringify email: data.email

    req.then(
      (=> @updateStatus('done')),
      (=> @updateStatus('done'))
    )

  postRender: ->
    setTimeout => @$el.find("[name=email]").select()
    @infoMessage  = @$ '.signup-form__info'
    @errorMessage = @$ '.signup-form__error'
    @submitButton = @$ '.signup-form__submit button'

_.extend(ForgotPasswordView.prototype, pendingButtonMixin)

module.exports = ForgotPasswordView
