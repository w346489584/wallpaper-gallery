// ========================================
// 回到顶部功能 Composable
// ========================================

import { onMounted, onUnmounted, ref } from 'vue'

export function useScrollTop(threshold = 400) {
  const showButton = ref(false)

  const handleScroll = () => {
    showButton.value = window.scrollY > threshold
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    showButton,
    scrollToTop,
  }
}
