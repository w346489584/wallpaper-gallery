<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { usePagination } from '@/composables/usePagination'
import { useViewMode } from '@/composables/useViewMode'
import WallpaperCard from './WallpaperCard.vue'

const props = defineProps({
  wallpapers: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  searchQuery: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['select'])

const { viewMode } = useViewMode()

// 分页
const wallpapersRef = computed(() => props.wallpapers)
const {
  displayedItems,
  hasMore,
  isLoading: paginationLoading,
  observerTarget,
} = usePagination(wallpapersRef, 20)

// 用于控制列表显示的状态，避免闪烁
const showGrid = ref(true)

// 监听 wallpapers 变化，添加短暂的隐藏状态避免闪烁
watch(() => props.wallpapers, async (newVal, oldVal) => {
  // 只有当数组内容真正变化时才触发过渡
  if (oldVal && oldVal.length > 0 && newVal.length > 0) {
    showGrid.value = false
    await nextTick()
    // 短暂延迟后显示新内容
    setTimeout(() => {
      showGrid.value = true
    }, 50)
  }
}, { deep: false })

function handleSelect(wallpaper) {
  emit('select', wallpaper)
}
</script>

<template>
  <div class="wallpaper-grid-wrapper">
    <!-- Loading State -->
    <div v-if="loading" class="grid-loading">
      <LoadingSpinner size="lg" />
      <p class="loading-text">
        加载壁纸中...
      </p>
    </div>

    <!-- Empty State -->
    <div v-else-if="wallpapers.length === 0" class="grid-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
      <h3>没有找到壁纸</h3>
      <p>尝试调整搜索条件或筛选器</p>
    </div>

    <!-- Grid - 简化过渡，避免闪烁 -->
    <div
      v-else
      class="wallpaper-grid"
      :class="[`view-${viewMode}`, { 'is-hidden': !showGrid }]"
    >
      <WallpaperCard
        v-for="(wallpaper, index) in displayedItems"
        :key="wallpaper.id"
        :wallpaper="wallpaper"
        :index="index"
        :search-query="searchQuery"
        :view-mode="viewMode"
        @click="handleSelect"
      />
    </div>

    <!-- Load More Observer -->
    <div
      v-if="!loading && wallpapers.length > 0"
      ref="observerTarget"
      class="load-more-trigger"
    >
      <div v-if="paginationLoading" class="load-more-loading">
        <LoadingSpinner size="sm" />
        <span>加载更多...</span>
      </div>
      <div v-else-if="hasMore" class="load-more-hint">
        <span>向下滚动加载更多</span>
      </div>
      <div v-else class="load-more-end">
        <span>已加载全部 {{ wallpapers.length }} 张壁纸</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wallpaper-grid-wrapper {
  min-height: 400px;
}

.wallpaper-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--grid-gap);
  transition: opacity 0.2s ease;

  &.is-hidden {
    opacity: 0;
  }

  // 网格视图（默认）
  &.view-grid {
    @include respond-to('sm') {
      grid-template-columns: repeat(2, 1fr);
    }

    @include respond-to('md') {
      grid-template-columns: repeat(3, 1fr);
    }

    @include respond-to('lg') {
      grid-template-columns: repeat(4, 1fr);
    }

    @include respond-to('xl') {
      grid-template-columns: repeat(5, 1fr);
    }
  }

  // 列表视图
  &.view-list {
    grid-template-columns: 1fr;
    gap: $spacing-md;
  }

  // 瀑布流视图
  &.view-masonry {
    display: block;
    column-count: 2;
    column-gap: var(--grid-gap);

    @include respond-to('md') {
      column-count: 3;
    }

    @include respond-to('lg') {
      column-count: 4;
    }

    @include respond-to('xl') {
      column-count: 5;
    }

    > * {
      break-inside: avoid;
      margin-bottom: var(--grid-gap);
    }
  }
}

.grid-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-2xl;
  gap: $spacing-md;
}

.loading-text {
  font-size: $font-size-sm;
  color: var(--color-text-muted);
}

.grid-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-2xl;
  text-align: center;

  svg {
    width: 80px;
    height: 80px;
    color: var(--color-text-muted);
    opacity: 0.5;
    margin-bottom: $spacing-lg;
  }

  h3 {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: var(--color-text-primary);
    margin-bottom: $spacing-sm;
  }

  p {
    font-size: $font-size-sm;
    color: var(--color-text-muted);
  }
}

// 加载更多
.load-more-trigger {
  display: flex;
  justify-content: center;
  padding: $spacing-xl 0;
}

.load-more-loading,
.load-more-hint,
.load-more-end {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-size-sm;
  color: var(--color-text-muted);
}

.load-more-loading {
  color: var(--color-accent);
}

.load-more-end {
  padding: $spacing-sm $spacing-md;
  background: var(--color-bg-secondary);
  border-radius: $radius-full;
}
</style>
