<template>
  <div class="badge-display">
      <span class="custom-badge">{{ filteredCount }}</span>
  </div>

  <div class="filter-container">
      <button @click="toggleFilter" class="filter-button">
          <span class="filter-icon">&#x1F50D;</span> Filter: {{ filterStatus || 'All' }}
      </button>
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

      <div v-if="displayedLogStatus.length > 0">
          <div class="table-content" v-for="status in displayedLogStatus" :key="status.user_id">
              <div class="table-data-one">
                  <p class="clickable-name" @click="showAttendanceDetails(status)">{{ status['Full Name'] }}</p>
              </div>
              <div class="table-data-two">
                  <span :class="['status-icon', { 'onsite': status.status?.trim().toLowerCase() === 'on-site', 'offsite': status.status?.trim().toLowerCase() === 'off-site' }]"></span>
                  <p>{{ status.status || 'Unknown' }}</p>
              </div>
          </div>
      </div>
      <div v-else>
          <p class="no-data">No users found.</p>
      </div>
  </div>

  <!-- Attendance Details Modal -->
  <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ selectedUser ? `${selectedUser['Full Name']}'s Attendance` : 'Attendance Details' }}</h2>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <div v-if="isLoading" class="loading">
          Loading attendance records...
        </div>
        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>
        <div v-else-if="attendanceRecords.length" class="attendance-list">
          <div class="records-count">Total Records: {{ attendanceRecords.length }}</div>
          <div v-for="(record, index) in attendanceRecords" :key="index" class="attendance-item">
            <div class="attendance-time">
              <strong>Time Stamp:</strong> {{ formatDateTime(record['Time Stamp']) }}
            </div>
            <div class="attendance-info">
              <p><strong>Name:</strong> {{ record.first_name }} {{ record.last_name }}</p>
              <p><strong>Department:</strong> {{ record.department }}</p>
            </div>
          </div>
        </div>
        <div v-else class="no-records">
          No attendance records found.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { computed, ref, onMounted, watch } from 'vue';
import axios from 'axios';

const store = useStore();
const filterStatus = ref(null);
const showModal = ref(false);
const selectedUser = ref(null);
const attendanceRecords = ref([]);
const isLoading = ref(false);
const error = ref(null);

const logStatus = computed(() => {
  console.log('Raw logStatus:', store.state.logStatus);
  return store.state.logStatus || [];
});

const filteredLogStatus = computed(() => {
  const filtered = (logStatus.value || [])
    .filter(status => {
      console.log('Checking department:', status?.department);
      return status?.department === 'Life Choices Academy C1';
    })
    .sort((a, b) => new Date(b.latest_log_time) - new Date(a.latest_log_time));
  console.log('Filtered results:', filtered);
  return filtered;
});

const filteredCount = computed(() => {
  if (!filterStatus.value) return filteredLogStatus.value.length;
  return filteredLogStatus.value.filter(status => status?.status?.trim().toLowerCase() === filterStatus.value.toLowerCase()).length;
});

const displayedLogStatus = computed(() => {
  if (!filterStatus.value) return filteredLogStatus.value;
  return filteredLogStatus.value.filter(status => status?.status?.trim().toLowerCase() === filterStatus.value.toLowerCase());
});

const toggleFilter = () => {
  if (!filterStatus.value) {
    filterStatus.value = 'on-site';
  } else if (filterStatus.value === 'on-site') {
    filterStatus.value = 'off-site';
  } else {
    filterStatus.value = null;
  }
};

const updateData = async () => {
  try {
    await store.dispatch('fetchLogStatus');
  } catch (error) {
    console.error('Error fetching log status:', error);
  }
};

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
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

const throttledUpdateData = throttle(updateData, 3000);

onMounted(updateData);

onMounted(() => {
  setInterval(() => {
    store.dispatch("fetchLogStatus");
  }, 30000);
});

watch(logStatus, async () => {
  throttledUpdateData();
});

const showAttendanceDetails = async (user) => {
  selectedUser.value = user;
  isLoading.value = true;
  error.value = null;
  
  try {
    const userId = user.user_id;
    const response = await axios.get(`https://attendance-tagging-system.lcstudio.co.za/logs.php`, {
      params: {
        endpoint: 'logs',
        id: userId
      }
    });
    
    if (response.data && response.data.result && Array.isArray(response.data.result)) {
      attendanceRecords.value = response.data.result;
    } else {
      attendanceRecords.value = [];
      error.value = 'No attendance records found';
    }
  } catch (err) {
    console.error('Error fetching attendance records:', err);
    error.value = 'Failed to fetch attendance records';
    attendanceRecords.value = [];
  } finally {
    isLoading.value = false;
  }
  
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedUser.value = null;
  attendanceRecords.value = [];
};

const formatDateTime = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};
</script>

<style scoped>
.filter-container {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
}

.filter-button {
    background-color: rgb(74, 106, 38);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 5px;
    display: flex;
    align-items: center;
}

.filter-button:hover {
    background-color: rgb(121, 170, 64);
}

.filter-icon {
    margin-right: 0.5rem;
}

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

.table-border-btm {
    width: 94%;
    height: 1px;
    background-color: var(--guestColor);
    margin: auto;
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

/* .custom-badge {
    background-color: rgb(74, 106, 38);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    font-size: 1rem;
} */
/* 
.badge-display {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
} */

.no-data {
  text-align: center;
  font-size: 1.2rem;
  color: var(--guestColor);
  margin-top: 1rem;
}

.clickable-name {
  cursor: pointer;
  color: #4a6a26;
  transition: color 0.2s;
}

.clickable-name:hover {
  color: #79aa40;
  text-decoration: underline;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.close-button:hover {
  color: #000;
}

.attendance-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.attendance-item {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 6px;
  background-color: #f9f9f9;
}

.attendance-time {
  margin-bottom: 10px;
  color: #4a6a26;
}

.attendance-info p {
  margin: 5px 0;
}

.no-records {
  text-align: center;
  padding: 20px;
  color: #666;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #4a6a26;
}

.error-message {
  text-align: center;
  padding: 20px;
  color: #dc3545;
  background-color: #f8d7da;
  border-radius: 4px;
}

.records-count {
  text-align: center;
  margin-bottom: 15px;
  font-weight: bold;
  color: #4a6a26;
}

@media (max-width: 555px) {
  .table-heading p {
    font-size: 1.2rem;
  }
}
</style>