path = require 'path'
gulp = require 'gulp'
coffeelint = require 'gulp-coffeelint'

exports.all = ->
  gulp.src(['./app/**/*.coffee', './app/*.coffee'])
    .pipe(coffeelint(optFile: path.join __dirname, '../coffeelint.json'))
    .pipe(coffeelint.reporter())
