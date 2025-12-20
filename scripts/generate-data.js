/**
 * 壁纸数据生成脚本
 * 在构建前运行，生成 wallpapers.json
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 配置
const CONFIG = {
  // GitHub 图床仓库信息
  GITHUB_OWNER: 'IT-NuanxinPro',
  GITHUB_REPO: 'nuanXinProPic',
  GITHUB_BRANCH: 'main',
  WALLPAPER_DIR: 'wallpaper',
  THUMBNAIL_DIR: 'thumbnail',

  // 本地图床仓库路径（支持本地开发和 CI 环境）
  LOCAL_REPO_PATHS: [
    path.resolve(__dirname, '../nuanXinProPic'), // CI 环境：项目根目录下
    path.resolve(__dirname, '../../nuanXinProPic'), // 本地开发：同级目录
  ],

  // 支持的图片格式
  IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],

  // 输出路径
  OUTPUT_DIR: path.resolve(__dirname, '../public/data'),
  OUTPUT_FILE: 'wallpapers.json',
}

// 使用 jsdelivr CDN 加速（国内访问更快）
const RAW_BASE_URL = `https://cdn.jsdelivr.net/gh/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}@${CONFIG.GITHUB_BRANCH}/${CONFIG.WALLPAPER_DIR}`
const THUMBNAIL_BASE_URL = `https://cdn.jsdelivr.net/gh/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}@${CONFIG.GITHUB_BRANCH}/${CONFIG.THUMBNAIL_DIR}`

// 备用：raw.githubusercontent.com（如 jsdelivr 不可用时切换）
// const RAW_BASE_URL = `https://raw.githubusercontent.com/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}/${CONFIG.GITHUB_BRANCH}/${CONFIG.WALLPAPER_DIR}`
// const THUMBNAIL_BASE_URL = `https://raw.githubusercontent.com/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}/${CONFIG.GITHUB_BRANCH}/${CONFIG.THUMBNAIL_DIR}`

/**
 * 通过本地目录获取壁纸列表（优先使用，避免 API 限流）
 */
function fetchWallpapersFromLocal() {
  // 尝试多个可能的路径
  for (const repoPath of CONFIG.LOCAL_REPO_PATHS) {
    const localWallpaperDir = path.join(repoPath, CONFIG.WALLPAPER_DIR)

    if (!fs.existsSync(localWallpaperDir)) {
      console.log(`Path not found: ${localWallpaperDir}`)
      continue
    }

    console.log('Fetching wallpapers from local directory...')
    console.log(`Path: ${localWallpaperDir}`)

    const files = fs.readdirSync(localWallpaperDir)
      .filter((filename) => {
        const ext = path.extname(filename).toLowerCase()
        return CONFIG.IMAGE_EXTENSIONS.includes(ext)
      })
      .map((filename) => {
        const filePath = path.join(localWallpaperDir, filename)
        const stats = fs.statSync(filePath)
        return {
          name: filename,
          size: stats.size,
          sha: '', // 本地模式无 SHA
          type: 'file',
        }
      })

    console.log(`Found ${files.length} image files`)
    return files
  }

  console.log('No local repository found')
  return null
}

/**
 * 通过 GitHub API 获取壁纸列表
 */
async function fetchWallpapersFromGitHub() {
  const apiUrl = `https://api.github.com/repos/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}/contents/${CONFIG.WALLPAPER_DIR}?ref=${CONFIG.GITHUB_BRANCH}`

  console.log('Fetching wallpapers from GitHub API...')
  console.log(`URL: ${apiUrl}`)

  const response = await fetch(apiUrl, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Wallpaper-Gallery-Builder',
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }

  const files = await response.json()

  // 过滤出图片文件
  const imageFiles = files.filter((file) => {
    if (file.type !== 'file')
      return false
    const ext = path.extname(file.name).toLowerCase()
    return CONFIG.IMAGE_EXTENSIONS.includes(ext)
  })

  console.log(`Found ${imageFiles.length} image files`)

  return imageFiles
}

/**
 * 生成壁纸数据
 */
function generateWallpaperData(files) {
  const now = new Date()

  return files.map((file, index) => {
    const ext = path.extname(file.name).replace('.', '').toUpperCase()

    // 根据索引生成模拟上传时间（越前面的越新）
    const uploadDate = new Date(now.getTime() - index * 3600000) // 每张间隔1小时

    // 文件名（不含扩展名）
    const filenameNoExt = path.basename(file.name, path.extname(file.name))

    // 使用 jsdelivr CDN URL
    const imageUrl = `${RAW_BASE_URL}/${encodeURIComponent(file.name)}`

    // 缩略图 URL（webp 格式）
    const thumbnailUrl = `${THUMBNAIL_BASE_URL}/${encodeURIComponent(filenameNoExt)}.webp`

    return {
      id: `wallpaper-${index + 1}`,
      filename: file.name,
      url: imageUrl,
      thumbnailUrl,
      downloadUrl: imageUrl,
      size: file.size,
      format: ext,
      createdAt: uploadDate.toISOString(),
      sha: file.sha,
    }
  })
}

/**
 * 主函数
 */
async function main() {
  console.log('='.repeat(50))
  console.log('Wallpaper Data Generator')
  console.log('='.repeat(50))

  try {
    // 优先从本地目录获取（避免 GitHub API 限流）
    let files = fetchWallpapersFromLocal()

    // 如果本地目录不存在，则从 GitHub API 获取
    if (!files) {
      console.log('Falling back to GitHub API...')
      files = await fetchWallpapersFromGitHub()
    }

    if (files.length === 0) {
      console.warn('No image files found!')
      return
    }

    // 生成壁纸数据
    const wallpapers = generateWallpaperData(files)

    // 按大小降序排列（默认显示最大的在前）
    wallpapers.sort((a, b) => b.size - a.size)

    // 确保输出目录存在
    if (!fs.existsSync(CONFIG.OUTPUT_DIR)) {
      fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true })
    }

    // 写入 JSON 文件
    const outputPath = path.join(CONFIG.OUTPUT_DIR, CONFIG.OUTPUT_FILE)
    const outputData = {
      generatedAt: new Date().toISOString(),
      total: wallpapers.length,
      source: `https://github.com/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}`,
      baseUrl: RAW_BASE_URL,
      thumbnailBaseUrl: THUMBNAIL_BASE_URL,
      wallpapers,
    }

    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2))

    console.log('')
    console.log('='.repeat(50))
    console.log('Generation Complete!')
    console.log('='.repeat(50))
    console.log(`Total wallpapers: ${wallpapers.length}`)
    console.log(`Output file: ${outputPath}`)
    console.log(`Base URL: ${RAW_BASE_URL}`)
    console.log(`Thumbnail URL: ${THUMBNAIL_BASE_URL}`)
    console.log('')

    // 输出统计
    const stats = {
      jpg: wallpapers.filter(w => w.format === 'JPG' || w.format === 'JPEG').length,
      png: wallpapers.filter(w => w.format === 'PNG').length,
    }
    console.log('Statistics:')
    console.log(`  JPG: ${stats.jpg}`)
    console.log(`  PNG: ${stats.png}`)
  }
  catch (error) {
    console.error('Error generating wallpaper data:', error)
    process.exit(1)
  }
}

main()
