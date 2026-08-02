# -*- coding: utf-8 -*-
"""
daily_ingest.py —— 72tool.com 每日「引流内容」采集器

每天从 GitHub 拉取最新入库的 工具 / 主题模板 / 开源源码 各 1-2 个，
写入站点数据文件（tools-data.js / home-render.js 内的 THEME_DATA / SOURCE_DATA）。
写入后：
  - 站点「博客页」的引流帖 + 教程 会在运行时自动为新对象生成（无需额外处理）
  - 重建 sitemap（build-sitemap.cjs）
  - git 提交并推送（Cloudflare 自动部署）
  - 向谷歌（及可选 Bing）发送 sitemap ping

幂等：用 ingest_state.json 记录已采集的 GitHub full_name，避免重复写入。

用法：
  python daily_ingest.py            # 默认空跑（不写文件 / 不推送 / 不 ping），仅打印计划
  python daily_ingest.py --commit   # 真正写入、重建 sitemap、推送、ping 谷歌
  python daily_ingest.py --now      # 忽略时刻表（同 --commit）
"""
import sys, os, re, json, datetime, subprocess, urllib.request, urllib.error, urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
SITE_DIR = os.path.dirname(os.path.dirname(HERE))       # 仓库根 = 站点根（scripts → .github → 站点根）
STATE_PATH = os.path.join(HERE, "ingest_state.json")

# ---------------- 配置（改这里无需动逻辑）----------------
SITE = "https://72tool.com"
GH_API = "https://api.github.com/search/repositories"
GH_TOKEN = os.environ.get("GH_INGEST_TOKEN", "")      # 可选：填了提限速到 5000/h
PER_DAY = {"tool": 1, "theme": 1, "source": 1}        # 每类每日新增上限
PING_BING = False

# 三类数据源：GitHub 搜索查询 + 目标写入文件 + 注入的数据数组标识
SOURCES = {
    "tool": {
        "q": "topic:tools",
        "file": "tools-data.js",
        "marker": "window.TOOLS_DATA = [",
        "subCate": None,
    },
    "theme": {
        "q": "topic:hugo-theme",
        "file": "home-render.js",
        "marker": "const THEME_DATA = [",
        "subCate": ["blog"],
    },
    "source": {
        "q": "topic:open-source",
        "file": "home-render.js",
        "marker": "const SOURCE_DATA = [",
        "subCate": ["blogsrc"],
    },
}

COMMIT = "--commit" in sys.argv or "--now" in sys.argv
DRYRUN = not COMMIT


def log(msg):
    print(f"[{datetime.datetime.now().strftime('%H:%M:%S')}] {msg}")


def load_state():
    if os.path.exists(STATE_PATH):
        try:
            return json.load(open(STATE_PATH, encoding="utf-8"))
        except Exception:
            pass
    return {"tool": [], "theme": [], "source": []}


def save_state(st):
    json.dump(st, open(STATE_PATH, "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)


def gh_fetch(q, per_page=20):
    url = (GH_API + "?q=" + urllib.parse.quote(q) +
           "&sort=created&order=desc&per_page=" + str(per_page))
    req = urllib.request.Request(url, headers={
        "User-Agent": "72tool-daily-ingest",
        "Accept": "application/vnd.github+json",
    })
    if GH_TOKEN:
        req.add_header("Authorization", "Bearer " + GH_TOKEN)
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode("utf-8"))


def esc_js(s):
    return (str(s).replace("\\", "\\\\").replace("'", "\\'")
            .replace('"', '\\"').replace("\n", " ").replace("\r", " "))


def next_idx_in_file(path, marker):
    """取该数据数组当前最大 idx + 1（THEME/SOURCE 用；TOOLS 无 idx）。"""
    try:
        txt = open(path, encoding="utf-8").read()
    except Exception:
        return 0
    block = txt[txt.find(marker):]
    idxs = re.findall(r"idx\s*:\s*(\d+)", block[:block.find("\n];")])
    return (max(int(i) for i in idxs) + 1) if idxs else 0


def existing_identifiers(kind):
    """目标数据文件里已存在的标识（repo full_name 或 tool slug），用于防重复。"""
    cfg = SOURCES[kind]
    fpath = os.path.join(SITE_DIR, cfg["file"])
    try:
        txt = open(fpath, encoding="utf-8").read()
    except Exception:
        return set()
    if kind == "tool":
        return set(re.findall(r'"slug":\s*"([^"]+)"', txt))
    return set(re.findall(r"repo:\s*'([^']+)'", txt))


def build_items(kind, items, state):
    """把 GitHub repo 列表映射成本站数据对象，跳过已采集 / 已存在的。
    返回 (full_name, js_obj_str, meta) —— meta 用于后续生成静态 profile 页。"""
    out = []
    known = set(state.get(kind, []))
    have = existing_identifiers(kind)
    for it in items:
        full = it.get("full_name", "")
        if full in known or full in have:
            continue
        name = it.get("name", full)
        desc = (it.get("description") or "").strip() or name
        homepage = it.get("homepage") or ""
        html_url = it.get("html_url", "")
        lang = it.get("language") or ""
        if kind == "tool":
            slug = full.replace("/", "-")
            obj = (' { "slug": "%s", "zh": "%s", "en": "%s", '
                   '"cat": "util", "type": "%s", "type_cn": "实用工具" }' % (
                       esc_js(slug), esc_js(name), esc_js(name),
                       esc_js(lang or "Tool")))
            meta = {"slug": slug, "name": name, "desc": desc,
                    "html_url": html_url, "preview": homepage or "#",
                    "download": html_url, "idx": None}
        else:  # theme / source
            idx = next_idx_in_file(
                os.path.join(SITE_DIR, SOURCES[kind]["file"]),
                SOURCES[kind]["marker"])
            if kind == "theme":
                obj = ('    {idx:%d, subCate:%s, zh:\'%s\', en:\'%s\', '
                       'desc_zh:\'%s\', desc_en:\'%s\', previewUrl:\'%s\', '
                       'downloadUrl:\'%s\', repo:\'%s\'}' % (
                           idx, json.dumps(SOURCES[kind]["subCate"]),
                           esc_js(name), esc_js(name),
                           esc_js(desc), esc_js(desc),
                           esc_js(homepage or "#"), esc_js(html_url),
                           esc_js(full)))
            else:  # source
                obj = ('    {idx:%d, subCate:%s, zh:\'%s\', en:\'%s\', '
                       'desc_zh:\'%s\', desc_en:\'%s\', previewUrl:\'#\', '
                       'downloadUrl:\'%s\', repo:\'%s\'}' % (
                           idx, json.dumps(SOURCES[kind]["subCate"]),
                           esc_js(name), esc_js(name),
                           esc_js(desc), esc_js(desc),
                           esc_js(html_url), esc_js(full)))
            meta = {"slug": None, "idx": idx, "name": name, "desc": desc,
                    "html_url": html_url, "preview": homepage or "#",
                    "download": html_url}
        out.append((full, obj, meta))
    return out


def _esc_xml(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;")
            .replace(">", "&gt;").replace('"', "&quot;"))


_PROFILE_CSS = (
    "*{box-sizing:border-box;margin:0;padding:0;font-family:'Microsoft Yahei',sans-serif}"
    "body{max-width:880px;margin:40px auto;padding:0 20px;color:#1f2328;line-height:1.7}"
    ".back{display:block;margin:18px 0;color:#2478f5;text-decoration:none;font-size:15px}"
    ".card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:30px 34px;box-shadow:0 1px 3px rgba(0,0,0,.04)}"
    ".badge{display:inline-block;padding:3px 12px;border-radius:999px;font-size:12px;font-weight:700;color:#fff;background:#6366f1;margin-bottom:12px}"
    "h1{font-size:30px;line-height:1.25;margin-bottom:14px}"
    ".desc{font-size:16px;color:#374151;margin:14px 0 22px}"
    ".cta-wrap{display:flex;gap:12px;flex-wrap:wrap;margin-top:18px}"
    ".cta{display:inline-block;padding:12px 22px;border-radius:10px;background:#6366f1;color:#fff;font-weight:700;text-decoration:none;font-size:15px}"
    ".cta.alt{background:#fff;color:#2478f5;border:1px solid #2478f5}"
    "footer{margin-top:30px;padding-top:18px;border-top:1px solid #e5e7eb;color:#8b949e;font-size:12px}"
)


def render_profile(lang, kind, meta, ctas):
    """ctas: list of (label_zh, label_en, url)"""
    t = (lang == "zh")
    if kind == "tool":
        kind_zh, kind_en = "免费在线工具", "Free Online Tool"
        fname = meta["slug"] + ".html"
    elif kind == "theme":
        kind_zh, kind_en = "开源主题模板", "Open-source Theme"
        fname = "theme-%d.html" % meta["idx"]
    else:
        kind_zh, kind_en = "开源项目", "Open-source Project"
        fname = "source-%d.html" % meta["idx"]
    name = meta["name"]
    desc = meta["desc"]
    title = (name + " | 72Tool " + kind_zh) if t else (name + " | 72Tool " + kind_en)
    base = "https://72tool.com/"
    canon_zh = base + fname
    canon_en = base + "en/" + fname
    cta_html = "".join(
        '<a class="cta%s" href="%s" target="_blank" rel="noopener">%s</a>' % (
            ("" if i == 0 else " alt"), _esc_xml(u),
            _esc_xml((lz if t else le)))
        for i, (lz, le, u) in enumerate(ctas))
    return ('<!DOCTYPE html><html lang="%s"><head>'
            '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            '<title>%s</title>'
            '<meta name="description" content="%s">'
            '<link rel="canonical" href="%s">'
            '<link rel="alternate" hreflang="zh-Hans" href="%s">'
            '<link rel="alternate" hreflang="en" href="%s">'
            '<link rel="alternate" hreflang="x-default" href="%s">'
            '<meta property="og:type" content="website">'
            '<meta property="og:title" content="%s">'
            '<meta property="og:description" content="%s">'
            '<style>%s</style></head><body>'
            '<a class="back" href="%s">%s</a>'
            '<div class="card">'
            '<span class="badge">%s</span>'
            '<h1>%s</h1>'
            '<p class="desc">%s</p>'
            '<div class="cta-wrap">%s</div>'
            '</div>'
            '<footer>© 2026 72Tool · %s</footer>'
            '</body></html>') % (
        ("zh" if t else "en"),
        _esc_xml(title), _esc_xml(desc),
        _esc_xml(canon_zh), _esc_xml(canon_zh), _esc_xml(canon_en), _esc_xml(canon_en),
        _esc_xml(title), _esc_xml(desc),
        _PROFILE_CSS,
        ("/" if t else "/en/"), (("返回首页") if t else ("Back to Home")),
        (_esc_xml(kind_zh) if t else _esc_xml(kind_en)),
        _esc_xml(name), _esc_xml(desc), cta_html,
        (("内容由 72Tool 整理，详情以官方仓库为准") if t else ("Curated by 72Tool; see the official repo for details)")))


def write_profile_page(kind, meta):
    """为新增条目生成静态 profile 页（root + en），使 URL 真实可抓取。"""
    if kind == "tool":
        fname = meta["slug"] + ".html"
        ctas = [("在 GitHub 查看", "View on GitHub", meta["html_url"])]
    elif kind == "theme":
        fname = "theme-%d.html" % meta["idx"]
        demo = meta["preview"] if meta["preview"] != "#" else meta["download"]
        ctas = [("查看在线演示", "Live Demo", demo),
                ("获取主题源码", "Get Source", meta["download"])]
    else:  # source
        fname = "source-%d.html" % meta["idx"]
        ctas = [("前往 GitHub", "View on GitHub", meta["download"])]
    for lang, sub in (("zh", ""), ("en", "en/")):
        page = render_profile(lang, kind, meta, ctas)
        out_dir = os.path.join(SITE_DIR, sub) if sub else SITE_DIR
        if not os.path.isdir(out_dir):
            os.makedirs(out_dir, exist_ok=True)
        open(os.path.join(out_dir, fname), "w", encoding="utf-8").write(page)
    log("[%s] 生成静态页 %s (+ en/%s)" % (kind, fname, fname))


def append_to_array(path, marker, new_objs):
    """在 marker 对应的数组 `];` 前插入新对象（非贪婪匹配到首个列0 `];`）。"""
    txt = open(path, encoding="utf-8").read()
    start = txt.find(marker)
    if start < 0:
        raise RuntimeError("找不到数组标记: " + marker)
    rest = txt[start:]
    m = re.search(r"\n\];", rest)
    if not m:
        raise RuntimeError("找不到数组结束 ]")
    pos = start + m.start()
    insert = ",\n" + "\n".join(new_objs)
    return txt[:pos] + insert + txt[pos:]


def git(*args):
    return subprocess.run(["git", "-C", SITE_DIR] + list(args),
                          capture_output=True, text=True, timeout=120)


def ping_search_engines():
    sm = SITE + "/sitemap.xml"
    targets = ["https://www.google.com/ping?sitemap=" + urllib.parse.quote(sm, safe=":/")]
    if PING_BING:
        targets.append("https://www.bing.com/ping?sitemap=" + urllib.parse.quote(sm, safe=":/"))
    for u in targets:
        try:
            req = urllib.request.Request(u, headers={"User-Agent": "72tool-daily-ingest"})
            with urllib.request.urlopen(req, timeout=20) as r:
                log("ping %s -> %s" % (u.split("?")[0], r.status))
        except Exception as e:
            log("ping 失败 %s: %s" % (u.split("?")[0], e))


def main():
    state = load_state()
    added = []
    for kind, cfg in SOURCES.items():
        try:
            data = gh_fetch(cfg["q"])
        except Exception as e:
            log("[%s] GitHub 拉取失败：%s" % (kind, e))
            continue
        repos = data.get("items", [])
        log("[%s] GitHub 返回 %d 个候选" % (kind, len(repos)))
        picked = build_items(kind, repos, state)[:PER_DAY[kind]]
        if not picked:
            log("[%s] 无新增（均已采集过）" % kind)
            continue
        fpath = os.path.join(SITE_DIR, cfg["file"])
        objs = [o for _, o, _ in picked]
        metas = [m for _, _, m in picked]
        if DRYRUN:
            log("[%s] 空跑：将写入 %d 条到 %s" % (kind, len(objs), cfg["file"]))
            for full, o, m in picked:
                log("      + %s" % full)
        else:
            new_txt = append_to_array(fpath, cfg["marker"], objs)
            open(fpath, "w", encoding="utf-8").write(new_txt)
            log("[%s] 已写入 %d 条到 %s" % (kind, len(objs), cfg["file"]))
            # 为新增条目生成静态 profile 页（root + en），让 URL 真实可抓取
            for m in metas:
                try:
                    write_profile_page(kind, m)
                except Exception as e:
                    log("[%s] 生成 profile 页失败（跳过）：%s" % (kind, e))
        for full, _, _ in picked:
            state.setdefault(kind, []).append(full)
            added.append((kind, full))

    if not added:
        log("今日无新增内容，退出。")
        if not DRYRUN:
            save_state(state)
        return

    if DRYRUN:
        log("空跑结束，未做任何写入/推送/ping。去掉 --dry 或加 --commit 执行。")
        return

    # 先把「博客页」运行时文章落地为静态页（供 sitemap 与抓取使用）
    try:
        node = os.environ.get("NODE", "node")
        r = subprocess.run([node, os.path.join(SITE_DIR, "_build", "gen-blog-pages.cjs")],
                           cwd=SITE_DIR, capture_output=True, text=True, timeout=180)
        log("博客静态页：" + (r.stdout.strip().splitlines()[-1] if r.stdout else r.stderr.strip()[:80]))
    except Exception as e:
        log("博客静态页生成失败（仍继续）：" + str(e))

    # 重建 sitemap（已包含工具/主题/源码数据驱动的 URL + 博客文章）
    try:
        node = os.environ.get("NODE", "node")
        r = subprocess.run([node, os.path.join(SITE_DIR, "_build", "build-sitemap.cjs")],
                           cwd=SITE_DIR, capture_output=True, text=True, timeout=120)
        log("sitemap 重建：" + (r.stdout.strip().splitlines()[-1] if r.stdout else r.stderr.strip()[:80]))
    except Exception as e:
        log("sitemap 重建失败（仍继续推送）：" + str(e))

    # git 提交 + 推送
    git("add", "-A")
    r = git("-c", "user.name=72tool", "-c", "user.email=bot@72tool.com",
           "commit", "-m", "ingest: daily GitHub fetch (%d items)" % len(added))
    if r.returncode != 0:
        log("git 无变更：" + (r.stdout + r.stderr).strip()[:100])
    else:
        rp = git("push")
        if rp.returncode != 0:
            log("push 被拒，尝试 pull --rebase：" + (rp.stderr or rp.stdout).strip()[:100])
            rb = git("-c", "user.name=72tool", "-c", "user.email=bot@72tool.com", "pull", "--rebase")
            if rb.returncode == 0:
                rp = git("push")
            else:
                git("rebase", "--abort")
        log("git push " + ("成功 → Cloudflare 部署" if rp.returncode == 0 else "失败（下次重试）"))

    # ping 搜索引擎
    ping_search_engines()

    save_state(state)
    log("=== 今日采集 %d 条：%s ===" % (
        len(added), ", ".join("%s:%s" % (k, f) for k, f in added)))


if __name__ == "__main__":
    main()
