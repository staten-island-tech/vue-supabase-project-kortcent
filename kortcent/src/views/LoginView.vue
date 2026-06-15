<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const submitting = ref(false)

async function handleSubmit() {
  submitting.value = true
  const success = await auth.login(username.value, password.value)
  submitting.value = false

  if (success) {
    router.push({ name: 'profile' })
  }
}
</script>

<template>
  <div class="auth-page">
    <form class="auth-card" @submit.prevent="handleSubmit">
      <h1>Log In</h1>

      <label class="field">
        <span>Username</span>
        <input v-model="username" type="text" autocomplete="username" required />
      </label>

      <label class="field">
        <span>Password</span>
        <input v-model="password" type="password" autocomplete="current-password" required />
      </label>

      <p v-if="auth.error" class="error">{{ auth.error }}</p>

      <button class="primary-btn" type="submit" :disabled="submitting">
        {{ submitting ? 'Logging in...' : 'Log In' }}
      </button>

      <p class="switch-link">
        Don't have an account?
        <RouterLink to="/register">Register</RouterLink>
      </p>

      <RouterLink to="/" class="back-link">&larr; Back to Home</RouterLink>
    </form>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.auth-card {
  background: #2b2540;
  color: #f5f2ff;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-card h1 {
  margin: 0 0 0.5rem;
  text-align: center;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.9rem;
}

.field input {
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #4b4470;
  background: #1e1a30;
  color: #f5f2ff;
  font-size: 1rem;
}

.field input:focus {
  outline: 2px solid #6c5ce7;
}

.primary-btn {
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: #6c5ce7;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.primary-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.error {
  color: #ff7675;
  font-size: 0.85rem;
  text-align: center;
  margin: 0;
}

.switch-link {
  text-align: center;
  font-size: 0.85rem;
  margin: 0;
}

.switch-link a {
  color: #a29bfe;
  font-weight: 600;
}

.back-link {
  display: block;
  text-align: center;
  color: #a29bfe;
  font-size: 0.85rem;
  text-decoration: none;
  margin-top: 0.5rem;
}

.back-link:hover {
  text-decoration: underline;
}
</style>