Date Time
<template>
    <div class="date-time-display text-white">
      <span>{{ formattedDate }}</span>
      <span class="separator"></span>
      <span>{{ formattedTime }}</span>
    </div>
  </template>
  
  <script>
  export default {
    name: "DateTime",
    data() {
      return {
        formattedDate: "",
        formattedTime: "",
      };
    },
    methods: {
      updateDateTime() {
        const now = new Date();
  
        const dateFormatter = new Intl.DateTimeFormat("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        this.formattedDate = dateFormatter.format(now);
  
        const timeFormatter = new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });
        this.formattedTime = timeFormatter.format(now);
      },
    },
    mounted() {
      this.updateDateTime();
      this.timer = setInterval(this.updateDateTime, 1000); // Update every second
    },
    beforeUnmount() {
      clearInterval(this.timer); // Clear interval when the component is destroyed
    },
  };
  </script>
  
  <style>
  .date-time-display {
    display: flex;
    align-items: center;
    font-size: 1.2rem;
  }
  
  .separator {
  display: inline-block;
  width: 2px; 
  height: 3rem; 
  background-color: white; 
  margin: 0 1.5rem; 
}

@media (max-width: 555px){
  .date-time-display { 
    display: block; 
    text-align: center;
    font-size: 1rem; 
    margin-bottom: 1.2rem;
  } 

  .separator { 
    width: 90%; 
    height: 2px; 
    margin: 0.5rem 0;
  }
  }

  /* Media query 556px to 999px */
@media (min-width: 556px) and (max-width: 999px){
  .date-time-display { 
    display: block; 
    text-align: center;
    font-size: 1.2rem; 
    margin-bottom: 1.2rem;
  } 

  .separator { 
    width: 90%; 
    height: 2px; 
    margin: 0.5rem 0;
  }
}
  </style>
  