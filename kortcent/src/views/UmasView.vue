<script setup>
import { useRouter } from 'vue-router'
import { useUmaStore } from '@/stores/umaStore'
import { onMounted, computed, ref } from 'vue'
import UmaCard from '@/components/UmaCard.vue'

const searchQuery = ref('')
const searchError = ref(null)

const filteredUmas = computed(() => {
  if (!searchQuery.value.trim()) return umaStore.allUmas
  return umaStore.allUmas.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const umaStore = useUmaStore()
const router = useRouter()

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

    <!-- Search -->
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Search umas..."
        aria-label="Search umas"
      />
    </div>

    <div v-if="umaStore.loading" class="loading">Loading umas...</div>

    <div v-else class="grid">
      <!-- Props passed from parent (UmasView) to child (UmaCard) -->
      <UmaCard
        v-for="uma in filteredUmas"
        :key="uma.id"
        :uma="uma"
        :unlocked="isUnlocked(uma.id)"
        @click="openUma"
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

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

.card {
  background: white;
  border: 1px solid #e0dcf5;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  position: relative;
  transition:
    transform 0.1s ease,
    box-shadow 0.15s ease;
  font-family: inherit;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(108, 92, 231, 0.15);
}

.card.locked {
  filter: grayscale(0.8);
  opacity: 0.7;
}

.portrait {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  background: #f0eefc;
  margin-bottom: 0.75rem;
}

.name {
  margin: 0 0 0.4rem;
  font-size: 1rem;
  color: #2b2540;
}

.stars {
  margin-bottom: 0.4rem;
}

.star {
  color: #d8d4ea;
  font-size: 1.1rem;
}

.star.filled {
  color: #f1c40f;
}

.style {
  margin: 0;
  font-size: 0.85rem;
  color: #6c5ce7;
  font-weight: 600;
}

.lock-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #2b2540;
  color: #f5f2ff;
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
}
</style>
