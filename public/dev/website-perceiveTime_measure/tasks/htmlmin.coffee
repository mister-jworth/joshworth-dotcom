gulp = require 'gulp'
htmlmin = require 'gulp-htmlmin'

exports.all = ->
  gulp.src('./dist/{**/,}*.html')
    .pipe(htmlmin(
      removeComments: true
      collapseWhitespace: true
    ))
exports.all.dependencies = ['copy']
