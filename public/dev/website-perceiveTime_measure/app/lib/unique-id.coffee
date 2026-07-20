counter = 0

# Simple function that generates a unique element ID when it is called.
module.exports = -> 'unique-elem-' + (counter++)
