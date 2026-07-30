# -*- coding: utf-8 -*-
"""
gen_blog.py —— 72tool.com 工具博客自动生成（AI 教程文章）

读站点 tools.html 清单 → 自动按分类生成「各不相同」的教程文章 →
渲染为 blog/<slug>.html + blog/index.html → 更新 sitemap.xml。

两种生成模式（config.ini [blog] mode 控制）：
  - template：内置分类模板，无需任何 API key，立即可用、可部署。
  - api     ：调用你的 OpenAI 兼容端点（DeepSeek / 通义 / 智谱 / 本地模型等）
              做真正的 AI 写作，文章更自然丰富。填入 api_base/api_key/model 即可。

用法：
  python gen_blog.py                 # 按 config 的 mode / max_articles 生成
  python gen_blog.py --mode api      # 强制用 AI 端点生成（需先填好 key）
  python gen_blog.py --mode template # 强制用模板生成
  python gen_blog.py --max 30        # 本次最多 30 篇（0=全部）
  python gen_blog.py --dry-run       # 只打印计划，不写文件

部署：生成的 blog/ 在站点仓库里，git push 后 Cloudflare 自动构建上线。
"""
import sys, os, re, json, configparser, datetime, urllib.request, urllib.error
import hashlib, random
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(HERE, "config.ini")
DEFAULT_SITE = "https://72tool.com"
TODAY = datetime.date.today().isoformat()

CATEGORIES = {
    "image": {
        "label": "图片处理",
        "highlights": [
            "纯浏览器本地处理，图片不会上传到服务器，隐私更有保障。",
            "支持多种常见图片格式的转换、压缩与编辑，即开即用。",
            "界面简洁，无需安装任何软件，手机和电脑都能直接打开使用。",
        ],
        "scenarios": [
            "日常办公中快速压缩图片体积、转换格式以便分享。",
            "电商或自媒体需要对商品图、封面图做裁剪、去背景等处理。",
            "处理证件照、头像、配图等需要统一规格的场景。",
        ],
        "tips": [
            "批量处理多张图片时，优先用批量工具一次完成，效率更高。",
            "压缩前先确认是否需要保留透明通道（PNG），避免意外丢信息。",
            "需要印刷或高清展示时，注意输出分辨率，别压得太狠。",
        ],
        "faq": [
            ("处理过程中图片会传到服务器吗？", "不会。所有处理都在你的浏览器本地完成，文件不会上传，保护隐私。"),
            ("支持哪些图片格式？", "覆盖常见格式（如 JPG/PNG/WEBP/GIF 等），具体以页面可选格式为准。"),
            ("压缩后画质会明显下降吗？", "合理参数下肉眼几乎无感；若追求更小体积可适当降低质量，但建议先预览效果。"),
            ("手机上能用吗？", "可以，本工具基于网页运行，手机、平板、电脑均可直接打开使用，无需安装 App。"),
            ("处理大图会卡吗？", "一般不会，处理在本地进行；若图片特别大，建议分批处理。"),
        ],
    },
    "audio": {
        "label": "音频处理",
        "highlights": [
            "完全在浏览器本地处理音频，文件不上传，安全私密。",
            "覆盖格式转换、剪辑、降噪、混音等常见音频需求。",
            "无需安装专业软件，打开网页即可完成处理。",
        ],
        "scenarios": [
            "把录音、音乐转换为目标格式以便播放或剪辑。",
            "裁剪片段、去除静音、调整音量、添加淡入淡出等后期处理。",
            "提取人声、分离伴奏、转写文字等创作与整理场景。",
        ],
        "tips": [
            "批量音频建议用批量工具统一参数处理，省时省力。",
            "导出前先试听一小段，确认音量、速度符合预期。",
            "人声分离等智能处理对音质有一定要求，源文件越干净效果越好。",
        ],
        "faq": [
            ("音频会上传吗？", "不会，全部在浏览器本地处理，文件不出本机。"),
            ("支持哪些音频格式？", "支持常见格式（如 MP3/WAV/M4A/OGG 等），以页面选项为准。"),
            ("处理很长的音频会慢吗？", "处理在本地完成，时长越大耗时越长，属于正常现象。"),
            ("能提取音频里的文字吗？", "部分音频工具支持音频转文字，可直接在页面使用。"),
            ("手机能用吗？", "可以，网页端运行，手机浏览器直接打开即可。"),
        ],
    },
    "video": {
        "label": "视频处理",
        "highlights": [
            "视频在浏览器本地处理，原始文件不上传，隐私安全。",
            "覆盖格式转换、压缩、剪辑、提取音频、加字幕等常用功能。",
            "免安装、随开随用，适合日常剪辑与社媒创作。",
        ],
        "scenarios": [
            "把视频转成平台要求的格式或压小体积方便上传。",
            "裁剪片段、去水印、调色、加字幕等轻量剪辑。",
            "从视频里提取音频、转成 GIF 动图等二次创作。",
        ],
        "tips": [
            "上传平台前先看清楚分辨率/格式要求，避免反复转码。",
            "压缩时优先保证画面清晰，必要时只调码率而非分辨率。",
            "长视频建议分段处理，降低单次等待时间。",
        ],
        "faq": [
            ("视频会上传服务器吗？", "不会，处理全程在本地浏览器完成。"),
            ("能转成 GIF 吗？", "可以，部分视频工具支持视频转 GIF 动图。"),
            ("压缩后画质差很多吗？", "合理参数下影响很小；追求更小体积可适度降低码率。"),
            ("能从视频提取音频吗？", "可以，使用视频提取音频类工具即可。"),
            ("支持哪些格式？", "覆盖 MP4/WebM/MOV 等常见格式，以页面选项为准。"),
        ],
    },
    "pdf": {
        "label": "PDF 处理",
        "highlights": [
            "PDF 处理在浏览器本地完成，文档不上传，内容更安全。",
            "覆盖合并、拆分、压缩、转换、OCR、加密等常见需求。",
            "无需安装 Acrobat 等专业软件，网页即开即用。",
        ],
        "scenarios": [
            "把多份 PDF 合并，或按页码拆分、提取指定页。",
            "压缩体积方便邮件发送，或转成 Word/Excel/图片继续编辑。",
            "给 PDF 加密码、加水印、做 OCR 识别图片文字。",
        ],
        "tips": [
            "批量 PDF 建议一次性添加后统一处理。",
            "OCR 识别前尽量保证扫描清晰，识别率更高。",
            "加密文档请牢记密码，忘记后无法直接找回。",
        ],
        "faq": [
            ("PDF 会上传吗？", "不会，处理在本地浏览器完成，文档不出本机。"),
            ("能把 PDF 转成 Word 吗？", "可以，使用 PDF 转 Word 工具即可。"),
            ("扫描版 PDF 能提取文字吗？", "可以，使用带 OCR 的工具识别图片中的文字。"),
            ("能去掉 PDF 密码吗？", "对于已知打开密码的文档可解除，未知密码无法破解。"),
            ("压缩后文字会丢吗？", "合理压缩不影响文字内容，仅优化体积。"),
        ],
    },
    "doc": {
        "label": "文档表格",
        "highlights": [
            "文档/表格在浏览器本地处理，数据不上传，安全私密。",
            "覆盖 CSV/Excel/JSON/Markdown/Word/PPT 等格式互转与清洗。",
            "无需安装 Office，网页即可完成转换与整理。",
        ],
        "scenarios": [
            "CSV 去重、筛选、排序、拆分、合并等数据整理。",
            "Excel/CSV 与 JSON、Markdown 等格式互转。",
            "表格生成 SQL、去敏打码、差异对比等开发/运营场景。",
        ],
        "tips": [
            "大文件建议先预览再处理，确认编码（如 UTF-8）正确。",
            "含敏感信息的表格，优先用脱敏工具打码后再外发。",
            "转换前备份原文件，避免误操作覆盖。",
        ],
        "faq": [
            ("表格会上传吗？", "不会，处理在本地浏览器完成。"),
            ("CSV 乱码怎么办？", "多为编码问题，先用转 UTF-8 工具统一编码再处理。"),
            ("能把 Excel 转 CSV 吗？", "可以，使用 Excel 转 CSV 工具。"),
            ("JSON 能转表格吗？", "可以，JSON 转 CSV/Excel 工具可直接转换。"),
            ("数据量大时会卡吗？", "本地处理，数据越大越慢，建议分批。"),
        ],
    },
    "dev": {
        "label": "开发工具",
        "highlights": [
            "面向开发者的编码/格式/调试工具，浏览器本地运行。",
            "覆盖 Base64、Hash、JSON、正则、时间戳、URL、SQL 等常见需求。",
            "无需安装环境，打开网页即可调试与转换。",
        ],
        "scenarios": [
            "接口调试、编码转换、数据格式化与校验。",
            "正则测试、JWT 解析、Cron 表达式生成。",
            "本地快速完成哈希签名、UUID、变量命名等小任务。",
        ],
        "tips": [
            "处理敏感 token/密钥时，优先用本地工具而非上传到第三方网站。",
            "正则/JSON 调试可实时预览，边写边验证更高效。",
            "把常用工具加入书签，开发时随取随用。",
        ],
        "faq": [
            ("数据会上传吗？", "不会，全部在浏览器本地处理，适合处理敏感内容。"),
            ("支持哪些编码/格式？", "覆盖开发常见格式与算法，具体以页面参数选项为准。"),
            ("正则怎么测试？", "在正则工具中输入表达式与测试文本，实时查看匹配结果。"),
            ("结果能直接复制吗？", "可以，输出区通常支持一键复制。"),
            ("手机能用吗？", "可以，网页端运行，手机浏览器直接打开即可。"),
        ],
    },
    "text": {
        "label": "文本工具",
        "highlights": [
            "文本处理在浏览器本地完成，内容不上传，安全私密。",
            "覆盖大小写、全半角、繁简、分词、词频、对比等文字处理。",
            "无需安装软件，粘贴即用，适合写作与运营。",
        ],
        "scenarios": [
            "清理多余空格空行、统一排版、字符统计。",
            "中文繁简转换、全角半角转换、大小写转换。",
            "文本差异对比、词频统计、敏感词检测。",
        ],
        "tips": [
            "长文本先统计字数/词频，再针对性润色。",
            "对比两段文本差异时，先统一换行与空格再比对更准确。",
            "含隐私的文本优先用本地工具处理。",
        ],
        "faq": [
            ("文本会上传吗？", "不会，处理在本地浏览器完成。"),
            ("支持繁简转换吗？", "支持，使用简繁转换工具即可。"),
            ("能统计字数和词频吗？", "可以，文本统计与词频工具直接给出结果。"),
            ("两段文本怎么对比差异？", "使用文本差异对比工具，高亮展示不同之处。"),
            ("手机能用吗？", "可以，网页端运行，手机可直接打开。"),
        ],
    },
    "calc": {
        "label": "计算工具",
        "highlights": [
            "各类生活与财务计算在浏览器本地完成，即时出结果。",
            "覆盖 BMI、贷款、个税、利息、折扣、利润等常见计算。",
            "无需下载，打开网页填参数即得结果。",
        ],
        "scenarios": [
            "个人理财：贷款月供、复利利息、房租分期测算。",
            "购物优惠：折扣、满减、优惠券最优组合计算。",
            "健康与日常：BMI、标准体重、步行消耗等。",
        ],
        "tips": [
            "输入前确认单位（如年化/月利率、税前/税后）。",
            "结果仅供参考，重大财务决策建议结合实际情况。",
            "把常用计算工具加入书签，随时取用。",
        ],
        "faq": [
            ("计算会上传我的数据吗？", "不会，计算在本地浏览器完成。"),
            ("结果准确吗？", "按通用公式本地计算，准确可靠；复杂场景以实际合同为准。"),
            ("支持哪些计算？", "覆盖健康、贷款、税务、折扣等常见计算，见对应工具页。"),
            ("手机能用吗？", "可以，网页端运行，手机直接打开。"),
            ("能导出结果吗？", "多数工具支持复制结果，部分支持导出。"),
        ],
    },
    "unit": {
        "label": "单位换算",
        "highlights": [
            "单位换算在浏览器本地完成，输入即出结果，免安装。",
            "覆盖长度、重量、温度、面积、体积、字节、货币等维度。",
            "界面简洁，适合学习、工作与日常换算。",
        ],
        "scenarios": [
            "学习/科研中的长度、面积、体积、温度换算。",
            "跨境购物与账务的货币、字节、重量换算。",
            "工程与生活中的功率、压强、能量等维度换算。",
        ],
        "tips": [
            "货币换算注意汇率会波动，结果仅供参考。",
            "换算前确认单位体系（如公制/英制）。",
            "大数值建议先核对数量级再使用。",
        ],
        "faq": [
            ("换算会上传吗？", "不会，换算在本地浏览器完成。"),
            ("支持哪些单位？", "覆盖常见物理量单位，以页面可选单位为准。"),
            ("汇率是实时的吗？", "货币类以页面标注的汇率为准，会随时间变化。"),
            ("手机能用吗？", "可以，网页端运行，手机直接打开。"),
            ("结果能复制吗？", "可以，输出区支持一键复制。"),
        ],
    },
    "qr": {
        "label": "二维码条码",
        "highlights": [
            "二维码/条形码在浏览器本地生成，内容不上传。",
            "支持普通二维码、批量生成、WiFi 二维码等。",
            "生成的码可直接下载使用，方便分享与印刷。",
        ],
        "scenarios": [
            "把网址、文本生成二维码方便手机扫码访问。",
            "生成 WiFi 二维码，访客扫码即连。",
            "批量生成带序列号的二维码/条形码。",
        ],
        "tips": [
            "二维码内容越长，图案越密，打印时留出静区更稳妥。",
            "WiFi 二维码注意密码大小写准确。",
            "批量生成前先确认命名规则，避免混乱。",
        ],
        "faq": [
            ("生成会上传内容吗？", "不会，生成在本地浏览器完成。"),
            ("能生成 WiFi 二维码吗？", "可以，使用 WiFi 二维码工具，扫码即连。"),
            ("支持批量吗？", "支持，使用批量二维码生成工具。"),
            ("能下载图片吗？", "可以，生成后直接下载 PNG 等格式。"),
            ("手机能用吗？", "可以，网页端运行，手机直接打开。"),
        ],
    },
    "color": {
        "label": "配色设计",
        "highlights": [
            "颜色处理在浏览器本地完成，色值不上传。",
            "支持 RGB/HEX/HSL 互转、对比度检测、配色提取。",
            "适合前端、设计与运营快速取色配色。",
        ],
        "scenarios": [
            "前端开发中的色值转换与对比度检查。",
            "从图片提取配色色卡，用于设计参考。",
            "快速生成协调的配色方案。",
        ],
        "tips": [
            "做网页配色时用对比度工具检查可读性（WCAG）。",
            "导出配色表方便在设计稿中统一使用。",
            "转换时注意色彩空间差异，必要时肉眼复核。",
        ],
        "faq": [
            ("色值会上传吗？", "不会，处理在本地浏览器完成。"),
            ("支持哪些格式互转？", "支持 RGB/HEX/HSL 等常见格式，以页面为准。"),
            ("能检查文字可读性吗？", "可以，用对比度检测工具检查 WCAG 对比度。"),
            ("能从图片取色吗？", "部分工具支持从图片提取配色色卡。"),
            ("手机能用吗？", "可以，网页端运行，手机直接打开。"),
        ],
    },
    "seo": {
        "label": "站长 SEO",
        "highlights": [
            "站长与 SEO 工具在浏览器本地运行，链接/配置不上传。",
            "覆盖 Sitemap、Robots、Meta、OG、SSL、DNS 等检测与生成。",
            "无需安装，打开网页即可诊断与生成。",
        ],
        "scenarios": [
            "生成 Sitemap、Robots、Canonical、OG 等 SEO 标签与文件。",
            "检测页面 Meta、SSL 证书、HTTP 状态、DNS 解析。",
            "排查收录与抓取相关的基础配置问题。",
        ],
        "tips": [
            "改完 Robots/Sitemap 后，记得到各搜索引擎站长平台重新提交。",
            "生成 Sitemap 后定期检查有效性，及时清理死链。",
            "Meta/OG 信息要与实际内容一致，避免被降权。",
        ],
        "faq": [
            ("我的站点信息会上传吗？", "不会，相关检测与生成在本地浏览器完成。"),
            ("能生成 Sitemap 吗？", "可以，使用 Sitemap 生成工具生成后部署到根目录。"),
            ("Robots 写错了怎么办？", "用 Robots 生成/检测工具修正后重新部署即可。"),
            ("SSL 证书怎么查？", "使用 SSL 证书检测工具查看到期与签发信息。"),
            ("手机能用吗？", "可以，网页端运行，手机直接打开。"),
        ],
    },
}

DEFAULT_CAT = {
    "label": "效率工具",
    "highlights": [
        "工具在浏览器本地运行，数据不上传，安全私密。",
        "即开即用，无需安装，适合日常效率提升。",
        "界面简洁，手机和电脑都能直接使用。",
    ],
    "scenarios": [
        "日常办公与学习中的轻量处理需求。",
        "临时性的小任务，不想安装专业软件时使用。",
        "需要快速得到结果、随取随用的场景。",
    ],
    "tips": [
        "把常用工具加入书签，随取随用。",
        "处理敏感内容优先用本地工具。",
        "批量任务优先用批量版工具，效率更高。",
    ],
    "faq": [
        ("数据会上传吗？", "不会，处理在本地浏览器完成。"),
        ("需要安装吗？", "不需要，网页打开即用。"),
        ("手机能用吗？", "可以，网页端运行，手机直接打开。"),
        ("结果能复制吗？", "可以，输出区通常支持一键复制。"),
        ("免费吗？", "是的，本站工具免费使用。"),
    ],
}


def detect_category(slug, name):
    s = (slug + " " + name).lower()
    if any(k in s for k in ["img", "image", "picture", "photo", "gif", "png", "jpg", "avatar", "crop", "palette", "icon", "watermark", "exif", "screenshot"]):
        return "image"
    if any(k in s for k in ["audio", "mp3", "sound", "voice", "music"]):
        return "audio"
    if any(k in s for k in ["video", "mp4", "gif", "subtitle", "字幕", "vide"]):
        return "video"
    if "pdf" in s or "ppt" in s or "word" in s:
        return "pdf"
    if any(k in s for k in ["csv", "excel", "json", "markdown", "md2", "table", "xls", "txt", "sql insert"]):
        return "doc"
    if any(k in s for k in ["base64", "hash", "regex", "timestamp", "url", "sql", "jwt", "cron", "css", "uuid", "var-name", "mac", "roman", "morse", "hex", "htaccess", "query-builder", "xml", "svg"]):
        return "dev"
    if any(k in s for k in ["text", "case", "word", "char", "fullhalf", "zhconvert", "sensitive", "emoji", "lorem", "slug", "title", "symbol", "morse", "unicode", "indent"]):
        return "text"
    if any(k in s for k in ["calc", "loan", "tax", "bmi", "age", "interest", "discount", "profit", "rental", "compound", "stock", "order", "car", "freight", "fuel", "coupon", "square", "geometry", "proportion", "std", "weight-standard"]):
        return "calc"
    if any(k in s for k in ["unit", "length", "weight", "temp", "area", "volume", "byte", "money", "angle", "speed", "pressure", "power", "energy", "density", "timezone"]):
        return "unit"
    if any(k in s for k in ["qr", "barcode", "wifi-qr"]):
        return "qr"
    if any(k in s for k in ["color", "rgb", "hsl", "contrast", "palette"]):
        return "color"
    if any(k in s for k in ["seo", "canonical", "robots", "sitemap", "meta", "og-", "ssl", "http", "dns", "domain", "user-agent", "nofollow", "keyword", "robotstxt"]):
        return "seo"
    return "other"


# ---------------- 配置 ----------------
def load_config():
    cp = configparser.ConfigParser()
    cp.read(CONFIG_PATH, encoding="utf-8")
    def g(sec, key, d=""):
        return cp.get(sec, key, fallback=d) if cp.has_section(sec) else d
    def gb(sec, key, d=True):
        return g(sec, key, "true" if d else "false").strip().lower() in ("1", "true", "yes", "on", "y")
    # ---- 环境变量覆盖（GitHub Actions 云端运行用；本地留空即可）----
    # BLOG_SITE_DIR : 站点根目录（含 tools.html / sitemap.xml），Actions 里就是仓库根
    # BLOG_API_KEY / BLOG_API_BASE / BLOG_MODEL / BLOG_MODE : LLM 相关，走 Secrets
    env_site_dir = os.environ.get("BLOG_SITE_DIR", "").strip()
    default_site_dir = "C:\\Users\\Administrator\\Desktop\\全能工具箱"
    site_dir = env_site_dir or default_site_dir

    tools_html = g("blog", "tools_html", "").strip()
    if env_site_dir or not tools_html:
        tools_html = os.path.join(site_dir, "tools.html")
    blog_dir = g("blog", "blog_dir", "").strip()
    if env_site_dir or not blog_dir:
        blog_dir = os.path.join(site_dir, "blog")

    return {
        "enabled": gb("blog", "enabled", True),
        "mode": (os.environ.get("BLOG_MODE", "").strip()
                 or g("blog", "mode", "template").strip()).lower(),
        "api_base": (os.environ.get("BLOG_API_BASE", "").strip()
                     or g("blog", "api_base", "").strip()),
        "api_key": (os.environ.get("BLOG_API_KEY", "").strip()
                    or g("blog", "api_key", "").strip()),
        "model": (os.environ.get("BLOG_MODEL", "").strip()
                  or g("blog", "model", "deepseek-chat").strip()),
        "blog_dir": blog_dir,
        "tools_html": tools_html,
        "max_articles": int(g("blog", "max_articles", "30") or 30),
        "update_sitemap": gb("blog", "update_sitemap", True),
        "site": g("general", "site", DEFAULT_SITE).strip(),
    }


CFG = load_config()
_dry = "--dry-run" in sys.argv
for i, a in enumerate(sys.argv):
    if a == "--mode" and i + 1 < len(sys.argv):
        CFG["mode"] = sys.argv[i + 1].strip().lower()
    if a == "--max" and i + 1 < len(sys.argv):
        try: CFG["max_articles"] = int(sys.argv[i + 1])
        except ValueError: pass


def log(msg):
    print(f"[{datetime.datetime.now().strftime('%H:%M:%S')}] {msg}")


def parse_tools(path):
    try:
        html = open(path, encoding="utf-8").read()
    except Exception as e:
        log(f"读取 tools.html 失败: {e}")
        return []
    items = re.findall(r'<li><a href="(.*?\.html)">(.*?)\s*\|\s*72在线工具箱</a></li>', html)
    out = []
    for slug, name in items:
        # 抽取该工具页的独有素材：description / 真实操作步骤 / 页面 FAQ
        desc, steps, page_faq = "", [], []
        tpath = os.path.join(os.path.dirname(path), slug)
        try:
            th = open(tpath, encoding="utf-8").read()
            m = re.search(r'<meta name="description" content="(.*?)"', th, re.S)
            if m:
                desc = re.sub(r"\s+", " ", m.group(1)).strip()
            # 该工具页「使用教程」里的真实步骤（工具专属，各不相同）
            m = re.search(r'使用教程</div>\s*<ol[^>]*>(.*?)</ol>', th, re.S)
            if m:
                steps = [re.sub(r"<[^>]+>", "", x).strip()
                         for x in re.findall(r"<li[^>]*>(.*?)</li>", m.group(1), re.S)]
                steps = [s for s in steps if s][:6]
            # 该工具页「常见问题」里的 Q/A（工具专属）
            m = re.search(r'常见问题</div>(.*?)</section>', th, re.S)
            if m:
                qs = re.findall(r'>Q\d*[：:]\s*(.*?)</div>\s*<div[^>]*>A[：:]\s*(.*?)</div>',
                                m.group(1), re.S)
                page_faq = [(re.sub(r"<[^>]+>", "", q).strip(),
                             re.sub(r"<[^>]+>", "", a).strip()) for q, a in qs]
        except Exception:
            pass
        out.append({"slug": slug, "name": name.strip(), "desc": desc,
                    "steps": steps, "page_faq": page_faq,
                    "cat": detect_category(slug, name)})
    return out


def pick_diverse(tools, max_n):
    # 按分类分组，轮询选取，保证覆盖多分类
    by_cat = {}
    for t in tools:
        by_cat.setdefault(t["cat"], []).append(t)
    order = list(by_cat.keys())
    picked, idx = [], {c: 0 for c in order}
    while len(picked) < max_n:
        progressed = False
        for c in order:
            if len(picked) >= max_n:
                break
            if idx[c] < len(by_cat[c]):
                picked.append(by_cat[c][idx[c]])
                idx[c] += 1
                progressed = True
        if not progressed:
            break
    return picked


# ---------------- 差异化变体池（按 slug 哈希确定性抽取，重跑结果稳定） ----------------
TITLE_VARIANTS = [
    "{name}使用教程：从打开到出结果的完整指南",
    "{name}怎么用？手把手图文教程",
    "免费在线{name}使用攻略与常见问题",
    "{name}在线工具入门教程（免安装）",
    "3 分钟学会{name}：步骤、技巧与 FAQ",
    "{name}详细使用方法与实用技巧",
    "新手必看：{name}完整操作流程",
    "{name}免费在线版怎么用？一文讲清",
]
EXCERPT_VARIANTS = [
    "{name}怎么用？本文详解操作步骤、适用场景与常见问题，帮你快速上手这款免费在线工具。",
    "一篇讲清{name}的用法：功能亮点、详细步骤、实用技巧与 FAQ，免安装在线使用。",
    "手把手教你用{name}：打开网页即用、本地处理不上传，附常见问题解答。",
    "{name}入门指南：适合谁用、怎么操作、要注意什么，3 分钟看完就会。",
    "免费{name}在线版使用攻略：完整步骤 + 避坑技巧 + 高频问题解答。",
    "还不会用{name}？这篇教程覆盖操作流程、使用场景和注意事项。",
]
INTRO_OPENERS = [
    "{name}是 72在线工具箱提供的一款免费在线{cx}工具，打开网页即可使用，无需下载安装。",
    "想找一款免安装的{cx}小工具？{name}直接在浏览器里就能完成任务。",
    "在日常{cx}场景里，{name}是一个轻量高效的选择——网页打开即用，不用注册登录。",
    "{name}主打「即开即用」：不装软件、不填注册表单，浏览器里直接完成{cx}相关操作。",
    "如果你经常需要处理{cx}相关的小任务，{name}值得放进书签栏。",
    "很多人以为{cx}必须装专业软件，其实用{name}在网页里就能搞定。",
]
INTRO_PRIVACY = [
    "所有处理均在浏览器本地完成，数据不会上传到服务器，隐私更有保障。",
    "它的处理逻辑跑在你自己的浏览器里，文件和内容不出本机，不用担心泄露。",
    "由于运算在本地进行，敏感内容也可以放心处理，不存在上传环节。",
    "整个过程无需联网传输文件——浏览器本地计算，用完即走。",
]
INTRO_DEVICE = [
    "电脑、平板、手机浏览器都能直接打开，随时随地使用。",
    "无论 Windows、Mac 还是手机浏览器，打开链接就能用，体验一致。",
    "跨平台可用：办公室用电脑、路上用手机，同一个网址随开随用。",
]
STEPS_LEAD = [
    "具体操作很简单，按下面的步骤走一遍就会了：",
    "整个流程只需几步：",
    "参考以下步骤即可完成操作：",
    "第一次使用可以按这个顺序来：",
]
GENERIC_STEPS = [
    ["打开「{name}」工具页面，等待界面加载完成。",
     "在输入区填入待处理的内容或选择文件/参数。",
     "点击主操作按钮，浏览器会在本地完成处理。",
     "在结果区查看输出，按需复制、下载或继续调整参数重试。"],
    ["进入「{name}」页面（免登录，直接可用）。",
     "按页面提示填写或粘贴需要处理的内容。",
     "确认参数无误后点击执行，稍等片刻即可出结果。",
     "对结果不满意可调整选项重新生成，满意后复制或导出。"],
    ["在浏览器地址栏输入 72tool.com，找到并打开「{name}」。",
     "根据界面提示提供输入内容（文本、文件或数值参数）。",
     "点击处理按钮，本地即时计算，无需等待上传。",
     "查看并保存结果；需要批量处理时重复以上步骤即可。"],
]
SUMMARY_VARIANTS = [
    "总的来说，{name}胜在轻量、免费、即开即用，适合不想安装软件的场景。如果它正好覆盖你的需求，把页面加入书签，下次直接打开就能用。",
    "以上就是{name}的完整用法。相比安装桌面软件，网页版的优势是零门槛、跨设备、本地处理保隐私——日常轻量需求用它足够了。",
    "掌握上面的步骤后，{name}基本可以做到「秒上手」。72在线工具箱还有几百款同类免费工具，遇到别的需求也可以先来这里找找。",
    "{name}解决的是高频小需求：不值得为它装软件，但网页一开就能搞定。有更复杂的需求时，可以搭配站内其他工具组合使用。",
    "简单总结：打开页面、填入内容、一键处理、拿走结果——这就是{name}的全部使用成本。免费且无广告干扰，欢迎长期使用。",
]
SEC_TITLE_VARIANTS = {
    "highlights": ["功能亮点", "这款工具的优势", "为什么选它", "核心特点"],
    "scenarios": ["适用场景", "什么时候会用到", "典型使用场景", "谁适合用"],
    "steps": ["使用步骤", "操作教程", "详细使用方法", "上手流程"],
    "tips": ["实用技巧", "使用建议", "进阶技巧与注意事项", "避坑指南"],
    "faq": ["常见问题", "高频疑问解答", "FAQ", "你可能想问"],
    "summary": ["小结", "写在最后", "总结", "结语"],
}


def _rng(slug):
    seed = int(hashlib.md5(slug.encode("utf-8")).hexdigest()[:8], 16)
    return random.Random(seed)


def template_article(tool):
    cat = CATEGORIES.get(tool["cat"], DEFAULT_CAT)
    name = tool["name"]
    rng = _rng(tool["slug"])
    cat_label = cat["label"]
    cx = cat_label[:-2] if cat_label.endswith("工具") else cat_label

    title = rng.choice(TITLE_VARIANTS).format(name=name)
    excerpt = rng.choice(EXCERPT_VARIANTS).format(name=name)

    # intro：开场 + （工具自身 description 摘句）+ 隐私 + 设备，四段拼接各自抽变体
    intro_parts = [rng.choice(INTRO_OPENERS).format(name=name, cx=cx)]
    desc = tool.get("desc", "")
    if desc:
        # 摘 description 里带信息量的一句（去掉与开场重复的通用话术）
        sent = re.split(r"[。；;]", desc)
        picked_sent = ""
        for s in sent:
            s = s.strip()
            if len(s) >= 10 and "免费" not in s and "无需下载" not in s and name[:4] not in s:
                picked_sent = s
                break
        if picked_sent:
            intro_parts.append(picked_sent + "。")
    intro_parts.append(rng.choice(INTRO_PRIVACY))
    intro_parts.append(rng.choice(INTRO_DEVICE))
    intro = "".join(intro_parts)

    # steps：优先用工具页抽到的真实步骤（工具专属），否则用通用步骤变体
    page_steps = tool.get("steps") or []
    if len(page_steps) >= 3:
        steps = [f"打开「{name}」工具页面（72tool.com 站内搜索或从全部工具进入）。"] + page_steps
    else:
        steps = [s.format(name=name) for s in rng.choice(GENERIC_STEPS)]
    steps.insert(0, "__LEAD__" + rng.choice(STEPS_LEAD))

    # highlights / scenarios / tips：打乱顺序 + 抽取子集，且工具页 desc 可补一条
    highlights = list(cat["highlights"])
    rng.shuffle(highlights)
    scenarios = list(cat["scenarios"])
    rng.shuffle(scenarios)
    tips = list(cat["tips"])
    rng.shuffle(tips)

    # faq：优先混入工具页自己的 FAQ，再补分类 FAQ，去重后抽 4-5 条
    faq_pool = list(tool.get("page_faq") or [])
    seen_q = {q for q, _ in faq_pool}
    for q, a in cat["faq"]:
        if q not in seen_q:
            faq_pool.append((q, a))
            seen_q.add(q)
    rng.shuffle(faq_pool)
    faq = faq_pool[:rng.choice([4, 5])]

    return {
        "title": title,
        "excerpt": excerpt,
        "cat": cat_label,
        "intro": intro,
        "highlights": highlights,
        "scenarios": scenarios,
        "steps": steps,
        "tips": tips,
        "faq": faq,
        "tags": [name, cat_label, "在线工具", "教程"],
        "summary": rng.choice(SUMMARY_VARIANTS).format(name=name),
        "sec_titles": {k: rng.choice(v) for k, v in SEC_TITLE_VARIANTS.items()},
        # 段落顺序变体：steps 固定第三、faq 固定最后，前两节与 tips 位置轮换
        "sec_order": rng.choice([
            ["highlights", "scenarios", "steps", "tips", "faq"],
            ["scenarios", "highlights", "steps", "tips", "faq"],
            ["highlights", "steps", "scenarios", "tips", "faq"],
            ["scenarios", "steps", "highlights", "tips", "faq"],
        ]),
    }


def call_api_article(tool):
    if not CFG["api_key"] or not CFG["api_base"]:
        log("未配置 api_key/api_base，回退到模板生成。")
        return None
    cat = CATEGORIES.get(tool["cat"], DEFAULT_CAT)
    sys_p = ("你是专业的中文 SEO 内容写手。为在线工具写一篇原创、自然、与工具强相关的教程文章，"
             "禁止模板腔和重复套话，每节内容都要针对该工具具体展开，自然融入长尾关键词。")
    user_p = (f"请为在线工具「{tool['name']}」（分类：{cat['label']}）写一篇教程文章，"
              f"以 JSON 返回，字段：title(含『使用教程』), excerpt(<=60字), intro(2-3句), "
              f"highlights(数组,3条功能亮点), scenarios(数组,3条适用场景), steps(数组,4条操作步骤), "
              f"tips(数组,3条实用技巧), faq(数组,每项{{q,a}},4-5条), tags(数组)。"
              f"工具简介参考：{tool['desc']}。只返回 JSON，不要解释。")
    body = json.dumps({
        "model": CFG["model"],
        "messages": [
            {"role": "system", "content": sys_p},
            {"role": "user", "content": user_p},
        ],
        "temperature": 0.8,
        "response_format": {"type": "json_object"},
    }, ensure_ascii=False)
    url = CFG["api_base"].rstrip("/") + "/chat/completions"
    req = urllib.request.Request(url, data=body.encode("utf-8"),
                                 headers={"Content-Type": "application/json",
                                           "Authorization": "Bearer " + CFG["api_key"]},
                                 method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            data = json.loads(r.read().decode("utf-8", "ignore"))
        content = data["choices"][0]["message"]["content"]
        art = json.loads(content)
        art["cat"] = cat["label"]
        # 补全缺省字段
        for k in ["highlights", "scenarios", "steps", "tips", "faq", "tags"]:
            art.setdefault(k, [])
        # FAQ 归一化：API 返回 {q,a}/{question,answer} 字典 → 统一转 (q, a) 元组
        norm_faq = []
        for item in art["faq"]:
            if isinstance(item, dict):
                q = item.get("q") or item.get("question") or item.get("Q") or ""
                a = item.get("a") or item.get("answer") or item.get("A") or ""
                if q and a:
                    norm_faq.append((str(q), str(a)))
            elif isinstance(item, (list, tuple)) and len(item) == 2:
                norm_faq.append((str(item[0]), str(item[1])))
        art["faq"] = norm_faq
        # 各列表字段元素统一转字符串，防 API 返回嵌套对象
        for k in ["highlights", "scenarios", "steps", "tips", "tags"]:
            art[k] = [x if isinstance(x, str) else str(x) for x in art[k]]
        art.setdefault("intro", tool["desc"])
        art.setdefault("excerpt", tool["name"] + "使用教程。")
        art.setdefault("title", tool["name"] + "使用教程 - 72在线工具箱")
        return art
    except Exception as e:
        log(f"API 生成失败（{tool['name']}）：{e}，回退模板。")
        return None


def gen_article(tool):
    if CFG["mode"] == "api":
        art = call_api_article(tool)
        if art:
            return art
    return template_article(tool)


def esc(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def render_article(tool, art):
    slug = tool["slug"]
    tool_url = CFG["site"] + "/" + slug
    blog_url = CFG["site"] + "/blog/" + slug
    date_fmt = TODAY
    faq_json = json.dumps({
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": [{"@type": "Question", "name": q,
                        "acceptedAnswer": {"@type": "Answer", "text": a}}
                       for q, a in art.get("faq", [])]
    }, ensure_ascii=False)
    blogposting_json = json.dumps({
        "@context": "https://schema.org", "@type": "BlogPosting",
        "headline": art["title"], "description": art["excerpt"],
        "datePublished": date_fmt, "dateModified": date_fmt,
        "author": {"@type": "Organization", "name": "72在线工具箱"},
        "publisher": {"@type": "Organization", "name": "72在线工具箱"},
        "mainEntityOfPage": blog_url,
    }, ensure_ascii=False)

    def lis(items):
        return "\n".join(f"      <li>{esc(x)}</li>" for x in items)

    def faq_html(items):
        return "\n".join(
            f'      <div style="font-weight:600;color:#111;font-size:14px;margin-top:14px;">Q：{esc(q)}</div>\n'
            f'      <div style="color:#4b5563;font-size:14px;line-height:1.8;margin-top:4px;">A：{esc(a)}</div>'
            for q, a in items)

    # 小节标题与顺序（api/旧数据无 sec_titles/sec_order 时用默认值）
    st = art.get("sec_titles") or {}
    def sec_t(key, default):
        return st.get(key, default)
    order = art.get("sec_order") or ["highlights", "scenarios", "steps", "tips", "faq"]

    # steps 里第一个元素可能是引导语（__LEAD__ 前缀）
    steps_items = list(art["steps"])
    steps_lead = ""
    if steps_items and str(steps_items[0]).startswith("__LEAD__"):
        steps_lead = f'  <p style="color:#374151;font-size:14px;margin-bottom:10px;">{esc(steps_items[0][8:])}</p>\n'
        steps_items = steps_items[1:]

    def build_section(key):
        if key == "highlights":
            return (f'<section class="sec">\n  <h2>{esc(sec_t("highlights", "功能亮点"))}</h2>\n  <ul>\n'
                    f'{lis(art["highlights"])}\n  </ul>\n</section>')
        if key == "scenarios":
            return (f'<section class="sec">\n  <h2>{esc(sec_t("scenarios", "适用场景"))}</h2>\n  <ul>\n'
                    f'{lis(art["scenarios"])}\n  </ul>\n</section>')
        if key == "steps":
            return (f'<section class="sec">\n  <h2>{esc(sec_t("steps", "使用步骤"))}</h2>\n'
                    f'{steps_lead}  <ol>\n{lis(steps_items)}\n  </ol>\n</section>')
        if key == "tips":
            return (f'<section class="sec">\n  <h2>{esc(sec_t("tips", "实用技巧"))}</h2>\n  <ul>\n'
                    f'{lis(art["tips"])}\n  </ul>\n</section>')
        if key == "faq":
            return (f'<section class="sec">\n  <h2>{esc(sec_t("faq", "常见问题"))}</h2>\n'
                    f'{faq_html(art["faq"])}\n</section>')
        return ""

    sections_html = "\n\n".join(build_section(k) for k in order)
    summary_html = ""
    if art.get("summary"):
        summary_html = (f'\n<section class="sec">\n  <h2>{esc(sec_t("summary", "小结"))}</h2>\n'
                        f'  <p style="color:#374151;font-size:14px;line-height:1.9;margin:0;">{esc(art["summary"])}</p>\n</section>\n')

    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{esc(art['title'])} - 72在线工具箱</title>
<meta name="description" content="{esc(art['excerpt'])}">
<link rel="canonical" href="{blog_url}">
<meta property="og:type" content="article">
<meta property="og:title" content="{esc(art['title'])}">
<meta property="og:description" content="{esc(art['excerpt'])}">
<meta property="og:url" content="{blog_url}">
<meta property="og:site_name" content="72在线工具箱">
<meta name="twitter:card" content="summary">
<script type="application/ld+json">
{blogposting_json}
</script>
<script type="application/ld+json">
{faq_json}
</script>
<style>
*{{box-sizing:border-box;margin:0;padding:0;font-family:system-ui,-apple-system,"Microsoft YaHei",sans-serif}}
body{{max-width:820px;margin:0 auto;padding:30px 20px 60px;color:#1f2937;background:#f7f8fa}}
.back{{display:inline-block;margin:6px 0 18px;color:#2478f5;text-decoration:none;font-size:15px}}
.cat-tag{{display:inline-block;padding:3px 10px;background:#e8f0ff;color:#2478f5;border-radius:12px;font-size:12px;margin-bottom:10px}}
.date{{color:#9ca3af;font-size:13px;margin-left:8px}}
h1{{font-size:26px;margin:6px 0 14px;line-height:1.3}}
.intro{{color:#374151;font-size:15px;line-height:1.9;background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:18px;margin:16px 0 24px}}
.sec{{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:18px 20px;margin:16px 0}}
.sec h2{{font-size:18px;margin-bottom:12px;color:#111}}
.sec ul,.sec ol{{margin:0;padding-left:22px;color:#374151;font-size:14px;line-height:1.9}}
.sec li{{margin:6px 0}}
.cta{{margin:22px 0;padding:16px 18px;background:#eef4ff;border:1px solid #d6e4ff;border-radius:10px;font-size:14px;color:#1f2937}}
.cta a{{color:#2478f5;font-weight:600;text-decoration:none}}
footer{{margin-top:50px;padding:24px 10px;text-align:center;border-top:1px solid #e5e7eb;color:#666;font-size:14px}}
footer a{{margin:0 10px;color:#444;text-decoration:none}}
</style>
</head>
<body>
<a class="back" href="index.html">← 返回博客首页</a>
<span class="cat-tag">{esc(art['cat'])}</span><span class="date">{date_fmt}</span>
<h1>{esc(art['title'])}</h1>
<p class="intro">{esc(art['intro'])}</p>

{sections_html}
{summary_html}
<div class="cta">想直接上手？打开 <a href="{tool_url}">{esc(tool['name'])}</a> 立即免费使用，浏览器本地处理、数据不上传。</div>

<footer>
  <a href="index.html">博客首页</a> | <a href="../index.html">工具箱首页</a> | <a href="../tools.html">全部工具</a> | <a href="../about.html">关于我们</a>
  <div style="margin-top:8px;">© 2026 72在线工具箱 72tool.com 保留所有权利</div>
</footer>
<script defer src="../autopush.js"></script>
</body>
</html>"""
    return html


def render_index(articles_meta):
    # articles_meta: list of {slug, name, title, excerpt, cat, date}
    cards = "\n".join(
        f'      <a class="card" href="{m["slug"]}">\n'
        f'        <div class="cat">{esc(m["cat"])}</div>\n'
        f'        <div class="t">{esc(m.get("title") or (m["name"] + "使用教程"))}</div>\n'
        f'        <div class="e">{esc(m["excerpt"])}</div>\n'
        f'        <div class="d">{esc(m["date"])}</div>\n'
        f'      </a>' for m in articles_meta)
    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>工具教程博客 | 72在线工具箱</title>
<meta name="description" content="72在线工具箱教程博客：每款工具的使用教程、适用场景、操作步骤与常见问题，帮你快速上手免费在线工具。">
<link rel="canonical" href="{CFG['site']}/blog/index.html">
<meta property="og:type" content="website">
<meta property="og:title" content="工具教程博客 | 72在线工具箱">
<meta property="og:description" content="72在线工具箱教程博客：每款工具的使用教程、适用场景与常见问题。">
<meta property="og:url" content="{CFG['site']}/blog/index.html">
<meta property="og:site_name" content="72在线工具箱">
<style>
*{{box-sizing:border-box;margin:0;padding:0;font-family:system-ui,-apple-system,"Microsoft YaHei",sans-serif}}
body{{max-width:1100px;margin:0 auto;padding:30px 20px 60px;color:#1f2937;background:#f7f8fa}}
.back{{display:inline-block;margin:6px 0 18px;color:#2478f5;text-decoration:none;font-size:15px}}
h1{{font-size:24px;margin-bottom:8px}}
.intro{{color:#6b7280;font-size:14px;margin-bottom:20px;line-height:1.7}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}}
.card{{display:block;padding:16px 18px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;color:#222;text-decoration:none;transition:.15s}}
.card:hover{{border-color:#2478f5;box-shadow:0 1px 4px rgba(36,120,245,.15)}}
.cat{{display:inline-block;padding:2px 9px;background:#e8f0ff;color:#2478f5;border-radius:12px;font-size:12px;margin-bottom:8px}}
.t{{font-size:16px;font-weight:600;margin-bottom:6px}}
.e{{color:#6b7280;font-size:13px;line-height:1.6;margin-bottom:8px}}
.d{{color:#9ca3af;font-size:12px}}
footer{{margin-top:50px;padding:24px 10px;text-align:center;border-top:1px solid #e5e7eb;color:#666;font-size:14px}}
footer a{{margin:0 10px;color:#444;text-decoration:none}}
</style>
</head>
<body>
<a class="back" href="../index.html">← 返回工具箱首页</a>
<h1>工具教程博客</h1>
<p class="intro">72在线工具箱每款工具的使用教程：功能亮点、适用场景、操作步骤与常见问题，帮你快速上手。</p>
<div class="grid">
{cards}
</div>
<footer>
  <a href="../index.html">工具箱首页</a> | <a href="../tools.html">全部工具</a> | <a href="../about.html">关于我们</a>
  <div style="margin-top:8px;">© 2026 72在线工具箱 72tool.com 保留所有权利</div>
</footer>
<script defer src="../autopush.js"></script>
</body>
</html>"""
    return html


def update_sitemap(blog_urls):
    sp = os.path.join(os.path.dirname(CFG["tools_html"]), "sitemap.xml")
    try:
        data = open(sp, encoding="utf-8").read()
    except Exception as e:
        log(f"读取 sitemap 失败: {e}")
        return
    existing = set(re.findall(r"<loc>(.*?)</loc>", data))
    new_urls = [u for u in blog_urls if u not in existing]
    if not new_urls:
        log("sitemap 中博客 URL 已存在，跳过。")
        return
    insert = "\n".join(f"  <url>\n    <loc>{u}</loc>\n  </url>" for u in new_urls)
    if "</urlset>" in data:
        data = data.replace("</urlset>", insert + "\n</urlset>")
    else:
        data = data.rstrip() + "\n" + insert + "\n</urlset>\n"
    open(sp, "w", encoding="utf-8").write(data)
    log(f"sitemap.xml 新增 {len(new_urls)} 条博客 URL。")


def main():
    log("=== 72tool 博客生成开始 ===")
    if not CFG["enabled"]:
        log("blog 未启用（config.ini [blog] enabled=False），结束。")
        return
    tools = parse_tools(CFG["tools_html"])
    log(f"从 tools.html 解析到 {len(tools)} 个工具")
    if not tools:
        return
    max_n = CFG["max_articles"] if CFG["max_articles"] and CFG["max_articles"] > 0 else len(tools)
    picked = pick_diverse(tools, max_n)
    log(f"本次计划生成 {len(picked)} 篇（mode={CFG['mode']}）" + (" [dry-run]" if _dry else ""))
    blog_dir = CFG["blog_dir"]
    if not _dry:
        os.makedirs(blog_dir, exist_ok=True)
    metas = []
    blog_urls = []
    api_fail = 0
    # api 模式用线程池并发生成（6 并发），template 模式无 IO 直接串行
    if CFG["mode"] == "api" and not _dry:
        with ThreadPoolExecutor(max_workers=6) as ex:
            arts = list(ex.map(gen_article, picked))
    else:
        arts = [gen_article(t) for t in picked]
    for i, (t, art) in enumerate(zip(picked, arts), 1):
        slug = t["slug"]
        if CFG["mode"] == "api" and art.get("sec_titles") is not None:
            api_fail += 1  # sec_titles 只有模板生成才有 → 说明该篇回退了模板
        if _dry:
            log(f"[预览] {slug} -> {art['title']}")
            continue
        if i % 20 == 0 or i == len(picked):
            log(f"进度 {i}/{len(picked)}：{slug} -> {art['title'][:30]}")
        html = render_article(t, art)
        with open(os.path.join(blog_dir, slug), "w", encoding="utf-8") as f:
            f.write(html)
        metas.append({"slug": slug, "name": t["name"], "title": art["title"],
                      "excerpt": art["excerpt"], "cat": art["cat"], "date": TODAY})
        blog_urls.append(CFG["site"] + "/blog/" + slug)
    if _dry:
        log("=== dry-run 完成（未写文件）===")
        return
    # 博客首页
    with open(os.path.join(blog_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(render_index(metas))
    log(f"已生成博客首页 + {len(metas)} 篇文章到 {blog_dir}")
    if CFG["mode"] == "api":
        log(f"API 模式统计：AI 生成 {len(metas) - api_fail} 篇，回退模板 {api_fail} 篇")
    if CFG["update_sitemap"]:
        update_sitemap(blog_urls)
    log("=== 完成 ===")
    log("下一步：在站点仓库根目录 git add -A && git commit && git push，Cloudflare 会自动部署。")


if __name__ == "__main__":
    main()
