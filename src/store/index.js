import { createStore } from 'vuex'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { applyToken } from '../service/AuthenticatedUser.js'
import { useCookies } from 'vue3-cookies'
import router from '@/router'

const { cookies } = useCookies()
const apiUrl = "https://a-t-app-backend.onrender.com/"
// const apiUrl = "http://localhost:3001/"
// Apply token from cookies if available
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
  },
  actions: {
    async fetchCurrentUser({ commit  }) {
      try {
        const token = cookies.get("LegitUser")?.token;
        if (!token) return;
        const { result } = await (
          await axios.get(`${apiUrl}users/account`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ).data;
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
        const { msg, result, token } = await (
          await axios.post(`${apiUrl}admin/login`, loginObj)
        ).data;
        if (result) {
          toast.success(`${msg}:😘:`, {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
          context.commit("setUser", result);
          cookies.set("LegitUser", { token, msg, result });
          applyToken(token);
          if (
            context.state.redirectIntent === "admin" &&
            result.user_role === "admin"
          ) {
            router.push({ name: "admin" });
          }
          context.commit("setRedirectIntent", null);
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
    
    async fetchUsers(context) {
      try {
        const { results, msg } = await (await axios.get(`${apiUrl}users`)).data;
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
        const { result, msg } = await (await axios.get(`${apiUrl}users/${id}`))
          .data;
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
        const { msg, err } = await (
          await axios.patch(`${apiUrl}users/${payload.user_id}`, payload)
        ).data;
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
        const { msg, err } = await (
          await axios.delete(`${apiUrl}users/${id}`)
        ).data;
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
  },
});
export default store;