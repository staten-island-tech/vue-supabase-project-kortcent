import { useAuthStore } from '@/stores/authStore'

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
