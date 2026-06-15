<script setup>
import { computed } from 'vue'
import { RouterView, RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
const router = useRouter()

const isLoggedIn = computed(() => auth.isLoggedIn)

async function handleLogout() {
  await auth.logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="app-shell" :class="{ 'with-sidebar': isLoggedIn }">
    <aside v-if="isLoggedIn" class="sidebar">
      <div class="sidebar-header">
        <h2>Uma Trainer</h2>
        <p class="welcome">Welcome, {{ auth.username }}</p>
      </div>

      <nav class="sidebar-nav">
        <RouterLink to="/profile" class="nav-link">Profile</RouterLink>
        <RouterLink to="/umas" class="nav-link">Umas</RouterLink>
        <RouterLink to="/party" class="nav-link">Party</RouterLink>
        <RouterLink to="/gacha" class="nav-link">Gacha</RouterLink>
      </nav>

      <button class="logout-btn" @click="handleLogout">Log Out</button>
    </aside>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
}

.app-shell.with-sidebar {
  display: grid;
  grid-template-columns: 220px 1fr;
}

.sidebar {
  background: #2b2540;
  color: #f5f2ff;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  gap: 1.5rem;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.welcome {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  opacity: 0.8;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.nav-link {
  display: block;
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  color: inherit;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.15s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.08);
}

.nav-link.router-link-active {
  background: #6c5ce7;
}

.logout-btn {
  margin-top: auto;
  padding: 0.6rem 0.9rem;
  border: none;
  border-radius: 8px;
  background: #e74c3c;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.logout-btn:hover {
  background: #c0392b;
}

.content {
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
}

.app-shell:not(.with-sidebar) .content {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>