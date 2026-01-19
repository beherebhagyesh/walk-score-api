<template>
  <main class="app-container">
    <div class="container">
      <header class="hero-section animate-slide-in">
        <div class="header-badge glass">
          <span class="dot animate-pulse"></span>
          <span>{{ locationName }}</span>
        </div>
        <h1 class="title">Getting Around in <br/><span class="gradient-text">{{ data?.snapped_lat ? 'Selected Location' : 'Lake Nona South' }}</span></h1>
        <p class="subtitle">Real-time walkability, bike, and transit metrics for your selected neighborhood.</p>
      </header>

      <!-- Location Input -->
      <LocationInput @update="handleLocationUpdate" />

      <div v-if="pending" class="loading-state">
        <div class="spinner"></div>
        <p class="loading-text">Fetching neighborhood metrics...</p>
        <p class="loading-subtext">Connecting to Walk Score API</p>
      </div>

      <div v-else-if="error" class="error-state glass">
        <div class="error-icon-wrapper">
          <Icon name="heroicons:exclamation-triangle" size="56" class="error-icon" />
        </div>
        <h3>Unable to load data</h3>
        <p class="error-message">{{ error.message || 'There was a problem connecting to the Walk Score API.' }}</p>
        <button @click="refresh" class="retry-btn glass">
          <Icon name="heroicons:arrow-path" size="18" />
          Try Again
        </button>
      </div>

      <div v-else class="content-section">
        <div class="current-location glass" v-if="currentLocation">
          <Icon name="heroicons:map-pin" size="18" />
          <span>Coordinates: {{ currentLocation.lat.toFixed(4) }}°N, {{ Math.abs(currentLocation.lon).toFixed(4) }}°W</span>
        </div>
        
        <MetricsGrid 
          :data="data" 
          :location="currentLocation" 
          :location-name="locationName"
        />
        
        <div class="info-cards">
          <div class="info-card glass">
            <div class="info-icon">
              <Icon name="heroicons:light-bulb" size="24" />
            </div>
            <div class="info-content">
              <h4>What is Walk Score?</h4>
              <p>Walk Score measures the walkability of any address based on the distance to nearby amenities. Scores range from 0-100.</p>
            </div>
          </div>
          
          <div class="info-card glass">
            <div class="info-icon">
              <Icon name="heroicons:cursor-arrow-rays" size="24" />
            </div>
            <div class="info-content">
              <h4>Click for Details</h4>
              <p>Click on any score card to see city comparisons, nearby transit stops, and detailed descriptions.</p>
            </div>
          </div>
        </div>
        
        <footer class="data-footer glass">
          <div class="footer-left">
            <div class="footer-item">
              <Icon name="heroicons:clock" size="16" />
              <span>Updated: {{ formatDate(data?.updated) }}</span>
            </div>
          </div>
          <div class="footer-center">
            <a :href="data?.ws_link" target="_blank" class="ws-link">
              <span>View Full Report</span>
              <Icon name="heroicons:arrow-top-right-on-square" size="14" />
            </a>
          </div>
          <div class="footer-right">
            <a :href="data?.help_link" target="_blank" class="help-link">
              <Icon name="heroicons:question-mark-circle" size="16" />
              <span>How it works</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
    
    <!-- Background Decoration -->
    <div class="bg-glow blob-1 animate-float"></div>
    <div class="bg-glow blob-2 animate-float" style="animation-delay: -3s;"></div>
    <div class="grid-overlay"></div>
  </main>
</template>

<script setup>
const currentLocation = ref({ lat: 28.3722, lon: -81.2737 })

const { data, pending, error, refresh } = await useFetch('/api/walkscore', {
  query: computed(() => ({
    lat: currentLocation.value.lat,
    lon: currentLocation.value.lon
  })),
  watch: [currentLocation]
})

const locationName = computed(() => {
  if (!data.value) return 'Selected Location';
  const lat = data.value.snapped_lat || currentLocation.value.lat;
  const lon = data.value.snapped_lon || currentLocation.value.lon;
  
  // Precise matching for our presets
  if (lat === 28.3722 && lon === -81.2737) return 'Lake Nona South, FL';
  if (lat === 33.1423 && lon === -97.1176) return 'River Oaks, TX';
  if (lat === 29.4401 && lon === -98.4611) return 'Government Hill, TX';
  if (lat === 34.1896 && lon === -118.3904) return 'North Hollywood, CA';
  if (lat === 40.4535 && lon === -79.9323) return 'Shadyside, PA';
  
  // Heuristics for other areas
  if (lat > 40 && lon < -73) return 'New York Area';
  if (lat > 37 && lat < 38 && lon < -122) return 'San Francisco Area';
  if (lat > 25 && lat < 26 && lon < -80) return 'Miami Area';
  return 'Custom Location';
})

const handleLocationUpdate = async (location) => {
  currentLocation.value = location
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  } catch {
    return dateStr;
  }
}
</script>

<style scoped>
.app-container {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.hero-section {
  text-align: center;
  margin-bottom: 2rem;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1.5rem;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.header-badge span {
  color: var(--accent-primary);
}

.dot {
  width: 8px;
  height: 8px;
  background: var(--success);
  border-radius: 50%;
  box-shadow: 0 0 12px var(--success);
}

.title {
  font-size: clamp(2.25rem, 6vw, 4rem);
  line-height: 1.1;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  max-width: 550px;
  margin: 0 auto;
  line-height: 1.7;
}

.current-location {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.current-location :deep(svg) {
  color: var(--accent-primary);
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 300px;
  text-align: center;
}

.loading-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.loading-subtext {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(0, 242, 255, 0.1);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-state {
  padding: 3rem 2rem;
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
}

.error-icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: rgba(248, 81, 73, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-icon {
  color: var(--danger);
}

.error-message {
  color: var(--text-secondary);
  margin-top: 0.75rem;
  line-height: 1.6;
}

.retry-btn {
  margin-top: 1.5rem;
  padding: 0.75rem 2rem;
  color: var(--text-primary);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.info-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  align-items: flex-start;
}

.info-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 242, 255, 0.1);
  border-radius: 10px;
  color: var(--accent-primary);
}

.info-content h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: var(--text-primary);
}

.info-content p {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.data-footer {
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-left, .footer-right {
  flex: 1;
}

.footer-right {
  text-align: right;
}

.footer-center {
  flex: 2;
  text-align: center;
}

.footer-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.footer-item :deep(svg) {
  color: var(--text-secondary);
}

.ws-link {
  color: var(--accent-primary);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  padding: 0.5rem 1rem;
  background: rgba(0, 242, 255, 0.1);
  border-radius: 8px;
}

.ws-link:hover {
  background: rgba(0, 242, 255, 0.2);
}

.help-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.help-link:hover {
  color: var(--accent-primary);
}

.bg-glow {
  position: absolute;
  width: 50vw;
  height: 50vw;
  border-radius: 50%;
  filter: blur(140px);
  z-index: -1;
  opacity: 0.1;
  pointer-events: none;
}

.blob-1 {
  top: -15%;
  right: -10%;
  background: var(--accent-primary);
}

.blob-2 {
  bottom: -15%;
  left: -10%;
  background: var(--accent-secondary);
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  z-index: -1;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .hero-section {
    margin-bottom: 1.5rem;
  }
  
  .data-footer {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-left, .footer-right, .footer-center {
    flex: none;
    width: 100%;
    text-align: center;
  }
  
  .info-card {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
}
</style>
