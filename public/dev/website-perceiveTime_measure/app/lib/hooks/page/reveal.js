var $   = require('jquery'),
    _   = require('lodash');

var toRemove = {};

module.exports = function (view) {
  var $elements = _(view.$('.js-scroll-reveal').toArray())
    .map(function(el) {
      return $(el);
    })
    .filter(function($el, i) {
      if(toRemove[i]) {
        $el.addClass('scroll-revealed');
        return false;
      }
      return true;
    })
    .value();
  var lastCheck;

  function checkScroll() {
    if(lastCheck < new Date().getTime() - 500) return;

    for (var i = 0, l = $elements.length; i < l; i++) {
      var $element = $elements[i];
      var offset = $element.offset();
      if (offset.top < window.scrollY + window.innerHeight * 0.75) {
        $element.addClass('scroll-revealed');
        toRemove[i] = true;
      }
    }

    $elements = _.filter($elements, function(i) {
      return !toRemove[i];
    });
  }

  $(document).on('scroll', checkScroll);
  // When we navigate away from the page, remove the scroll handler.
  view.on('remove', function () {
    $(document).off('scroll', checkScroll);
  });
};
