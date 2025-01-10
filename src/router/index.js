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
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router