$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
_ = require 'lodash'

# Import the precompiled templates
Handlebars = require 'handlebars'
templates = require('./templates')(Handlebars)

# Get the view "hooks"
hooks = require './lib/hooks'

DEFAULT_META_TAGS = [{
  name: 'Description'
  content: 'Leading employee time management software. Features a simple online timer, visual timesheet reports and billable hours that help see where the time goes.'
}, {
  name: 'Keywords'
  content: 'time tracking, online timer, timesheets, time management system, employee time tracking, productivity tracking, work hours'
}, {
  property: 'og:image'
  content: 'https://toggl.com/images/share-img/fb-share-img.jpg'
}]

# This serves as a basis for our other views, doing the "heavy lifting" of
# templating behind the scenes for us.
class View extends Backbone.View
  className: -> 'page'
  model: require './lib/user-state-model'
  attributes: {}

  initialize: ->
    @meta ?= DEFAULT_META_TAGS
    @listenTo @model, 'change:logged', @updateLogged
    @listenTo @model, 'change:location', @updateFooterGeolocation

  remove: ->
    # There's no View::triggerMethod without Marionette
    @onBeforeRemove?()
    @trigger('before:remove')
    super
    @onRemove?()
    @trigger('remove')

  render: ->
    @.trigger 'pre-render'
    @preRender?()
    data = _.extend @model.toJSON(), @attributes
    @changeMetaTags()
    @updateCanonicalTag()
    @$el.html templates[@template] data
    document.title = @title if @title?
    @bindHooks()
    @postRender?()
    @scrollToAnchor()
    @updateLogged @model, @model.get('logged')
    @updateFooterGeolocation()
    return this

  updateFooterGeolocation: ->
    location = @model.getBestLocation()
    return unless location
    @$('#footer-togglers').html("Most productive togglers are in #{location}!")

  updateLogged: (model, logged) ->
    if logged
      @$('.not-logged').css('display', 'none')
      @$('.logged').attr('style', '') # removes js-defined styles
    else
      @$('.not-logged').attr('style', '')
      @$('.logged').css('display', 'none')

  changeMetaTags: ->
    $("meta[property='og:image'], meta[property='og:image:secure_url']").remove()

    CUSTOM_META_CLASS = 'custom-meta-tag'
    # Remove all old custom meta tags
    $(".#{CUSTOM_META_CLASS}").remove()

    meta = @prepareMetaTags()
    for metaOpts in meta
      tag = $ '<meta/>', _.extend metaOpts, class: CUSTOM_META_CLASS
      $('head').prepend tag

  prepareMetaTags: ->
    meta = _.clone(@meta, true)

    meta.push { property: 'og:title', content: @title } if @title?
    meta.push { property: 'og:url', content: @getCanonicalUrl() }

    description = _.find meta, { name: 'description' }
    meta.push { property: 'og:description', content: description.content } if description?

    ogImage = _.find meta, { property: 'og:image' }
    if not ogImage?
      ogImage = _.find DEFAULT_META_TAGS, { property: 'og:image' }
      meta.push ogImage
    meta.push { property: 'og:image:secure_url', content: ogImage.content }

    return meta

  updateCanonicalTag: ->
    address = @getCanonicalUrl()
    $('[rel=canonical]').remove()
    tag = $('<meta/>', rel: 'canonical', href: address)
    $('head').prepend tag

  getCanonicalUrl: ->
    address = window.location.href
    # force https, remove www, subdomain and force toggl.com domain
    address = address.replace(/^.*toggl(\.[A-z]+)+(\:\d+)?\//, 'https://toggl.com/')
    address = address.replace(/\?.*/, '') # remove url query
    if _.endsWith(address, '/')
      address = address.slice(0, -1) # remove trailing slash
    return address

  scrollToAnchor: ->
    hash = location.hash
    return unless hash
    $hash = $(hash)
    return unless $hash.length
    position = $hash.offset().top
    $(document.body).scrollTop position

  bindHooks: ->
    # Run view cooks
    hook(this) for hook in hooks.view
    # Run page hooks
    hooks.page[hook](this) for hook in @hooks if @hooks?

module.exports = View
