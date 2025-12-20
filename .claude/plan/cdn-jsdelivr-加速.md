# CDN jsdelivr 加速方案

## 背景
页面加载时图片/缩略图显示慢，需刷新才能正常显示。原因是 `raw.githubusercontent.com` 在国内访问不稳定。

## 方案
使用 `cdn.jsdelivr.net` 替换 `raw.githubusercontent.com`，保留原 URL 作为注释备用。

## URL 转换
```
# 原图
旧: https://raw.githubusercontent.com/IT-NuanxinPro/nuanXinProPic/main/wallpaper/xxx.jpg
新: https://cdn.jsdelivr.net/gh/IT-NuanxinPro/nuanXinProPic@main/wallpaper/xxx.jpg

# 缩略图
旧: https://raw.githubusercontent.com/IT-NuanxinPro/nuanXinProPic/main/thumbnail/xxx.webp
新: https://cdn.jsdelivr.net/gh/IT-NuanxinPro/nuanXinProPic@main/thumbnail/xxx.webp
```

## 执行步骤

### 步骤 1：修改 generate-data.js
- 文件：`scripts/generate-data.js`
- 位置：第 37-39 行
- 操作：
  - 注释掉原 `RAW_BASE_URL` 和 `THUMBNAIL_BASE_URL`
  - 添加 jsdelivr 版本的 URL

### 步骤 2：修改 constants.js
- 文件：`src/utils/constants.js`
- 位置：第 6-9 行
- 操作：
  - 注释掉原 `IMAGE_BASE_URL` 和 `THUMBNAIL_BASE_URL`
  - 添加 jsdelivr 版本的 URL

### 步骤 3：重新生成 wallpapers.json
- 命令：`npm run generate`
- 验证：检查生成的 JSON 中 URL 是否已更新

## 预期结果
- 所有图片资源通过 jsdelivr CDN 加载
- 页面首次加载即可快速显示图片
- 保留 wsrv.nl 作为最终降级方案（已在 WallpaperCard.vue 中实现）
