const WORK_DURATION_SECONDS = 25 * 60;
let timerInterval = null;
let remainingSeconds = WORK_DURATION_SECONDS;
const state = { isRunning: false, phase: 'work' };

const timerDisplay = document.getElementById('timer-display');
const timerLabel = document.getElementById('timer-label');

document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
  updateTimerDisplay(remainingSeconds);
  bindUIEvents();
}

function bindUIEvents() {
  const startButton = document.getElementById('start-button');
  if (startButton) {
    startButton.addEventListener('click', startTimer);
  }

  const pauseButton = document.getElementById('pause-button');
  if (pauseButton) {
    pauseButton.addEventListener('click', pauseTimer);
  }

  const resumeButton = document.getElementById('resume-button');
  if (resumeButton) {
    resumeButton.addEventListener('click', resumeTimer);
  }

  const resetButton = document.getElementById('reset-button');
  if (resetButton) {
    resetButton.addEventListener('click', resetTimer);
  }
}

function startTimer() {
  if (timerInterval !== null) {
    return; // Timer already running
  }

  state.isRunning = true;
  timerLabel.textContent = 'Work session';
  updateTimerDisplay(remainingSeconds);

  timerInterval = setInterval(() => {
    handleTimerTick();
  }, 1000);
}

function pauseTimer() {
  if (timerInterval === null) {
    return;
  }

  clearInterval(timerInterval);
  timerInterval = null;
  state.isRunning = false;
}

function resumeTimer() {
  if (state.isRunning || remainingSeconds <= 0) {
    return;
  }

  startTimer();
}

function resetTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  remainingSeconds = WORK_DURATION_SECONDS;
  state.phase = 'work';
  state.isRunning = false;
  timerLabel.textContent = 'Work session';
  updateTimerDisplay(remainingSeconds);
}

function switchToMode(mode) {
  // Mode switching logic will be added later.
}

function updateTimerDisplay(secondsLeft) {
  if (!timerDisplay) {
    return;
  }

  timerDisplay.textContent = formatTime(secondsLeft);
}

function updateCircularProgress(secondsLeft, totalSeconds) {
  // Circular progress update logic will be added later.
}

function handleTimerTick() {
  if (remainingSeconds <= 0) {
    return;
  }

  remainingSeconds -= 1;
  updateTimerDisplay(remainingSeconds);

  if (remainingSeconds <= 0) {
    clearInterval(timerInterval);
    timerInterval = null;
    console.log('work complete');
  }
}

function completeSession() {
  // Session complete logic will be added later.
}

function loadSessionCount() {
  // Persistence load logic will be added later.
}

function saveSessionCount(count) {
  // Persistence save logic will be added later.
}

function incrementSessionCount() {
  // Counter increment logic will be added later.
}

function playTransitionSound() {
  // Sound logic will be added later.
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(secs).padStart(2, '0');
  return `${paddedMinutes}:${paddedSeconds}`;
}
