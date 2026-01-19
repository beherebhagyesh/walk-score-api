<template>
  <div class="nearby-transit glass animate-slide-in">
    <div class="transit-header">
      <div class="header-title">
        <Icon name="heroicons:truck" size="20" />
        <h3>Nearby Connectivity</h3>
      </div>
      <div v-if="loading" class="mini-spinner"></div>
      <span v-else class="stop-count">{{ stops.length }} Routes Found</span>
    </div>

    <div v-if="stops.length > 0" class="transit-list">
      <div 
        v-for="(stop, index) in stops" 
        :key="index" 
        class="transit-item"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <div class="route-icon" :class="getRouteType(stop.name)">
          <Icon :name="getRouteIcon(stop.name)" size="18" />
        </div>
        
        <div class="route-info">
          <span class="route-name">{{ stop.name }}</span>
          <div class="route-distance" :class="getDistanceClass(stop.distance)">
            <Icon name="heroicons:map-pin" size="12" />
            <span>{{ stop.distance }} mi</span>
          </div>
        </div>

        <div class="route-status">
          <span class="status-dot"></span>
          <span>Active</span>
        </div>
      </div>
    </div>
    
    <div v-else-if="!loading" class="empty-state">
      <Icon name="heroicons:no-symbol" size="24" />
      <p>No transit routes found in this immediate area.</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  stops: {
    type: Array,
    default: () => []
  },
  loading: Boolean
})

const getRouteType = (name) => {
  const n = name.toLowerCase();
  if (n.includes('bus') || n.match(/\d+/)) return 'type-bus';
  if (n.includes('train') || n.includes('rail') || n.includes('metro')) return 'type-rail';
  return 'type-general';
}

const getRouteIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes('train') || n.includes('rail') || n.includes('metro')) return 'heroicons:train';
  return 'heroicons:truck'; // Bus icon
}

const getDistanceClass = (distance) => {
  const d = parseFloat(distance);
  if (d <= 0.2) return 'dist-near';
  if (d <= 0.5) return 'dist-mid';
  return 'dist-far';
}
</script>

<style scoped>
.nearby-transit {
  padding: 1.5rem;
  margin-top: 1rem;
}

.transit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-title :deep(svg) {
  color: var(--accent-primary);
}

.header-title h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.stop-count {
  font-size: 0.75rem;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.05);
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
}

.transit-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.transit-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  transition: all 0.3s ease;
  animation: slideInUp 0.5s ease-out forwards;
  opacity: 0;
}

.transit-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(0, 242, 255, 0.2);
  transform: translateY(-2px);
}

.route-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  flex-shrink: 0;
}

.type-bus {
  background: rgba(0, 242, 255, 0.1);
  color: var(--accent-primary);
}

.type-rail {
  background: rgba(112, 0, 255, 0.1);
  color: var(--accent-secondary);
}

.type-general {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
}

.route-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.route-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.route-distance {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.dist-near { color: var(--success); }
.dist-mid { color: var(--warning); }
.dist-far { color: var(--text-secondary); }

.route-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
  color: var(--text-secondary);
  opacity: 0.6;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: var(--success);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--success);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.mini-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0, 242, 255, 0.1);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .transit-list {
    grid-template-columns: 1fr;
  }
}
</style>
