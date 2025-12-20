<script setup>
import { computed } from 'vue'
import { FORMAT_OPTIONS, SORT_OPTIONS } from '@/utils/constants'

const props = defineProps({
  sortBy: {
    type: String,
    default: 'newest',
  },
  formatFilter: {
    type: String,
    default: 'all',
  },
  resultCount: {
    type: Number,
    default: 0,
  },
  totalCount: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['update:sortBy', 'update:formatFilter', 'reset'])

// 是否有激活的筛选条件
const hasActiveFilters = computed(() => {
  return props.formatFilter !== 'all' || props.sortBy !== 'newest'
})

function handleSortChange(value) {
  emit('update:sortBy', value)
}

function handleFormatChange(value) {
  emit('update:formatFilter', value)
}

function handleReset() {
  emit('update:sortBy', 'newest')
  emit('update:formatFilter', 'all')
  emit('reset')
}
</script>

<template>
  <div class="filter-panel" :class="{ 'has-filters': hasActiveFilters }">
    <div class="filter-left">
      <span class="result-count">
        共 <strong class="count-value">{{ resultCount }}</strong> 张壁纸
        <span v-if="resultCount !== totalCount" class="filtered-hint">
          (筛选自 {{ totalCount }} 张)
        </span>
      </span>

      <!-- 重置按钮 -->
      <Transition name="fade">
        <button
          v-if="hasActiveFilters"
          class="reset-btn"
          @click="handleReset"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          重置
        </button>
      </Transition>
    </div>

    <div class="filter-right">
      <!-- Format Filter -->
      <div class="filter-item">
        <span class="filter-label">格式</span>
        <el-select
          :model-value="formatFilter"
          placeholder="全部格式"
          size="default"
          style="width: 120px"
          @change="handleFormatChange"
        >
          <el-option
            v-for="option in FORMAT_OPTIONS"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </div>

      <!-- Sort -->
      <div class="filter-item">
        <span class="filter-label">排序</span>
        <el-select
          :model-value="sortBy"
          placeholder="排序方式"
          size="default"
          style="width: 130px"
          @change="handleSortChange"
        >
          <el-option
            v-for="option in SORT_OPTIONS"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filter-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-md;
  padding: $spacing-md $spacing-lg;
  background: var(--color-bg-secondary);
  border-radius: $radius-lg;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;

  &.has-filters {
    border-color: var(--color-accent-light);
    background: linear-gradient(135deg, var(--color-bg-secondary) 0%, rgba(99, 102, 241, 0.03) 100%);
  }
}

.filter-left {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.result-count {
  font-size: $font-size-sm;
  color: var(--color-text-secondary);

  .count-value {
    display: inline-block;
    color: var(--color-text-primary);
    font-weight: $font-weight-bold;
    font-size: $font-size-md;
    min-width: 24px;
    text-align: center;
    transition:
      transform 0.3s ease,
      color 0.3s ease;
  }
}

.filtered-hint {
  color: var(--color-text-muted);
  font-size: $font-size-xs;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
  color: var(--color-accent);
  background: var(--color-accent-light);
  border-radius: $radius-md;
  cursor: pointer;
  transition: all 0.25s ease;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    background: var(--color-accent);
    color: white;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
}

.filter-right {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.filter-label {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: var(--color-text-primary);
  white-space: nowrap;

  @include mobile-only {
    display: none;
  }
}

// 动画
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

// 响应式
@include mobile-only {
  .filter-panel {
    padding: $spacing-sm $spacing-md;
  }

  .filter-left {
    flex-wrap: wrap;
  }
}
</style>
