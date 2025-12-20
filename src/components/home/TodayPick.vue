<script setup>
import { gsap } from 'gsap'
import { computed, onMounted, ref } from 'vue'
import { formatFileSize } from '@/utils/format'

const props = defineProps({
  wallpapers: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['select'])

const containerRef = ref(null)
const imageLoaded = ref(false)

// 根据日期计算今日壁纸
const todayWallpaper = computed(() => {
  if (!props.wallpapers.length)
    return null

  const today = new Date()
  const startOfYear = new Date(today.getFullYear(), 0, 0)
  const diff = today - startOfYear
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
  const index = dayOfYear % props.wallpapers.length

  return props.wallpapers[index]
})

const formattedSize = computed(() => {
  if (!todayWallpaper.value)
    return ''
  return formatFileSize(todayWallpaper.value.size)
})

const fileFormat = computed(() => {
  if (!todayWallpaper.value)
    return ''
  return todayWallpaper.value.filename.split('.').pop()?.toUpperCase() || ''
})

function handleClick() {
  if (todayWallpaper.value) {
    emit('select', todayWallpaper.value)
  }
}

function handleImageLoad() {
  imageLoaded.value = true
}

onMounted(() => {
  if (containerRef.value) {
    gsap.fromTo(
      containerRef.value,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 },
    )
  }
})
</script>

<template>
  <div v-if="todayWallpaper" ref="containerRef" class="today-pick">
    <div class="today-pick__header">
      <div class="today-pick__badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span>今日精选</span>
      </div>
      <span class="today-pick__date">{{ new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }) }}</span>
    </div>

    <div class="today-pick__content" @click="handleClick">
      <div class="today-pick__image">
        <!-- Skeleton -->
        <div v-if="!imageLoaded" class="image-skeleton">
          <div class="skeleton-shimmer" />
        </div>

        <img
          v-show="imageLoaded"
          :src="todayWallpaper.thumbnailUrl || todayWallpaper.url"
          :alt="todayWallpaper.filename"
          @load="handleImageLoad"
        >

        <div class="today-pick__overlay">
          <div class="overlay-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M11 8v6M8 11h6" />
            </svg>
          </div>
          <span>查看大图</span>
        </div>
      </div>

      <div class="today-pick__info">
        <h3 class="today-pick__name">
          {{ todayWallpaper.filename }}
        </h3>
        <div class="today-pick__meta">
          <span class="meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            {{ formattedSize }}
          </span>
          <span class="meta-item meta-format">
            {{ fileFormat }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.today-pick {
  margin-bottom: $spacing-xl;
  opacity: 0;
}

.today-pick__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-md;
}

.today-pick__badge {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-xs $spacing-md;
  background: linear-gradient(135deg, var(--color-accent), #a855f7);
  color: white;
  border-radius: $radius-full;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;

  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
    stroke: none;
  }
}

.today-pick__date {
  font-size: $font-size-sm;
  color: var(--color-text-muted);
}

.today-pick__content {
  display: flex;
  flex-direction: column;
  background: var(--color-bg-card);
  border-radius: $radius-lg;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);

    .today-pick__overlay {
      opacity: 1;
    }

    .today-pick__image img {
      transform: scale(1.05);
    }
  }

  @include tablet-up {
    flex-direction: row;
  }
}

.today-pick__image {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--color-bg-hover);

  @include tablet-up {
    flex: 1;
    aspect-ratio: auto;
    min-height: 200px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
}

.image-skeleton {
  position: absolute;
  inset: 0;
  background: var(--color-bg-hover);
  overflow: hidden;

  .skeleton-shimmer {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, var(--color-bg-card) 50%, transparent 100%);
    animation: shimmer 1.5s infinite;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.today-pick__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;

  .overlay-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: $radius-full;
    backdrop-filter: blur(8px);

    svg {
      width: 28px;
      height: 28px;
    }
  }

  span {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
  }
}

.today-pick__info {
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @include tablet-up {
    width: 280px;
    flex-shrink: 0;
  }
}

.today-pick__name {
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: var(--color-text-primary);
  margin-bottom: $spacing-sm;
  word-break: break-all;
}

.today-pick__meta {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  font-size: $font-size-sm;
  color: var(--color-text-muted);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 14px;
    height: 14px;
  }
}

.meta-format {
  padding: 2px 8px;
  background: var(--color-bg-hover);
  border-radius: $radius-sm;
  font-weight: $font-weight-medium;
  font-size: $font-size-xs;
}
</style>
