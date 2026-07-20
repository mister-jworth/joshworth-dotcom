chai = require 'chai'
# This is an ugly hack to make pretender work with browserify:
toString = process.toString
process.toString = -> '[object process]'
Pretender = require 'pretender'
process.toString = toString
# It works because at the time of this comment, Pretender uses a check on
# `process.toString` http://git.io/FsIE. This could possibly be a patch to
# browserify. (i.e. `process.toString() // => '[object process]'`)
TogglApi = require '../../../app/lib/api'

chai.should()

describe "api", ->
  #before ->
    #@server = new Pretender(->
      #@post "/api/signups", (req) ->
        #return [200, {}, JSON.stringify
          #data:
            #user: {}
        #]
    #)

  #after ->
    #@server.shutdown()

  describe "TogglApi", ->
    beforeEach ->
      @togglapi = new TogglApi "dev", "username", "password", "/api"

    describe ".constructor(name, username, password, host=...)", ->
      it "bootstraps all endpoints' methods onto the instance", ->
        togglapi = @togglapi
        should.exist togglapi.user
        should.exist togglapi.user.signup
        togglapi.user.signup.should.be.instanceof(Function)
        should.exist togglapi.auth
        should.exist togglapi.auth.session
        togglapi.auth.session.should.be.instanceof(Function)

    describe "::url(path)", ->
      it "constructs a new URL to the API endpoint, where `path` is relative", ->
        @togglapi.url "session"
          .should.equal "/api/session"

    describe "::users", ->
      describe ".signup(username, password, tz)", ->
        it "returns a new user"
