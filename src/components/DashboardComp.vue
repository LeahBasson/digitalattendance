<template>
  <div class="dashboard-comp">
    <div class="panic-mode-section">
      <PanicMode />
    </div>
 
    <div class="dash-content-container">
      <div class="dash-content">
        <div class="iframe-container">
          <iframe
            src="/lca-class-one?fullView=false"
            title="Life Choices Academy Class 1"
            frameborder="0"
            class="iframe"
          ></iframe>
        </div>
        <router-link to="/lca-class-one?fullView=true">
          <button class="dash-button">Life Choices Academy C1</button>
        </router-link>
      </div>

      <div class="dash-content">
        <div class="iframe-container">
          <iframe
            src="/lca-class-two?fullView=false"
            title="Life Choices Academy Class 2"
            frameborder="0"
            class="iframe"
          ></iframe>
        </div>
        <router-link to="/lca-class-two?fullView=true">
          <button class="dash-button">Life Choices Academy C2</button>
        </router-link>
      </div>

      <div class="dash-content">
        <div class="iframe-container">
          <iframe
            src="/green-solar?fullView=false"
            title="Green Solar"
            frameborder="0"
            class="iframe"
          ></iframe>
        </div>
        <router-link to="/green-solar?fullView=true">
          <button class="dash-button">Green Solar</button>
        </router-link>
      </div>

      <div class="dash-content">
        <div class="iframe-container">
          <iframe
            src="/green-solar-youth?fullView=false"
            title="Green Solar Youth"
            frameborder="0"
            class="iframe"
          ></iframe>
        </div>
        <router-link to="/green-solar-youth?fullView=true">
          <button class="dash-button">Green Solar Youth</button>
        </router-link>
      </div>

      <div class="dash-content">
        <div class="iframe-container">
          <iframe
            src="/lc-studio?fullView=false"
            title="Lc Studio"
            frameborder="0"
            class="iframe"
          ></iframe>
        </div>
        <router-link to="/lc-studio?fullView=true">
          <button class="dash-button">LC Studio</button>
        </router-link>
      </div>

      <div class="dash-content">
        <div class="iframe-container">
          <iframe
            src="/youth-force?fullView=false"
            title="Youth Force"
            frameborder="0"
            class="iframe"
          ></iframe>
        </div>
        <router-link to="/youth-force?fullView=true">
          <button class="dash-button">Youth Force</button>
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
import { useCookies } from 'vue3-cookies'; // Correctly import cookies
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2'; // Import SweetAlert

export default {
  name: "DashboardComp",
  components: {
    PanicMode
  },
  setup() {
    const { cookies } = useCookies(); // Initialize cookies
    const router = useRouter(); // Initialize router

    // Logout function with SweetAlert confirmation
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
          cookies.remove('LegitUser'); // Remove the 'LegitUser' cookie
          router.push({ name: 'login' }); // Redirect to the login page
          setTimeout(() => {
            location.reload(); // Refresh the page after redirecting
          }, 1000); // Adjust the timeout as needed

          Swal.fire({
            title: 'Logged Out',
            text: 'You have been successfully logged out.',
            icon: 'success',
            confirmButtonColor: '#5A682C'
          });
        }
      });
    };

    return { logOut };
  }
};
</script>

<style>
.dashboard-comp {
  display: block;
}

.button-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
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

.dash-content {
  display: flex;
  justify-content: center;
  width: 28%;
  flex-direction: column;
  margin: auto;
}

.dash-content-container {
  display: flex;
  flex-wrap: wrap;
  width: 95%;
  justify-content: space-between;
  margin: auto;
  margin-top: 6rem;
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
  margin-bottom: 8rem;
}

.dash-button:hover {
  background-color: var(--awesome);
}

.panic-mode-section {
  text-transform: uppercase;
  padding-top: 2rem;
  color: var(--primary);
  margin: auto;
  display: none;
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

@media (max-width: 555px) {
  .panic-mode-section {
    text-transform: uppercase;
    padding-top: 2rem;
    color: var(--primary);
    margin: auto;
    display: block;
  }

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

/* Media query 556px to 999px */
@media (min-width: 556px) and (max-width: 999px) {
  .panic-mode-section {
    text-transform: uppercase;
    padding-top: 2rem;
    color: var(--primary);
    margin: auto;
    display: block;
  }

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

/* Media query for devices larger than 999px */
@media (min-width: 1700px) {
  .dash-content-container {
    display: flex;
    flex-wrap: wrap;
    width: 91%;
    justify-content: space-between;
    margin: auto;
    margin-top: 4rem;
    margin-bottom: 2rem;
  }
}
</style>
