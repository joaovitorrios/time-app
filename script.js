// DOM Elements
// Tabs
const clockTab = document.getElementById('clockTab');
const timerTab = document.getElementById('timerTab');
const stopwatchTab = document.getElementById('stopwatchTab');

// Content areas
const clockContent = document.getElementById('clockContent');
const timerContent = document.getElementById('timerContent');
const stopwatchContent = document.getElementById('stopwatchContent');

// Clock elements
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const dateElement = document.getElementById('date');

// Timer elements
const hoursInput = document.getElementById('hoursInput');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');
const timerSetup = document.getElementById('timerSetup');
const timerDisplay = document.getElementById('timerDisplay');
const timerHours = document.getElementById('timerHours');
const timerMinutes = document.getElementById('timerMinutes');
const timerSeconds = document.getElementById('timerSeconds');
const timerAlert = document.getElementById('timerAlert');
const startTimer = document.getElementById('startTimer');
const pauseTimer = document.getElementById('pauseTimer');
const resetTimer = document.getElementById('resetTimer');

// Stopwatch elements
const stopwatchMinutes = document.getElementById('stopwatchMinutes');
const stopwatchSeconds = document.getElementById('stopwatchSeconds');
const stopwatchMilliseconds = document.getElementById('stopwatchMilliseconds');
const startStopwatch = document.getElementById('startStopwatch');
const pauseStopwatch = document.getElementById('pauseStopwatch');
const resetStopwatch = document.getElementById('resetStopwatch');

// Sound elements
const soundToggle = document.getElementById('soundToggle');
const soundOnIcon = document.getElementById('soundOnIcon');
const soundOffIcon = document.getElementById('soundOffIcon');
const alarmSound = document.getElementById('alarmSound');

// State variables
let soundEnabled = true;
let timerInterval = null;
let timerTimeLeft = 0;
let timerRunning = false;
let stopwatchInterval = null;
let stopwatchElapsedTime = 0;
let stopwatchRunning = false;

// Tab switching
function switchTab(tab) {
  // Remove active class from all tabs and content
  [clockTab, timerTab, stopwatchTab].forEach(t => t.classList.remove('active'));
  [clockContent, timerContent, stopwatchContent].forEach(c => c.classList.remove('active'));
  
  // Add active class to selected tab and content
  tab.classList.add('active');
  
  if (tab === clockTab) {
    clockContent.classList.add('active');
  } else if (tab === timerTab) {
    timerContent.classList.add('active');
  } else if (tab === stopwatchTab) {
    stopwatchContent.classList.add('active');
  }
}

// Event listeners for tabs
clockTab.addEventListener('click', () => switchTab(clockTab));
timerTab.addEventListener('click', () => switchTab(timerTab));
stopwatchTab.addEventListener('click', () => switchTab(stopwatchTab));

// Sound toggle
soundToggle.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  if (soundEnabled) {
    soundOnIcon.classList.remove('hidden');
    soundOffIcon.classList.add('hidden');
  } else {
    soundOnIcon.classList.add('hidden');
    soundOffIcon.classList.remove('hidden');
  }
});

// Helper function to format time
function formatTimeUnit(unit) {
  return unit < 10 ? `0${unit}` : `${unit}`;
}

// Digital Clock functionality
function updateClock() {
  const now = new Date();
  
  hoursElement.textContent = formatTimeUnit(now.getHours());
  minutesElement.textContent = formatTimeUnit(now.getMinutes());
  secondsElement.textContent = formatTimeUnit(now.getSeconds());
  
  dateElement.textContent = now.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Update clock immediately and then every second
updateClock();
setInterval(updateClock, 1000);

// Timer functionality
function updateTimerDisplay() {
  const hours = Math.floor(timerTimeLeft / 3600);
  const minutes = Math.floor((timerTimeLeft % 3600) / 60);
  const seconds = timerTimeLeft % 60;
  
  timerHours.textContent = formatTimeUnit(hours);
  timerMinutes.textContent = formatTimeUnit(minutes);
  timerSeconds.textContent = formatTimeUnit(seconds);
}

function startTimerCountdown() {
  if (timerRunning) return;
  
  // Calculate total seconds from inputs
  const hours = parseInt(hoursInput.value) || 0;
  const minutes = parseInt(minutesInput.value) || 0;
  const seconds = parseInt(secondsInput.value) || 0;
  
  timerTimeLeft = hours * 3600 + minutes * 60 + seconds;
  
  if (timerTimeLeft <= 0) return;
  
  // Hide setup, show display
  timerSetup.classList.add('hidden');
  timerDisplay.classList.remove('hidden');
  timerAlert.classList.add('hidden');
  
  // Update button visibility
  startTimer.classList.add('hidden');
  pauseTimer.classList.remove('hidden');
  
  // Update display
  updateTimerDisplay();
  
  // Start countdown
  timerRunning = true;
  timerInterval = setInterval(() => {
    timerTimeLeft--;
    updateTimerDisplay();
    
    if (timerTimeLeft <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      timerAlert.classList.remove('hidden');
      pauseTimer.classList.add('hidden');
      startTimer.classList.remove('hidden');
      
      if (soundEnabled) {
        alarmSound.play();
      }
      
      // Hide alert after 5 seconds
      setTimeout(() => {
        timerAlert.classList.add('hidden');
      }, 5000);
    }
  }, 1000);
}

function pauseTimerCountdown() {
  if (!timerRunning) return;
  
  clearInterval(timerInterval);
  timerRunning = false;
  
  pauseTimer.classList.add('hidden');
  startTimer.classList.remove('hidden');
}

function resetTimerCountdown() {
  clearInterval(timerInterval);
  timerRunning = false;
  
  // Reset inputs
  hoursInput.value = 0;
  minutesInput.value = 0;
  secondsInput.value = 0;
  
  // Show setup, hide display and alert
  timerSetup.classList.remove('hidden');
  timerDisplay.classList.add('hidden');
  timerAlert.classList.add('hidden');
  
  // Reset button visibility
  startTimer.classList.remove('hidden');
  pauseTimer.classList.add('hidden');
}

// Timer event listeners
startTimer.addEventListener('click', startTimerCountdown);
pauseTimer.addEventListener('click', pauseTimerCountdown);
resetTimer.addEventListener('click', resetTimerCountdown);

// Stopwatch functionality
function updateStopwatchDisplay() {
  const minutes = Math.floor(stopwatchElapsedTime / 60000);
  const seconds = Math.floor((stopwatchElapsedTime % 60000) / 1000);
  const milliseconds = Math.floor((stopwatchElapsedTime % 1000) / 10);
  
  stopwatchMinutes.textContent = formatTimeUnit(minutes);
  stopwatchSeconds.textContent = formatTimeUnit(seconds);
  stopwatchMilliseconds.textContent = formatTimeUnit(milliseconds);
}

function startStopwatchCount() {
  if (stopwatchRunning) return;
  
  startStopwatch.classList.add('hidden');
  pauseStopwatch.classList.remove('hidden');
  
  const startTime = Date.now() - stopwatchElapsedTime;
  stopwatchRunning = true;
  
  stopwatchInterval = setInterval(() => {
    stopwatchElapsedTime = Date.now() - startTime;
    updateStopwatchDisplay();
  }, 10);
}

function pauseStopwatchCount() {
  if (!stopwatchRunning) return;
  
  clearInterval(stopwatchInterval);
  stopwatchRunning = false;
  
  pauseStopwatch.classList.add('hidden');
  startStopwatch.classList.remove('hidden');
}

function resetStopwatchCount() {
  clearInterval(stopwatchInterval);
  stopwatchRunning = false;
  stopwatchElapsedTime = 0;
  
  updateStopwatchDisplay();
  
  pauseStopwatch.classList.add('hidden');
  startStopwatch.classList.remove('hidden');
}

// Stopwatch event listeners
startStopwatch.addEventListener('click', startStopwatchCount);
pauseStopwatch.addEventListener('click', pauseStopwatchCount);
resetStopwatch.addEventListener('click', resetStopwatchCount);

// Initialize the app with the clock tab active
switchTab(clockTab);