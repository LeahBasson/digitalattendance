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
    <div v-if="!isRight" class="stopwatch-container">
      <Stopwatch ref="stopwatch" />
    </div>
  </div>
</template>

<script>
import Stopwatch from './StopwatchComp.vue';
import { nextTick } from 'vue'; // Import nextTick
export default {
  components: {
    Stopwatch
  },
  data() {
    return {
      isRight: true, // Default state (Disabled)
      iframes: ['Iframe 1', 'Iframe 2', 'Iframe 3'],
      selectedIframes: []
    };
  },
  created() {
    // Check localStorage for the saved state
    const savedState = localStorage.getItem("panicMode");
    if (savedState !== null) {
      this.isRight = JSON.parse(savedState); // Parse saved state as boolean
      if (!this.isRight) {
        // Start the stopwatch if Panic Mode is enabled
        nextTick(() => {
          this.$refs.stopwatch.startStopwatch();
        });
      }
    }
  },
  methods: {
    async toggle() {
      this.isRight = !this.isRight; // Toggle between Enabled and Disabled
      localStorage.setItem("panicMode", JSON.stringify(this.isRight)); // Save the new state
      // Wait for the DOM to update before accessing the ref
      if (!this.isRight) {
        await nextTick(); // Wait for the DOM to render the Stopwatch component
        this.$refs.stopwatch.resetStopwatch(); // Reset the stopwatch
        this.$refs.stopwatch.startStopwatch(); // Start the stopwatch
      } else {
        this.$refs.stopwatch.stopStopwatch(); // Stop the stopwatch when Panic Mode is disabled
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
}
.toggle-label {
  font-size: 0.9rem;
  text-transform: none;
}
.stopwatch-container {
  position: absolute;
  top: 120px; /* Adjust as needed */
  right: 120px; /* Adjust as needed */
  padding: 10px;
  border-radius: 5px;
  z-index: 1000; /* Ensure it stays on top */
}
.stopwatch-container h2,
.stopwatch-container p {
  color: var(--primary); /* Match text color to your theme */
}

@media (max-width: 555px) {
  .stopwatch-container {
  position: absolute;
  top: 230px; /* Adjust as needed */
  right: 140px; /* Adjust as needed */
  padding: 10px;
  border-radius: 5px;
  z-index: 1000; /* Ensure it stays on top */
}
}


/* Media query 556px to 999px */
@media (min-width: 556px) and (max-width: 999px) {
  .stopwatch-container {
  position: absolute;
  top: 245px; /* Adjust as needed */
  right: 330px; /* Adjust as needed */
  padding: 10px;
  border-radius: 5px;
  z-index: 1000; /* Ensure it stays on top */
}
}

/* Media query 1080px to 1920px */
@media (width: 1920px){
  .stopwatch-container {
  position: absolute;
  top: 120px; /* Adjust as needed */
  right: 160px; /* Adjust as needed */
  padding: 10px;
  border-radius: 5px;
  z-index: 1000; /* Ensure it stays on top */
}
}
</style>
