import { defineStore } from 'pinia'
import { supabase } from '@/supabaseClient'
import { useAuthStore } from './authStore'

export const PARTY_CATEGORIES = ['sprint', 'mile', 'medium', 'long', 'dirt']

function emptyParty() {
  return {
    sprint: [null, null, null, null, null],
    mile: [null, null, null, null, null],
    medium: [null, null, null, null, null],
    long: [null, null, null, null, null],
    dirt: [null, null, null, null, null]
  }
}

export const useTrainerStore = defineStore('trainer', {
  state: () => ({
    party: emptyParty(),
    loading: false,
    error: null
  }),

  actions: {
    async fetchParty() {
      const auth = useAuthStore()
      if (!auth.user) return

      this.loading = true
      const { data, error } = await supabase
        .from('party_slots')
        .select('category, slot_number, uma_id')
        .eq('user_id', auth.user.id)

      if (!error && data) {
        this.party = emptyParty()
        for (const row of data) {
          this.party[row.category][row.slot_number - 1] = row.uma_id
        }
      } else if (error) {
        this.error = error.message
      }
      this.loading = false
    },

    // Place (or replace) a uma in a slot. slotIndex is 0-based.
    async setSlot(category, slotIndex, umaId) {
      const auth = useAuthStore()
      if (!auth.user) return

      this.party[category][slotIndex] = umaId

      const { error } = await supabase
        .from('party_slots')
        .upsert(
          {
            user_id: auth.user.id,
            category,
            slot_number: slotIndex + 1,
            uma_id: umaId
          },
          { onConflict: 'user_id,category,slot_number' }
        )

      if (error) this.error = error.message
    },

    async clearSlot(category, slotIndex) {
      const auth = useAuthStore()
      if (!auth.user) return

      this.party[category][slotIndex] = null

      const { error } = await supabase
        .from('party_slots')
        .delete()
        .eq('user_id', auth.user.id)
        .eq('category', category)
        .eq('slot_number', slotIndex + 1)

      if (error) this.error = error.message
    },

    // Is this uma already placed somewhere in the party? Useful to
    // prevent adding the same uma to multiple slots if you want that rule.
    isUmaInParty(umaId) {
      return PARTY_CATEGORIES.some((cat) =>
        this.party[cat].includes(umaId)
      )
    }
  }
})