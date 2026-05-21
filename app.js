const WORK_DURATION_SECONDS = 25 * 60;
const BREAK_DURATION_SECONDS = 5 * 60;
let timerInterval = null;
let remainingSeconds = WORK_DURATION_SECONDS;
const state = { isRunning: false, phase: 'work' };

let timerDisplay = null;
let timerLabel = null;

document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
  timerDisplay = document.getElementById('timer-display');
let progressForeground = null;
let progressCircumference = 0;
  timerLabel = document.getElementById('timer-label');

  updateTimerDisplay(remainingSeconds);
  bindUIEvents();

  progressForeground = document.querySelector('.progress-ring__foreground');
  if (progressForeground) {
    const r = parseFloat(progressForeground.getAttribute('r')) || 0;
    progressCircumference = 2 * Math.PI * r;
    progressForeground.setAttribute('stroke-dasharray', String(progressCircumference));
    progressForeground.setAttribute('stroke-dashoffset', '0');
  }
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
  // Update circular progress based on the current phase total
  const total = state.phase === 'work' ? WORK_DURATION_SECONDS : BREAK_DURATION_SECONDS;
  updateCircularProgress(secondsLeft, total);
}

function startTimer() {
  if (!progressForeground || !progressCircumference || !totalSeconds) return;

  // fraction of time remaining (1.0 = full ring, 0.0 = empty)
  const fraction = Math.max(0, Math.min(1, secondsLeft / totalSeconds));

  // stroke-dashoffset is the amount of the circle that's hidden.
  const offset = progressCircumference * (1 - fraction);
  progressForeground.setAttribute('stroke-dashoffset', String(offset));
    return; // Timer already running
  }

  state.isRunning = true;
  timerLabel.textContent = state.phase === 'work' ? 'Work' : 'Break';
  updateTimerDisplay(remainingSeconds);

  timerInterval = setInterval(() => {
    handleTimerTick();
  }, 1000);
}

function pauseTimer() {
  if (timerInterval === null) {
    // Reset the ring for the new phase
    if (progressForeground && progressCircumference) {
      // ensure dasharray is set for the new circumference
      progressForeground.setAttribute('stroke-dasharray', String(progressCircumference));
    }
    updateTimerDisplay(remainingSeconds);
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
  // Reset ring to full
  if (progressForeground && progressCircumference) {
    progressForeground.setAttribute('stroke-dasharray', String(progressCircumference));
    progressForeground.setAttribute('stroke-dashoffset', '0');
  }
  updateTimerDisplay(remainingSeconds);
    clearInterval(timerInterval);
    timerInterval = null;
  }

  remainingSeconds = WORK_DURATION_SECONDS;
  state.phase = 'work';
  state.isRunning = false;
  if (timerLabel) timerLabel.textContent = 'Work';
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

  if (remainingSeconds <= 0) {
    // Toggle phase and load its duration, keep the interval running
    state.phase = state.phase === 'work' ? 'break' : 'work';
    remainingSeconds = state.phase === 'work' ? WORK_DURATION_SECONDS : BREAK_DURATION_SECONDS;
    if (timerLabel) timerLabel.textContent = state.phase === 'work' ? 'Work' : 'Break';
    updateTimerDisplay(remainingSeconds);
    return;
  }

  updateTimerDisplay(remainingSeconds);
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
