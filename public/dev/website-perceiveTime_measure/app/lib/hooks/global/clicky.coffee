Backbone = require 'backbone'
clicky = require 'clicky-loader'
$ = require 'jquery'

clicky.init(100857897)

DATA_KEY = '[data-clicky]'

$(document).on 'click', DATA_KEY, (e) ->
  action = $(e.currentTarget).closest(DATA_KEY).data('clicky')?.split(':')
  url   = document.location.pathname
  title = action[0]
  type  = action[1]
  clicky.log url, title, type

DATA_GOAL_KEY = '[data-custom-analytics-event]'
$(document).on 'click', DATA_GOAL_KEY, (e) ->
  goal = $(e.currentTarget).closest(DATA_GOAL_KEY).data('custom-analytics-event')
  clicky.goal(goal)
