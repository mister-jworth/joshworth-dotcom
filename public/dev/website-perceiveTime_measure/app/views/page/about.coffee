View = require '../../view'
JobPopup = require '../component/jobs-popup'
$ = require 'jquery'

class AboutView extends View
  template: 'page/about'
  title: 'Toggl Team: join us, we are hiring for flexible remote jobs'
  meta: [
    name: 'description'
    content: 'Get to know the productive and awesome people behind Toggl time tracker - and apply for one of our remote job positions!'
  ]

  postRender: ->
    $('.js-jobs-popup', @$el).on 'click', (e) ->
      e.preventDefault()
      new JobPopup().render()

module.exports = AboutView
