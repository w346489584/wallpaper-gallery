// ========================================
// 视图模式管理 Composable
// ========================================

import { ref } from 'vue'
import { STORAGE_KEYS } from '@/utils/constants'

const viewMode = ref(localStorage.getItem(STORAGE_KEYS.VIEW_MODE) || 'grid')

export function useViewMode() {
  const setViewMode = (mode) => {
    viewMode.value = mode
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode)
  }

  // 视图模式选项
  const viewModeOptions = [
    { value: 'grid', icon: 'grid', label: '网格' },
    { value: 'list', icon: 'list', label: '列表' },
    { value: 'masonry', icon: 'masonry', label: '瀑布流' },
  ]

  return {
    viewMode,
    setViewMode,
    viewModeOptions,
  }
}
