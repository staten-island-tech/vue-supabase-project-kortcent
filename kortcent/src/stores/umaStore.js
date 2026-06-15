import { defineStore } from 'pinia'
import { supabase } from '@/supabaseClient'
import { useAuthStore } from './authStore'

// 3-star umas are intentionally very rare
const RARITY_RATES = {
  3: 0.02, // 2%
  2: 0.18, // 18%
  1: 0.80  // 80%
}

function rollRarity() {
  const roll = Math.random()
  if (roll < RARITY_RATES[3]) return 3
  if (roll < RARITY_RATES[3] + RARITY_RATES[2]) return 2
  return 1
}

export const useUmaStore = defineStore('uma', {
  state: () => ({
    allUmas: [],
    unlockedIds: [],
    loading: false,
    error: null
  }),

  getters: {
    unlockedUmas: (state) =>
      state.allUmas.filter((u) => state.unlockedIds.includes(u.id)),

    lockedUmas: (state) =>
      state.allUmas.filter((u) => !state.unlockedIds.includes(u.id)),

    getUmaById: (state) => (id) =>
      state.allUmas.find((u) => u.id === Number(id))
  },

  actions: {
    async fetchAllUmas() {
      if (this.allUmas.length) return
      this.loading = true
      const { data, error } = await supabase
        .from('umas')
        .select('*')
        .order('rarity', { ascending: false })
        .order('name')

      if (error) {
        this.error = error.message
      } else {
        this.allUmas = data
      }
      this.loading = false
    },

    async fetchUnlockedUmas() {
      const auth = useAuthStore()
      if (!auth.user) return

      const { data, error } = await supabase
        .from('user_umas')
        .select('uma_id')
        .eq('user_id', auth.user.id)

      if (!error) {
        this.unlockedIds = data.map((row) => row.uma_id)
      }
    },

    // Saves an unlock to the DB. Returns true if it was newly unlocked,
    // false if the player already had it (duplicate, not saved again).
    async unlockUma(umaId) {
      const auth = useAuthStore()
      if (!auth.user) return false

      if (this.unlockedIds.includes(umaId)) {
        return false
      }

      const { error } = await supabase
        .from('user_umas')
        .insert({ user_id: auth.user.id, uma_id: umaId })

      if (!error) {
        this.unlockedIds.push(umaId)
        return true
      }
      return false
    },

    rollOnePull() {
      const rarity = rollRarity()
      const pool = this.allUmas.filter((u) => u.rarity === rarity)
      return pool[Math.floor(Math.random() * pool.length)]
    },

    async pullOne() {
      await this.fetchAllUmas()
      const uma = this.rollOnePull()
      const isNew = await this.unlockUma(uma.id)
      return { ...uma, isNew }
    },

    async pullTen() {
      await this.fetchAllUmas()
      const results = []
      for (let i = 0; i < 10; i++) {
        const uma = this.rollOnePull()
        const isNew = await this.unlockUma(uma.id)
        results.push({ ...uma, isNew })
      }
      return results
    }
  }
})