<script setup>
defineProps({
  uma: {
    type: Object,
    required: true,
  },
})

defineEmits(['remove'])
</script>

<template>
  <div class="trainer-card">
    <img :src="uma.image_url" :alt="uma.name" class="portrait" />
    <span class="name">{{ uma.name }}</span>

    <div class="stars">
      <span v-for="n in 3" :key="n" class="star" :class="{ filled: n <= uma.rarity }">★</span>
    </div>

    <button class="remove-btn" @click="$emit('remove')" :aria-label="`Remove ${uma.name}`">
      ✕
    </button>
  </div>
</template>

<style scoped>
.trainer-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  text-align: center;
  position: relative;
  width: 100%;
}

.portrait {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  background: #f0eefc;
}

.name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2b2540;
}

.stars {
  font-size: 0.8rem;
}
.star {
  color: #d8d4ea;
}
.star.filled {
  color: #f1c40f;
}

.remove-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.65rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
</style>
