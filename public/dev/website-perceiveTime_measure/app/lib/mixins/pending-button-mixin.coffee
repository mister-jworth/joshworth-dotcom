$ = require 'jquery'

# A mixin for easily updating a button's pending status. Assumes the object
# defined a property `submitButton` with the target button element.
pendingButtonMixin =
  isPending: -> $(@submitButton).hasClass 'pending'

  updateStatus: (status) ->
    $submitButton = @submitButton

    switch status
      when 'pending'
        loader = @loader = @loader or document.createElement('div')

        @submitButtonOriginalText = $submitButton.text()
        loader.className = 'loader'
        $submitButton.css('height', $submitButton.outerHeight())
        $submitButton.html(loader)
        $submitButton.addClass('disabled pending cta-button--no-arrow')
        $submitButton.prop('disabled', 'disabled')
      else
        $submitButton.css('height', '')
        $submitButton.text(@submitButtonOriginalText)
        $submitButton.removeClass('disabled pending cta-button--no-arrow')
        $submitButton.prop('disabled', '')
        $submitButton.blur()

exports = module.exports = pendingButtonMixin
