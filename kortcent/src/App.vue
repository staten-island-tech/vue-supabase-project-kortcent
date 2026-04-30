<script setup>
import { ref, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'

const todos = ref([])

async function getTodos() {
  const { data } = await supabase.from('todos').select()
  todos.value = data
}

onMounted(() => {
  getTodos()
})
</script>

<template>
  <ul>
    <p>hi</p>
    <li v-for="todo in todos" :key="todo.id">{{ todo.name }}</li>
  </ul>
</template>
