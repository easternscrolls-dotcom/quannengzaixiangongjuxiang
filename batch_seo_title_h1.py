import os
import re

# ====================== 配置区 ======================
ROOT_DIR = "."
TITLE_SUFFIX = " | 72在线工具箱"
INSERT_AFTER = "<body>"
MAP_FILE = "tool_name_map.txt"
# ====================================================

# 加载工具映射
tool_mapping = {}
with open(MAP_FILE, "r", encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        fname, tname = line.split("|")
        tool_mapping[fname.strip()] = tname.strip()


def read_html_safe(path):
    """优先utf8读取，失败自动切换gbk"""
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except UnicodeDecodeError:
        with open(path, "r", encoding="gbk", errors="ignore") as f:
            return f.read()


def write_html_safe(path, content):
    """统一保存为UTF-8无乱码"""
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def process_html(file_path: str, filename: str):
    if filename not in tool_mapping:
        print(f"[跳过] 无名称映射：{filename}")
        return

    tool_title = tool_mapping[filename]
    new_title = f"<title>{tool_title}{TITLE_SUFFIX}</title>"
    h1_tag = f'<h1 style="margin:16px 0;font-size:22px;">{tool_title}</h1>'

    html = read_html_safe(file_path)

    # 防止重复插入H1
    if h1_tag in html:
        print(f"[已处理跳过] {filename}")
        return

    # 替换原title标签
    html = re.sub(r"<title>.*?</title>", new_title, html, flags=re.S)
    # 在<body>下方插入H1标题
    html = html.replace(INSERT_AFTER, f"{INSERT_AFTER}\n{h1_tag}\n")

    write_html_safe(file_path, html)
    print(f"[已更新] {filename} → {tool_title}")


def scan_all_html():
    for dirpath, _, files in os.walk(ROOT_DIR):
        for name in files:
            # 排除首页、法律页面不批量处理
            skip_list = ["index.html", "about.html", "privacy.html", "contact.html"]
            if name.lower().endswith(".html") and name not in skip_list:
                fullpath = os.path.join(dirpath, name)
                process_html(fullpath, name)


if __name__ == "__main__":
    scan_all_html()
    print("\n✅ 批量处理全部完成！")