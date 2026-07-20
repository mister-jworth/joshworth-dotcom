module.exports = (config) ->
  config.set
    basePath: './'
    browsers: [
      'PhantomJS'
      #'Chrome'
    ]
    frameworks: [ 'browserify', 'mocha', 'sinon-expect' ]
    reporters: [ 'progress', 'coverage' ]

    browserify:
      transform: [ 'coffeeify' ]
      extensions: [ '.js', '.coffee' ]
      debug: true
      watch: true # Watches dependencies only (Karma watches the tests)

    files: [
      # Init the actual tests
      './test/**/*.spec.coffee'
      './test/*.spec.coffee'
      './test/**/*.test.coffee'
      './test/*.test.coffee'
    ]

    preprocessors:
      './test/**/*.coffee': [ 'browserify' ]
      './test/*.coffee': [ 'browserify' ]

    coverageReporter:
      type: 'text'

    logLevel: 'debug'
