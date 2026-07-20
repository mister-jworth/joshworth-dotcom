View = require '../../view'
uniqueId = require '../../lib/unique-id'
formData = require '../../lib/form-data'
API = require '../../lib/api'
$ = require 'jquery'
keycode = require 'keycode'
_ = require 'lodash'

class ModalView extends View
  events:
    'click .modal-overlay__close': 'fadeAndRemove'
    'click .modal-overlay': 'onClickModalOverlay'
    'keydown': (e) -> if keycode(e) is 'esc' then @fadeAndRemove()

  onClickModalOverlay: (e) ->
    # Ignore clicks inside the modal
    $content = @$('.modal-overlay__content')
    offset = $content.offset()

    if $.contains($content.get(0), e.target)
      return

    if offset.left <= e.pageX <= offset.left + $content.width() and
       offset.top <= e.pageY <= offset.top + $content.height()
      return

    @fadeAndRemove()

  # Cleans up the body class and removes the visible class, then waits until
  # the animation is done to trigger removal
  fadeAndRemove: ->
    $('body').removeClass 'with-modal-overlay'
    @modal.removeClass 'modal-overlay--visible'
    setTimeout (=> @remove()), 150

  # Finds a adds jquery objects for re-used elements on the lgoin view.
  findElements: ->

  # Before rending, insert an element on the page for the popup to
  # be drawn into.
  preRender: ->
    id = '#' + uniqueId()
    $el = $ '<div id="' + id.slice(1) + '" />'
    $('body').append $el
    @setElement($el)

  # Then bind hooks appropriately.
  postRender: ->
    $('body').addClass 'with-modal-overlay'
    @modal = @$ '.modal-overlay'
    _.defer => @modal.addClass 'modal-overlay--visible'

module.exports = ModalView
