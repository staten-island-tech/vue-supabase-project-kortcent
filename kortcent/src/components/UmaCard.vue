<script setup>
defineProps({
  uma: {
    type: Object,
    required: true,
  },
  unlocked: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])
</script>

<template>
  <button class="card" :class="{ locked: !unlocked }" @click="$emit('click', uma.id)">
    <img :src="uma.image_url" :alt="uma.name" class="portrait" />
    <h3 class="name">{{ uma.name }}</h3>

    <div class="stars">
      <span v-for="n in 3" :key="n" class="star" :class="{ filled: n <= uma.rarity }">★</span>
    </div>

    <p class="style">{{ uma.running_style }}</p>
    <span v-if="!unlocked" class="lock-badge">Locked</span>
  </button>
</template>

<style scoped>
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
  width: 100%;
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
