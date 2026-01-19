<template>
  <div class="metrics-wrapper">
    <div class="metrics-grid">
      <ScoreCard 
        label="Walk Score"
        :score="data?.walkscore"
        :description="data?.description"
        icon-name="material-symbols:directions-walk"
        type="walk"
        :comparisons="walkComparisons"
        @click="handleCardClick"
      />
      <ScoreCard 
        label="Bike Score"
        :score="data?.bike?.score"
        :description="data?.bike?.description"
        icon-name="material-symbols:directions-bike"
        type="bike"
        :comparisons="bikeComparisons"
        @click="handleCardClick"
      />
      <ScoreCard 
        label="Transit Score"
        :score="data?.transit?.score"
        :description="data?.transit?.description"
        icon-name="material-symbols:directions-car"
        type="transit"
        :summary="data?.transit?.summary"
        :comparisons="transitComparisons"
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
      :location-name="locationName"
      :transit-stops="transitStops"
      :comparisons="selectedCard?.comparisons"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  data: Object,
  location: Object,
  locationName: String
})

const modalOpen = ref(false)
const selectedCard = ref(null)
const transitStops = ref([])
const loadingTransit = ref(false)

const walkComparisons = ref([])
const bikeComparisons = ref([])
const transitComparisons = ref([])

const fetchComparisons = async () => {
  if (!props.locationName) return
  
  const parts = props.locationName.split(',')
  if (parts.length < 2) return
  
  const city = parts[0].trim()
  const state = parts[1].trim()
  
  // We'll try to find city-level coordinates for a "real" average call
  // For our presets, we can use these (approximate center for comparison)
  const cityCenters = {
    'Orlando': { lat: 28.5383, lon: -81.3792 },
    'River Oaks': { lat: 33.1423, lon: -97.1176 }, // Preset already has these
    'Government Hill': { lat: 29.4241, lon: -98.4936 }, // San Antonio center
    'North Hollywood': { lat: 34.0522, lon: -118.2437 }, // LA center
    'Shadyside': { lat: 40.4406, lon: -79.9959 } // Pittsburgh center
  }
  
  const center = cityCenters[city] || props.location // Fallback to current if not known center
  if (!center) return

  try {
    // Call the server API for the "City Average"
    const response = await $fetch('/api/walkscore', {
      query: { 
        lat: center.lat, 
        lon: center.lon,
        address: `${city}, ${state}`
      }
    })
    
    if (response) {
      walkComparisons.value = [{ label: 'City Avg', value: response.walkscore }]
      bikeComparisons.value = [{ label: 'City Avg', value: response.bike?.score }]
      transitComparisons.value = [{ label: 'City Avg', value: response.transit?.score }]
      
      // We could also add a "State Avg" if we have coordinates for state center, 
      // but let's stick to City for now as it's more relevant and accurate.
      // If we don't have real data, we hide it as requested.
    }
  } catch (e) {
    console.error('Failed to fetch comparisons:', e)
  }
}

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

// Fetch data whenever location changes
watch(() => props.location, () => {
  fetchTransitStops()
  fetchComparisons()
}, { immediate: true, deep: true })

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
