const WORK_DURATION_SECONDS = 25 * 60;
const BREAK_DURATION_SECONDS = 5 * 60;
let timerInterval = null;
let remainingSeconds = WORK_DURATION_SECONDS;
const state = { isRunning: false, phase: 'work' };

let timerDisplay = null;
let timerLabel = null;
let progressForeground = null;
let progressCircumference = 0;
let audioContext = null;

document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
  timerDisplay = document.getElementById('timer-display');
  timerLabel = document.getElementById('timer-label');
  progressForeground = document.querySelector('.progress-ring__foreground');

  if (progressForeground) {
    const r = parseFloat(progressForeground.getAttribute('r')) || 0;
    progressCircumference = 2 * Math.PI * r;
    progressForeground.setAttribute('stroke-dasharray', String(progressCircumference));
    progressForeground.setAttribute('stroke-dashoffset', '0');
  }

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

function getTotalSeconds() {
  return state.phase === 'work' ? WORK_DURATION_SECONDS : BREAK_DURATION_SECONDS;
}

function startTimer() {
  if (state.isRunning) {
    return;
  }

  ensureAudioContext();

  state.isRunning = true;
  timerLabel.textContent = state.phase === 'work' ? 'Work' : 'Break';
  updateTimerDisplay(remainingSeconds);

  timerInterval = setInterval(handleTimerTick, 1000);
}

function pauseTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  state.isRunning = false;
}

function resumeTimer() {
  if (state.isRunning || remainingSeconds <= 0) {
    return;
  }

  startTimer();
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
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
  updateCircularProgress(secondsLeft, getTotalSeconds());
}

function updateCircularProgress(secondsLeft, totalSeconds) {
  if (!progressForeground || !progressCircumference || totalSeconds <= 0) {
    return;
  }

  const fraction = Math.max(0, Math.min(1, secondsLeft / totalSeconds));
  const offset = progressCircumference * (1 - fraction);
  progressForeground.setAttribute('stroke-dashoffset', String(offset));
}

function handleTimerTick() {
  if (remainingSeconds <= 0) {
    return;
  }

  remainingSeconds -= 1;

  if (remainingSeconds <= 0) {
    const previousPhase = state.phase;
    state.phase = previousPhase === 'work' ? 'break' : 'work';
    remainingSeconds = getTotalSeconds();
    if (timerLabel) timerLabel.textContent = state.phase === 'work' ? 'Work' : 'Break';
    playTransitionSound(previousPhase, state.phase);
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

function ensureAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  if (audioContext.state === 'suspended') {
    void audioContext.resume().catch(() => {});
  }

  return audioContext;
}

function playTone(frequency, durationSeconds = 0.2) {
  const audio = ensureAudioContext();
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  oscillator.connect(gain);
  gain.connect(audio.destination);

  const now = audio.currentTime;
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);

  oscillator.start(now);
  oscillator.stop(now + durationSeconds);

  oscillator.onended = () => {
    oscillator.disconnect();
    gain.disconnect();
  };
}

function playTransitionSound(fromPhase, toPhase) {
  if (fromPhase === 'work' && toPhase === 'break') {
    playTone(440, 0.2);
  } else if (fromPhase === 'break' && toPhase === 'work') {
    playTone(660, 0.2);
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(secs).padStart(2, '0');
  return `${paddedMinutes}:${paddedSeconds}`;
}
