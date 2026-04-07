-- ============================================
-- Supabase 旧统计结构下线脚本
-- ============================================
-- 使用方式：
-- 1. 先执行“标记阶段”
-- 2. 观察一段时间，确认无误后再执行“删除阶段”
-- 3. 删除前请先备份
-- ============================================

-- ============================================
-- 第一阶段：标记旧结构
-- ============================================

COMMENT ON TABLE public.wallpaper_views IS
'LEGACY: 旧统计明细表，当前项目已不再写入。当前运行时主表为 public.image_stats。';

COMMENT ON TABLE public.wallpaper_downloads IS
'LEGACY: 旧统计明细表，当前项目已不再写入。当前运行时主表为 public.image_stats。';

COMMENT ON TABLE public.wallpaper_stats_summary IS
'LEGACY: 旧统计汇总表，当前项目已不再使用。当前运行时主表为 public.image_stats。';

COMMENT ON VIEW public.view_stats IS
'LEGACY: 基于 wallpaper_views 的旧视图，当前项目已不再读取。';

COMMENT ON VIEW public.download_stats IS
'LEGACY: 基于 wallpaper_downloads 的旧视图，当前项目已不再读取。';

COMMENT ON VIEW public.popular_wallpapers IS
'LEGACY: 旧热门视图，当前项目已不再读取。';

COMMENT ON VIEW public.popular_wallpapers_weekly IS
'LEGACY: 旧周热门视图，当前项目已不再读取。';

COMMENT ON VIEW public.popular_wallpapers_monthly IS
'LEGACY: 旧月热门视图，当前项目已不再读取。';

-- 可选：查看旧结构当前是否还有数据
SELECT 'wallpaper_views' AS object_name, COUNT(*) AS row_count FROM public.wallpaper_views
UNION ALL
SELECT 'wallpaper_downloads' AS object_name, COUNT(*) AS row_count FROM public.wallpaper_downloads
UNION ALL
SELECT 'wallpaper_stats_summary' AS object_name, COUNT(*) AS row_count FROM public.wallpaper_stats_summary;

-- ============================================
-- 第二阶段：删除旧结构
-- ============================================
-- 确认不再需要旧表原始事件后，再手动取消注释执行

-- DROP VIEW IF EXISTS public.popular_wallpapers_monthly;
-- DROP VIEW IF EXISTS public.popular_wallpapers_weekly;
-- DROP VIEW IF EXISTS public.popular_wallpapers;
-- DROP VIEW IF EXISTS public.download_stats;
-- DROP VIEW IF EXISTS public.view_stats;

-- DROP TABLE IF EXISTS public.wallpaper_stats_summary;
-- DROP TABLE IF EXISTS public.wallpaper_downloads;
-- DROP TABLE IF EXISTS public.wallpaper_views;
