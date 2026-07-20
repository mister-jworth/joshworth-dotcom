gulp = require 'gulp'
imagemin = require 'gulp-imagemin'
gzip = require 'gulp-gzip'

exports.all = ->
  gulp.src('./dist/{,**/}*.{jpg,png,jpeg,svg,gif}')
    .pipe(imagemin())
    .pipe(gzip())
    .pipe(gulp.dest('./dist/'))

exports.all.dependencies = ['copy']
