# 🚀 百度主动推送 API 使用指南

## 🔑 你的推送接口

```
http://data.zz.baidu.com/urls?site=https://wallpaper.061129.xyz&token=gLxXGwS0j5sNpOK
```

**重要**：这个 token 是你的专属密钥，不要泄露给他人！

---

## ⚠️ 当前问题：Token 验证失败

### 错误信息
```json
{"error":401,"message":"token is not valid"}
```

### 原因分析

**最可能的原因**：网站验证尚未完成

百度主动推送 API 需要满足以下条件才能使用：

1. ✅ 网站已在百度搜索资源平台添加
2. ❌ **网站验证必须完成**（当前可能未完成）
3. ❌ 百度系统需要时间同步（可能需要几小时）

---

## 📋 正确使用流程

### 第 1 步：完成网站验证

1. **访问百度搜索资源平台**
   - https://ziyuan.baidu.com/

2. **检查验证状态**
   - 进入"用户中心" > "站点管理"
   - 找到 `wallpaper.061129.xyz`
   - 确认状态是否显示"已验证"

3. **如果未验证，点击"验证"**
   - 等待 GitHub Pages 部署完成（1-3 分钟）
   - 访问验证文件确认可访问：
     ```
     https://wallpaper.061129.xyz/baidu_verify_codeva-0y9FGffGpu.html
     ```
   - 点击"完成验证"

### 第 2 步：等待 Token 生效

验证完成后，token 可能需要 **1-6 小时**才能生效。

---

## 🛠️ 使用方法（验证完成后）

### 方法 1：使用脚本推送（推荐）

```bash
# 执行推送脚本
./scripts/baidu-push.sh
```

**成功响应示例**：
```json
{
  "remain": 99995,     // 今日剩余可推送数量
  "success": 5,        // 成功推送的 URL 数量
  "not_same_site": [], // 非本站 URL
  "not_valid": []      // 无效 URL
}
```

### 方法 2：手动 curl 命令

```bash
# 创建 URL 列表文件
cat > urls.txt << EOF
https://wallpaper.061129.xyz/
https://wallpaper.061129.xyz/about
https://wallpaper.061129.xyz/#/desktop
https://wallpaper.061129.xyz/#/mobile
https://wallpaper.061129.xyz/#/avatar
EOF

# 推送到百度
curl -H 'Content-Type:text/plain' \
     --data-binary @urls.txt \
     "http://data.zz.baidu.com/urls?site=https://wallpaper.061129.xyz&token=gLxXGwS0j5sNpOK"
```

### 方法 3：在线推送（最简单）

1. 访问百度搜索资源平台
2. 进入"普通收录" > "链接提交" > "手动提交"
3. 粘贴 URL 列表（每行一个）
4. 点击"提交"

---

## 📅 什么时候使用推送？

### 立即推送（验证完成后）

**首次推送**：网站验证完成后，立即推送所有主要页面
```bash
./scripts/baidu-push.sh
```

### 定期推送

**新内容发布时**：
- 添加新壁纸分类
- 发布新功能页面
- 更新重要内容

**推送新 URL**：
```bash
# 编辑 scripts/baidu-push.sh，添加新 URL
URLS=(
  "https://wallpaper.061129.xyz/"
  "https://wallpaper.061129.xyz/about"
  "https://wallpaper.061129.xyz/#/new-category"  # 新增页面
)

# 执行推送
./scripts/baidu-push.sh
```

---

## 🔍 推送限额

| 限制项 | 数量 |
|--------|------|
| **每天推送数量** | 10 万条 |
| **单次推送数量** | 2000 条（建议） |
| **推送频率** | 无限制 |

**注意**：
- 超出限额会返回错误
- 重复推送同一 URL 不会重复计数
- 推送成功 ≠ 一定收录（百度会评估内容质量）

---

## 📊 监控推送效果

### 查看推送统计

1. 访问百度搜索资源平台
2. 进入"普通收录" > "链接提交"
3. 查看"推送数据"统计

### 验证收录状态

**方法 1：site 指令**
```
site:wallpaper.061129.xyz
```

**方法 2：精确 URL 查询**
```
wallpaper.061129.xyz
```

**方法 3：百度平台查询**
- 进入"数据监控" > "索引量"
- 查看已收录页面数量

---

## ⏱️ 收录时间预估

| 推送方式 | 收录时间 | 备注 |
|---------|---------|------|
| **主动推送** | 1-3 天 | 最快 |
| **sitemap** | 3-7 天 | 定期抓取 |
| **自然抓取** | 7-14 天 | 最慢 |

**建议**：三种方式结合使用，效果最佳
1. ✅ 主动推送（立即）
2. ✅ 提交 sitemap（已完成）
3. ✅ 增加外链（持续进行）

---

## 🚨 常见错误处理

### 错误 1：Token 无效
```json
{"error":401,"message":"token is not valid"}
```

**解决方案**：
1. 确认网站验证已完成
2. 等待 1-6 小时让 token 生效
3. 检查 token 是否正确（复制粘贴时避免多余空格）

### 错误 2：超出配额
```json
{"error":400,"message":"over quota"}
```

**解决方案**：
- 等待第二天（配额每天重置）
- 减少推送数量

### 错误 3：非本站 URL
```json
{
  "success": 3,
  "not_same_site": [
    "https://other-domain.com/page"
  ]
}
```

**解决方案**：
- 只推送 `wallpaper.061129.xyz` 域名下的 URL
- 检查 URL 是否正确

### 错误 4：URL 格式错误
```json
{
  "success": 3,
  "not_valid": [
    "invalid-url"
  ]
}
```

**解决方案**：
- 确保 URL 格式正确（包含 http:// 或 https://）
- 避免特殊字符

---

## 💡 最佳实践

### 1. 首次推送策略

**第一批**（网站验证完成后立即推送）：
```
https://wallpaper.061129.xyz/           # 首页（最重要）
https://wallpaper.061129.xyz/about      # 关于页
```

**第二批**（24 小时后）：
```
https://wallpaper.061129.xyz/#/desktop  # 电脑壁纸
https://wallpaper.061129.xyz/#/mobile   # 手机壁纸
https://wallpaper.061129.xyz/#/avatar   # 头像
```

### 2. 持续推送策略

- **新内容发布**：立即推送
- **重要页面更新**：每周推送一次
- **定期检查**：每周查看收录状态

### 3. 配合其他方式

```
主动推送（快速）
    ↓
Sitemap（稳定）
    ↓
外链建设（长期）
    ↓
搜索引擎收录
```

---

## 📝 操作清单

### 立即完成

- [x] 创建推送脚本
- [ ] 完成百度网站验证
- [ ] 等待 token 生效（1-6 小时）
- [ ] 执行首次推送

### 验证完成后

- [ ] 运行 `./scripts/baidu-push.sh`
- [ ] 查看推送结果
- [ ] 记录推送时间
- [ ] 3 天后查询收录状态

### 持续优化

- [ ] 每周检查收录状态
- [ ] 新内容发布时推送
- [ ] 监控推送数据统计

---

## 🔗 相关链接

- **百度搜索资源平台**：https://ziyuan.baidu.com/
- **推送 API 文档**：https://ziyuan.baidu.com/linksubmit/index
- **收录查询**：https://www.baidu.com/s?wd=site:wallpaper.061129.xyz

---

## 📞 需要帮助？

### 验证 token 是否生效

```bash
# 推送单个 URL 测试
curl -H 'Content-Type:text/plain' \
     --data-binary "https://wallpaper.061129.xyz/" \
     "http://data.zz.baidu.com/urls?site=https://wallpaper.061129.xyz&token=gLxXGwS0j5sNpOK"
```

**期望结果**（成功）：
```json
{"remain":99999,"success":1}
```

**失败结果**：
```json
{"error":401,"message":"token is not valid"}
```

如果持续失败：
1. 检查网站验证状态
2. 等待更长时间（最多 24 小时）
3. 联系百度客服

---

**创建日期**：2025-12-26
**下次检查**：验证完成后 1-6 小时测试 token
**推送状态**：待验证完成后执行
