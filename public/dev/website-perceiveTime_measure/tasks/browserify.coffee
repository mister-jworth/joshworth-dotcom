'use strict'
browserify = require 'browserify'
gulp = require 'gulp'
refresh = require 'gulp-livereload'
sourcemaps = require 'gulp-sourcemaps'
uglify = require 'gulp-uglify'
_ = require 'lodash'
buffer = require 'vinyl-buffer'
source = require 'vinyl-source-stream'
watchify = require 'watchify'

lrserver = require('./serve')._lrserver

NO_SOURCE_MAPS = process.env.NO_SOURCE_MAPS || false
NO_MINIFICATION = process.env.NO_MINIFICATION || false

exit = (err) ->
  console.error err.stack
  process.exit err.code || 1

# External packages to be put in the "vendor" browserify bundle
EXTERNAL_MODULES = Object.keys(require('../package.json').dependencies)

togglBundler = watchify(browserify(_.extend({
  entries: './dist/.tmp/app/toggl.js'
  extensions: ['.coffee', '.hbs', '.js']
  debug: if NO_MINIFICATION and NO_SOURCE_MAPS then false else true
}, watchify.args)))

exports.toggl = ->
  bundler = togglBundler
  bundler.external(EXTERNAL_MODULES)

  output = bundler.bundle()
    .pipe(source('toggl.js'))
    .pipe(buffer())

  unless NO_MINIFICATION
    output = output
      .pipe(sourcemaps.init(loadMaps: true))
      .pipe(uglify())
      .pipe(sourcemaps.write())

  output = output
    .pipe(gulp.dest('./dist/javascripts/'))
    .pipe(refresh(lrserver))

  output.on 'error', exit
  output

exports.toggl.dependencies = ['coffeescript', 'handlebars', 'copy:toggl-javascript']

vendorBundler = watchify(browserify(_.extend({
  entries: []
  debug: if NO_MINIFICATION and NO_SOURCE_MAPS then false else true
}, watchify.args)))

exports.vendor = ->
  bundler = vendorBundler
  bundler.require(EXTERNAL_MODULES)

  output = bundler.bundle()
    .pipe(source('vendor.js'))
    .pipe(buffer())
  unless NO_MINIFICATION
    output = output.pipe(sourcemaps.init(loadMaps: true))
    .pipe(uglify())
    .pipe(sourcemaps.write())
  output = output.pipe(gulp.dest('./dist/javascripts/'))
    .pipe(refresh(lrserver))

  output.on 'error', exit
  output
