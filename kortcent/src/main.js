import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/authStore'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Restore an existing Supabase session (if any) before mounting,
// so route guards see the correct auth state on first load.
const authStore = useAuthStore()
authStore.restoreSession().finally(() => {
  app.mount('#app')
})