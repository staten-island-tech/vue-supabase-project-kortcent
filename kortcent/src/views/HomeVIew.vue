<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
const router = useRouter()

const isLoggedIn = computed(() => auth.isLoggedIn)

function goToLogin() {
  router.push({ name: 'login' })
}

function goToRegister() {
  router.push({ name: 'register' })
}

function goToProfile() {
  router.push({ name: 'profile' })
}
</script>

<template>
  <div class="home">
    <div class="hero">
      <h1>Uma Trainer</h1>
      <p class="tagline">Train, collect, and build your dream party of Umamusume.</p>

      <div v-if="!isLoggedIn" class="actions">
        <button class="primary-btn" @click="goToLogin">Log In</button>
        <button class="secondary-btn" @click="goToRegister">Register</button>
      </div>

      <div v-else class="actions">
        <button class="primary-btn" @click="goToProfile">Go to Profile</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.hero {
  text-align: center;
  background: #2b2540;
  color: #f5f2ff;
  padding: 3rem 4rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.hero h1 {
  margin: 0 0 0.5rem;
  font-size: 2.5rem;
}

.tagline {
  margin: 0 0 2rem;
  opacity: 0.85;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.primary-btn,
.secondary-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.1s ease, opacity 0.15s ease;
}

.primary-btn {
  background: #6c5ce7;
  color: white;
}

.secondary-btn {
  background: transparent;
  color: #f5f2ff;
  border: 2px solid #6c5ce7;
}

.primary-btn:hover,
.secondary-btn:hover {
  opacity: 0.85;
}

.primary-btn:active,
.secondary-btn:active {
  transform: scale(0.97);
}
</style>