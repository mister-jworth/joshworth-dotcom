View = require '../../view'

class LandingView extends View

  initialize: ({template, @title, meta}) ->
    super
    @meta = meta or @meta
    @template = "page/landing/#{template}"

module.exports = LandingView
