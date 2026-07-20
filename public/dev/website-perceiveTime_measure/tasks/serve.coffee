fs = require 'fs'
path = require 'path'
livereload = require 'connect-livereload'
express = require 'express'
proxy = require 'express-http-proxy'
gutil = require 'gulp-util'
tinylr = require 'tiny-lr'

PORT = process.env.PORT || 9001
LIVERELOAD_PORT = process.env.LIVERELOAD_PORT || 35729
TOGGL_API_URL = process.env.TOGGL_API_URL || 'https://next.toggl.com'
TOGGL_WEBAPP_URL = process.env.TOGGL_WEBAPP_URL || 'http://127.0.0.1:3000'

exports._devserver = devserver = express()
# devserver.use()
devserver.use(livereload port: LIVERELOAD_PORT)
devserver.use('/api', proxy(TOGGL_API_URL,
  forwardPath: (req, res) -> '/api' + req.url
))
devserver.use('/app', proxy(TOGGL_WEBAPP_URL,
  forwardPath: (req, res) -> '/app' + req.url
))
devserver.use(express.static('./dist'))
devserver.use((req, res, next) ->
  indexPath = path.join(__dirname, "../dist/index.html")
  indexStream = fs.createReadStream indexPath
  indexStream.pipe res
)

exports['start-devserver'] = ->
  devserver.listen PORT

exports._lrserver = lrserver = tinylr()

exports['start-lrserver'] = ->
  lrserver.listen LIVERELOAD_PORT
