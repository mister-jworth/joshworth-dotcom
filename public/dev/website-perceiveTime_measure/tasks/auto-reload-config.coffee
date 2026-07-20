'use strict'
child_process = require 'child_process'
chalk = require 'chalk'
gulp = require 'gulp'
notify = require 'gulp-notify'
gutil = require 'gulp-util'
read = require 'read'

spawn = child_process.spawn

exports.gulp = ->
  child = undefined
  restart = ->
    if child
      gutil.log(chalk.red("!! Killing Gulp process #{child.pid}"))
      child.killed = true
      child.kill()

    gutil.log("#{chalk.red('!!')} Starting Gulp child process")
    child = spawn 'gulp', ['all'],
      stdio: 'inherit'

    child.on 'exit', ->
      return if @killed
      notify('Gulp child process died').write({})
      read prompt: 'Child died. Restart? (y/n) ', (err, answer) ->
        if answer == 'y' then restart()
        else process.exit(1)

    gutil.log("#{chalk.red('!!')} Child running at PID
               #{chalk.magenta(child.pid)}")
  gulp.watch ['gulpfile.coffee', 'tasks/*.coffee'], ->
    gutil.log("#{chalk.red('!!')} Gulp configuration changed")
    restart()
  restart()
