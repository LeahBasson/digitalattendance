import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'font-awesome/css/font-awesome.css';

createApp(App).use(store).use(router).mount('#app')
