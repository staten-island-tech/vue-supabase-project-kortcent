<template>
  <main class="gacha-container">
    <h1>Gacha</h1>
    <p class="subtitle">Try your luck to unlock new Umas!</p>

    <section class="pull-buttons" aria-label="Gacha pull options">
      <button @click="doOnePull" :disabled="loading" class="btn btn-single">1 Pull</button>

      <button @click="doTenPull" :disabled="loading" class="btn btn-ten">10 Pull</button>
    </section>

    <p v-if="error" class="error" role="alert">{{ error }}</p>

    <p v-if="loading" class="loading" aria-live="polite">Rolling...</p>

    <section v-if="results.length > 0 && !loading" class="results-grid" aria-label="Gacha results">
      <article
        v-for="(uma, index) in results"
        :key="index"
        class="uma-card"
        :class="`rarity-${uma.rarity}`"
      >
        <img :src="uma.image_url" :alt="uma.name" class="uma-image" />
        <h2 class="uma-name">{{ uma.name }}</h2>

        <p class="stars" :aria-label="`${uma.rarity} stars`">
          {{ '⭐'.repeat(uma.rarity) }}
        </p>

        <p class="running-style">{{ uma.running_style }}</p>

        <span v-if="uma.isNew" class="badge-new">NEW!</span>
        <span v-else class="badge-dupe">Duplicate</span>
      </article>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useUmaStore } from '@/stores/umaStore'
import { useAuthStore } from '@/stores/authStore'

const umaStore = useUmaStore()
const authStore = useAuthStore()

const results = ref([])
const loading = ref(false)
const error = ref(null)

async function doOnePull() {
  error.value = null
  loading.value = true
  results.value = []

  try {
    const uma = await umaStore.pullOne(authStore.user.id)
    if (!uma) throw new Error('No umas found in the database.')
    results.value = [uma]
  } catch (e) {
    error.value = `Pull failed: ${e.message}`
  } finally {
    loading.value = false
  }
}

async function doTenPull() {
  error.value = null
  loading.value = true
  results.value = []

  try {
    const umas = await umaStore.pullTen(authStore.user.id)
    if (!umas.length) throw new Error('No umas returned.')
    results.value = umas
  } catch (e) {
    error.value = `Pull failed: ${e.message}`
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.gacha-container {
  padding: 2rem;
  text-align: center;
}

.pull-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
}

.btn {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.1s;
}
.btn:hover:not(:disabled) {
  transform: scale(1.05);
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-single {
  background: #6c63ff;
  color: white;
}
.btn-ten {
  background: #f5a623;
  color: white;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.uma-card {
  border-radius: 12px;
  padding: 1rem;
  position: relative;
  background: #1e1e2e;
  border: 2px solid #333;
}

.rarity-3 {
  border-color: gold;
  background: #2a2000;
}
.rarity-2 {
  border-color: silver;
  background: #1a1a2a;
}
.rarity-1 {
  border-color: #888;
  background: #1e1e1e;
}

.uma-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
}

.badge-new {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #00c853;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
}
.badge-dupe {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #555;
  color: #ccc;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
}

.error {
  color: #ff5252;
  margin-top: 1rem;
}
.loading {
  color: #aaa;
  font-style: italic;
}
.uma-name {
  color: #f5f2ff;
}
.running-style {
  color: #c9c4e8;
}
.stars {
  color: #f1c40f;
}
</style>
