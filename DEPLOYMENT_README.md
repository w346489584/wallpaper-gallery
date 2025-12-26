# 子域名部署配置文件说明

## 📁 文件清单

| 文件 | 大小 | 用途 |
|------|------|------|
| `CNAME` | 20B | GitHub Pages 自定义域名配置文件 |
| `QUICKSTART.md` | 2.8KB | 3 步快速部署指南 |
| `SUBDOMAIN_GUIDE.md` | 10KB | 完整的多项目子域名部署指南 |
| `check-subdomain-dns.sh` | 7.9KB | DNS 配置验证脚本 |

---

## 🚀 快速开始

### 立即部署（3 步）

1. **添加 DNS CNAME 记录**（Spaceship 后台）
   ```
   Name: wallpaper
   Type: CNAME
   Value: it-nuanxinpro.github.io.  ← 末尾有点
   TTL: 3600
   ```

2. **推送代码到 GitHub**
   ```bash
   git push origin main
   ```

3. **配置 GitHub Pages**
   - 访问：https://github.com/IT-NuanxinPro/wallpaper-gallery/settings/pages
   - Custom domain: `wallpaper.061129.xyz`
   - Enforce HTTPS: ✓

---

## 🔍 验证配置

### 运行自动验证脚本

```bash
./check-subdomain-dns.sh
```

该脚本会检查：
- ✅ CNAME 记录是否正确
- ✅ IP 解析是否正常
- ✅ HTTPS 访问是否成功
- ✅ SSL 证书是否有效

### 手动验证

```bash
# 检查 DNS CNAME
dig wallpaper.061129.xyz CNAME +short

# 检查 IP 解析
dig wallpaper.061129.xyz A +short

# 访问网站
open https://wallpaper.061129.xyz
```

---

## 📚 详细文档

### 快速开始

阅读 `QUICKSTART.md` 获取 3 步部署流程。

### 完整指南

阅读 `SUBDOMAIN_GUIDE.md` 了解：
- DNS 配置详解
- 多项目子域名架构
- 团队协作配置方法
- 常见问题排查

---

## 🌐 访问地址

部署完成后，可通过以下地址访问：

- **自定义域名**（推荐）: https://wallpaper.061129.xyz
- **GitHub 默认**（备用）: https://it-nuanxinpro.github.io/wallpaper-gallery

---

## 🎯 核心概念

### 为什么使用子域名而不是根域名？

1. **更灵活**：一个域名可以托管多个项目
   - `wallpaper.061129.xyz` → 壁纸站
   - `blog.061129.xyz` → 博客
   - `tools.061129.xyz` → 工具集

2. **更简单**：不需要创建 `username.github.io` 仓库
   - 任何 GitHub 仓库都可以绑定子域名
   - 无需特殊命名规则

3. **团队友好**：成员可独立管理各自的子域名
   - 不同仓库、不同账号
   - 互不干扰、独立部署

---

## ⚙️ 技术架构

### DNS 解析流程

```
用户访问 wallpaper.061129.xyz
    ↓
DNS CNAME 解析到 it-nuanxinpro.github.io
    ↓
GitHub 根据 Host 头匹配到正确的仓库
    ↓
返回 IT-NuanxinPro/wallpaper-gallery 的内容
```

### HTTPS 自动配置

- GitHub 使用 **Let's Encrypt** 自动签发 SSL 证书
- DNS 验证通过后 5-10 分钟生效
- 证书 90 天自动续期，无需手动操作

---

## 🆘 需要帮助？

### 常见问题

1. **DNS 验证失败**
   - 检查 CNAME 末尾是否有点 `.`
   - 等待 5-30 分钟让 DNS 传播
   - 运行 `./check-subdomain-dns.sh` 诊断

2. **404 错误**
   - 检查 CNAME 文件是否已推送
   - 检查 GitHub Pages 设置
   - 等待部署完成（1-3 分钟）

3. **HTTPS 无法启用**
   - 等待 DNS 验证完成（绿色 ✓）
   - 通常需要 5-10 分钟
   - 清除自定义域名后重新填入

### 获取支持

- 查看完整指南：`SUBDOMAIN_GUIDE.md`
- 运行诊断脚本：`./check-subdomain-dns.sh`
- GitHub Pages 文档：https://docs.github.com/en/pages

---

**创建日期**: 2025-12-26
**配置方案**: 子域名 + GitHub Pages
**预计配置时间**: 10-15 分钟
