import { createStore } from 'vuex';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { applyToken } from '../service/AuthenticatedUser.js';
import { useCookies } from 'vue3-cookies';
import router from '@/router';
const { cookies } = useCookies();
const apiUrl = "https://a-t-app-backend.onrender.com/";
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
        const { result } = await axios.get(`${apiUrl}users/account`, {
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
        const response = await axios.post(`${apiUrl}admin/login`, loginObj);
        const { msg, result, token } = response.data || {};
        if (result) {
          toast.success(`${msg}:kissing_heart:`, {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
          context.commit("setUser", result);
          cookies.set("LegitUser", { token, msg, result });
          applyToken(token);
          
          console.log("here");
          
          router.push({ name: "home" }); // Ensure redirection to dashboard
        } else {
          toast.error(`${msg}`, {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } catch (e) {
        console.error('Login error:', e);
        toast.error(`Error during login: ${e.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
    async fetchUsers(context) {
      try {
        const { results, msg } = await axios.get(`${apiUrl}users`).data;
        if (results) {
          context.commit("setUsers", results);
        } else {
          toast.error(`${msg}`, {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } catch (e) {
        toast.error(`${e.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
    async fetchUser(context, id) {
      try {
        const { result, msg } = await axios.get(`${apiUrl}users/${id}`).data;
        if (result) {
          context.commit("setUser", result);
        } else {
          toast.error(`${msg}`, {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } catch (e) {
        toast.error(`${e.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
    async updateUser(context, payload) {
      try {
        const { msg, err } = await axios.patch(`${apiUrl}users/${payload.user_id}`, payload).data;
        if (msg) {
          context.dispatch("fetchUsers");
          toast.success(`${msg}`, {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
          cookies.set("LegitUser", {
            token: savedUser.token,
            result: payload,
          });
          setTimeout(() => {
            location.reload();
          }, 3000);
        } else {
          toast.error(`${err}`, {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } catch (e) {
        toast.error(`${e.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
    async deleteUser(context, id) {
      try {
        const { msg, err } = await axios.delete(`${apiUrl}users/${id}`).data;
        if (msg) {
          context.dispatch("fetchUsers");
          toast.success(`${msg}`, {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else {
          toast.error(`${err}`, {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } catch (e) {
        toast.error(`${e.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
    async fetchLogs(context) {
      try {
        const { results } = await axios.get(`${apiUrl}logs`).data;
        if (results) {
          context.commit('setLogs', results);
        } else {
          router.push({ name: 'login' });
        }
      } catch (err) {
        toast.error(`${err}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
    async fetchLogStatus(context) {
      try {
        const res = await axios.get(`${apiUrl}logs/status`);
        const { results, msg } = res.data;
        if (results) {
          context.commit('setLogStatus', results);
        } else {
          toast.error(`${msg}`, {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } catch (e) {
        toast.error(`${e.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
  },
});
export default store;