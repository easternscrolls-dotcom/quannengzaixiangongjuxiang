#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
星云 Nebula 主题注入脚本（幂等）。
- 含 class="navbar" 的 4 个首页：在首个 </style> 后注入 <link rel=stylesheet href=/home-nebula.css>
- 其余 .html：在 </head> 前注入 <link rel=stylesheet href=/nebula.css>
- 所有页：在 </body> 前注入 <script src=/nebula-bg.js>（粒子背景）
- 根相对路径，/en/ /jp/ /es/ 子目录亦可加载。
- 已注入则跳过（可重复运行）。百度验证文件无 </head>/</body> 自动跳过。
"""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
HOME_CSS = "/home-nebula.css"
GLOBAL_CSS = "/nebula.css"
BG_JS = "/nebula-bg.js"
HOME_LINK = f'<link rel="stylesheet" href="{HOME_CSS}">'
GLOBAL_LINK = f'<link rel="stylesheet" href="{GLOBAL_CSS}">'
BG_SCRIPT = f'<script src="{BG_JS}"></script>'

def iter_html():
    for dirpath, _, files in os.walk(ROOT):
        if ".git" in dirpath or "node_modules" in dirpath:
            continue
        for f in files:
            if f.endswith(".html"):
                yield os.path.join(dirpath, f)

def main():
    home_n, home_skip = 0, 0
    glob_n, glob_skip = 0, 0
    js_n, js_skip, skip = 0, 0, 0
    for path in iter_html():
        with open(path, "r", encoding="utf-8", errors="ignore") as fh:
            html = fh.read()
        is_home = 'class="navbar"' in html
        changed = False

        # ---- CSS ----
        if is_home:
            if HOME_CSS in html:
                home_skip += 1
            else:
                idx = html.find("</style>")
                if idx == -1:
                    skip += 1
                else:
                    html = html[:idx + len("</style>")] + "\n" + HOME_LINK + html[idx + len("</style>"):]
                    home_n += 1
                    changed = True
        else:
            if GLOBAL_CSS in html:
                glob_skip += 1
            else:
                idx = html.rfind("</head>")
                if idx == -1:
                    skip += 1
                else:
                    html = html[:idx] + GLOBAL_LINK + "\n" + html[idx:]
                    glob_n += 1
                    changed = True

        # ---- JS 粒子背景 ----
        if BG_JS in html:
            js_skip += 1
        else:
            idx = html.rfind("</body>")
            if idx == -1:
                pass  # 无 </body> 的验证文件跳过
            else:
                html = html[:idx] + BG_SCRIPT + "\n" + html[idx:]
                js_n += 1
                changed = True

        if changed:
            with open(path, "w", encoding="utf-8") as fh:
                fh.write(html)

    print(f"首页(home-nebula.css) 注入: {home_n}  跳过: {home_skip}")
    print(f"工具/分类页(nebula.css) 注入: {glob_n}  跳过: {glob_skip}")
    print(f"粒子背景(nebula-bg.js) 注入: {js_n}  跳过: {js_skip}")
    print(f"无 </style>/</head>/</body> 跳过: {skip}")

if __name__ == "__main__":
    main()
