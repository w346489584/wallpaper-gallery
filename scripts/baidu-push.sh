#!/bin/bash

# ========================================
# 百度搜索引擎主动推送脚本
# ========================================

# 百度推送 API（你的专属 token）
BAIDU_API="http://data.zz.baidu.com/urls?site=https://wallpaper.061129.xyz&token=gLxXGwS0j5sNpOK"

# 要推送的 URL 列表
URLS=(
  "https://wallpaper.061129.xyz/"
  "https://wallpaper.061129.xyz/about"
  "https://wallpaper.061129.xyz/#/desktop"
  "https://wallpaper.061129.xyz/#/mobile"
  "https://wallpaper.061129.xyz/#/avatar"
)

echo "🚀 开始推送 URL 到百度搜索引擎..."
echo "======================================"
echo ""

# 将 URL 写入临时文件
TEMP_FILE=$(mktemp)
for url in "${URLS[@]}"; do
  echo "$url" >> "$TEMP_FILE"
done

echo "📋 推送以下 URL："
cat "$TEMP_FILE"
echo ""

# 推送到百度
echo "⬆️  正在推送..."
RESPONSE=$(curl -H 'Content-Type:text/plain' --data-binary @"$TEMP_FILE" "$BAIDU_API")

echo "======================================"
echo "📊 百度返回结果："
echo "$RESPONSE"
echo "======================================"
echo ""

# 解析结果
if echo "$RESPONSE" | grep -q '"success"'; then
  SUCCESS_COUNT=$(echo "$RESPONSE" | grep -o '"success":[0-9]*' | grep -o '[0-9]*')
  echo "✅ 成功推送 $SUCCESS_COUNT 条 URL"
else
  echo "⚠️  推送可能失败，请检查返回信息"
fi

# 清理临时文件
rm "$TEMP_FILE"

echo ""
echo "💡 提示："
echo "   - 每天最多推送 10 万条 URL"
echo "   - 推送成功不代表一定收录，百度会评估内容质量"
echo "   - 建议：每次发布新内容时使用此脚本推送"
echo ""
echo "✨ 推送完成！"
