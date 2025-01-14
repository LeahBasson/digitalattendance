<template>
    <div>
      <div v-if="showFullView" class="back-icon">
        <router-link to="/">
          <i class="fi fi-br-angle-small-left"></i>
        </router-link>
      </div>
  
      <div v-if="showFullView" class="heading">
        <h1>Green Solar Youth</h1>
        <p>Daily Logs</p>
      </div>
  
      <!-- Always display the class-one-data section -->
      <div class="green-solar-youth-data" id="greensolaryouthdata">
        <p>This is the data.</p>
      </div>
      <div class="green-solar-youth-data" id="greensolaryouthdata">
        <p>This is the data.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "GreenSolarYouth",
    computed: {
      // Check the query parameter to determine what to show
      showFullView() {
        return this.$route.query.fullView === "true";
      },
    },
  };
  </script>
  
  <style>
  .heading {
    width: 95%;
    height: 220px;
    background-color: var(--alternative);
    margin: auto;
    text-align: center;
    padding-top: 4rem;
    margin-top: 0.5rem;
    border-radius: 2rem;
    color: var(--secondary);
  }
  
  .heading p {
    font-size: 1.3rem;
  }
  
  .back-icon {
    display: flex;
    align-items: center;
    padding: 1rem;
    margin-left: 1rem;
  }
  
  .back-icon i {
    color: var(--guestColor);
    font-size: 2.5rem;
    cursor: pointer;
  }
  
  .back-icon a {
    text-decoration: none;
  }
  
  .green-solar-youth-data {
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: 10px;
    margin: 1rem auto;
    width: 95%;
    text-align: center;
  }
  </style>
  