# 博客滴灌发布（GitHub Actions 云端）

每天自动生成 5-6 篇工具教程文章，在 09:00-22:00 之间错峰发布，
提交到本仓库后由 Cloudflare Pages 自动部署。**不依赖本机开机**。

## 目录说明

| 文件 | 作用 |
|---|---|
| `drip_blog.py` | 滴灌发布器：判定是否到点 → 生成 1 篇 → 更新首页/sitemap → 提交推送 |
| `gen_blog.py` | 文章生成与渲染（AI 模式 + 内置模板回退） |
| `config.ini` | 发布节奏配置（**不含任何密钥**） |
| `blog_state.json` | 发布状态（已发文章、每日已消费时段），由 Actions 自动维护 |

## 首次配置

在仓库 **Settings → Secrets and variables → Actions** 添加：

- **Secrets** → `ZHIPU_API_KEY`：智谱开放平台 API Key（必填）
- **Variables**（可选，不填走默认值）
  - `BLOG_API_BASE`：默认 `https://open.bigmodel.cn/api/paas/v4`
  - `BLOG_MODEL`：默认 `glm-4-flash`

未配置 Key 时脚本会自动回退到内置模板生成，不会中断发布。

## 调节奏

改 `config.ini` 的 `[drip]` 段即可，无需改代码：

```ini
daily_min = 5          ; 每天最少几篇
daily_max = 6          ; 每天最多几篇
window_start = 9       ; 发布时间窗起（北京时间）
window_end = 22        ; 发布时间窗止
min_gap_minutes = 60   ; 相邻两篇最小间隔
max_per_run = 1        ; 单次运行最多发几篇
```

## 手动触发

Actions → 「72tool 博客滴灌发布」→ Run workflow，
勾选 `force` 可忽略时刻表立即发一篇（测试用）。

## 注意

- 定时任务为每 30 分钟检查一次，GitHub 高峰期可能延迟 5-15 分钟，属正常现象。
- 请勿同时启用本机的 `72tool_blog_drip` 计划任务，否则会重复发布。
- 本目录以 `.` 开头，Cloudflare Pages 不会将其作为站点内容发布。
