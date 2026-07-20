# Parses a QueryString as an Object
parseQuery = (qs = '') ->
  qs = qs.slice(1) if qs[0] == '?'
  ret = {}
  for pair in qs.split '&'
    [key, value] = pair.split '='
    continue unless key
    if value
      value = decodeURIComponent(value)
      if value is "true"
        value = true
      else if value is "false"
        value = false
      else if !isNaN(n = +value)
        value = n
    ret[decodeURIComponent(key)] = value
  ret

exports = module.exports = parseQuery
