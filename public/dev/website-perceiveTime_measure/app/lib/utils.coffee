generateLink = (url, type) ->
  if not (type in ['external', 'email', undefined])
    throw new Error "Unrecognised link type: #{ type }"
  tag = "<a "
  if type is 'email'
    tag += "href='mailto:#{ url }'"
  else
    tag += "href='#{ url }'"
  tag += " target='_blank'" if type is 'external'
  tag += ">#{ url }</a>"
  tag

supportEmail = 'support@toggl.com'

supportEmailLink = generateLink(supportEmail, 'email')

genericErrorMessage = "Sorry about that, please try again or contact \
#{ supportEmailLink }."

module.exports = {
  generateLink
  supportEmail
  supportEmailLink
  genericErrorMessage
}
