Backbone           = require 'backbone'
$                  = require 'jquery'
_                  = require 'lodash'
View               = require '../../view'
API                = require '../../lib/api'
formData           = require '../../lib/form-data'
pendingButtonMixin = require '../../lib/mixins/pending-button-mixin'

class UnsubscribeView extends View
  template: 'page/unsubscribe'
  title: 'Unsubscribe from Toggl e-mails - Toggl, The Simplest Time Tracker'

  events:
    'click .js-unsubscribe': 'onClickUnsubscribe',

  initialize: ({@type, @token}) ->
    super
    @readableType = @getReadableType @type
    unless @readableType
      document.location = '/not-found'
    @attributes =
      description: "Click the button below to unsubscribe from the #{@readableType}"

  postRender: ->
    @description = @$('.js-description')
    @submitButton = @$('.js-unsubscribe')
    @errorMessage = @$('.js-error')

  showError: (err = "We couldn't automatically unsubscribe you. Please contact support.") ->
    if err.indexOf('Error') is -1
      err = 'Error: ' + err
    @errorMessage.text(err)
    @errorMessage.show()

  getReadableType: ->
    if @type is 'disable_weekly_report'
      'Toggl weekly report'
    else if @type is 'disable_product_emails'
      'Toggl product e-mails'

  onClickUnsubscribe: (e) ->
    e?.preventDefault()
    e?.stopPropagation()

    return if @isPending()
    @updateStatus('pending')

    oldValue = @description.text()
    @description.text('Unsubscribing...')

    jqhr = $.post "/api/v9/me/#{@type}/#{@token}", =>
      @errorMessage.hide()
      @submitButton.hide()
      @updateStatus('done')
      @description.text("You're no longer subscribed to the #{@readableType}")
    jqhr.fail (err) =>
      @updateStatus('done')
      @showError(err.responseText)
      @description.text(oldValue)

_.extend(UnsubscribeView.prototype, pendingButtonMixin)

exports = module.exports = UnsubscribeView
