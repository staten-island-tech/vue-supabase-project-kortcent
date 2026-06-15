<script setup>
import { onMounted, ref, computed } from 'vue'
import { useUmaStore } from '@/stores/umaStore'
import { useTrainerStore } from '@/stores/trainerStore'
import TrainerCard from '@/components/TrainerCard.vue'

const umaStore = useUmaStore()
const trainerStore = useTrainerStore()

const CATEGORIES = [
  { key: 'sprint', label: 'Sprint' },
  { key: 'dirt', label: 'Dirt' },
  { key: 'mile', label: 'Mile' },
  { key: 'medium', label: 'Medium' },
  { key: 'long', label: 'Long' },
]

onMounted(async () => {
  await umaStore.fetchAllUmas()
  await umaStore.fetchUnlockedUmas()
  await trainerStore.fetchParty()
})

const pickerOpen = ref(false)
const activeCategory = ref(null)
const activeSlotIndex = ref(null)

function openPicker(categoryKey, slotIndex) {
  activeCategory.value = categoryKey
  activeSlotIndex.value = slotIndex
  pickerOpen.value = true
}

function closePicker() {
  pickerOpen.value = false
  activeCategory.value = null
  activeSlotIndex.value = null
}

const pickerOptions = computed(() => {
  if (!activeCategory.value) return []
  const usedInCategory = trainerStore.party[activeCategory.value] || []
  return umaStore.unlockedUmas.filter((uma) => !usedInCategory.includes(uma.id))
})

async function selectUma(umaId) {
  await trainerStore.setSlot(activeCategory.value, activeSlotIndex.value, umaId)
  closePicker()
}

async function clearSlot(categoryKey, slotIndex) {
  await trainerStore.clearSlot(categoryKey, slotIndex)
}

function getUma(id) {
  return umaStore.getUmaById(id)
}
</script>

<template>
  <div class="party-page">
    <h1>Party</h1>
    <p class="subtitle">Build a squad of up to 5 umas for each race distance.</p>

    <div v-if="umaStore.unlockedUmas.length === 0" class="empty">
      You don't have any unlocked umas yet. Visit the Gacha to recruit some!
    </div>

    <div v-else class="categories">
      <section v-for="category in CATEGORIES" :key="category.key" class="category">
        <h2>{{ category.label }}</h2>

        <div class="slots">
          <button
            v-for="(umaId, slotIndex) in trainerStore.party[category.key] || []"
            :key="slotIndex"
            class="slot"
            :class="{ filled: umaId }"
            @click="
              umaId ? clearSlot(category.key, slotIndex) : openPicker(category.key, slotIndex)
            "
          >
            <template v-if="umaId && getUma(umaId)">
              <TrainerCard :uma="getUma(umaId)" @remove="clearSlot(category.key, slotIndex)" />
            </template>
            <template v-else>
              <span class="plus">+</span>
              <span class="add-hint">Add Uma</span>
            </template>
          </button>
        </div>
      </section>
    </div>

    <!-- Picker modal -->
    <div v-if="pickerOpen" class="modal-overlay" @click.self="closePicker">
      <div class="modal" role="dialog" aria-modal="true" aria-label="Choose an Uma">
        <header class="modal-header">
          <h3>Choose an Uma</h3>
          <button class="close-btn" @click="closePicker" aria-label="Close">&times;</button>
        </header>

        <div v-if="pickerOptions.length === 0" class="empty">
          No available umas — all your unlocked umas are already in this category.
        </div>

        <div v-else class="modal-grid">
          <button
            v-for="uma in pickerOptions"
            :key="uma.id"
            class="modal-option"
            @click="selectUma(uma.id)"
          >
            <img :src="uma.image_url" :alt="uma.name" class="portrait" />
            <span class="uma-name">{{ uma.name }}</span>
            <div class="stars">
              <span v-for="n in 3" :key="n" class="star" :class="{ filled: n <= uma.rarity }"
                >★</span
              >
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.party-page {
  max-width: 1000px;
}

.party-page h1 {
  margin: 0;
  color: #2b2540;
}

.subtitle {
  color: #6c5ce7;
  margin: 0.25rem 0 1.5rem;
}

.empty {
  color: #8a85a6;
  font-style: italic;
}

.categories {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.category h2 {
  margin: 0 0 0.75rem;
  color: #2b2540;
  font-size: 1.1rem;
}

.slots {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
}

.slot {
  background: white;
  border: 2px dashed #d8d4ea;
  border-radius: 12px;
  min-height: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  cursor: pointer;
  font-family: inherit;
  padding: 0.75rem;
  text-align: center;
  transition:
    border-color 0.15s ease,
    transform 0.1s ease;
}

.slot:hover {
  border-color: #6c5ce7;
  transform: translateY(-2px);
}

.slot.filled {
  border-style: solid;
  border-color: #e0dcf5;
}

.plus {
  font-size: 1.8rem;
  color: #c9c4e8;
  line-height: 1;
}

.add-hint {
  font-size: 0.75rem;
  color: #b3aed4;
}

.portrait {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  background: #f0eefc;
}

.uma-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2b2540;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(43, 37, 64, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-header h3 {
  margin: 0;
  color: #2b2540;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #8a85a6;
  line-height: 1;
}

.modal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

.modal-option {
  background: #f8f7fd;
  border: 1px solid #e0dcf5;
  border-radius: 12px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s ease;
}

.modal-option:hover {
  background: #ece9fb;
}

.stars {
  font-size: 0.85rem;
}
.star {
  color: #d8d4ea;
}
.star.filled {
  color: #f1c40f;
}

@media (max-width: 700px) {
  .slots {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  }
}
</style>
