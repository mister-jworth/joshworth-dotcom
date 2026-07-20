'use strict'
gulp = require 'gulp'
modernizr = require 'gulp-modernizr'
sourcemaps = require 'gulp-sourcemaps'
uglify = require 'gulp-uglify'

NO_SOURCE_MAPS = process.env.NO_SOURCE_MAPS

exports.assets = ->
  gulp.src(['app/assets/**/*', 'app/assets/*'], base: 'app/assets/')
    .pipe(gulp.dest('dist/'))

exports.modernizr = ->
  src = gulp.src('./dist/javascripts/toggl.js')
  src = src.pipe(sourcemaps.init(loadMaps: true)) unless NO_SOURCE_MAPS
  src = src
    .pipe(modernizr({
      parseFiles: false
      extra:
        shiv: true
        load: true
        cssclasses: true
    }))
    .pipe(uglify())
  src = src.pipe(sourcemaps.write()) unless NO_SOURCE_MAPS
  src.pipe(gulp.dest('./dist/javascripts/'))
exports.modernizr.dependencies = ['browserify', 'copy:assets']

exports['toggl-javascript'] = ->
  gulp.src(['./app/lib/hooks/page/*.js'])
    .pipe(gulp.dest('./dist/.tmp/app/lib/hooks/page/'))
