import { defineStore } from 'pinia'
import { supabase } from '@/supabaseClient'

const EMAIL_DOMAIN = '@umamusume.local'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    username: null,
    loading: false,
    error: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.user
  },

  actions: {
    async register(username, password) {
      this.error = null
      this.loading = true
      try {
        const cleanUsername = username.trim().toLowerCase()

        if (!cleanUsername || !password) {
          this.error = 'Username and password are required.'
          return false
        }

        // Make sure the username isn't already taken
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', cleanUsername)
          .maybeSingle()

        if (existing) {
          this.error = 'That username is already taken.'
          return false
        }

        const fakeEmail = `${cleanUsername}${EMAIL_DOMAIN}`
        const { data, error } = await supabase.auth.signUp({
          email: fakeEmail,
          password
        })

        if (error) {
          this.error = error.message
          return false
        }

        const userId = data.user?.id
        if (!userId) {
          this.error = 'Registration failed. Please try again.'
          return false
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ id: userId, username: cleanUsername })

        if (profileError) {
          this.error = profileError.message
          return false
        }

        return true
      } catch (e) {
        this.error = e.message
        return false
      } finally {
        this.loading = false
      }
    },

    async login(username, password) {
      this.error = null
      this.loading = true
      try {
        const cleanUsername = username.trim().toLowerCase()
        const fakeEmail = `${cleanUsername}${EMAIL_DOMAIN}`

        const { data, error } = await supabase.auth.signInWithPassword({
          email: fakeEmail,
          password
        })

        if (error) {
          this.error = 'Invalid username or password.'
          return false
        }

        this.user = data.user
        this.username = cleanUsername
        return true
      } catch (e) {
        this.error = e.message
        return false
      } finally {
        this.loading = false
      }
    },

    async logout() {
      await supabase.auth.signOut()
      this.user = null
      this.username = null
    },

    // Call this on app startup to restore an existing session
    async restoreSession() {
      const { data } = await supabase.auth.getSession()
      if (data.session?.user) {
        this.user = data.session.user
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', this.user.id)
          .single()
        this.username = profile?.username ?? null
      }
    }
  }
})