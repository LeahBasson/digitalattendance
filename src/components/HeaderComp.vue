<template>
    <div class="header-section">
      <div class="dash-logo">
        <a href="#home">
          <img class="img-fluid" src="https://leahbasson.github.io/MyImages/dats/lc-logo.png" alt="logo" loading="eager">
        </a>
      </div>

      <div class="dt-section">
        <DateTime />
      </div>
        
      <div class="pm-section text-white">
        <PanicMode />
      </div>

    </div>
  </template>
  
  <script>
  import DateTime from './DateTime.vue';
  import PanicMode from './PanicMode.vue';

  export default {
    name: "HeaderCompo",
    components: {
      DateTime,
      PanicMode
    },
  };
  </script>
  
  <style>
  .header-section {
    display: flex;
    justify-content: space-between;
    background-color: var(--primary);
  }
  
  .dash-logo {
    margin-left: 2rem;
    margin-top: 1.2rem;
    margin-bottom: 1.2rem;
  }
  
  .dash-logo a img {
    width: 230px;
    height: auto;
    transition: all 0.5s;
  }
  
  .dash-logo a img:hover {
    transform: scale(1.1);
  }
  
  .dt-section {
    margin-top: 2rem;
  }
  
  .pm-section {
    width: 300px;
    text-transform: uppercase;
    margin-top: 1.5rem;
  }
  </style>
  