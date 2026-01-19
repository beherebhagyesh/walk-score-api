<template>
  <div class="metrics-wrapper">
    <div class="metrics-grid">
      <ScoreCard 
        label="Walk Score"
        :score="data?.walkscore"
        :description="data?.description"
        icon-name="heroicons:user"
        type="walk"
        @click="handleCardClick"
      />
      <ScoreCard 
        label="Bike Score"
        :score="data?.bike?.score"
        :description="data?.bike?.description"
        icon-name="heroicons:arrow-path-rounded-square"
        type="bike"
        @click="handleCardClick"
      />
      <ScoreCard 
        label="Transit Score"
        :score="data?.transit?.score"
        :description="data?.transit?.description"
        icon-name="heroicons:truck"
        type="transit"
        :summary="data?.transit?.summary"
        @click="handleCardClick"
      />
    </div>

    <!-- Nearby Connectivity Section -->
    <NearbyTransit 
      :stops="transitStops" 
      :loading="loadingTransit"
    />
    
    <!-- Modal for score details -->
    <ScoreCardModal
      :is-open="modalOpen"
      :label="selectedCard?.label"
      :score="selectedCard?.score"
      :type="selectedCard?.type"
      :icon-name="selectedCard?.iconName"
      :transit-stops="transitStops"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  data: Object,
  location: Object
})

const modalOpen = ref(false)
const selectedCard = ref(null)
const transitStops = ref([])
const loadingTransit = ref(false)

const fetchTransitStops = async () => {
  if (!props.location?.lat || !props.location?.lon) return
  
  loadingTransit.value = true
  try {
    const lat = props.location.lat
    const lon = props.location.lon
    const response = await $fetch(`/api/transit-stops?lat=${lat}&lon=${lon}`)
    transitStops.value = response.stops || []
  } catch (e) {
    console.error('Failed to fetch transit stops:', e)
    transitStops.value = []
  } finally {
    loadingTransit.value = false
  }
}

// Fetch transit stops whenever location changes
watch(() => props.location, fetchTransitStops, { immediate: true, deep: true })

const handleCardClick = (cardData) => {
  selectedCard.value = cardData
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  selectedCard.value = null
}
</script>

<style scoped>
.metrics-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
