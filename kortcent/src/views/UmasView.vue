<script setup>
import { useRouter } from 'vue-router'
import { useUmaStore } from '@/stores/umaStore'
import { onMounted, computed, ref } from 'vue'
import UmaCard from '@/components/UmaCard.vue'
import SearchBar from '@/components/SearchBar.vue'

const umaStore = useUmaStore()
const router = useRouter()

const searchQuery = ref('')
const searchError = ref(null)

const filteredUmas = computed(() => {
  searchError.value = null
  if (!searchQuery.value.trim()) return umaStore.allUmas

  const results = umaStore.allUmas.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )

  if (results.length === 0) searchError.value = 'No umas found.'
  return results
})

onMounted(async () => {
  await umaStore.fetchAllUmas()
  await umaStore.fetchUnlockedUmas()
})

function openUma(id) {
  router.push({ name: 'uma-detail', params: { id } })
}

function isUnlocked(id) {
  return umaStore.unlockedIds.includes(id)
}
</script>

<template>
  <div class="umas-page">
    <h1>Uma Gallery</h1>
    <p class="subtitle">All Umamusume available on the Global server.</p>

    <SearchBar v-model="searchQuery" placeholder="Search umas..." />

    <p v-if="searchError" class="error">{{ searchError }}</p>

    <div v-if="umaStore.loading" class="loading">Loading umas...</div>

    <div v-else class="grid">

      <UmaCard
        v-for="uma in filteredUmas"
        :key="uma.id"
        :uma="uma"
        :unlocked="isUnlocked(uma.id)"
        @click="(id) => openUma(id)"
      />
    </div>
  </div>
</template>

<style scoped>
.umas-page h1 {
  margin: 0;
  color: #2b2540;
}

.subtitle {
  color: #6c5ce7;
  margin: 0.25rem 0 1.5rem;
}

.loading {
  color: #6c5ce7;
  font-weight: 600;
}

.error {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}
</style>
