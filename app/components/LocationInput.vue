<template>
  <div class="location-input glass">
    <h3 class="input-title">
      <Icon name="heroicons:map-pin" size="20" />
      Change Location
    </h3>
    
    <div class="input-row">
      <div class="input-group">
        <label for="lat">Latitude</label>
        <input 
          id="lat"
          v-model="latitude" 
          type="number" 
          step="0.0001"
          placeholder="28.3672"
          class="coord-input"
        />
      </div>
      
      <div class="input-group">
        <label for="lon">Longitude</label>
        <input 
          id="lon"
          v-model="longitude" 
          type="number" 
          step="0.0001"
          placeholder="-81.2803"
          class="coord-input"
        />
      </div>
      
      <button @click="updateLocation" class="update-btn" :disabled="loading">
        <Icon v-if="loading" name="heroicons:arrow-path" size="18" class="spin" />
        <Icon v-else name="heroicons:magnifying-glass" size="18" />
        <span>{{ loading ? 'Loading...' : 'Search' }}</span>
      </button>
    </div>
    
    <div class="presets">
      <span class="preset-label">Quick picks:</span>
      <button 
        v-for="preset in presets" 
        :key="preset.name"
        @click="selectPreset(preset)"
        class="preset-btn"
      >
        {{ preset.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['update'])

const latitude = ref('28.3672')
const longitude = ref('-81.2803')
const loading = ref(false)

const presets = [
  { name: 'Lake Nona', lat: 28.3672, lon: -81.2803 },
  { name: 'Downtown Orlando', lat: 28.5383, lon: -81.3792 },
  { name: 'New York City', lat: 40.7128, lon: -74.0060 },
  { name: 'San Francisco', lat: 37.7749, lon: -122.4194 },
  { name: 'Miami', lat: 25.7617, lon: -80.1918 }
]

const updateLocation = async () => {
  if (!latitude.value || !longitude.value) return
  
  loading.value = true
  emit('update', {
    lat: parseFloat(latitude.value),
    lon: parseFloat(longitude.value)
  })
  
  // Reset loading after a delay (parent will handle actual loading)
  setTimeout(() => {
    loading.value = false
  }, 2000)
}

const selectPreset = (preset) => {
  latitude.value = preset.lat.toString()
  longitude.value = preset.lon.toString()
  updateLocation()
}
</script>

<style scoped>
.location-input {
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.input-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.input-title :deep(svg) {
  color: var(--accent-primary);
}

.input-row {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
}

.input-group {
  flex: 1;
  min-width: 120px;
}

.input-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.coord-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.2s ease;
}

.coord-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  background: rgba(0, 242, 255, 0.05);
}

.coord-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.5;
}

.update-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border: none;
  border-radius: 10px;
  color: var(--bg-primary);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.update-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 242, 255, 0.3);
}

.update-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spin {
  animation: spin 1s linear infinite;
}

.presets {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.preset-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.preset-btn {
  padding: 0.4rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: 6px;
  color: var(--text-secondary);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-btn:hover {
  background: rgba(0, 242, 255, 0.1);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .input-row {
    flex-direction: column;
  }
  
  .input-group {
    width: 100%;
  }
  
  .update-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
