import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'
import UmasView from '@/views/UmasView.vue'
import UmaDetailView from '@/views/UmaDetailView.vue'
import TrainersView from '@/views/TrainersView.vue'
import GachaView from '@/views/GachaView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: '/umas',
    name: 'umas',
    component: UmasView,
    meta: { requiresAuth: true },
  },
  {
    path: '/umas/:id',
    name: 'uma-detail',
    component: UmaDetailView,
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: '/party',
    name: 'party',
    component: TrainersView,
    meta: { requiresAuth: true },
  },
  {
    path: '/gacha',
    name: 'gacha',
    component: GachaView,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // Make sure session is restored before checking
  if (!auth.user) {
    await auth.restoreSession()
  }

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next({ name: 'home' })
  } else if ((to.name === 'login' || to.name === 'register') && auth.isLoggedIn) {
    next({ name: 'profile' })
  } else {
    next()
  }
})

export default router
