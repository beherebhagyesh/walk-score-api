<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="close">
      <div class="modal-content glass">
        <button class="close-btn" @click="close">
          <Icon name="heroicons:x-mark" size="24" />
        </button>
        
        <div class="modal-header">
          <div class="modal-icon" :style="{ background: iconBgColor }">
            <Icon :name="iconName" size="32" :style="{ color: scoreColor }" />
          </div>
          <div class="modal-title-group">
            <h2 class="modal-title">{{ label }}</h2>
            <span class="modal-score" :style="{ color: scoreColor }">{{ score }}/100</span>
          </div>
        </div>
        
        <div class="modal-body">
          <!-- City Comparison -->
          <div class="comparison-section">
            <h3 class="section-title">
              <Icon name="heroicons:chart-bar" size="18" />
              City Comparison
            </h3>
            
            <div class="comparison-bars">
              <div class="bar-item">
                <div class="bar-label">
                  <span>This Location</span>
                  <span class="bar-value">{{ score }}</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill current" :style="{ width: score + '%' }"></div>
                </div>
              </div>
              
              <div class="bar-item">
                <div class="bar-label">
                  <span>Orlando Average</span>
                  <span class="bar-value">{{ cityAverage }}</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill city" :style="{ width: cityAverage + '%' }"></div>
                </div>
              </div>
              
              <div class="bar-item">
                <div class="bar-label">
                  <span>Florida Average</span>
                  <span class="bar-value">{{ stateAverage }}</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill state" :style="{ width: stateAverage + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Transit Stops (only for Transit Score) -->
          <div v-if="type === 'transit' && transitStops.length > 0" class="transit-section">
            <h3 class="section-title">
              <Icon name="heroicons:truck" size="18" />
              Nearby Transit Stops
            </h3>
            
            <div class="stops-list">
              <div v-for="stop in transitStops" :key="stop.name" class="stop-item">
                <div class="stop-info">
                  <Icon name="heroicons:map-pin" size="16" class="stop-icon" />
                  <span class="stop-name">{{ stop.name }}</span>
                </div>
                <span class="stop-distance">{{ stop.distance }} mi</span>
              </div>
            </div>
          </div>
          
          <!-- Description -->
          <div class="description-section">
            <h3 class="section-title">
              <Icon name="heroicons:information-circle" size="18" />
              What This Means
            </h3>
            <p class="description-text">{{ getDescription() }}</p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  label: String,
  score: Number,
  type: String,
  iconName: String,
  transitStops: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close'])

const close = () => emit('close')

// City/State averages (mock data - these could be fetched from an API)
const cityAverage = computed(() => {
  if (props.type === 'walk') return 42;
  if (props.type === 'bike') return 55;
  return 35;
})

const stateAverage = computed(() => {
  if (props.type === 'walk') return 38;
  if (props.type === 'bike') return 48;
  return 28;
})

const scoreColor = computed(() => {
  if (props.score >= 70) return '#3fb950';
  if (props.score >= 50) return '#d29922';
  return '#f85149';
})

const iconBgColor = computed(() => {
  if (props.score >= 70) return 'rgba(63, 185, 80, 0.15)';
  if (props.score >= 50) return 'rgba(210, 153, 34, 0.15)';
  return 'rgba(248, 81, 73, 0.15)';
})

const getDescription = () => {
  if (props.type === 'walk') {
    if (props.score >= 90) return 'Daily errands do not require a car. This is a walker\'s paradise with excellent walkability.';
    if (props.score >= 70) return 'Most errands can be accomplished on foot. Very walkable area with good pedestrian infrastructure.';
    if (props.score >= 50) return 'Some errands can be accomplished on foot. Somewhat walkable with some amenities nearby.';
    if (props.score >= 25) return 'Most errands require a car. Car-dependent area with limited walkability.';
    return 'Almost all errands require a car. Very limited walkability in this area.';
  }
  if (props.type === 'bike') {
    if (props.score >= 90) return 'Biking is convenient for most trips. Excellent bike infrastructure and flat terrain.';
    if (props.score >= 70) return 'Biking is convenient for most trips. Good bike lanes and paths available.';
    if (props.score >= 50) return 'Some bike infrastructure exists. Bikeable with some routes and bike-friendly roads.';
    return 'Minimal bike infrastructure. Limited biking options in this area.';
  }
  // Transit
  if (props.score >= 70) return 'Excellent public transportation with many nearby routes and frequent service.';
  if (props.score >= 50) return 'Good public transportation options with several routes accessible.';
  if (props.score >= 25) return 'Some public transportation available but with limited routes and frequency.';
  return 'Minimal public transportation. Very few transit options in this area.';
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  width: 100%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
  animation: slideUp 0.3s ease;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.modal-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
}

.modal-title-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.modal-score {
  font-size: 1.25rem;
  font-weight: 700;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.section-title :deep(svg) {
  color: var(--accent-primary);
}

.comparison-bars {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bar-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bar-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.bar-value {
  font-weight: 600;
  color: var(--text-primary);
}

.bar-track {
  height: 10px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 5px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.8s ease;
}

.bar-fill.current {
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
}

.bar-fill.city {
  background: rgba(255, 255, 255, 0.3);
}

.bar-fill.state {
  background: rgba(255, 255, 255, 0.15);
}

.stops-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stop-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
}

.stop-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stop-icon {
  color: var(--accent-primary);
}

.stop-name {
  font-size: 0.85rem;
  color: var(--text-primary);
}

.stop-distance {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.description-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
