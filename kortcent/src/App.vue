<script setup>
import { ref, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'

const todos = ref([])
const transactions = ref([])
const error = ref(null)
const supabase = createClient(URL, KEY)

async function getTodos() {
  const { data } = await supabase.from('todos').select()
  todos.value = data
}

onMounted(async () => {
  getTodos()
  let { data: transactionData, error: err } = await supabase
    .from('transactions')
    .select('*')
  if (err) {
    error.value = err.message
  } else {
    transactions.value = transactionData
  }
})
</script>

<template>
  <ul v-if="todos.length">
    <li v-for="todo in todos" :key="todo.id">
      {{ todo.name }}
    </li>
  </ul>

  <ul v-else>
    <li
      v-for="transaction in transactions"
      :key="transaction.id"
    >
      ID: {{ transaction.id }}
      User: {{ transaction.user_id }}
    </li>
  </ul>
</template>
