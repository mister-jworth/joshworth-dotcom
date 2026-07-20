"use strict"
fs                = require 'fs'
path              = require 'path'
connectLiveReload = require 'connect-livereload'
matchdep          = require 'matchdep'
request           = require 'request'
_                 = require 'lodash'
glob              = require 'glob'
moment            = require 'moment'
execSync          = require('child_process').execSync
{proxyRequest}    = require 'grunt-connect-proxy/lib/utils'

timerStart = Date.now()

STAGING = process.env.STAGING || (process.env.NODE_ENV is 'staging') || false
API_HOST = "https://toggl.space" || process.env.API_HOST
API_HOST_USES_SSL = API_HOST.indexOf("https") == 0
LIVERELOAD_PORT = 35730 || process.env.LIVERELOAD_PORT
LARGE_ASSET_BASEURL_STAGING = 'https://assets.toggl.space'
LARGE_ASSET_BASEURL_PROD = 'https://assets.toggl.com'

getFileLastMod = (fileName) ->
  isoDate = execSync "git log -1 --format=\"%aI\" -- #{fileName}"
  isoDate = _.trim isoDate.toString()
  return moment(isoDate).toDate()

getMainPagesSitemapData = (appDir) ->
  include = ['index', 'features', 'pricing', 'about', 'tools', 'terms', 'privacy']
  priorities = { 'index': '1', 'features': '0.8', 'pricing': '0.8' }
  prefix = { 'terms': 'legal/', 'privacy': 'legal/' }

  mainPages = _.map glob.sync("#{appDir}/templates/page/*.hbs"), (fileName) ->
    loc = fileName.split('/templates/page/')[1].replace('.hbs', '')
    priority = priorities[loc] or '0.6'
    return { loc: loc, lastmod: getFileLastMod(fileName), priority }
  mainPages = _.filter mainPages, (page) -> page.loc in include
  mainPages.forEach (page) -> page.loc = (prefix[page.loc] or '') + page.loc

  indexPage = _.find mainPages, { loc: 'index' }
  indexPage.loc = ''

  return mainPages

getStaticPagesSitemapData = (appDir) ->
  ignore = ['not-found/', 'email-cancelled/', 'under-maintenance/']

  staticPages = _.map glob.sync("#{appDir}/static-pages/**/index.html"), (fileName) ->
    loc = fileName.split('/static-pages/')[1].replace('/index.html', '') + '/'
    return { loc: loc, lastmod: getFileLastMod(fileName), priority: '0.6' }
  staticPages = _.reject staticPages, (page) -> page.loc in ignore

  meetPage = _.find staticPages, { loc: 'meet/' }
  meetJsonModified = getFileLastMod("#{appDir}/../data/meetings.json")
  meetPage.lastmod = meetJsonModified if meetJsonModified > meetPage.lastmod

  return staticPages

getLandingPagesSitemapData = (appDir) ->
  landingRoutes = require('./app/landing-routes')
  landingPages = _.map landingRoutes, (route, routeName) ->
    fileName = "#{appDir}/templates/page/landing/#{route.template}.hbs"
    return { loc: routeName, lastmod: getFileLastMod(fileName), priority: '0.6' }
  return landingPages

getSitemapData = (appDir) ->
  mainPages = getMainPagesSitemapData(appDir)
  staticPages = getStaticPagesSitemapData(appDir)
  landingPages = getLandingPagesSitemapData(appDir)

  pages = _.union mainPages, staticPages, landingPages
  pages.sort (a, b) ->
    return a.lastmod - b.lastmod if a.priority is b.priority
    return b.priority - a.priority

  return { pages, moment }

module.exports = (grunt) ->
  # load all grunt tasks
  matchdep.filterDev("grunt-*").forEach(grunt.loadNpmTasks)

  # configurable paths
  yeomanConfig =
    app: "app"
    dist: "dist"
    tmp: ".tmp"

  # External packages to be put in the "vendor" browserify bundle
  external = [
    "jquery"
    "backbone"
    "lodash"
    "handlebars"
    "es6-promise"
    "custom-event-polyfill"
    "devtools-detect"
    "sweetalert"
  ]

  pkg = grunt.file.readJSON("package.json")

  grunt.initConfig
    yeoman: yeomanConfig

    karma:
      options:
        configFile: 'karma.conf.coffee'
      spec:
        singleRun: true
      watch:
        reporters: [ 'progress' ]
        singleRun: false
        watch: true

    connect:
      server:
        proxies: [
          {
            context: "/api/v8/"
            host: API_HOST['https://'.length..]
            https: API_HOST_USES_SSL
            secure: false
            protocol: if API_HOST_USES_SSL then 'https:' else 'http:'
            port: if API_HOST_USES_SSL then 443 else 80
          }
          {
            context: "/api/v9/"
            host: API_HOST['https://'.length..]
            https: API_HOST_USES_SSL
            secure: false
            protocol: if API_HOST_USES_SSL then 'https:' else 'http:'
            port: if API_HOST_USES_SSL then 443 else 80
          }
          {
            context: "/app"
            host: 'localhost'
            port: 3000
          }
        ]
        options:
          port: process.env.PORT or 9001
          hostname: "localhost"
          debug: true
          livereload: LIVERELOAD_PORT
          base: "dist"
          middleware: (connect, options) ->
            # Make sure we can iterate through the `base` directories
            if not Array.isArray options.base
              options.base = [options.base]

            # Try serving static files first
            serveStaticFiles = options.base.map (dir) -> connect.static dir

            # Set-up the proxy
            proxyApiRequests = proxyRequest

            # Fallback to serving `index.html` so routing is handled by Backbone
            # in the client
            fallbackToIndex = (req, res, next) ->
              indexPath = path.join(__dirname, "dist/index.html")
              indexStream = fs.createReadStream indexPath
              indexStream.pipe res

            # Return the generated middleware Array
            serveStaticFiles.concat(proxyApiRequests, fallbackToIndex)

    coffeelint:
      options:
        configFile: 'coffeelint.json'
      app: [ "<%= yeoman.app %>/{,**/}*.coffee" ]

    clean:
      dist: [
        ".tmp"
        "<%= yeoman.dist %>/*"
        "snapshots"
      ]
      server: ".tmp"

    imagemin:
      dist:
        files: [
          expand: true
          cwd: "<%= yeoman.dist %>"
          src: "**/*.{png,jpg,jpeg,gif}"
          dest: "<%= yeoman.dist %>"
        ]
      distLargeAssets:
        files: [
          expand: true
          cwd: "dist-assets/"
          src: "**/*.{png,jpg,jpeg,gif}"
          dest: "dist-assets/"
        ]

    compress:
      dist:
        expand: true
        mode: "gzip"
        src: [
          "<%= yeoman.dist %>/**/*.js"
          "<%= yeoman.dist %>/**/*.css"
          "<%= yeoman.dist %>/**/*.html"
        ]
        dest: "."

    cssmin:
      dist:
        files: [
          expand: true
          cwd: "<%= yeoman.dist %>"
          src: "**/*.css"
          dest: "<%= yeoman.dist %>"
        ]

    htmlmin:
      dist:
        options:
          removeComments: true
          collapseWhitespace: true
          conservativeCollapse: true
        files: [
          expand: true
          cwd: "<%= yeoman.dist %>"
          src: "**/*.html"
          dest: "<%= yeoman.dist %>"
        ]

    # Put files not handled in other tasks here
    copy:
      dist:
        expand: true
        cwd: "<%= yeoman.app %>/assets"
        src: '**/*'
        dest: "<%= yeoman.dist %>/"

      appjs:
        expand: true
        cwd: "<%= yeoman.app %>"
        src: 'lib/**/*.js'
        dest: ".tmp/app"

      statics:
        expand: true
        cwd: "<%= yeoman.app %>/static-pages"
        src: '**/*'
        dest: "<%= yeoman.dist %>/"

      serveLargeAssets:
        expand: true
        cwd: "<%= yeoman.app %>/large-assets"
        src: '**/*'
        dest: "<%= yeoman.dist %>/large-assets"

      distLargeAssets:
        expand: true
        cwd: "<%= yeoman.app %>/large-assets"
        src: '**/*'
        dest: "dist-assets/"

    autoprefixer:
      notFound:
        expand: true
        flatten: true
        src: "<%= yeoman.app %>/static-pages/not-found/stylesheets/*.css"
        dest: "<%= yeoman.dist %>/not-found/stylesheets/"
        ext: ".autoprefixed.css"

      underMaintenance:
        expand: true
        flatten: true
        src: "<%= yeoman.app %>/static-pages/under-maintenance/stylesheets/*.css"
        dest: "<%= yeoman.dist %>/under-maintenance/stylesheets/"
        ext: ".autoprefixed.css"

      css:
        src: "<%= yeoman.app %>/assets/stylesheets/style.css"
        dest: "<%= yeoman.dist %>/stylesheets/style.autoprefixed.css"

    replace:
      distVersion:
        options:
          variables:
            version: pkg.version
        files: [
          flatten: true
          expand: true
          src: [
            'dist/index.html'
          ]
          dest: 'dist/'
        ]
      stagingAssets:
        options:
          patterns: [
            match: /\/large-assets/g,
            replacement: LARGE_ASSET_BASEURL_STAGING
          ]
        files: [
          flatten: true
          expand: true
          src: [
            "<%= yeoman.dist %>/javascripts/*.js"
          ]
          dest: 'dist/javascripts/'
        ]
      prodAssets:
        options:
          patterns: [
            match: /\/large-assets/g,
            replacement: LARGE_ASSET_BASEURL_PROD
          ]
        files: [
          flatten: true
          expand: true
          src: [
            "<%= yeoman.dist %>/javascripts/*.js"
          ]
          dest: 'dist/javascripts/'
        ]

    watch:
      copy:
        options: livereload: LIVERELOAD_PORT
        files: [
          "<%= yeoman.app %>/{,**/}*.js",
          "<%= yeoman.app %>/assets/{,**/}*",
        ]
        tasks: [ "build:serve" ]
      copyStatics:
        options: livereload: LIVERELOAD_PORT
        files: [
          "<%= yeoman.app %>/static-templates/**/*",
          "<%= yeoman.app %>/static-pages/**/*",
          "<%= yeoman.app %>/../data/meetings.json",
        ]
        tasks: [ "copy", "processhtml" ]
      coffee:
        options: livereload: LIVERELOAD_PORT
        files: "<%= yeoman.app %>/{,**/}*.coffee"
        tasks: [ "build:serve" ]
      handlebars:
        options: livereload: LIVERELOAD_PORT
        files: "<%= yeoman.app %>/templates/{,**/}*.hbs"
        tasks: [ "build:serve" ]
      css:
        options: livereload: LIVERELOAD_PORT
        files: "<%= yeoman.app %>/assets/stylesheets/style.css"
        tasks: [ "build:serve" ]

    coffee:
      dist:
        files: [{
          expand: true
          cwd: "<%= yeoman.app %>"
          src: "**/*.coffee"
          dest: ".tmp/app"
          ext: ".js"
        }]
        options:
          bare: true

    browserify:
      app:
        src: [".tmp/app/**/*.js"]
        dest: "<%= yeoman.dist %>/javascripts/toggl.js"
        options:
          external: external
      vendor:
        src: []
        dest: "<%= yeoman.dist %>/javascripts/vendor.js"
        options:
          require: external

    modernizr:
      dist:
        devFile: "remote"
        outputFile: "<%= yeoman.dist %>/javascripts/modernizr.js"
        parseFiles: false
        uglify: false
        extra:
          shiv: true
          load: true
          cssclasses: true

    handlebars:
      dist:
        options:
          namespace: false
          commonjs: true
          processName: (f) -> f.replace("app/templates/", "").replace(".hbs", "")
          partialRegex: /.*/,
          partialsPathRegex: /\/partials\//

        src: "<%= yeoman.app %>/templates/**/*.hbs"
        dest: ".tmp/app/templates/index.js"

    rev:
      dist: [
        '<%= yeoman.dist %>/**/*.js'
        '<%= yeoman.dist %>/**/*.css'
        '<%= yeoman.dist %>/**/*.{png,jpg,jpeg,gif,webp}'
        '!<%= yeoman.dist %>/not-found/**/*'
        '!<%= yeoman.dist %>/under-maintenance/**/*'
        '!<%= yeoman.dist %>/images/logo-big.png'
        '!<%= yeoman.dist %>/images/logo.png'
        '!<%= yeoman.dist %>/images/share-img/**/*'
        '!<%= yeoman.dist %>/images/tools/**/*'
        '!<%= yeoman.dist %>/photos/**/*'
        '!<%= yeoman.dist %>/stylesheets/sweetalert.css'
        '!<%= yeoman.dist %>/javascripts/sweetalert.min.js'
        '!<%= yeoman.dist %>/stylesheets/bootstrap.min.css'
        '!<%= yeoman.dist %>/stylesheets/slalom.css'
        '!<%= yeoman.dist %>/stylesheets/developer-challenge.css'
        '!<%= yeoman.dist %>/stylesheets/media-coverage.css'
        '!<%= yeoman.dist %>/stylesheets/reports.css'
        '!<%= yeoman.dist %>/images/landing-pages/**/*'
      ]

    useminPrepare:
      html: '<%= yeoman.dist %>/**/*.html'
      options:
        dist: '<%= yeoman.dist %>'

    # usemin generates a `xxx:generated` task in concat and uglify
    usemin:
      html: ['<%= yeoman.dist %>/**/*.html']
      css: ['<%= yeoman.dist %>/**/*.css']

    concat:
      sweetalert:
        src: [
          '<%= yeoman.app %>/../node_modules/sweetalert/dist/sweetalert.min.js'
          '.tmp/app/lib/show-alert.js'
        ]
        dest: '<%= yeoman.dist %>/javascripts/sweetalert.min.js'

    uglify:
      '<%= yeoman.dist %>/javascripts/sweetalert.min.js': [
       '<%= yeoman.dist %>/javascripts/sweetalert.min.js'
      ]

    # Generate HTML snapshots for to make crawlers happy
    htmlSnapshot:
      all:
        options:
          # that's the path where the snapshots should be placed
          # it's empty by default which means they will go into the directory
          # where your Gruntfile.js is placed
          snapshotPath: '<%= yeoman.dist %>/static/',
          # This should be either the base path to your index.html file
          # or your base URL. Currently the task does not use it's own
          # webserver. So if your site needs a webserver to be fully
          # functional configure it here.
          sitePath: 'http://localhost:9001/',
          # you can choose a prefix for your snapshots
          # by default it's 'snapshot_'
          fileNamePrefix: '',
          # by default the task waits 500ms before fetching the html.
          # this is to give the page enough time to to assemble itself.
          # if your page needs more time, tweak here.
          msWaitForPages: 1000,
          # sanitize function to be used for filenames. Converts '#!/' to '_' as default
          # has a filename argument, must have a return that is a sanitized string
          sanitize: (requestUri) ->
            # returns 'index.html' if the url is '/', otherwise a prefix
            return 'index' if requestUri is "#"
            requestUri.replace(/#\//g, '') + "/index"

          # if you would rather not keep the script tags in the html snapshots
          # set `removeScripts` to true. It's false by default
          removeScripts: true,
          # allow to add a custom attribute to the body
          bodyAttr: 'data-prerendered'
          # here goes the list of all urls that should be fetched
          urls: [
            '#'
            '#/features'
            '#/about'
            '#/signup'
            '#/legal/terms'
            '#/legal/privacy'
            '#/tools'
            '#/forgot-password'
            '#/pricing'
          ].concat _.map(require('./app/landing-routes'), (params, path) -> "#/#{path}")

    processhtml:
      options:
        commentMarker: 'processhtml'
        includeBase: "<%= yeoman.app %>/static-templates"
      meet:
        options:
          data: require('./data/meetings.json')
        files:
          "<%= yeoman.dist %>/meet/index.html": "<%= yeoman.dist %>/meet/index.html"
      statics:
        expand: true
        flatten: false
        cwd: "<%= yeoman.dist %>"
        src: "**/index.html"
        dest: "<%= yeoman.dist %>"
      sitemap:
        options:
          data: getSitemapData(yeomanConfig.app)
        files:
          "<%= yeoman.dist %>/sitemap.xml": "<%= yeoman.dist %>/sitemap.xml"
    shell:
      symlinkLandingPages:
        command: ->
          paths = Object.keys require ('./app/landing-routes')
          cmds = _.map paths, (path) ->
            "mkdir <%= yeoman.dist %>/#{path}
            && ln -s ../index.html <%= yeoman.dist %>/#{path}/index.html
            && ln -s ../index.html.gz <%= yeoman.dist %>/#{path}/index.html.gz"
          cmds.join(';')

  grunt.registerTask "build:largeAssets", [
    'copy:distLargeAssets'
    'imagemin:distLargeAssets'
    ]

  grunt.registerTask "serve", [
    'build:serve'
    "copy:serveLargeAssets"
    'configureProxies:server'
    'connect:server'
    'watch'
  ]

  grunt.registerTask "build:serve", [
    "clean"
    "coffee"
    "handlebars"
    "copy:appjs"
    "concat"
    "browserify"
    "autoprefixer"
    "modernizr"
    "copy:statics"
    "copy:dist"
    "replace:distVersion"
    "processhtml"
  ]

  buildTaskFactory = (staging = false) ->
    distAssetsTask = if staging or STAGING
      'replace:stagingAssets'
    else
      'replace:prodAssets'
    [
      "build:serve"
      "useminPrepare"
      "concat"
      "uglify"
      "imagemin"
      "cssmin"
      "rev"
      "usemin"
      distAssetsTask
      "htmlmin"
      "compress"
      "shell:symlinkLandingPages"
      # "htmlSnapshot"
    ]

  grunt.registerTask "build", buildTaskFactory(false)
  grunt.registerTask "build:staging", buildTaskFactory(true)

  grunt.registerTask "build:nosnapshot", [
    "build:serve"
    "useminPrepare"
    "concat"
    "uglify"
    "imagemin"
    "cssmin"
    "rev"
    "usemin"
    "htmlmin"
    "compress"
  ]

  grunt.registerTask "default", ["build"]
