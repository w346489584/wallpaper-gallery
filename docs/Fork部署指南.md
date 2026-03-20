# 🚀 Fork 部署指南 (Cloudflare Pages 托管版)

本文档为想要 Fork 本项目的开发者提供完整的配置指南。本项目采用 **GitHub Actions (高性能构建)** + **Cloudflare Pages (全球 CDN 托管)** 的混合方案，彻底解决了单页应用（SPA）在 SEO 和路由上的痛点。

---

## 📋 目录

1. [快速开始](#1-快速开始)
2. [GitHub Secrets 配置 (核心)](#2-github-secrets-配置-核心)
3. [Cloudflare Pages 设置](#3-cloudflare-pages-设置)
4. [Supabase 统计功能 (可选)](#4-supabase-统计功能-可选)
5. [常见问题](#5-常见问题)

---

## 1. 快速开始

### 1.1 Fork 项目
点击 GitHub 页面右上角的 **Fork** 按钮，将项目克隆到你的账户。

### 1.2 本地运行
```bash
git clone https://github.com/你的用户名/wallpaper-gallery.git
cd wallpaper-gallery
pnpm install
pnpm dev # 本地开发模式
```

### 1.3 核心架构说明
*   **构建端 (GitHub Actions)**：利用 GitHub 的高性能服务器，自动克隆巨大的图床仓库、同步 JSON 数据并执行生产环境打包。
*   **托管端 (Cloudflare Pages)**：仅作为静态文件服务器，通过全球 CDN 分发，并识别 `_redirects` 文件以支持 200 状态码路由，完美适配 Google/百度收录。

---

## 2. GitHub Secrets 配置 (核心)

为了让 GitHub Actions 能够自动将打包好的文件推送到你的 Cloudflare，必须配置以下 Secrets。

**操作路径**：GitHub 仓库 -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**。

| Secret 名称 | 必需 | 说明 | 获取方式 |
| :--- | :---: | :--- | :--- |
| `CLOUDFLARE_API_TOKEN` | **是** | Cloudflare 身份令牌 | [个人资料] -> [API 令牌] -> [创建自定义令牌] -> 给予 **Pages:编辑** 权限 |
| `CLOUDFLARE_ACCOUNT_ID` | **是** | 账户唯一标识 | Cloudflare 控制台 -> [概述] -> 右侧栏 [账户 ID] |
| `VITE_SUPABASE_URL` | 否 | Supabase 项目地址 | 用于启用壁纸浏览/下载统计功能 |
| `VITE_SUPABASE_ANON_KEY` | 否 | Supabase 匿名 Key | 用于启用壁纸浏览/下载统计功能 |

---

## 3. Cloudflare Pages 设置

### 3.1 创建 Pages 项目
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2. 进入 **Workers 和 Pages** -> **创建** -> **Pages** -> **连接到 Git**。
3. 关联你的仓库，项目名称建议设置为 `wallpaper-gallery-prod`（**需与 deploy.yml 中的 projectName 保持一致**）。

### 3.2 禁用自动构建 (重要步骤)
由于我们使用 GitHub Actions 主动推送产物，必须关闭 Cloudflare 的自动检测，否则会造成重复构建且速度极慢。
1. 在 Cloudflare 项目页点击 **设置** -> **构建与部署**。
2. 在 **分支控制** 处点击“编辑”。
3. **取消勾选** “启用自动生产分支部署”。
4. 在 **预览分支** 处选择 “无（禁用自动分支部署）”。

---

## 4. Supabase 统计功能 (可选)

如果你需要启用壁纸的浏览量和下载量统计，推荐直接使用一份“复制即用”的初始化 SQL。

推荐方式：

1. 打开 [scripts/supabase-init.sql](../scripts/supabase-init.sql)
2. 复制全部内容
3. 粘贴到 Supabase 的 **SQL Editor**
4. 一次性执行

这份脚本适合：

- 新建 Supabase 项目的 fork 用户
- 不需要历史迁移，只想尽快跑通统计功能的用户

时间字段说明：

- 表里继续使用 `TIMESTAMPTZ`
- 查询展示北京时间时，推荐使用
  `AT TIME ZONE 'Asia/Shanghai'` + `to_char(...)`

如果你是从旧统计结构升级，请改用 [scripts/supabase-migration.sql](../scripts/supabase-migration.sql)。

详细架构说明请查看 [Supabase统计系统.md](./Supabase统计系统.md)。

<details>
<summary>点击展开 SQL 脚本</summary>

```sql
-- 直接复制 scripts/supabase-init.sql 全部内容到 Supabase SQL Editor 执行
```
</details>

---

## 5. 常见问题

### Q: 部署成功了，但页面没有任何图片数据？
**A:** 请检查 GitHub Actions 的运行日志。重点查看 `Copy data from image repository` 这一步是否报错。如果克隆图床仓库失败，`public/data` 目录将为空，导致网站无数据。

### Q: 刷新页面出现 404 错误？
**A:** 请确保 `public/_redirects` 文件存在于你的仓库中。GitHub Actions 构建完成后，该文件应出现在 `dist` 根目录下，Cloudflare 才会识别并启用 200 状态码重定向。

### Q: 部署显示 "Authentication error" (403)？
**A:** 请检查 `CLOUDFLARE_API_TOKEN`。确保它拥有 **“账户”级别** 的 `Cloudflare Pages:编辑` 权限。不要使用“区域”令牌，Pages 部署属于账户级操作。
