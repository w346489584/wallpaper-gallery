# Wallpaper Gallery 功能增强规划 v2

> 生成时间: 2025-12-20
> 规划版本: v2.0（基于用户反馈更新）
> 上一版本: wallpaper-gallery-功能增强.md

## 一、本次迭代范围

用户确认的功能列表：

| 编号 | 功能 | 模块 | 复杂度 |
|------|------|------|--------|
| **A1** | 搜索实时高亮 | 搜索 | 中 |
| **A2** | 搜索建议下拉 | 搜索 | 中 |
| **B1** | 筛选标签加粗 | 筛选 | 简单 |
| **B2** | 筛选面板视觉增强 | 筛选 | 简单 |
| **C2** | 视图切换 | 标题栏 | 中 |
| **C3** | 全屏浏览模式 | 标题栏 | 中 |
| **D1** | Hero 动态背景 | 页面 | 中 |
| **D3** | 今日精选 | 页面 | 中 |
| **D5** | 回到顶部 | 页面 | 简单 |
| **D6** | 无限滚动/懒加载 | 页面 | 中 |
| **D8** | 壁纸统计信息 | 页面 | 简单 |

---

## 二、详细设计

### 🔍 A1. 搜索实时高亮

#### 功能描述
搜索时，匹配的关键字在卡片文件名中高亮显示

#### 技术方案
```javascript
// src/utils/format.js
export function highlightText(text, keyword) {
  if (!keyword || !text) return [{ text, highlight: false }]
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)
  return parts.filter(Boolean).map(part => ({
    text: part,
    highlight: part.toLowerCase() === keyword.toLowerCase()
  }))
}
```

#### 涉及文件
- `src/utils/format.js` - 新增 highlightText 函数
- `src/components/wallpaper/WallpaperCard.vue` - 渲染高亮
- `src/composables/useFilter.js` - 导出 searchQuery
- `src/App.vue` - 传递 searchQuery
- `src/components/wallpaper/WallpaperGrid.vue` - 传递 searchQuery

#### 样式
```scss
.highlight {
  background: var(--color-accent-light);
  color: var(--color-accent);
  font-weight: $font-weight-semibold;
  padding: 1px 3px;
  border-radius: 2px;
}
```

---

### 🔍 A2. 搜索建议下拉

#### 功能描述
输入时实时显示匹配的文件名建议列表

#### 技术方案
- SearchBar 组件内部管理建议列表
- 接收 wallpapers 数据用于匹配
- 最多显示 6 条建议
- 支持键盘导航（↑↓选择，Enter确认，ESC关闭）
- 点击建议项填充搜索框

#### 涉及文件
- `src/components/common/SearchBar.vue` - 添加建议面板
- `src/App.vue` - 传递 wallpapers 数据

#### UI 设计
```
┌─────────────────────────────────┐
│ 🔍 动漫                      ✕  │
├─────────────────────────────────┤
│ 原神_雷电将军.png               │ ← 悬停高亮
│ 动漫_风景_夕阳.jpg              │
│ 动漫_少女_樱花.png              │
│ 疯狂动物城_兔子警官.png         │
└─────────────────────────────────┘
```

---

### 🎨 B1. 筛选标签加粗

#### 改动
```scss
.filter-label {
  font-weight: $font-weight-semibold; // 600
  color: var(--color-text-primary);
}
```

---

### 🎨 B2. 筛选面板视觉增强

#### 功能描述
提升筛选区域的视觉层次和交互反馈

#### 设计要点
- 添加微妙背景色和圆角
- 筛选数量动画（数字变化时）
- 下拉框激活状态增强
- 筛选激活时显示"重置"按钮

#### 样式
```scss
.filter-panel {
  background: var(--color-bg-secondary);
  border-radius: $radius-lg;
  padding: $spacing-md $spacing-lg;
  border: 1px solid var(--color-border);
}

.result-count strong {
  // 数字变化动画
  transition: all 0.3s ease;
}
```

---

### 🏠 C2. 视图切换

#### 功能描述
网格/列表/瀑布流三种视图模式

#### 技术方案
```javascript
// src/composables/useViewMode.js
export function useViewMode() {
  const viewMode = ref(localStorage.getItem('view-mode') || 'grid')

  const setViewMode = (mode) => {
    viewMode.value = mode
    localStorage.setItem('view-mode', mode)
  }

  return { viewMode, setViewMode }
}
```

#### 视图模式
| 模式 | 图标 | 布局 |
|------|------|------|
| grid | ⊞ | 4列网格 |
| list | ☰ | 单列列表 |
| masonry | ⊟ | CSS瀑布流 |

#### 涉及文件
- `src/composables/useViewMode.js` - 新建
- `src/components/layout/AppHeader.vue` - 添加切换按钮
- `src/components/wallpaper/WallpaperGrid.vue` - 响应视图模式
- `src/components/wallpaper/WallpaperCard.vue` - 列表模式样式

---

### 🏠 C3. 全屏浏览模式

#### 功能描述
一键进入沉浸式全屏浏览，隐藏标题栏和筛选栏

#### 技术方案
```javascript
// src/composables/useFullscreen.js
export function useFullscreen() {
  const isFullscreen = ref(false)

  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value
    document.body.classList.toggle('fullscreen-mode', isFullscreen.value)
  }

  // ESC 退出
  onMounted(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isFullscreen.value) {
        isFullscreen.value = false
      }
    })
  })

  return { isFullscreen, toggleFullscreen }
}
```

#### 涉及文件
- `src/composables/useFullscreen.js` - 新建
- `src/components/layout/AppHeader.vue` - 添加全屏按钮
- `src/App.vue` - 全屏状态管理
- `src/assets/styles/main.scss` - 全屏模式样式

---

### ✨ D1. Hero 动态背景

#### 功能描述
Hero 区域添加动态渐变背景动画

#### 技术方案
```scss
.hero-section {
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: -50%;
    background: linear-gradient(
      45deg,
      var(--color-accent) 0%,
      #a855f7 25%,
      #ec4899 50%,
      var(--color-accent) 75%,
      #a855f7 100%
    );
    background-size: 400% 400%;
    animation: gradient-flow 15s ease infinite;
    opacity: 0.1;
    filter: blur(60px);
    z-index: 0;
  }
}

@keyframes gradient-flow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

---

### ✨ D3. 今日精选

#### 功能描述
首页顶部展示今日精选壁纸

#### 技术方案
```javascript
// 根据日期计算今日壁纸索引
const getTodayWallpaper = (wallpapers) => {
  const today = new Date()
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  )
  const index = dayOfYear % wallpapers.length
  return wallpapers[index]
}
```

#### UI 设计
```
┌────────────────────────────────────────────┐
│  🌟 今日精选                               │
│  ┌──────────────────────────────────────┐  │
│  │                                      │  │
│  │         [大图预览区域]               │  │
│  │                                      │  │
│  └──────────────────────────────────────┘  │
│  原神_雷电将军.png    13.3MB    4K+        │
│  [下载] [收藏]                             │
└────────────────────────────────────────────┘
```

#### 涉及文件
- `src/components/home/TodayPick.vue` - 新建
- `src/App.vue` - 引入组件

---

### ✨ D5. 回到顶部

#### 功能描述
滚动后显示回到顶部按钮

#### 技术方案
```javascript
// src/composables/useScrollTop.js
export function useScrollTop() {
  const showButton = ref(false)

  const handleScroll = () => {
    showButton.value = window.scrollY > 400
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  onMounted(() => window.addEventListener('scroll', handleScroll))
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))

  return { showButton, scrollToTop }
}
```

#### 涉及文件
- `src/composables/useScrollTop.js` - 新建
- `src/components/common/BackToTop.vue` - 新建
- `src/App.vue` - 引入组件

---

### ✨ D6. 无限滚动/懒加载

#### 功能描述
大量壁纸时分批加载，优化性能

#### 技术方案
```javascript
// src/composables/usePagination.js
export function usePagination(items, pageSize = 20) {
  const currentPage = ref(1)
  const isLoading = ref(false)

  const displayedItems = computed(() => {
    return items.value.slice(0, currentPage.value * pageSize)
  })

  const hasMore = computed(() => {
    return displayedItems.value.length < items.value.length
  })

  const loadMore = () => {
    if (isLoading.value || !hasMore.value) return
    isLoading.value = true
    setTimeout(() => {
      currentPage.value++
      isLoading.value = false
    }, 300)
  }

  // Intersection Observer 自动加载
  const observerTarget = ref(null)

  return { displayedItems, hasMore, isLoading, loadMore, observerTarget }
}
```

#### 涉及文件
- `src/composables/usePagination.js` - 新建
- `src/components/wallpaper/WallpaperGrid.vue` - 使用分页
- `src/components/common/LoadMore.vue` - 加载更多组件

---

### ✨ D8. 壁纸统计信息

#### 功能描述
Footer 展示壁纸统计数据

#### UI 设计
```
┌────────────────────────────────────────────┐
│  📊 壁纸统计                               │
│  ────────────────────────────────────────  │
│  总数量: 63 张  |  JPG: 49  |  PNG: 14     │
│  总大小: 1.2 GB                            │
└────────────────────────────────────────────┘
```

#### 涉及文件
- `src/components/layout/AppFooter.vue` - 添加统计展示
- `src/composables/useWallpapers.js` - 添加统计计算

---

## 三、新建文件清单

| 文件路径 | 用途 |
|----------|------|
| `src/composables/useViewMode.js` | 视图模式管理 |
| `src/composables/useFullscreen.js` | 全屏模式管理 |
| `src/composables/useScrollTop.js` | 回到顶部功能 |
| `src/composables/usePagination.js` | 分页/懒加载 |
| `src/components/home/TodayPick.vue` | 今日精选组件 |
| `src/components/common/BackToTop.vue` | 回到顶部按钮 |
| `src/components/common/LoadMore.vue` | 加载更多组件 |

---

## 四、修改文件清单

| 文件路径 | 改动内容 |
|----------|----------|
| `src/utils/format.js` | 新增 highlightText 函数 |
| `src/composables/useFilter.js` | 导出 searchQuery |
| `src/composables/useWallpapers.js` | 添加统计计算 |
| `src/components/common/SearchBar.vue` | 搜索建议下拉 |
| `src/components/common/FilterPanel.vue` | 标签加粗、视觉增强 |
| `src/components/wallpaper/WallpaperCard.vue` | 高亮渲染、列表模式 |
| `src/components/wallpaper/WallpaperGrid.vue` | 视图模式、懒加载 |
| `src/components/layout/AppHeader.vue` | 视图切换、全屏按钮 |
| `src/components/layout/AppFooter.vue` | 统计信息展示 |
| `src/App.vue` | 整合所有功能、今日精选 |

---

## 五、执行顺序

### 第一批（基础功能）
1. ✅ B1 筛选标签加粗
2. ✅ D5 回到顶部
3. ✅ D8 统计信息

### 第二批（搜索增强）
4. A1 搜索实时高亮
5. A2 搜索建议下拉

### 第三批（视觉增强）
6. B2 筛选面板视觉增强
7. D1 Hero 动态背景

### 第四批（布局功能）
8. C2 视图切换
9. C3 全屏浏览

### 第五批（内容功能）
10. D3 今日精选
11. D6 无限滚动

---

## 六、验收标准

### A1 搜索实时高亮
- [ ] 输入搜索词后匹配部分高亮
- [ ] 高亮支持中英文
- [ ] 不区分大小写
- [ ] 适配深色/浅色主题

### A2 搜索建议下拉
- [ ] 输入时显示匹配建议
- [ ] 最多显示 6 条
- [ ] 支持键盘导航
- [ ] 点击填充搜索框
- [ ] 点击外部关闭

### C2 视图切换
- [ ] 三种视图模式正常切换
- [ ] 记住用户偏好
- [ ] 切换动画流畅

### C3 全屏浏览
- [ ] 一键进入/退出全屏
- [ ] ESC 退出
- [ ] 隐藏标题栏和筛选栏

### D1 Hero 动态背景
- [ ] 渐变动画流畅
- [ ] 不影响性能
- [ ] 深色/浅色适配

### D3 今日精选
- [ ] 每日展示不同壁纸
- [ ] 大图预览美观
- [ ] 支持下载

### D5 回到顶部
- [ ] 滚动后显示
- [ ] 点击平滑滚动
- [ ] 动画效果

### D6 无限滚动
- [ ] 首次加载 20 张
- [ ] 滚动自动加载
- [ ] 加载状态显示

### D8 统计信息
- [ ] 显示总数量
- [ ] 显示格式分布
- [ ] 显示总大小
