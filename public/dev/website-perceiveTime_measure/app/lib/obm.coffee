module.exports = class ObmHelper
  constructor: ({ @data, @api } = {}) ->
    if not @data?
      throw new Error 'Missing Obm data source'
    if not @api?
      throw new Error 'Missing API'

  getObm: -> @data

  getNR: -> @getObm()?.nr

  # Checks if the current number of experiment is running
  isRunning: (nr) -> @getObm().nr is nr

  # Checks if the user is included in the running obm
  isIncluded: (nr) => @isRunning(nr) and @getObm().included is true

  # Checks if the user is excluded in the running obm
  isExcluded: (nr) => @isRunning(nr) and @getObm().included is false

  # Checks if user action exists for the given obm
  # Used for workspace specific obms.
  getActionExists: (action) ->
    actions = @getObm()?.actions?.split(',') or []
    action in actions

  ###
  # Returns:
  # - 'included' if the user is included in the experiment
  # - 'excluded' if the user is excluded in the experiment
  #
  # An optional parameter is used in the `if` logic, in case h4x are required.
  # Like saving in a cookie whether the user was previously participating in the
  # experiment.
  ###
  getGroupString: (extra) ->
    if @isIncluded(@getNR()) or extra
      'included'
    else
      'excluded'

  sendAction: (action) ->
    experimentNr = @getNR()
    @api.request 'POST', 'me/options',
      contentType: 'application/json'
      data: JSON.stringify(number: experimentNr, action: action)

