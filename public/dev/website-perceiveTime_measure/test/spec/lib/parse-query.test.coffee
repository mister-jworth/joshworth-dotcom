chai = require 'chai'
parseQuery = require '../../../app/lib/parse-query'

chai.should()

describe 'parse-query', ->
  describe 'parseQuery(qs)', ->
    it 'parses objects out of querystrings', ->
      parseQuery '?something=10'
        .should.eql
          something: '10'

      parseQuery 'something=10'
        .should.eql
          something: '10'

      parseQuery 'something=10&is%20here=50'
        .should.eql
          something: '10'
          'is here': '50'
