;(function(window) {
  'use strict';

  var document = window.document;

  function each(fn, arr) {
    for(var i = 0, len = arr.length; i < len; i++) {
      fn(arr[i]);
    }
  }

  function handleClick(e) {
    var button = e.target;

    var oldRipples = button.getElementsByClassName('js-ripple-button__ripple');
    each(function(r) {
      button.removeChild(r);
    }, oldRipples);

    var ripple = document.createElement('span');
    var rect = button.getBoundingClientRect();
    ripple.className = [
      'js-ripple-button__ripple',
      'js-ripple-button__ripple--active',
    ].join(' ');
    ripple.style.top  = (e.clientY - rect.top).toString() + 'px';
    ripple.style.left = (e.clientX - rect.left).toString() + 'px';
    button.appendChild(ripple);
  }

  function setupRippleButton() {
    var buttons = document.getElementsByClassName('js-ripple-button');
    each(function(b) {
      b.onclick = handleClick;
    }, buttons);
  }

  window.setupRippleButton = setupRippleButton;

})(window);
