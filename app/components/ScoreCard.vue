<template>
  <div 
    class="score-card glass" 
    :class="{ 'is-loaded': isLoaded, [scoreClass]: true }"
    @click="handleClick"
  >
    <div class="card-glow" :style="{ background: glowColor }"></div>
    
    <div class="card-header">
      <div class="header-content">
        <div class="label-row">
          <h3 class="label">{{ label }}</h3>
          <span class="score-label-tag" :style="{ background: tagBgColor, color: scoreColor }">{{ description || 'No data' }}</span>
        </div>
      </div>
      <div class="icon-wrapper" :style="{ background: iconBgColor }">
        <Icon :name="iconName" size="28" class="icon" :style="{ color: scoreColor }" />
      </div>
    </div>
    
    <div class="score-display">
      <span class="score-number" :style="{ color: scoreColor }">{{ animatedScore }}</span>
      <div class="score-meta">
        <span class="score-max">/100</span>
        <span class="score-rating">{{ getRating(score) }}</span>
      </div>
    </div>
    
    <div class="score-body">
      <div class="progress-container">
        <div class="progress-bar-bg">
          <div 
            class="progress-bar-fill" 
            :style="{ width: progressWidth + '%', background: progressGradient }"
          ></div>
        </div>
        <div class="progress-labels">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>
      
      <div v-if="summary" class="transit-summary">
        <Icon name="heroicons:information-circle" size="14" />
        <span>{{ summary }}</span>
      </div>
      
      <div class="click-hint">
        <Icon name="heroicons:cursor-arrow-rays" size="14" />
        <span>Click for details</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  score: Number,
  description: String,
  iconName: String,
  summary: String,
  type: String
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click', {
    label: props.label,
    score: props.score,
    type: props.type,
    iconName: props.iconName
  })
}

const isLoaded = ref(false)
const animatedScore = ref(0)

const scoreClass = computed(() => {
  if (props.score >= 70) return 'score-high';
  if (props.score >= 50) return 'score-medium';
  return 'score-low';
})

const getRating = (score) => {
  if (!score) return '';
  if (score >= 90) return 'Walker\'s Paradise';
  if (score >= 70) return 'Very Walkable';
  if (score >= 50) return 'Somewhat Walkable';
  if (score >= 25) return 'Car-Dependent';
  return 'Almost All Errands Require a Car';
}

const scoreColor = computed(() => {
  if (props.score >= 70) return '#3fb950';
  if (props.score >= 50) return '#d29922';
  return '#f85149';
})

const tagBgColor = computed(() => {
  if (props.score >= 70) return 'rgba(63, 185, 80, 0.15)';
  if (props.score >= 50) return 'rgba(210, 153, 34, 0.15)';
  return 'rgba(248, 81, 73, 0.15)';
})

const glowColor = computed(() => {
  if (props.score >= 70) return 'radial-gradient(circle at top right, rgba(63, 185, 80, 0.2) 0%, transparent 60%)';
  if (props.score >= 50) return 'radial-gradient(circle at top right, rgba(210, 153, 34, 0.2) 0%, transparent 60%)';
  return 'radial-gradient(circle at top right, rgba(248, 81, 73, 0.2) 0%, transparent 60%)';
})

const iconBgColor = computed(() => {
  if (props.score >= 70) return 'rgba(63, 185, 80, 0.12)';
  if (props.score >= 50) return 'rgba(210, 153, 34, 0.12)';
  return 'rgba(248, 81, 73, 0.12)';
})

const progressGradient = computed(() => {
  if (props.score >= 70) return 'linear-gradient(90deg, #3fb950 0%, #56d364 100%)';
  if (props.score >= 50) return 'linear-gradient(90deg, #d29922 0%, #e3b341 100%)';
  return 'linear-gradient(90deg, #f85149 0%, #ff7b72 100%)';
})

const progressWidth = ref(0)

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
    
    // Animate the score number
    const target = props.score || 0
    const duration = 1800
    const startTime = performance.now()
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3)
      animatedScore.value = Math.round(target * easeOut)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
    
    // Animate progress bar
    setTimeout(() => {
      progressWidth.value = props.score || 0
    }, 300)
  }, 150)
})
</script>

<style scoped>
.score-card {
  position: relative;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.score-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
}

.score-card.score-low {
  border-color: rgba(248, 81, 73, 0.2);
}

.score-card.score-medium {
  border-color: rgba(210, 153, 34, 0.2);
}

.score-card.score-high {
  border-color: rgba(63, 185, 80, 0.2);
}

.card-glow {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.6s ease;
}

.score-card.is-loaded .card-glow {
  opacity: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.label-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.score-label-tag {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  width: fit-content;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.score-card:hover .icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.score-display {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.score-number {
  font-size: 4rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
}

.score-meta {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.score-max {
  font-size: 1.25rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.score-rating {
  font-size: 0.7rem;
  color: var(--text-secondary);
  opacity: 0.7;
}

.progress-container {
  position: relative;
}

.progress-bar-bg {
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 1.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.15);
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.65rem;
  color: var(--text-secondary);
  opacity: 0.5;
}

.transit-summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.transit-summary :deep(svg) {
  flex-shrink: 0;
  color: var(--accent-primary);
}

.click-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 0.75rem;
  font-size: 0.7rem;
  color: var(--text-secondary);
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.click-hint :deep(svg) {
  color: var(--accent-primary);
}

.score-card:hover .click-hint {
  opacity: 1;
}

.score-card {
  cursor: pointer;
}
</style>

