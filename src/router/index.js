import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
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
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router