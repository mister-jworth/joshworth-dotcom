var $      = require('jquery'),
  raf      = require('raf'),
  Backbone = require('backbone');

// Because AMD is hard...
// https://github.com/carhartl/jquery-cookie/issues/319
require('jquery.cookie');
require('./froogaloop.js');

var COOKIE_VAL = 'SEEN_KIDS_VIDEO';

function incrementSeenCount () {
  var current = +$.cookie(COOKIE_VAL) || 0;
  $.cookie(COOKIE_VAL, current + 1);
}

/**
 * Video playback for the homepage video.
 */
module.exports = function(view) {
  view.on('video:load', function() {
    attachToVideo(view);
  });

  view.on('render', function() {
    resize(view);
  });

  view.on('show', function() {
    resize(view);
  });
};

function attachToVideo(view) {
  var video = view.$('.hero__background iframe').get(0),
      player = $f(video),
      firstTimerHeading = view.$('.hero-timer-heading.dynamic').get(0),
      secondTimerHeading = view.$('.hero-timer-heading.dynamic').get(1),
      timerSeconds = view.$('.hero-timer .seconds').get(0),
      timerMilliseconds = view.$('.hero-timer .milliseconds').get(0),
      breakpoints = [
        {
          time: 0
        },
        {
          time: 0.01,
          firstHeadingText: 'Track',
          secondHeadingText: 'tax returns',
          timerTime: 0.00,
          timerVisible: true
        },
        {
          time: 4.16,
          firstHeadingText: 'Track',
          secondHeadingText: 'live testing',
          timerTime: 8.00,
          timerVisible: true
        },
        {
          time: 8.64,
          firstHeadingText: 'Track',
          secondHeadingText: 'creative process',
          timerTime: 27.00,
          timerVisible: true
        },
        {
          time: 13.64,
          firstHeadingText: 'Track',
          secondHeadingText: 'load testing',
          timerTime: 0.00,
          timerVisible: true
        },
        {
          time: 18.64,
          firstHeadingText: 'Track',
          secondHeadingText: 'intern hours',
          timerTime: 19.00,
          timerVisible: true
        },
        {
          time: 23.52,
          firstHeadingText: 'Track',
          secondHeadingText: 'budget negotiations',
          timerTime: 5.00,
          timerVisible: true
        },
        {
          time: 28.24,
          firstHeadingText: 'Track',
          secondHeadingText: 'legal fees',
          timerTime: 0.00,
          timerVisible: true
        },
        {
          time: 33.24,
          firstHeadingText: 'Track',
          secondHeadingText: 'client feedback',
          timerTime: 0.00,
          timerVisible: true
        },
        {
          time: 38.24,
          firstHeadingText: 'Track',
          secondHeadingText: 'PHP refactoring',
          timerTime: 2.00,
          timerVisible: true
        },
        {
          time: 43.44,
          firstHeadingText: 'Track',
          secondHeadingText: 'board meetings',
          timerTime: 45.00,
          timerVisible: true
        }
      ],
      lastBreakpoint = 0,
      referenceTime,
      referenceDelta = 0,
      running = true, paused = false,
      lastRunningTime = 0;

  if(view.isAprilFools()) {
    breakpoints = [
      {
        time: 0
      },
      {
        time: 9.13,
        firstHeadingText: 'Track',
        secondHeadingText: '"Working"'
      },
      {
        time: 14.64,
        secondHeadingText: 'introspection'
      },
      {
        time: 22.22,
        secondHeadingText: 'deep thoughts'
      },
      {
        time: 28.24,
        secondHeadingText: 'ballistics calculations'
      },
      {
        time: 35.77,
        secondHeadingText: 'remote communication'
      },
      {
        time: 42.12,
        secondHeadingText: 'mining operations'
      },
      {
        time: 50.53,
        secondHeadingText: 'cruisin\''
      },
      {
        time: 55.17,
        secondHeadingText: 'cruisin\''
      },
      {
        time: 59.82,
        secondHeadingText: 'looking for a new job'
      },
      {
        time: 65.93,
        firstHeadingText: '',
        secondHeadingText: ''
      }
    ];
  }

  function hideTimer() {
    view.$('.hero-timer').css({'display': 'none', 'opacity': 0});
  }

  function showTimer() {
    view.$('.hero-timer').css({'display': 'block', 'opacity': 1});
  }

  function updateTimer() {
    if (running && !paused) {
      var refTime = referenceTime || new Date().getTime(),
          currentTime = new Date().getTime(),
          timeDifference = Math.floor((currentTime-refTime+referenceDelta)/10),
          minutes,
          seconds,
          milliseconds;

      minutes = Math.floor(timeDifference/(60*100));
      seconds = Math.floor(timeDifference/100)-minutes*60;
      milliseconds = timeDifference - seconds*100 - minutes*60*100;

      if (milliseconds < 10) {
        milliseconds = '0'+milliseconds;
      }

      timerSeconds.textContent = seconds;
      timerMilliseconds.textContent = milliseconds;
    }
    raf(updateTimer);
  }

  var lastLoopTime = null;

  function loop() {
    var threshold = 50; // run max once every 50ms or so
    var now = new Date().getTime();

    if (lastLoopTime && now < lastLoopTime + threshold) {
      // Not yet time to run! Reschedule self for later.
      raf(loop);
      return;
    }

    // Otherwise...
    lastLoopTime = now;

    if (paused || !running) {
      raf(loop);
      return;
    }

    player.api('getCurrentTime', function(seconds) {
      if (seconds > 0) {
        view.$('.js-play-pause-controls').show();
      }
      if (!paused) {
        updateTimerHeadings(seconds);
      }
      // Schedule next loop() call.
      raf(loop);
    });
  }

  function updateTimerHeadings(currentTime) {
    var firstHeadingText,
        secondHeadingText,
        timerTime = null,
        timerVisible,
        currentBreakpoint = lastBreakpoint;

    var adjust = function(breakpointTime) {
      // We adjust the given text times to be slightly early.
      // This lets us run updateTimerHeadings at a low framerate, and things work pretty well.
      // (It feels better than being one frame early or late now and again.)
      var t = breakpointTime - 0.1;
      return (t > 0) ? t : breakpointTime;
    }

    if (breakpoints.length > currentBreakpoint+1 && currentTime > adjust(breakpoints[currentBreakpoint+1].time)) {
      // next breakpoint
      currentBreakpoint = currentBreakpoint + 1;

      firstHeadingText = breakpoints[currentBreakpoint].firstHeadingText;
      secondHeadingText = breakpoints[currentBreakpoint].secondHeadingText;
      timerTime = breakpoints[currentBreakpoint].timerTime;
      timerVisible = breakpoints[currentBreakpoint].timerVisible;
    } else if (breakpoints.length == currentBreakpoint+1 && currentTime < adjust(breakpoints[currentBreakpoint].time)) {
      // video restarted
      currentBreakpoint = 0;
    }

    if (currentBreakpoint != lastBreakpoint) {
      if(view.isAprilFools()) {
        switch (currentBreakpoint) {
          case 0:
            hideTimer();
          break;
          case 1:
            showTimer();
            referenceTime = new Date().getTime();
            referenceDelta = 0;
          break;
          case 8:
            referenceDelta = new Date().getTime() - referenceTime;
            referenceTime = undefined;
          break;
          case 10:
            referenceDelta = 0;
            hideTimer();
          break;
          default:
            referenceTime = new Date().getTime();
            referenceDelta = 0;
        }
      } else {
        if (timerTime != null) {
          referenceTime = new Date().getTime() - (timerTime * 1000);
        }
        if (timerVisible === true) {
          showTimer();
        }
        if (timerVisible === false) {
          hideTimer();
        }
      }

      lastBreakpoint = currentBreakpoint;
    }

    if (typeof firstHeadingText != 'undefined') {
      firstTimerHeading.textContent = firstHeadingText;
    }

    if (typeof secondHeadingText != 'undefined') {
      secondTimerHeading.textContent = secondHeadingText;
    }
  }

  function handleMuteButtonClick(/*event*/) {
    var mute = this.classList.contains('active');

    this.classList.toggle('active');
    if (mute) {
      player.api('setVolume', 0);
    } else {
      player.api('setVolume', 1);
    }
  }

  function handlePlayButtonClick(event) {
    event.preventDefault();
    player.api('play');
    togglePausePlayButtons(true);
  }

  function handlePauseButtonClick(event) {
    event.preventDefault();
    player.api('pause');
    togglePausePlayButtons(false);
  }

  function togglePausePlayButtons (toggle) {
    view.$('.video-pause-button').toggle(toggle);
    view.$('.video-play-button').toggle(!toggle);
  }

  function detect_autoplay(){
    if('ontouchstart' in document.body){
      running = false;
      document.body.classList.add('video-suspended');

      var heading = document.querySelector('.hero-timer-heading.dynamic'),
          headingText;

      if (heading.dataset) {
        headingText = heading.dataset.defaultText;
      } else {
        headingText = heading.getAttribute('data-default-text');
      }

      heading.textContent = headingText;

      view.$('.hero__background .video').hide();
    } else {
      player.api('setVolume', 0);
      player.api('play');

      // Thinking at e.g. 20 FPS works fine.
      // No longer using playProgress event as that was only triggering 2 to 4 times per sec.
      raf(loop);

      raf(updateTimer);
    }
  }

  var MANUAL = 1;
  var AUTOMATIC = 2;
  function setVideoMode(mode) {
    var $automaticVideo = view.$('.js-automatic-video');
    var $manualVideo = view.$('.js-manual-video');

    if(mode === AUTOMATIC) $automaticVideo.show();
    else $automaticVideo.hide();

    if(mode === MANUAL) $manualVideo.show();
    else $manualVideo.hide();

    resize(view);
  }

  function onDisposed() {
    running = false;
    view.off('remove pre-render', onDisposed);
  }
  view.on('remove pre-render', onDisposed);

  player.addEvent('ready', function() {
    player.addEvent('play', function () {
      incrementSeenCount();
      togglePausePlayButtons(true);
      paused = false;
    });
    var startedPlaying = false;
    player.addEvent('playProgress', function () {
      if(!startedPlaying) {
        video.style.visibility = 'visible';
        startedPlaying = true;
      }
    });

    player.addEvent('pause', function () {
      togglePausePlayButtons(false);
      paused = true;
    }, true);

    player.addEvent('finish', function () {
      paused = true;
      togglePausePlayButtons(false);
    });

    if ('ontouchstart' in document.body) {
      // Do not show play button for mobile devices
      view.$('.seen-wrapper').hide();
      setVideoMode(MANUAL);

    } else if (Backbone.history.fragment == 'login') {
      incrementSeenCount();
      setVideoMode(MANUAL);
    } else if (+$.cookie(COOKIE_VAL) > 9 && !view.isAprilFools()) {
      // If the user has seen the movie more than 9 times already
      // then lets just not show it
      setVideoMode(MANUAL);
    } else {
      view.$('.js-manual-video').hide();
      setVideoMode(AUTOMATIC);
      detect_autoplay();
      if(!view.isAprilFools()) incrementSeenCount();
    }
  });


  view.$('.video-mute-button').on('click', handleMuteButtonClick);
  view.$('.video-pause-button').on('click', handlePauseButtonClick);
  view.$('.video-play-button').on('click', handlePlayButtonClick);

  $(window).resize(resize.bind(null, view));
  resize(view);
}

function resize(view) {
  var $windowHeight = $(window).height();
  var $windowWidth = $(window).width();
  var $videoHeight = view.$(".video").outerHeight();
  var windowRatio = $windowHeight / $windowWidth;
  var videoRatio;
  if(view.isAprilFools()) {
    videoRatio = 281/500;
  } else {
    videoRatio = 540/960;
  }
  // Using coefficients 1.15 and 1.03 here to hide the player controls
  if(windowRatio > videoRatio) {
    var videoWidth = ($windowHeight*1.15) / videoRatio;
    view.$('.video .wrapper').css({
      'width': videoWidth + 'px',
      'height': $windowHeight * 1.15 + 'px',
      'top': '50%',
      'left': '50%',
      "-webkit-transform" : "translateX(-50%) translateY(-50%)",
      "transform" : "translateX(-50%) translateY(-50%)"
    });
  } else {
    var videoHeight = $windowWidth * 1.12 * videoRatio;
    view.$('.video .wrapper').css({
      'width': '112%',
      'height': videoHeight + 'px',
      'top': '50%',
      'left': '50%',
      "-webkit-transform" : "translateX(-50%) translateY(-50%)",
      "transform" : "translateX(-50%) translateY(-50%)"
    });
  }
}
