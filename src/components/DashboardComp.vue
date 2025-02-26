<template>
  <div class="dashboard-comp">
    <div class="panic-mode-container">
      <PanicMode />
    </div>
    
      <input 
        type="text" 
        v-model="searchTerm" 
        placeholder="Search users..." 
        class="search-input"
      />

    <div v-if="searchTerm" class="search-results">
      <div v-for="user in filteredUsers" :key="user.user_id" class="user-item">
        <div class="user-info">
          <div class="user-name">{{ user.fullName }}</div>
          <div class="user-department">{{ user.department }}</div>
        </div>
        <div :class="['status-badge', user.isOnsite ? 'status-onsite' : 'status-offsite']">
          {{ user.isOnsite ? 'On-Site' : 'Off-Site' }}
        </div>
      </div>
    </div>

    <div class="dash-content-container" v-show="!searchTerm">
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

    <div class="logout">
      <button class="logout-button" @click="logOut">
        Logout<span><i class="bi bi-box-arrow-right"></i></span>
      </button>
    </div>
  </div>
</template>

<script>
import PanicMode from './PanicMode.vue';
import { useCookies } from 'vue3-cookies';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { ref, computed, onMounted } from 'vue';

export default {
  name: "DashboardComp",
  components: {
    PanicMode
  },
  setup() {
    const { cookies } = useCookies();
    const router = useRouter();
    const searchTerm = ref('');
    const users = ref([]);

    const fetchUsers = async () => {
      try {
        // Fetch users
        const usersResponse = await fetch('https://attendance-tagging-system.lcstudio.co.za/user.php?endpoint=users');
        const usersData = await usersResponse.json();
        console.log('Users data:', usersData);
        
        // Fetch status from the same API
        const statusResponse = await fetch('https://attendance-tagging-system.lcstudio.co.za/logs.php?endpoint=status');
        const statusData = await statusResponse.json();
        console.log('Status data:', statusData);
        
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
          console.log('Combined users data:', users.value);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    onMounted(() => {
      fetchUsers();
      // Refresh data every 30 seconds
      setInterval(fetchUsers, 30000);
    });

    const filteredUsers = computed(() => {
      const search = searchTerm.value.toLowerCase().trim();
      console.log('Search term:', search);
      console.log('Current users:', users.value);
      
      if (!search) return [];
      
      const filtered = (users.value || []).filter(user => 
        user?.first_name?.toLowerCase().includes(search) ||
        user?.last_name?.toLowerCase().includes(search) ||
        user?.department?.toLowerCase().includes(search) ||
        user?.fullName?.toLowerCase().includes(search)
      );
      
      console.log('Filtered users:', filtered);
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

    return { 
      logOut,
      searchTerm,
      filteredDashContent,
      filteredUsers
    };
  }
};
</script>

<style>
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
}

.user-item {
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #eee;
  color: var(--primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: bold;
  margin-bottom: 0.2rem;
}

.user-department {
  font-size: 0.9rem;
  color: #666;
}

.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.status-onsite {
  background-color: #8EA833;
  color: white;
}

.status-offsite {
  background-color: #ff6b6b;
  color: white;
}

.user-item:last-child {
  border-bottom: none;
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

.logout {
  display: flex;
  justify-content: end;
  width: 85%;
  margin: auto;
  margin-bottom: 2rem;
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
