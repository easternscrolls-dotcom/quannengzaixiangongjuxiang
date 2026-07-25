import os

root_dir = "."
output_file = "tool_name_map_template.txt"
lines = []

# 注释头
lines.append("# 格式：文件名|工具中文名称")
lines.append("# 自动生成模板，请把【待填写工具名称】替换为真实名称")

for dirpath, _, filenames in os.walk(root_dir):
    for name in filenames:
        # 排除首页和页面说明页，只处理工具html
        if name.lower().endswith(".html") and name not in ["index.html", "about.html", "privacy.html", "contact.html"]:
            lines.append(f"{name}|待填写工具名称")

with open(output_file, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"✅ 模板生成完成：{output_file}")
print("打开文件批量替换【待填写工具名称】为对应的工具标题")