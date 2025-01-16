import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/LoginPage.vue';
import DashboardComp from '@/components/DashboardComp.vue';
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies()

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/logout',
    name: 'logout',
    component: ()=> import('@/components/LoginPage.vue'),
    beforeEnter() {
      location.reload()
      cookies.remove('LegitUser')
      router.push({name: 'login'})
    }
  },
  {
    path: '/lca-class-one',
    name: 'lca-class-one',
    component: () => import('@/views/LcaClassOne.vue') 
  },
  {
    path: '/lca-class-two',
    name: 'lca-class-two',
    component: () => import('@/views/LcaClassTwo.vue') 
  },
  {
    path: '/green-solar',
    name: 'green-solar',
    component: () => import('@/views/GreenSolar.vue') 
  },
  {
    path: '/green-solar-youth',
    name: 'green-solar-youth',
    component: () => import('@/views/GreenSolarYouth.vue') 
  },
  {
    path: '/lc-studio',
    name: 'lc-studio',
    component: () => import('@/views/LcStudio.vue') 
  },
  {
    path: '/youth-force',
    name: 'youth-force',
    component: () => import('@/views/YouthForce.vue') 
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardComp,
    // meta: {requiresAuth: true},
  }
 
]

// router.beforeEach((to, from, next) => {
//   const user = cookies.get('LegitUser');
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (!user) {
//       next({ name: 'Login' });
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router