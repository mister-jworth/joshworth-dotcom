Backbone = require 'backbone'
$ = require 'jquery'
_ = require 'lodash'
API = require './lib/api'
parseQuery = require './lib/parse-query'
redirectToApp = require './lib/redirect-to-app'

$application = $('.application')
currentView = null
renderPage = (Page, paramsObj) ->
  $(window).scrollTop 0
  currentView?.remove()
  currentView = new Page(paramsObj).render()
  $application.html(currentView.$el)
  currentView.trigger('show')
  currentView

# Create a new backbone router with the routes specified
Router = class Router extends Backbone.Router

  initialize: ->
    @on 'route', ->
      $(document.body).attr id: document.location.pathname.replace(/^\/+|\/+$/g, '')

  routes: ->
    landingRoutes = {}
    _.each require('./landing-routes'), (value, key) ->
      landingRoutes[key + '(/)'] = value
    _.extend {
      '(/)': -> renderPage require './views/page/index'
      'features(/)': -> renderPage require './views/page/features'
      'about(/)': -> renderPage require './views/page/about'
      'tools(/)': -> renderPage require './views/page/tools'
      'legal/privacy(/)': 'showPrivacy'
      'legal/terms(/)': 'showTos'
      'forgot-password(/)': -> renderPage require './views/page/forgot-password'
      'unsubscribe/:type/:token(/)': 'showUnsubscribe'
      'reset_password(/:token)': 'showResetPassword'
      'signup/user-has-invitation': 'showUserHasInvitation'
      'signup(/)(/:invitationCode)': 'showSignup'
      'login(/)': 'showLogin'
      'pricing(/)': 'showPricing'
      'business(/)': -> window.location = '/business' # hack to redirect to static page
      'again(/)': -> window.location = '/again' # hack to redirect to static page
      'feature-list(/)': -> window.location = '/feature-list' # hack to redirect to static
    }, _.mapValues landingRoutes, (params) ->
      -> renderPage require('./views/page/landing'), params

  showUnsubscribe: (type, token) ->
    Unsubscribe = require './views/page/unsubscribe'
    renderPage Unsubscribe, { token, type }

  showResetPassword: (token) ->
    ResetPassword = require './views/page/reset-password'
    renderPage ResetPassword, { token }
    @navigate 'reset_password'

  showPricing: ->
    Pricing = require './views/page/pricing'
    renderPage Pricing

  showSignup: (invitationCode) ->
    Signup = require './views/page/signup'
    page = renderPage Signup, { invitationCode }
    @listenTo page, 'login:success', redirectToApp

  showUserHasInvitation: ->
    UserHasInvitation = require './views/page/user-has-invitation'
    renderPage UserHasInvitation

  showLogin: ->
    Login = require './views/page/login'
    page = renderPage Login, { }
    @listenTo page, 'login:success', redirectToApp

  showTos: (qs) ->
    { simple } = parseQuery(qs)
    TermsPage = require './views/page/terms'
    renderPage TermsPage, { simple }

  showPrivacy: (qs) ->
    { simple } = parseQuery qs
    PrivacyPage = require './views/page/privacy'
    renderPage PrivacyPage, { simple }

module.exports = Router
