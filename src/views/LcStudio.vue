<template>
    <div>
      <div v-if="showFullView" class="back-icon">
        <router-link to="/">
          <i class="fi fi-br-angle-small-left"></i>
        </router-link>
      </div>
  
      <div v-if="showFullView" class="heading">
        <h1>LC Studio</h1>
        <p>Daily Logs</p>
      </div>
  
      <div>
      <StatusTable />
     </div>

    </div>
  </template>
  
  <script>
  import StatusTable from '@/components/LcStudioTableComp.vue';

  export default {
    name: "LcStudio",
    components: {
    StatusTable,
  },
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

.status-icon {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: green;
  border-radius: 50%;
  margin-right: 5px;
}

.badge-display{
  width: 93%;
  margin: auto;
  /* background-color: pink; */
  margin-top: 1rem;
  display: flex;
  justify-content: end;
  margin-bottom: 0.5rem;
}

.custom-badge {
  display: inline-block;
  background-color: var(--awesome); 
  color: white; 
  font-size: 1rem; 
  font-weight: bold;
  text-align: center;
  width: 40px; 
  height: 40px;
  line-height: 40px; 
  border-radius: 50%; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 555px){
  .back-icon {
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-left: 0rem;
}
}

/* Media query 556px to 999px */
@media (min-width: 556px) and (max-width: 999px){
  .back-icon {
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-left: 0rem;
}
}
</style>
