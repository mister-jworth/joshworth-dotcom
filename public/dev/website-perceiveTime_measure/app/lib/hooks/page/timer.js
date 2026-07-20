module.exports = function(view) {
  var secondsTracked = 0,
      interval,
      timerTimeElement
      paused = false;

  function startTimer() {
    interval = setInterval(timerLoop, 1000);
  }

  function pauseTimer() {
    clearInterval(interval);
  }

  function timerLoop() {
    var components = [],
        hours,
        minutes,
        seconds;

    secondsTracked ++;

    if (secondsTracked >= 3600) {
      // hh:mm:ss
      hours = Math.floor(secondsTracked / 3600);

      if (hours < 10) {
        hours = '0' + hours;
      }

      components.push(hours);
    }

    if (secondsTracked >= 60) {
      // mm:ss min
      minutes = Math.floor((secondsTracked - (hours?hours * 3600:0)) / 60);

      if (minutes < 10) {
        minutes = '0' + minutes;
      }

      components.push(minutes);
    }
    // s sec
    seconds = secondsTracked - (hours?hours * 3600:0) - (typeof minutes != 'undefined'?minutes * 60:0);

    if (typeof minutes != 'undefined' && seconds < 10) {
      seconds = '0' + seconds;
    }

    components.push(seconds);

    timerTimeElement.text(components.join(':') + (typeof minutes != 'undefined'?hours?'':' min':' sec'));
  }

  function attachListeners() {
    view.$('.timer__button').on('click', handleTimerButtonClick);
  }

  function handleTimerButtonClick(event) {
    if (paused) {
      startTimer();
      event.target.innerHTML = event.target.innerHTML.replace('Start', 'Stop');
      event.target.classList.add('timer__button--stop');
    } else {
      pauseTimer();
      event.target.innerHTML = event.target.innerHTML.replace('Stop', 'Start');
      event.target.classList.remove('timer__button--stop');
    }
    paused = !paused;
  }


  timerTimeElement = view.$('.timer__time');
  startTimer();
  attachListeners();
};
