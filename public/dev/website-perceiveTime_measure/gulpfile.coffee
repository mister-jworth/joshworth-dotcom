'use strict'
gulp = require 'gulp'

# Bootstrap `tasks` directory
require('./tasks')(gulp)

gulp.task 'build', ['browserify', 'copy', 'autoprefix']
gulp.task 'default', ['auto-reload-config']
gulp.task 'all', [
  'coffeelint'
  'build'
  'copy'
  'imagemin'
  'htmlmin'
  'serve'
  'watch'
]
