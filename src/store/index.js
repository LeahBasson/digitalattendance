import { createStore } from 'vuex';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { applyToken } from '../service/AuthenticatedUser.js';
import { useCookies } from 'vue3-cookies';
import router from '@/router';


const { cookies } = useCookies();
const apiUrl = "https://attendance-tagging-system.lcstudio.co.za/";

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

const savedUser = cookies.get('LegitUser');
if (savedUser && savedUser?.token) {
  applyToken(savedUser.token);
}

const store = createStore({
  state() {
    return {
      users: undefined,
      user: savedUser ? savedUser.result : null,
      redirectIntent: null,
      logs: null,
      logStatus: [],
    };
  },
  mutations: {
    setUsers(state, value) {
      state.users = value;
    },
    setUser(state, payload) {
      state.user = payload;
    },
    setRedirectIntent(state, value) {
      state.redirectIntent = value;
    },
    setLogs(state, value) {
      state.logs = value;
    },
    setLogStatus(state, value) {
      state.logStatus = value;
    }
  },
  actions: {
    async fetchCurrentUser({ commit }) {
      try {
        const token = cookies.get("LegitUser")?.token;
        if (!token) return;
        const { result } = await axios.get(`${apiUrl}user.php?endpoint=users`, {
          headers: { Authorization: `Bearer ${token}` },
        }).data;
        if (result) {
          commit("setUser", result);
        } else {
          cookies.remove("LegitUser");
        }
      } catch (error) {
        toast.error(`Error fetching user: ${error.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
    async loginUser(context, loginObj) {
      try {
        console.log(loginObj);
        const apiUrl = 'https://attendance-tagging-system.lcstudio.co.za/user.php'

        const res = await axios.post(apiUrl, null, {
          params: {
            endpoint: "login",
            payLoad: JSON.stringify({
              password: loginObj.user_pass,
              email: loginObj.email_add
            })
          }})

        console.log('here');
        console.log( res, router);
        
        

        if (res.data) {
          const { message, result } = res.data;
          if (result) {
            toast.success(`${message}`, {
              autoClose: 2000,
              position: toast.POSITION.BOTTOM_CENTER,
            });
            context.commit("setUser", result);
            cookies.set("LegitUser", { token: "sajfhkjfahfkhkhkoq3979148jhoqeryr39yrqourqhkajfufy9qr", result });
            // applyToken(token);
            setTimeout(() => {
              router.push({ name: "home" });
            }, 2000);
          } else {
            toast.error(`Invalid credentials`, {
              autoClose: 2000,
              position: toast.POSITION.BOTTOM_CENTER,
            });
          }
        }
      } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Error during login';
        
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          errorMessage = error.response.data?.msg || `Server error: ${error.response.status}`;
        } else if (error.request) {
          // The request was made but no response was received
          errorMessage = 'No response from server. Please check your internet connection.';
        } else {
          // Something happened in setting up the request that triggered an Error
          errorMessage = error.message;
        }
        
        toast.error(errorMessage, {
          autoClose: 3000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
    async fetchUsers(context) {
      try {
        const response = await axios.get(`${apiUrl}user.php?endpoint=users`);
        if (response.data) {
          context.commit("setUsers", response.data);
        } else {
          toast.error('Failed to fetch users', {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error(`Error fetching users: ${error.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
    async fetchUser(context, id) {
      try {
        const response = await axios.get(`${apiUrl}user.php?endpoint=users&id=${id}`);
        if (response.data) {
          return response.data;
        }
        return null;
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error(`Error fetching user: ${error.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
        return null;
      }
    },
    async updateUser(context, { id, payload }) {
      try {
        const response = await axios.patch(`${apiUrl}user.php?endpoint=users&id=${id}`, payload);
        if (response.data) {
          toast.success('User updated successfully', {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
          context.dispatch('fetchUsers');
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error updating user:', error);
        toast.error(`Error updating user: ${error.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
        return false;
      }
    },
    async deleteUser(context, id) {
      try {
        const response = await axios.delete(`${apiUrl}user.php?endpoint=users&id=${id}`);
        if (response.data) {
          context.dispatch('fetchUsers');
          toast.success('User deleted successfully', {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else {
          toast.error('Failed to delete user', {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error(`Error deleting user: ${error.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
    async fetchLogs(context) {
      try {
        const response = await axios.get(`${apiUrl}logs.php?endpoint=logs`);
        if (response.data) {
          context.commit("setLogs", response.data);
        } else {
          toast.error('Failed to fetch logs', {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
        toast.error(`Error fetching logs: ${error.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
    async fetchLogStatus(context) {
      try {
        const response = await axios.get(`${apiUrl}logs.php?endpoint=status`);
        console.log("Fetched log status:", response.data);
        
        if (response.data && response.data.result) {
          // Use the result array from the response
          const logStatusArray = Array.isArray(response.data.result) ? response.data.result : [response.data.result];
          context.commit("setLogStatus", logStatusArray);
        } else {
          toast.error('Failed to fetch log status', {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } catch (error) {
        console.log('Error fetching log status:', error);
        toast.warning(`Error fetching log status: ${error.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
    async addLog(context, id) {
      try {
        const response = await axios.post(`${apiUrl}log.php?endpoint=addLog&id=${id}`);
        if (response.data) {
          toast.success('Log added successfully', {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
          context.dispatch('fetchLogStatus');
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error adding log:', error);
        toast.error(`Error adding log: ${error.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
        return false;
      }
    }
  },
});
export default store;