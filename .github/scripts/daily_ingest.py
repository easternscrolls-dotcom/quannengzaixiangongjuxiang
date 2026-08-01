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
    """把 GitHub repo 列表映射成本站数据对象，跳过已采集 / 已存在的。"""
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
        elif kind == "theme":
            obj = ('    {idx:%d, subCate:%s, zh:\'%s\', en:\'%s\', '
                   'desc_zh:\'%s\', desc_en:\'%s\', previewUrl:\'%s\', '
                   'downloadUrl:\'%s\', repo:\'%s\'}' % (
                       next_idx_in_file(
                           os.path.join(SITE_DIR, SOURCES[kind]["file"]),
                           SOURCES[kind]["marker"]),
                       json.dumps(SOURCES[kind]["subCate"]),
                       esc_js(name), esc_js(name),
                       esc_js(desc), esc_js(desc),
                       esc_js(homepage or "#"), esc_js(html_url),
                       esc_js(full)))
        else:  # source
            obj = ('    {idx:%d, subCate:%s, zh:\'%s\', en:\'%s\', '
                   'desc_zh:\'%s\', desc_en:\'%s\', previewUrl:\'#\', '
                   'downloadUrl:\'%s\', repo:\'%s\'}' % (
                       next_idx_in_file(
                           os.path.join(SITE_DIR, SOURCES[kind]["file"]),
                           SOURCES[kind]["marker"]),
                       json.dumps(SOURCES[kind]["subCate"]),
                       esc_js(name), esc_js(name),
                       esc_js(desc), esc_js(desc),
                       esc_js(html_url), esc_js(full)))
        out.append((full, obj))
    return out


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
        objs = [o for _, o in picked]
        if DRYRUN:
            log("[%s] 空跑：将写入 %d 条到 %s" % (kind, len(objs), cfg["file"]))
            for full, o in picked:
                log("      + %s" % full)
        else:
            new_txt = append_to_array(fpath, cfg["marker"], objs)
            open(fpath, "w", encoding="utf-8").write(new_txt)
            log("[%s] 已写入 %d 条到 %s" % (kind, len(objs), cfg["file"]))
        for full, _ in picked:
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

    # 重建 sitemap
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
