<template>
    <div>

      <div class="panic-mode">
        <h6>Panic Mode</h6>
      </div>
  
      <div class="toggle-display">
        <!-- Label for Enabled -->
        <p class="toggle-label">Enabled</p>
        
        <!-- Toggle Switch -->
        <div
          class="toggle-switch"
          :class="{ right: isRight }"
          @click="toggle"
        >
          <!-- Toggle Knob -->
          <div :class="{'toggle-knob': true, 'right': isRight}"></div>
        </div>
        
        <!-- Label for Disabled -->
        <p class="toggle-label">Disabled</p>
      </div>

    </div>
  </template>
  
  <script>
export default {
  data() {
    return {
      isRight: true, // Default state (Disabled)
    };
  },
  created() {
    // Check localStorage for the saved state
    const savedState = localStorage.getItem("panicMode");
    if (savedState !== null) {
      this.isRight = JSON.parse(savedState); // Parse saved state as boolean
    }
  },
  methods: {
    toggle() {
      this.isRight = !this.isRight; // Toggle between Enabled and Disabled
      localStorage.setItem("panicMode", JSON.stringify(this.isRight)); // Save the new state
    },
  },
};
</script>
  
  <style>
  .panic-mode h6 {
    text-transform: uppercase;
    font-weight: 600;
    text-align: center;
    color: white;
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
    color: white;
    text-transform: none;
  }
  </style>
  