var $   = require('jquery'),
    raf = require('raf');

// We don't want the animation to run on any subsequent visits to /features, so
// this is shared on all animation set-ups
var animationCompleted = false;
var animationRunning = false;
var animationCompletedPercent;
var animationStartTime;

module.exports = function (view) {
  var canvas,
      canvasBoundingRect,
      ctx,
      segments = [
        {
          size: 0.3,
          color: '#cfcfcf'
        },
        {
          size: 0.1,
          color: '#d9d9d9'
        },
        {
          size: 0.2,
          color: '#e7e7e7'
        },
        {
          size: 0.4,
          color: '#f30c16'
        }
      ],
      currentTime,
      settings = {
        strokeWidth: 86,
        radius: 115,
        center: {},
        animationLength: 1000,
        counterclockwise: true
      };

  function scaleCanvas() {
    if (window.devicePixelRatio) {
      var canvasWidth = canvas.width,
          canvasHeight = canvas.height;

      canvas.width = canvasWidth * window.devicePixelRatio;
      canvas.height = canvasHeight * window.devicePixelRatio;

      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  }

  var lastCheck;
  function checkCanvasVisibility() {
    if(lastCheck < new Date().getTime() - 100) return;

    if (!animationCompleted && !animationRunning) {
      if (canvasBoundingRect.top < window.scrollY + window.innerHeight * 0.75) {
        startAnimation();
      }
    }
  }

  function startAnimation() {
    animationStartTime = new Date().getTime();
    animationRunning = true;
    animationCompleted = false;
    animationCompletedPercent = 0;

    loop();
  }

  function loop() {
    if(animationCompleted) return;
    currentTime = new Date().getTime() - animationStartTime;
    animationCompletedPercent = animationCompletedPercent = currentTime / settings.animationLength;

    if (animationCompletedPercent >= 1) {
      animationCompletedPercent = 1;
      animationCompleted = true;
      animationRunning = false;
    }

    clear();
    draw();

    if (animationCompleted) {
      canvas.parentNode.classList.add('pie-chart--animation-complete');
    } else {
      enqueue();
    }
  }

  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function draw() {
    var startAngle,
        endAngle;

    segments.forEach(function(segment, index, array) {
      var arcLength = 2 * Math.PI * segment.size * animationCompletedPercent;

      if (index === 0) {
        startAngle = 2 * Math.PI * -0.25;
      } else {
        startAngle = endAngle;
      }

      if (settings.counterclockwise) {
        endAngle = startAngle - arcLength;
      } else {
        endAngle = startAngle + arcLength;
      }

      ctx.beginPath();

      ctx.strokeStyle = segment.color;

      ctx.arc(settings.center.x, settings.center.y, settings.radius, startAngle, endAngle, settings.counterclockwise);

      ctx.stroke();
    });
  }

  function enqueue() {
    raf(loop);
  }

  function handleCanvasClick() {
    canvas.parentNode.classList.remove('pie-chart--animation-complete');
    startAnimation();
  }

  view.once('show', function() {

    canvas = view.$('#js-pie-chart-canvas').get(0);
    canvasBoundingRect = canvas.getBoundingClientRect();
    ctx = canvas.getContext('2d');

    settings.center.x = canvas.width/2;
    settings.center.y = canvas.height/2;

    scaleCanvas();

    ctx.lineWidth = settings.strokeWidth;

    canvas.addEventListener('click', handleCanvasClick);

    if (animationRunning) {
      loop();
      return;
    }

    if (animationCompleted) {
      clear();
      animationCompletedPercent = 1;
      draw();
      canvas.parentNode.classList.add('pie-chart--animation-complete');
      return;
    }

    $(document).on('scroll', checkCanvasVisibility);
    view.on('destroy', function() {
      $(document).off('scroll', checkCanvasVisibility);
    });

  });

};
