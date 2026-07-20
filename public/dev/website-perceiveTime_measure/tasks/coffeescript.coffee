gulp = require 'gulp'
coffee = require 'gulp-coffee'
sourcemaps = require 'gulp-sourcemaps'

exports.all = ->
  gulp.src(['./app/*.coffee', './app/**/*.coffee'])
    .pipe(sourcemaps.init(loadMaps: true))
    .pipe(coffee(bare: true))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/.tmp/app/'))
