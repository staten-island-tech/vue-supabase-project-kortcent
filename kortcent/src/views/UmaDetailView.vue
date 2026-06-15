<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUmaStore } from '@/stores/umaStore'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
})

const umaStore = useUmaStore()
const router = useRouter()

onMounted(async () => {
  await umaStore.fetchAllUmas()
  await umaStore.fetchUnlockedUmas()
})

const uma = computed(() => umaStore.getUmaById(props.id))
const isUnlocked = computed(() => uma.value && umaStore.unlockedIds.includes(uma.value.id))

function goBack() {
  router.back()
}
</script>

<template>
  <div class="detail-page">
    <button class="back-btn" @click="goBack">&larr; Back</button>

    <div v-if="!uma" class="loading">Loading...</div>

    <div v-else class="detail-card">
      <img :src="uma.image_url" :alt="uma.name" class="portrait" />

      <div class="info">
        <h1>{{ uma.name }}</h1>

        <div class="stars">
          <span v-for="n in 3" :key="n" class="star" :class="{ filled: n <= uma.rarity }">★</span>
        </div>

        <p class="style-badge">{{ uma.running_style }}</p>

        <span v-if="!isUnlocked" class="lock-badge">Not yet unlocked</span>

        <p class="description">{{ uma.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-page {
  width: 100%;
  max-width: 700px;
}

.back-btn {
  background: none;
  border: none;
  color: #6c5ce7;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  padding: 0;
}

.back-btn:hover {
  text-decoration: underline;
}

.loading {
  color: #6c5ce7;
  font-weight: 600;
}

.detail-card {
  background: white;
  border: 1px solid #e0dcf5;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.portrait {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  background: #f0eefc;
  flex-shrink: 0;
}

.info h1 {
  margin: 0 0 0.5rem;
  color: #2b2540;
}

.stars {
  margin-bottom: 0.5rem;
}

.star {
  color: #d8d4ea;
  font-size: 1.4rem;
}

.star.filled {
  color: #f1c40f;
}

.style-badge {
  display: inline-block;
  background: #f0eefc;
  color: #6c5ce7;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  margin: 0 0 0.75rem;
}

.lock-badge {
  display: block;
  background: #2b2540;
  color: #f5f2ff;
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  width: fit-content;
  margin-bottom: 0.75rem;
}

.description {
  color: #4a4560;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 600px) {
  .detail-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>