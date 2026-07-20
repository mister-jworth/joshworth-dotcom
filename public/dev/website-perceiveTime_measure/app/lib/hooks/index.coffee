# "Hooks" are divided into three seconds. Global, view, and page.
#   - Global hooks are loaded once when the page is run.
#   - View hooks are called whenever a view is loaded.
#   - Page hooks are named and can be called specifically by a certian
#     page, but are never "automatically" loaded.
module.exports =
  global: [
    require './global/stretch'
  ]
  view: [
    require './view/ripple-button'
    require './view/nav-opener'
    require './view/logout-button'
  ]
  page: {
    frontvideo: require './page/frontvideo'
    timer: require './page/timer'
    piechart: require './page/piechart'
    reveal: require './page/reveal'
  }
