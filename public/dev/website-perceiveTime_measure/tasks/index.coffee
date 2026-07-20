'use strict'
chalk = require 'chalk'
gutil = require 'gulp-util'
requireDirectory = require 'require-directory'

# Bootstraps the tasks directory into gulp
exports = module.exports = (gulp) ->
  tasks = requireDirectory module

  gutil.log 'Starting to bootstrap tasks'
  for prefix, taskSet of tasks
    if prefix[0] == '_' then continue

    prefixedNames = []
    for name, task of taskSet
      if name[0] == '_' then continue
      if not task instanceof Function then continue

      prefixedName = prefix + ':' + name
      prefixedNames.push prefixedName
      gulp.task prefixedName, task.dependencies || [], task

    gutil.log(
      "Bootstrapped #{chalk.cyan(prefix)} -
       #{chalk.magenta(prefixedNames.join(', '))}"
    )
    gulp.task prefix, prefixedNames
