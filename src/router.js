import { createRouter, createWebHistory } from 'vue-router'
import MainView from './views/MainView.vue'
import { useAuth } from './composables/useAuth'

const routes = [
  { path: '/', component: MainView, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth()
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next() 
  } else {
    next()
  }
})

export default router