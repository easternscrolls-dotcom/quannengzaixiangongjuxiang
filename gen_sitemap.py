import os
from datetime import date

base_domain = "https://72tool.com"
# 当前源码根目录
root_dir = "."
today = date.today().strftime("%Y-%m-%d")
url_list = []

# 首页优先加入
url_list.append(f"{base_domain}/")

# 遍历目录寻找html文件
for dirpath, _, filenames in os.walk(root_dir):
    for fname in filenames:
        if fname.lower().endswith(".html"):
            full_path = os.path.join(dirpath, fname)
            rel_path = os.path.relpath(full_path, root_dir)
            # Windows路径转web路径
            web_path = rel_path.replace(os.sep, "/")

            # index.html 简化为目录形式
            if web_path.endswith("index.html"):
                web_url = f"{base_domain}/{web_path[:-10]}"
                # 避免重复首页
                if web_url == f"{base_domain}/":
                    continue
            else:
                web_url = f"{base_domain}/{web_path}"
            url_list.append(web_url)

# 去重
url_list = list(dict.fromkeys(url_list))

# 拼装xml
xml = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
'''

# 首页单独设置高权重
xml += f'''
<url>
<loc>{base_domain}/</loc>
<lastmod>{today}</lastmod>
<changefreq>daily</changefreq>
<priority>1.0</priority>
</url>
'''

# 其余页面
for url in url_list:
    if url == f"{base_domain}/":
        continue
    xml += f'''
<url>
<loc>{url}</loc>
<lastmod>{today}</lastmod>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>
'''

xml += "\n</urlset>"

# 输出文件
with open("sitemap.xml", "w", encoding="utf-8") as f:
    f.write(xml)

print(f"生成完成，共{len(url_list)}条链接，文件：sitemap.xml")