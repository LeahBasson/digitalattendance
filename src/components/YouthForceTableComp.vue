<template>
    <div class="badge-display">
        <span class="custom-badge">{{ onsiteCount }}</span>
    </div>
  
    <div class="table-container">
        <div class="table-heading">
             <div>
                <p>Fullname</p>
             </div>
             <div>
                <p>Status</p>
             </div>
        </div>
  
        <div class="table-border-btm"></div>
  
        <div v-if="filteredLogStatus.length > 0">
            <div class="table-content" v-for="status in filteredLogStatus" :key="status.user_id">
                <div class="table-data-one">
                    <p>{{ status['Full Name'] }}</p>
                </div>
                <div class="table-data-two">
                    <span :class="['status-icon', { 'onsite': status.status.trim().toLowerCase() === 'on-site', 'offsite': status.status.trim().toLowerCase() === 'off-site' }]"></span>
                    <p>{{ status.status || 'Unknown' }}</p>
                </div>
            </div>
        </div>
    </div>
  </template>
  
  
  <script setup>
import { useStore } from 'vuex';
import { computed, onMounted, watch } from 'vue';

const store = useStore()

const logStatus = computed(() => store.state.logStatus)

const filteredLogStatus = computed(() => logStatus.value.filter(status => status.department === 'Youthforce'))

const onsiteCount = computed(() => filteredLogStatus.value.filter(status => status.status.trim().toLowerCase() === 'on-site').length)

const updateData = async () => {
  try {

    await store.dispatch('fetchLogStatus')
  } catch (error) {
    console.error('Error fetching log status:', error)
  }
}

const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function(...args) {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

const throttledUpdateData = throttle(updateData, 300); // Throttle to 300ms

onMounted(updateData)

// Awodwa patch 
onMounted(()=>{
  setInterval(() => {
      store.dispatch("fetchLogStatus")   
  }, 30000);
})
// Awodwa patch

// Watch for changes in logStatus and update the data immediately using throttle
watch(logStatus, async () => {
  throttledUpdateData()
})
</script>
  
  <style scoped>
  .table-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 4rem;
  }
  .table-heading {
    display: flex;
    justify-content: space-between;
    width: 94%;
    margin: auto;
    margin-top: 1rem;
  }
  .table-content {
    display: flex;
    justify-content: space-between;
    width: 95%;
    border-radius: 1rem;
    margin: auto;
    margin-top: 1rem;
    background-color: var(--logColor);
    padding: 1rem;
  }
  .table-border-btm {
    width: 94%;
    height: 1px;
    background-color: var(--guestColor);
    margin: auto;
  }
  .status-icon {
    margin-top: 0.4rem;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
  }
  .onsite {
    background-color: green;
  }
  .offsite {
    background-color: red;
  }
  .table-data-one {
    word-wrap: break-word;
    width: 50%;
    text-align: start;
  }
  .table-data-two {
    width: 50%;
    text-align: end;
    display: flex;
    justify-content: end;
  }
  .table-content {
    font-size: 1rem;
  }

  @media (max-width: 555px){
  .table-heading p {
  font-size: 1.2rem;
}
}

/* Media query 556px to 999px */
@media (min-width: 556px) and (max-width: 999px){
  .table-heading p {
  font-size: 1.2rem;
}
}
  </style>
  
  