# -*- coding: utf-8 -*-
"""
drip_blog.py —— 72tool.com 博客「滴灌式」发布器

策略：不一次性铺满，而是每天发 5-6 篇，且在一天内不同时间点陆续发布。
  - 每天的「发布篇数」和「发布时刻表」由日期做种子随机生成（确定性，
    同一天多次运行结果一致）：篇数 5 或 6，时间落在 09:00-22:00 之间，
    相邻两次发布至少间隔约 1 小时。
  - 配合 Windows 计划任务每 30 分钟跑一次本脚本：没到发布时刻就静默退出；
    到点了就生成 1 篇（智谱 AI，失败自动回退模板）→ 更新博客首页 + sitemap
    → git 提交并推送（Cloudflare 自动部署）。
  - 电脑关机错过的时段会在下次运行时逐次补发（每次运行最多发 1 篇，
    避免同一秒集中上线一堆文章）。

状态文件 blog_state.json（与本脚本同目录）：
  { "published": { "<slug>": {"title","excerpt","cat","date","time"} },
    "consumed":  { "YYYY-MM-DD": 已消费的发布时段数 } }

用法：
  python drip_blog.py            # 正常判定：到点则发 1 篇，否则退出
  python drip_blog.py --now      # 忽略时刻表，立即发 1 篇（测试用）
  python drip_blog.py --status   # 只看进度和今天的时刻表
  python drip_blog.py --plan     # 预览今天的发布时刻表
  python drip_blog.py --no-push  # 发布但不 git push（只本地提交）
"""
import sys, os, re, json, random, datetime, subprocess, configparser

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import gen_blog as gb  # 复用工具解析 / 文章生成 / 渲染 / sitemap 逻辑

STATE_PATH = os.path.join(HERE, "blog_state.json")
SITE_DIR = os.path.dirname(gb.CFG["tools_html"])   # C:\Users\Administrator\Desktop\全能工具箱
BLOG_DIR = os.path.join(SITE_DIR, "blog")

# ---- 滴灌参数（全部来自 config.ini 的 [drip] 段，改配置不用动代码）----
_cp = configparser.ConfigParser(inline_comment_prefixes=(";", "#"))
_cp.read(os.path.join(HERE, "config.ini"), encoding="utf-8")


def _cfg(key, default, cast=int):
    try:
        return cast(_cp.get("drip", key).strip())
    except Exception:
        return default


DRIP_ENABLED = _cfg("enabled", True, lambda v: v.lower() in ("1", "true", "yes", "on"))
DAILY_MIN = _cfg("daily_min", 5)
DAILY_MAX = _cfg("daily_max", 6)
WIN_START = _cfg("window_start", 9)
WIN_END = _cfg("window_end", 22)
MIN_GAP_MIN = _cfg("min_gap_minutes", 60)
MAX_PER_RUN = _cfg("max_per_run", 1)
AUTO_PUSH = _cfg("auto_push", True, lambda v: v.lower() in ("1", "true", "yes", "on"))

FORCE_NOW = "--now" in sys.argv
STATUS_ONLY = "--status" in sys.argv
PLAN_ONLY = "--plan" in sys.argv
NO_PUSH = "--no-push" in sys.argv


def log(msg):
    print(f"[{datetime.datetime.now().strftime('%H:%M:%S')}] {msg}")


def load_state():
    if os.path.exists(STATE_PATH):
        try:
            return json.load(open(STATE_PATH, encoding="utf-8"))
        except Exception:
            pass
    return {"published": {}, "consumed": {}}


def save_state(st):
    json.dump(st, open(STATE_PATH, "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)


def day_schedule(date_str):
    """按日期种子生成当天发布时刻表（确定性）：5或6个时刻，窗口内、有最小间隔。"""
    rng = random.Random("72tool-drip-" + date_str)
    n = rng.randint(DAILY_MIN, DAILY_MAX)
    total_min = (WIN_END - WIN_START) * 60
    for _ in range(200):
        mins = sorted(rng.sample(range(total_min), n))
        if all(b - a >= MIN_GAP_MIN for a, b in zip(mins, mins[1:])):
            break
    return [f"{WIN_START + m // 60:02d}:{m % 60:02d}" for m in mins]


def next_tool(state):
    """按 pick_diverse 的分类轮询顺序，取第一个未发布的工具。"""
    tools = gb.parse_tools(gb.CFG["tools_html"])
    if not tools:
        return None, 0
    ordered = gb.pick_diverse(tools, len(tools))
    pub = state["published"]
    for t in ordered:
        if t["slug"] not in pub:
            return t, len(ordered) - len(pub)
    return None, 0


def rebuild_index(state):
    """用状态里的已发布文章重建博客首页（新→旧排序）。"""
    metas = []
    for slug, m in state["published"].items():
        metas.append({"slug": slug, "name": m.get("name", ""),
                      "title": m.get("title", ""), "excerpt": m.get("excerpt", ""),
                      "cat": m.get("cat", ""), "date": m.get("date", "")})
    metas.sort(key=lambda x: (x["date"], state["published"][x["slug"]].get("time", "")),
               reverse=True)
    os.makedirs(BLOG_DIR, exist_ok=True)
    with open(os.path.join(BLOG_DIR, "index.html"), "w", encoding="utf-8") as f:
        f.write(gb.render_index(metas))
    return len(metas)


def git_publish(slug, title, do_push=True):
    def run(*args):
        return subprocess.run(["git", "-C", SITE_DIR] + list(args),
                              capture_output=True, text=True, timeout=90)
    run("add", "-A")
    r = run("-c", "user.name=72tool", "-c", "user.email=bot@72tool.com",
            "commit", "-m", f"blog: publish {slug} - {title[:40]}")
    committed = r.returncode == 0
    if committed:
        log(f"git 已提交：{r.stdout.strip().splitlines()[0] if r.stdout else 'ok'}")
    else:
        log("git 无新变更或提交失败：" + (r.stdout + r.stderr).strip()[:120])
    if do_push:
        try:
            r = run("push")
            if r.returncode != 0:
                # 远端有新提交（本机/云端并发）→ 先 rebase 再重推一次
                log("git push 被拒，尝试 pull --rebase 后重推：" +
                    (r.stderr or r.stdout).strip()[:120])
                rb = run("-c", "user.name=72tool", "-c", "user.email=bot@72tool.com",
                         "pull", "--rebase")
                if rb.returncode == 0:
                    r = run("push")
                else:
                    run("rebase", "--abort")
            if r.returncode == 0:
                log("git push 成功 → Cloudflare 将自动部署")
            else:
                log("git push 失败（将随下次成功推送一起上线）：" +
                    (r.stderr or r.stdout).strip()[:150])
        except Exception as e:
            log(f"git push 异常：{e}")


def main():
    now = datetime.datetime.now()
    today = now.date().isoformat()
    state = load_state()
    sched = day_schedule(today)
    consumed = int(state["consumed"].get(today, 0))
    published_total = len(state["published"])

    if STATUS_ONLY or PLAN_ONLY:
        log(f"今日({today})时刻表：{'、'.join(sched)}（共 {len(sched)} 篇）")
        log(f"今日已发布 {consumed} 篇；累计已发布 {published_total} 篇")
        t, remaining = next_tool(state)
        log(f"待发布剩余 {remaining} 篇；下一篇：{t['name'] if t else '（已全部发完）'}")
        return

    if not DRIP_ENABLED and not FORCE_NOW:
        log("config.ini [drip] enabled = False，滴灌已关闭，退出。")
        return

    # 判定是否到发布时刻（错过的时段会累计，本次运行最多补 MAX_PER_RUN 篇）
    due = sum(1 for hm in sched if hm <= now.strftime("%H:%M"))
    if FORCE_NOW:
        todo = 1
    else:
        if consumed >= len(sched):
            log(f"今日 {len(sched)} 篇已发完，退出。时刻表：{'、'.join(sched)}")
            return
        if consumed >= due:
            nxt = sched[consumed] if consumed < len(sched) else "-"
            log(f"未到发布时刻（下一时段 {nxt}），退出。时刻表：{'、'.join(sched)}")
            return
        todo = min(due - consumed, MAX_PER_RUN)

    done = 0
    for _ in range(todo):
        tool, remaining = next_tool(state)
        if tool is None:
            log("全部工具的文章都已发布完毕 🎉")
            break

        log(f"到点发布：{tool['name']}（{tool['slug']}），剩余 {remaining} 篇待发")

        # 生成（config mode=api → 智谱；失败自动回退模板）
        gb.CFG["mode"] = "api"
        art = gb.gen_article(tool)
        src = "模板回退" if art.get("sec_titles") else "AI(智谱)"
        log(f"生成完成［{src}］：{art['title']}")

        # 写文章
        os.makedirs(BLOG_DIR, exist_ok=True)
        html = gb.render_article(tool, art)
        with open(os.path.join(BLOG_DIR, tool["slug"]), "w", encoding="utf-8") as f:
            f.write(html)

        # 更新状态 → 重建首页 → 更新 sitemap
        now2 = datetime.datetime.now()
        state["published"][tool["slug"]] = {
            "name": tool["name"], "title": art["title"], "excerpt": art["excerpt"],
            "cat": art["cat"], "date": today, "time": now2.strftime("%H:%M"),
        }
        state["consumed"][today] = int(state["consumed"].get(today, 0)) + 1
        save_state(state)
        n = rebuild_index(state)
        gb.update_sitemap([gb.CFG["site"] + "/blog/" + tool["slug"]])
        log(f"博客首页已重建（{n} 篇），sitemap 已更新")

        # git 提交 + 推送
        git_publish(tool["slug"], art["title"],
                    do_push=(AUTO_PUSH and not NO_PUSH))
        done += 1
        log(f"--- 已发布 {tool['slug']}（今日 {state['consumed'][today]}/{len(sched)}）---")

    log(f"=== 本次运行发布 {done} 篇，今日累计 "
        f"{state['consumed'].get(today, 0)}/{len(sched)} 篇 ===")


if __name__ == "__main__":
    main()
