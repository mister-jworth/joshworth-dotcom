'use strict'
gulp = require 'gulp'
notify = require 'gulp-notify'

exports.browserify = ->
  gulp.watch ['./app/**/*.coffee', './app/*.coffee'], ['browserify:toggl']

exports.css = ->
  gulp.watch(
    ['./app/assets/*.css', './app/assets/**/*.css'],
    ['copy:assets', 'autoprefix']
  )

exports.images = ->
  gulp.watch(
    ['./app/assets/*.{png,jpg,jpeg,svg}', './app/assets/**/*.{png,jpg,jpeg,svg}'],
    ['copy:assets', 'imagemin']
  )

exports.html = ->
  gulp.watch(
    ['./app/assets/*.html', './app/assets/**/*.html'],
    ['copy:assets', 'htmlmin']
  )

exports.handlebars = ->
  gulp.watch(
    ['./app/templates/*.hbs', './app/templates/**/*.hbs'],
    ['handlebars', 'browserify:toggl']
  )

exports['toggl-javascript'] = ->
  gulp.watch ['./app/lib/hooks/page/*.js'], ['copy', 'browserify']

exports._after = ->
  notify('Done').write({})
