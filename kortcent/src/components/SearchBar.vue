<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Search...',
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="search-bar">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="search"
      :placeholder="placeholder"
      aria-label="Search"
      class="search-input"
    />
  </div>
</template>

<style scoped>
.search-bar {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #d8d4ea;
  font-size: 1rem;
  color: #2b2540;
  background: white;
}

.search-input:focus {
  outline: 2px solid #6c5ce7;
}
</style>
