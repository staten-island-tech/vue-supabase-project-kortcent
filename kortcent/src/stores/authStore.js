import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null, loading: false, error: null }),
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
  actions: {
    async login(email, password) {
      this.loading = true
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        this.error = error.message
        return
      }
      this.user = data.user
    },
    async logout() {
      await supabase.auth.signOut()
      this.user = null
    },
    async fetchUser() {
      const { data } = await supabase.auth.getUser()
      this.user = data.user ?? null
    },
  },
})
