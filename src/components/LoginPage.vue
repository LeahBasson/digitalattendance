<template>
  <div class="login-container">
    <div class="login-form-container">
      <form id="loginForm" @submit.prevent="handleSubmit" novalidate autocomplete="off">
        <h3>LOGIN</h3>
        <div class="form-group">
          <input
            type="email"
            id="uEmail"
            name="uEmail"
            class="form-control"
            placeholder="Enter your email"
            v-model="loginObj.email_add"
          />
        </div>
        <div class="form-group">
          <input
            type="password"
            id="uPass"
            name="uPass"
            class="form-control"
            placeholder="Enter your password"
            v-model="loginObj.user_pass"
          />
        </div>
        <div class="form-group">
          <input type="submit" value="Login Now" class="btn" @click.prevent="loginUser" />
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import Swal from 'sweetalert2';
import { mapActions } from "vuex";
export default {
  name: "LoginPage",
  data() {
    return {
      loginObj: { email_add: "", user_pass: "" },
      errors: [],
    };
  },
  methods: {
  ...mapActions(["loginUser"]), // map the loginUser action from Vuex
  scrollToTop() {
    window.scrollTo(0, 0);
  },
  async loginUser() {
    // Validate the email and password fields
    if (!this.loginObj.email_add || !this.loginObj.user_pass) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        confirmButtonColor: '#5A682C',
        text: 'Both email and password are required!',
      });
      return;
    }

    // Proceed with the login if both fields are filled
    await this.$store.dispatch('loginUser', this.loginObj)
    // if (this.$store.state.user) {
    //   this.$router.push('/home'); // Redirect to dashboard upon successful login
    // }
  },

  async handleSubmit() {
    this.errors = [];
    if (!this.loginObj.email_add) {
      this.errors.push("Email is required");
    } else {
      const emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
      if (!emailPattern.test(this.loginObj.email_add)) {
        this.errors.push("Email must be valid");
      }
    }
    if (!this.loginObj.user_pass) {
      this.errors.push("Password is required");
    }
    if (!this.errors.length) {
      try {
        await this.loginUser(this.loginObj);
      } catch (error) {
        this.errors.push("Incorrect email or password!");
      }
    }
  },
}

};
</script>
<style scoped>
.login-container {
  padding: 2rem 9%;
}
.login-container .login-form-container {
  background-color: #fff;
  height: 90vh;
}
.login-container .login-form-container form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 40rem;
  width: 100%;
  box-shadow: 1rem 1rem 1rem #666;
  border: 0.1rem solid rgba(0, 0, 0, 0.2);
  padding: 2rem;
  border-radius: 0.5rem;
  animation: fadeUp 0.4s linear;
}
.login-container .login-form-container form h3 {
  padding-bottom: 1rem;
  font-size: 2rem;
  font-weight: bolder;
  text-transform: uppercase;
  color: var(--alternative);
  margin: 0;
  text-shadow: 4.5px 2px 2px var(--logColor);
}
.login-container .login-form-container form .form-control {
  margin: 0.7rem 0;
  border-radius: 0.5rem;
  background: #F7F7F7;
  padding: 2rem 1.2rem;
  font-size: 1.6rem;
  color: #130F40;
  text-transform: none;
  width: 100%;
  border: none;
}
.login-container .login-form-container form .btn {
  margin-bottom: 1rem;
  font-weight: 400;
  margin-top: 1rem;
  width: 94%;
  border: 1px solid rgba(0, 0, 0, 0.2)
}
.login-container .login-form-container form .btn:hover {
  background-color: var(--alternative);
  color:#f7f7f7;
  transform: scale(1);
  transition: ease-in-out 0.3s;
}
.login-container .login-form-container form p {
  padding-top: 1rem;
  font-size: 1rem;
  color: #666;
  margin: 0;
}
.login-container .login-form-container form p a {
  color: var(--alternative);
}
.login-container .login-form-container form p a:hover {
  color: var(--awesome);
  text-decoration: underline;
}
.login-container .login-form-container form .error-box {
  background-color: #FFF9FA;
  box-sizing: border-box;
  border: 2px solid rgba(255, 66, 79, 0.2);
  border-radius: 2px;
  font-size: 12px;
  margin-bottom: 20px;
}
.login-container .login-form-container form .error-box ul {
  list-style-type: none;
  margin: 0;
  padding: 10px 0px;
}
.login-container .login-form-container form .error-box ul li {
  padding-left: 10px;
  color: rgb(182, 0, 0);
}

/* Media query for 555px and less */
@media (max-width: 555px) {
  .form-group input::placeholder{
    font-size: 1.2rem;
  }
}
</style>