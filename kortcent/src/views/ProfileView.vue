<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useUmaStore } from '@/stores/umaStore'

const auth = useAuthStore()
const umaStore = useUmaStore()
const router = useRouter()

onMounted(async () => {
  await umaStore.fetchAllUmas()
  await umaStore.fetchUnlockedUmas()
})

function openUma(id) {
  router.push({ name: 'uma-detail', params: { id } })
}
</script>

<template>
  <div class="profile-page">
    <header class="profile-header">
      <h1>{{ auth.username }}</h1>
      <p class="summary">
        {{ umaStore.unlockedUmas.length }} / {{ umaStore.allUmas.length }} Umas unlocked
      </p>
    </header>

    <section class="section">
      <h2>Unlocked Umas</h2>

      <div v-if="umaStore.unlockedUmas.length === 0" class="empty">
        You haven't unlocked any umas yet. Try the Gacha!
      </div>

      <div v-else class="grid">
        <button
          v-for="uma in umaStore.unlockedUmas"
          :key="uma.id"
          class="card unlocked"
          @click="openUma(uma.id)"
        >
          <img :src="uma.image_url" :alt="uma.name" class="portrait" />
          <h3 class="name">{{ uma.name }}</h3>
          <div class="stars">
            <span v-for="n in 3" :key="n" class="star" :class="{ filled: n <= uma.rarity }">★</span>
          </div>
        </button>
      </div>
    </section>

    <section class="section">
      <h2>Locked Umas</h2>

      <div v-if="umaStore.lockedUmas.length === 0" class="empty">
        You've unlocked every uma. Nice work!
      </div>

      <div v-else class="locked-grid">
        <div v-for="uma in umaStore.lockedUmas" :key="uma.id" class="locked-pill">
          {{ uma.name }}
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 900px;
}

.profile-header h1 {
  margin: 0;
  color: #2b2540;
}

.summary {
  margin: 0.25rem 0 2rem;
  color: #6c5ce7;
  font-weight: 600;
}

.section {
  margin-bottom: 2rem;
}

.section h2 {
  margin: 0 0 1rem;
  color: #2b2540;
  font-size: 1.2rem;
}

.empty {
  color: #8a85a6;
  font-style: italic;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
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
  transition: transform 0.1s ease, box-shadow 0.15s ease;
  font-family: inherit;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(108, 92, 231, 0.15);
}

.portrait {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  background: #f0eefc;
  margin-bottom: 0.6rem;
}

.name {
  margin: 0 0 0.3rem;
  font-size: 0.95rem;
  color: #2b2540;
}

.stars {
  font-size: 0.95rem;
}

.star {
  color: #d8d4ea;
}

.star.filled {
  color: #f1c40f;
}

.locked-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.locked-pill {
  background: #f0eefc;
  color: #8a85a6;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
}
</style>