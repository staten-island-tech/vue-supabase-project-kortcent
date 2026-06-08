import { useAuthStore } from '@/stores/authStore'
import { createRouter, createWebHistory } from 'vue-router'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/umas', component: UmasView, meta: { requiresAuth: true } },
  { path: '/trainers', component: TrainersView, meta: { requiresAuth: true } },
  { path: '/profile/:id', component: ProfileView, meta: { requiresAuth: true } },
]

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.fetchUser()
  if (to.meta.requiresAuth && !auth.isLoggedIn) return '/login'
})
