ModalView = require './modal'

class LoginOverlay extends ModalView
  template: 'component/login-overlay'

  updateMessage: (message) -> @$el.find('.js-modal-message').text message

  close: =>
    @fadeAndRemove()

module.exports = LoginOverlay
