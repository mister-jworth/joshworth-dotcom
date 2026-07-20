'use strict'
gulp = require 'gulp'
autoprefixer = require 'gulp-autoprefixer'
minifyCss = require 'gulp-minify-css'
rename = require 'gulp-rename'
sourcemaps = require 'gulp-sourcemaps'

NO_SOURCE_MAPS = process.env.NO_SOURCE_MAPS

exports.style = ->
  src = gulp.src('./app/assets/stylesheets/style.css', base: 'app/assets/stylesheets')
  src.pipe(sourcemaps.init()) unless NO_SOURCE_MAPS
  src = src
    .pipe(autoprefixer())
    .pipe(minifyCss())
  src = src.pipe(sourcemaps.write()) unless NO_SOURCE_MAPS
  src
    .pipe(rename('style.autoprefixed.css'))
    .pipe(gulp.dest('./dist/stylesheets/'))
