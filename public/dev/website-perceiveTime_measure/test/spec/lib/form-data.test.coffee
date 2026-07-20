chai = require 'chai'
$ = require 'jquery'
_ = require 'lodash'
formData = require '../../../app/lib/form-data.coffee'

chai.should()

describe "form-data", ->
  describe "formData($form)", ->
    it "doesn't fail if the form has no `input` children", ->
      form = document.createElement 'form'
      formData($(form)).should.eql {}

    it "ignores input elements without a `name` attribute", ->
      form = document.createElement 'form'
      i = document.createElement 'input'
      i.type = 'number'
      i.value = 10
      form.appendChild i
      formData($(form)).should.eql {}

    it "gets data from input elements in a form and returns it as an object", ->
      testData =
        email: 'joe@doe.com'
        password: 'funny-funny'

      form = document.createElement 'form'
      inputs = _.map testData, (value, key) ->
        input = document.createElement 'input'
        input.name = key
        input.value = value
        input

      _.each inputs, (input) ->
         form.appendChild input

      formData($(form)).should.eql testData
