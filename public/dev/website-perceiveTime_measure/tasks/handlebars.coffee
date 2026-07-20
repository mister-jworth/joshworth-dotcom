path = require 'path'
gulp = require 'gulp'
concat = require 'gulp-concat'
declare = require 'gulp-declare'
handlebars = require 'gulp-handlebars'
wrap = require 'gulp-wrap'
through2 = require 'through2'

TEMPLATES_PATH = path.join __dirname, '../app/templates/'

exports.all = ->
  gulp.src(['./app/templates/*.hbs', './app/templates/**/*.hbs'])
    .pipe(handlebars({
      handlebars: require('handlebars')
    }))
    .pipe(through2.obj((chunk, enc, cb) ->
      fp = chunk.path
      name = path.relative(TEMPLATES_PATH, fp).slice(0, -path.extname(fp).length)
      chunk.path = name

      if name.indexOf('partials/') == 0
        chunk.contents =
          new Buffer("Handlebars.registerPartial(
            '#{name.slice('partials/'.length)}',
            Handlebars.template(#{chunk.contents})
          )")
      else
        chunk.contents = new Buffer("Handlebars.template(#{chunk.contents})")

      @push(chunk)
      cb()
    ))
    .pipe(declare({
      root: 'ns'
      noRedeclare: true
      processName: (fp) -> fp
    }))
    .pipe(concat('index.js'))
    .pipe(wrap(
      'module.exports = function(Handlebars) {
         var ns = {};
         <%= contents %>\n
         return ns
      }'
    ))
    .pipe(gulp.dest('./dist/.tmp/app/templates/'))
