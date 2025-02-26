<template>
  <div>
    <div class="panic-mode">
      <h6>Panic Mode</h6>
    </div>
    <div class="toggle-display">
      <p class="toggle-label">Enabled</p>
      <div
        class="toggle-switch"
        :class="{ right: isRight }"
        @click="toggle"
      >
        <div :class="{'toggle-knob': true, 'right': isRight}"></div>
      </div>
      <p class="toggle-label">Disabled</p>
    </div>
    <div v-if="stopwatchVisible" class="stopwatch-container">
      <Stopwatch ref="stopwatch" />
    </div>
  </div>
</template>

<script>
import Stopwatch from './StopwatchComp.vue';
import { nextTick } from 'vue';
import Swal from 'sweetalert2';

export default {
  components: {
    Stopwatch,
  },
  data() {
    return {
      isRight: true, // Default state (Disabled)
      stopwatchVisible: false, // To control the visibility of the stopwatch
    };
  },
  created() {
    const savedState = localStorage.getItem("panicMode");
    const savedStopwatchVisibility = localStorage.getItem("stopwatchVisible");
    if (savedState !== null) {
      this.isRight = JSON.parse(savedState); // Parse saved state as boolean
      if (!this.isRight) {
        this.stopwatchVisible = JSON.parse(savedStopwatchVisibility);
        if (this.stopwatchVisible) {
          nextTick(() => {
            this.$refs.stopwatch.startStopwatch();
          });
        }
      }
    }
  },
  methods: {
    async toggle() {
  this.isRight = !this.isRight; // Toggle between Enabled and Disabled
  localStorage.setItem("panicMode", JSON.stringify(this.isRight)); // Save the new state

  if (!this.isRight) {
    this.stopwatchVisible = true; // Show the stopwatch
    localStorage.setItem("stopwatchVisible", true);
    await nextTick(); // Wait for the DOM to render the Stopwatch component
    this.$refs.stopwatch.resetStopwatch(); // Reset the stopwatch
    this.$refs.stopwatch.startStopwatch(); // Start the stopwatch
  } else {
    // Stop the stopwatch, fetch the elapsed time, and show it
    this.$refs.stopwatch.stopStopwatch();
    const elapsedTime = this.$refs.stopwatch.getElapsedTime(); // Assume getElapsedTime() returns formatted time
    localStorage.setItem("stopwatchVisible", true);

    // Use a SweetAlert modal to display the elapsed time
    Swal.fire({
      title: "Time Completed!",
      text: `Elapsed Time: ${elapsedTime}`,
      icon: "info",
      confirmButtonColor: '#5A682C',
      confirmButtonText: "OK",
    });

    // Immediately hide the stopwatch
    this.stopwatchVisible = false;
    localStorage.setItem("stopwatchVisible", false);
  }
},
  },
};
</script>

<style>
.panic-mode h6 {
  text-transform: uppercase;
  font-weight: 600;
  text-align: center;
}

/* Toggle switch container */
.toggle-switch {
  width: 50px;
  height: 25px;
  background-color: #FF0600; /* Default background for Enabled state */
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 3px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: -1rem;
  position: relative;
}

/* When the toggle is in the Disabled state */
.toggle-switch.right {
  background-color: #ccc;
}

/* Toggle knob */
.toggle-knob {
  width: 19px;
  height: 19px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

/* When the toggle is Disabled, move the knob to the right */
.toggle-knob.right {
  transform: translateX(25px);
}

/* Container for toggle and labels */
.toggle-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 0.8rem;
  position: relative;
  z-index: 9999 !important;
}

.toggle-label {
  font-size: 0.9rem;
  text-transform: none;
}

.stopwatch-container {
  position: fixed !important;
  top: 7rem !important;
  right: 2rem !important;
  padding: 10px !important;
  border-radius: 5px !important;
  z-index: 9999 !important;
  background: transparent !important;
}

.stopwatch-container h2,
.stopwatch-container p {
  color: var(--primary);
}

/* Ensure the entire panic mode section stays above search */
.panic-mode {
  position: relative;
  z-index: 9999 !important;
}

.toggle-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 0.8rem;
  position: relative;
  z-index: 9999 !important;
}

/* Media query 556px to 999px */
@media (min-width: 556px) and (max-width: 999px) {
  .stopwatch-container {
  position: absolute;
  top: 245px; 
  right: 330px; 
  padding: 10px;
  border-radius: 5px;
  z-index: 1; 
}
}

/* Media query 1080px to 1920px */
@media (width: 1920px){
  .stopwatch-container {
  position: absolute;
  top: 120px; 
  right: 160px; 
  padding: 10px;
  border-radius: 5px;
  z-index: 1000; 
}
}
</style>
