<template>
  <div class="dashboard-comp">
    <div class="panic-mode-container">
      <PanicMode />
    </div>

    <div class="view-toggle">
      <button 
        :class="['toggle-btn', { active: viewMode === 'departments' }]" 
        @click="viewMode = 'departments'"
      >
        Departments
      </button>
      <button 
        :class="['toggle-btn', { active: viewMode === 'global' }]" 
        @click="viewMode = 'global'"
      >
        Global
      </button>
    </div>
    
    <input 
      type="text" 
      v-model="searchTerm" 
      placeholder="Search users..." 
      class="search-input"
    />

    <div v-if="searchTerm" class="search-results">
      <div v-for="user in filteredUsers" :key="user.user_id" class="user-item">
        <div class="user-info" @click="showAttendanceDetails(user)">
          <div class="user-name clickable-name">{{ user.fullName }}</div>
          <div class="user-department">{{ user.department }}</div>
        </div>
        <div :class="['status-badge', user.isOnsite ? 'status-onsite' : 'status-offsite']">
          {{ user.isOnsite ? 'On-Site' : 'Off-Site' }}
        </div>
      </div>
    </div>

    <div v-if="viewMode === 'departments'" class="dash-content-container" v-show="!searchTerm">
      <div v-for="(item, index) in filteredDashContent" :key="index" class="dash-content" v-show="item.visible">
        <div class="iframe-container">
          <iframe
            :src="item.src"
            :title="item.title"
            frameborder="0"
            class="iframe"
          ></iframe>
        </div>
        <router-link :to="item.route">
          <button class="dash-button">{{ item.name }}</button>
        </router-link>
      </div>
    </div>

    <div v-else-if="viewMode === 'global'" class="global-view-container" v-show="!searchTerm">
      <GlobalTableComp />
    </div>

    <div class="button-container">
      <button class="attendance-button" @click="openDatePicker">
        Export Logs<span><i class="bi bi-calendar"></i></span>
      </button>
      <button class="logout-button" @click="logOut">
        Logout<span><i class="bi bi-box-arrow-right"></i></span>
      </button>
    </div>

    <!-- Date Range Picker Modal -->
    <div v-if="showDatePickerModal" class="modal-overlay" @click="closeDatePicker">
      <div class="modal-content date-picker-modal" @click.stop>
        <div class="modal-header">
          <h2>Select Date Range</h2>
          <button class="close-button" @click="closeDatePicker">&times;</button>
        </div>
        <div class="modal-body">
          <div class="date-inputs">
            <div class="date-field">
              <label>Start Date:</label>
              <input type="date" v-model="startDate" :max="endDate || today">
            </div>
            <div class="date-field">
              <label>End Date:</label>
              <input type="date" v-model="endDate" :min="startDate" :max="today">
            </div>
          </div>
          <div class="modal-actions">
            <button 
              class="submit-button" 
              @click="fetchDateRangeAttendance"
              :disabled="!startDate || !endDate"
            >
              Export to Excel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Date Range Records Modal -->
    <div v-if="showDateRangeModal" class="modal-overlay" @click="closeDateRangeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Attendance Records</h2>
          <button class="close-button" @click="closeDateRangeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div v-if="isLoading" class="loading">
            Loading attendance records...
          </div>
          <div v-else-if="error" class="error-message">
            {{ error }}
          </div>
          <div v-else-if="dateRangeRecords.length" class="attendance-list">
            <div class="records-count">
              Total Records: {{ dateRangeRecords.length }}
              <div class="date-range-info">
                {{ startDate }} to {{ endDate }}
              </div>
            </div>
            <div v-for="(record, index) in dateRangeRecords" :key="index" class="attendance-item">
              <div class="attendance-info">
                <p><strong>Name:</strong> {{ record['Full Name'] }}</p>
                <p><strong>Department:</strong> {{ record.department }}</p>
                <p><strong>Date:</strong> {{ record.Date }}</p>
                <p><strong>Clocked In:</strong> {{ formatTime(record['Clocked In']) }}</p>
                <p><strong>Clocked Out:</strong> {{ formatTime(record['Clocked Out']) }}</p>
              </div>
            </div>
          </div>
          <div v-else class="no-records">
            No attendance records found for the selected date range.
          </div>
        </div>
      </div>
    </div>

    <!-- Attendance Details Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedUser ? `${selectedUser.fullName}'s Attendance` : 'Attendance Details' }}</h2>
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
            <div class="records-count">Total Logs: {{ attendanceRecords.length }}</div>
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
            No log records found.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PanicMode from './PanicMode.vue';
import GlobalTableComp from './GlobalTableComp.vue';
import { useCookies } from 'vue3-cookies';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default {
  name: "DashboardComp",
  components: {
    PanicMode,
    GlobalTableComp
  },
  setup() {
    const { cookies } = useCookies();
    const router = useRouter();
    const searchTerm = ref('');
    const users = ref([]);
    const viewMode = ref('departments');
    const showModal = ref(false);
    const selectedUser = ref(null);
    const attendanceRecords = ref([]);
    const isLoading = ref(false);
    const error = ref(null);
    const showDatePickerModal = ref(false);
    const startDate = ref('');
    const endDate = ref('');
    const today = new Date().toISOString().split('T')[0];
    const showDateRangeModal = ref(false);
    const dateRangeRecords = ref([]);

    const fetchUsers = async () => {
      try {
        // Fetch users
        const usersResponse = await fetch('https://attendance-tagging-system.lcstudio.co.za/user.php?endpoint=users');
        const usersData = await usersResponse.json();
        // console.log('Users data:', usersData);
        
        // Fetch status from the same API
        const statusResponse = await fetch('https://attendance-tagging-system.lcstudio.co.za/logs.php?endpoint=status');
        const statusData = await statusResponse.json();
        // console.log('Status data:', statusData);
        
        // Create a map of user_id to their status
        const statusMap = {};
        if (statusData.result) {
          statusData.result.forEach(record => {
            statusMap[record.user_id] = record.status?.toLowerCase() === 'on-site';
          });
        }
        
        // Combine user data with status
        if (usersData) {
          users.value = (usersData.result || []).map(user => ({
            ...user,
            isOnsite: statusMap[user.user_id] || false,
            fullName: `${user.first_name} ${user.last_name}`
          }));
          // console.log('Combined users data:', users.value);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    onMounted(() => {
      fetchUsers();
      // Refresh data every 30 seconds
      setInterval(fetchUsers, 2000);
    });

    const filteredUsers = computed(() => {
      const search = searchTerm.value.toLowerCase().trim();
      // console.log('Search term:', search);
      // console.log('Current users:', users.value);
      
      if (!search) return [];
      
      const filtered = (users.value || []).filter(user => 
        user?.first_name?.toLowerCase().includes(search) ||
        user?.last_name?.toLowerCase().includes(search) ||
        user?.department?.toLowerCase().includes(search) ||
        user?.fullName?.toLowerCase().includes(search)
      );
      
      // console.log('Filtered users:', filtered);
      return filtered;
    });

    const dashContent = [
      {
        src: '/lca-class-one?fullView=false',
        title: 'Life Choices Academy Class 1',
        route: '/lca-class-one?fullView=true',
        name: 'Life Choices Academy C1'
      },
      {
        src: '/lca-class-two?fullView=false',
        title: 'Life Choices Academy Class 2',
        route: '/lca-class-two?fullView=true',
        name: 'Life Choices Academy C2'
      },
      {
        src: '/green-solar?fullView=false',
        title: 'Green Solar',
        route: '/green-solar?fullView=true',
        name: 'Green Solar'
      },
      {
        src: '/green-solar-youth?fullView=false',
        title: 'Green Solar Youth',
        route: '/green-solar-youth?fullView=true',
        name: 'Green Solar Youth'
      },
      {
        src: '/lc-studio?fullView=false',
        title: 'Lc Studio',
        route: '/lc-studio?fullView=true',
        name: 'LC Studio'
      },
      {
        src: '/youth-force?fullView=false',
        title: 'Youth Force',
        route: '/youth-force?fullView=true',
        name: 'Youth Force'
      }
    ];

    const filteredDashContent = computed(() => {
      const search = searchTerm.value.toLowerCase();
      return dashContent.map(item => ({
        ...item,
        visible: item.name.toLowerCase().includes(search) || 
                item.title.toLowerCase().includes(search)
      }));
    });

    const logOut = () => {
      Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out of your account.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5A682C',
        cancelButtonColor: '#8EA833',
        confirmButtonText: 'Yes, log me out!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          cookies.remove('LegitUser');
          router.push({ name: 'login' });
          setTimeout(() => {
            location.reload();
          }, 1000);

          Swal.fire({
            title: 'Logged Out',
            text: 'You have been successfully logged out.',
            icon: 'success',
            confirmButtonColor: '#5A682C'
          });
        }
      });
    };

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

    const openDatePicker = () => {
      showDatePickerModal.value = true;
    };

    const closeDatePicker = () => {
      showDatePickerModal.value = false;
      startDate.value = '';
      endDate.value = '';
    };

    const closeDateRangeModal = () => {
      showDateRangeModal.value = false;
      dateRangeRecords.value = [];
    };

    const formatTime = (timestamp) => {
      if (!timestamp) return 'Not recorded';
      const date = new Date(timestamp);
      return date.toLocaleTimeString();
    };

    const fetchDateRangeAttendance = async () => {
      try {
        isLoading.value = true;
        error.value = null;

        // Format dates with quotes
        const formattedStartDate = `"${startDate.value}"`;
        const formattedEndDate = `"${endDate.value}"`;

        const response = await axios.get('https://attendance-tagging-system.lcstudio.co.za/logs.php', {
          params: {
            endpoint: 'records',
            startDate: formattedStartDate,
            endDate: formattedEndDate
          }
        });

        if (response.data && response.data.status === 200 && Array.isArray(response.data.result)) {
          const records = response.data.result;
          if (records.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'No Records Found',
              text: 'No attendance records found for the selected date range'
            });
            return;
          }

          dateRangeRecords.value = records;
          await exportToExcel(records);
          showDatePickerModal.value = false;
          showDateRangeModal.value = true;
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (err) {
        console.error('Error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch attendance records'
        });
      } finally {
        isLoading.value = false;
      }
    };

    const exportToExcel = async (data) => {
      try {
        // Format data for Excel exactly as received from API
        const formattedData = data.map(record => ({
          'User ID': record.user_id,
          'Full Name': record['Full Name'],
          'Department': record.department,
          'Date': record.Date,
          'Clocked In': record['Clocked In'],
          'Clocked Out': record['Clocked Out']
        }));

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(formattedData);

        // Set column widths
        ws['!cols'] = [
          { wch: 10 },  // User ID
          { wch: 25 },  // Full Name
          { wch: 20 },  // Department
          { wch: 12 },  // Date
          { wch: 20 },  // Clocked In
          { wch: 20 }   // Clocked Out
        ];

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Attendance Records');

        // Generate Excel file
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        // Save file
        const fileName = `attendance_${startDate.value}_to_${endDate.value}.xlsx`;
        saveAs(blob, fileName);

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Attendance records exported to Excel',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        console.error('Error exporting to Excel:', err);
        Swal.fire({
          icon: 'error',
          title: 'Export Failed',
          text: 'Failed to export attendance records'
        });
      }
    };

    return { 
      logOut,
      searchTerm,
      filteredDashContent,
      filteredUsers,
      viewMode,
      showModal,
      selectedUser,
      attendanceRecords,
      isLoading,
      error,
      showAttendanceDetails,
      closeModal,
      formatDateTime,
      showDatePickerModal,
      startDate,
      endDate,
      today,
      openDatePicker,
      closeDatePicker,
      fetchDateRangeAttendance,
      showDateRangeModal,
      dateRangeRecords,
      closeDateRangeModal,
      formatTime
    };
  }
};
</script>

<style scoped>
.dashboard-comp {
  display: block;
  padding-top: 8rem;
}

.search-container {
  width: 35%;
  max-width: 350px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  padding: 0.8rem;
  background: white;
  position: fixed;
  top: 6rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 997;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
}

.search-input {
  width: 100%;
  max-width: 250px;
  padding: 0.8rem 1rem;
  border: 2px solid var(--alternative);
  border-radius: 1.5rem;
  font-size: 1rem;
  outline: none;
}

.search-input:focus {
  border-color: var(--primary);
}

.search-results {
  max-width: 600px;
  width: 80%;
  margin: 1rem auto;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #eee;
}

.user-info {
  cursor: pointer;
  flex: 1;
}

.user-info:hover {
  color: rgb(121, 170, 64);
}

.user-name {
  font-weight: bold;
  color: rgb(74, 106, 38);
}

.user-department {
  font-size: 0.9em;
  color: #666;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9em;
}

.status-onsite {
  background-color: #4caf50;
  color: white;
}

.status-offsite {
  background-color: #f44336;
  color: white;
}

.dash-content-container {
  display: flex;
  flex-wrap: wrap;
  width: 95%;
  justify-content: space-between;
  margin: auto;
  margin-top: 2rem;
  margin-bottom: 4rem;
}

.dash-content {
  display: flex;
  justify-content: center;
  width: 28%;
  flex-direction: column;
  margin: auto;
}

.iframe-container {
  width: 100%;
  height: 300px;
  margin-top: 2rem;
  /* border: 1px solid #ddd; */
  border-radius: 10px;
  overflow: hidden;
}

.iframe {
  width: 100%;
  height: 100%;
}

.dash-button {
  border-radius: 1.5rem;
  padding: 0.8rem 1rem;
  width: 15rem;
  border: none;
  background-color: var(--alternative);
  color: var(--secondary);
  margin-top: 1rem;
  margin-bottom: 8rem;
}

.dash-button:hover {
  background-color: var(--awesome);
}

.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  width: 85%;
  margin: auto;
  margin-bottom: 2rem;
}

.attendance-button {
  padding: 0.7rem 1.5rem;
  background-color: rgb(74, 106, 38);
  color: white;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s;
}

.attendance-button:hover {
  background-color: rgb(121, 170, 64);
}

.attendance-button span {
  display: inline-flex;
  align-items: center;
  margin-left: 0.5rem;
}

.logout-button {
  padding: 0.7rem 1.5rem;
  border: none;
  background-color: var(--alternative);
  color: var(--secondary);
  border-radius: 1rem;
}

.logout-button i {
  margin-left: 0.5rem;
}

.logout-button:hover {
  background-color: var(--awesome);
}

.panic-mode-container {
  text-transform: uppercase;
  padding-top: 2rem;
  color: var(--primary);
  margin: auto;
  display: none;
}

.view-toggle {
  margin: 2rem auto;
  display: flex;
  justify-content: space-between;
  width: 20rem;
}

.toggle-btn {
  padding: 0.8rem 1rem;
  border: none;
  background-color: var(--alternative);
  color: var(--secondary);
  border-radius: 1rem;
  width: 9rem;
}

.toggle-btn:hover {
  background-color: var(--awesome);
}

.toggle-btn.active {
  background-color: var(--primary);
  color: white;
}

.global-view-container {
  width: 95%;
  margin: auto;
  margin-top: 2rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: rgb(74, 106, 38);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 1rem;
}

.loading, .error-message, .no-records {
  text-align: center;
  padding: 1rem;
}

.attendance-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.records-count {
  font-weight: bold;
  color: rgb(74, 106, 38);
  margin-bottom: 1rem;
}

.attendance-item {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border-left: 4px solid rgb(74, 106, 38);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.attendance-time {
  margin-bottom: 0.5rem;
}

.attendance-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.attendance-info p {
  margin: 0;
  line-height: 1.4;
  color: #000000;
}

.attendance-info strong {
  color: rgb(74, 106, 38);
  margin-right: 0.5rem;
}

.records-count {
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  color: rgb(74, 106, 38);
  font-weight: bold;
  border: 1px solid #eee;
}

.date-range-info {
  font-size: 0.9rem;
  color: #333;
  margin-top: 0.5rem;
}

.attendance-list {
  max-height: 70vh;
  overflow-y: auto;
  padding: 1rem;
}

.attendance-item {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border-left: 4px solid rgb(74, 106, 38);
}

.records-count {
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  color: rgb(74, 106, 38);
  font-weight: bold;
  border: 1px solid #eee;
}

.date-picker-modal {
  max-width: 400px;
}

.date-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
}

.date-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.date-field label {
  font-weight: bold;
  color: rgb(74, 106, 38);
}

.date-field input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.submit-button {
  background-color: rgb(74, 106, 38);
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: rgb(121, 170, 64);
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.attendance-info p {
  margin: 0.25rem 0;
  color: #000000;
}

@media (max-width: 555px) {
  .panic-mode-container {
    display: block;
  }
}

@media (min-width: 556px) and (max-width: 999px) {
  .panic-mode-container {
    display: block;
  }
}

@media (max-width: 555px) {
  .dash-content {
    display: flex;
    justify-content: center;
    width: 100%;
    flex-direction: column;
    margin: auto;
  }

  .dash-content-container {
    display: flex;
    flex-wrap: wrap;
    width: 95%;
    justify-content: space-between;
    margin: auto;
    margin-top: 1rem;
    margin-bottom: 2rem;
  }

  .dash-button {
    border-radius: 1.5rem;
    padding: 0.8rem 1rem;
    width: 15rem;
    border: none;
    background-color: var(--alternative);
    color: var(--secondary);
    margin-top: 1rem;
    margin-bottom: 4rem;
  }
}

@media (min-width: 556px) and (max-width: 999px) {
  .dash-content {
    display: flex;
    justify-content: center;
    width: 84%;
    flex-direction: column;
    margin: auto;
  }

  .dash-content-container {
    display: flex;
    flex-wrap: wrap;
    width: 95%;
    justify-content: space-between;
    margin: auto;
    margin-top: 1rem;
    margin-bottom: 2rem;
  }

  .dash-button {
    border-radius: 1.5rem;
    padding: 0.8rem 1rem;
    width: 15rem;
    border: none;
    background-color: var(--alternative);
    color: var(--secondary);
    margin-top: 1rem;
    margin-bottom: 4rem;
  }
}

@media (min-width: 1700px) {
  .dash-content-container {
    display: flex;
    flex-wrap: wrap;
    width: 91%;
    justify-content: space-between;
    margin: auto;
    margin-top: 10rem;
    margin-bottom: 2rem;
  }
}
</style>
