<template>
  <div class="stopwatch">
    <label>{{ formattedTime }}</label>
  </div>
</template>

<script>
export default {
  name: "StopwatchComp",
  data() {
    return {
      startTime: null, // The timestamp when the stopwatch was started
      elapsedTime: 0,  // The elapsed time in seconds
      intervalId: null // Stores the interval ID for the stopwatch
    };
  },
  computed: {
    // Formats the time into MM:SS format
    formattedTime() {
      const minutes = Math.floor(this.elapsedTime / 60);
      const seconds = this.elapsedTime % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  },
  methods: {
    // Starts the stopwatch
    startStopwatch() {
      if (!this.intervalId) { // Prevent multiple intervals
        this.startTime = Date.now() - this.elapsedTime * 1000;
        this.intervalId = setInterval(() => {
          this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
          localStorage.setItem('stopwatchElapsedTime', this.elapsedTime);
          localStorage.setItem('stopwatchStartTime', this.startTime);
          localStorage.setItem('stopwatchRunning', true);
        }, 1000);
      }
    },
    // Stops the stopwatch
    stopStopwatch() {
      if (this.intervalId) {
        clearInterval(this.intervalId); // Clear the interval
        this.intervalId = null; // Reset the interval ID
        localStorage.setItem('stopwatchElapsedTime', this.elapsedTime);
        localStorage.setItem('stopwatchStartTime', this.startTime); // Save the start time
        localStorage.setItem('stopwatchRunning', false);
      }
    },
    // Resets the stopwatch
    resetStopwatch() {
      this.elapsedTime = 0; // Reset time to 0
      this.startTime = null;
      localStorage.removeItem('stopwatchElapsedTime'); // Remove time from localStorage
      localStorage.removeItem('stopwatchStartTime'); // Remove start time from localStorage
      localStorage.removeItem('stopwatchRunning'); // Remove running state from localStorage
      if (this.intervalId) {
        clearInterval(this.intervalId); // Clear the interval
        this.intervalId = null; // Reset the interval ID
      }
    },
    // Fetches the formatted elapsed time
    getElapsedTime() {
      return this.formattedTime; // Return the computed formatted time
    }
  },
  created() {
    const savedElapsedTime = localStorage.getItem('stopwatchElapsedTime');
    const savedStartTime = localStorage.getItem('stopwatchStartTime');
    const isRunning = localStorage.getItem('stopwatchRunning') === 'true';

    if (savedElapsedTime) {
      this.elapsedTime = parseInt(savedElapsedTime, 10);
    }
    if (savedStartTime) {
      this.startTime = parseInt(savedStartTime, 10);
      if (isRunning) {
        this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
      }
    }
    if (isRunning) {
      this.startStopwatch();
    }
  },
  // Automatically clean up the interval when the component is destroyed
  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
};
</script>

<style>
.stopwatch {
  background-color: var(--secondary);
  border: 1px solid var(--guestColor);
  padding: 0.5rem 1.5rem;
  width: 6rem;
  color: var(--primary);
  border-radius: 0.8rem;
  animation: redBlur 2s infinite;
  position: relative;
  z-index: 9999 !important;
}

.stopwatch-container {
  position: relative;
  z-index: 9999 !important;
}

@keyframes redBlur {
  0% {
    box-shadow: 0 0 5px 5px rgba(255, 0, 0, 0);
  }
  50% {
    box-shadow: 0 0 10px 10px rgba(255, 0, 0, 0.7);
  }
  100% {
    box-shadow: 0 0 5px 5px rgba(255, 0, 0, 0);
  }
}
</style>
