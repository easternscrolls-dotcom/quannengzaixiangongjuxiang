const fs = require("fs");
const path = require("path");

// =====================【配置区 - 自行修改】=====================
const ROOT_DIR = __dirname;
const IGNORE_FILES = ["index.html", "tool-admin.html", "README.md", "sync-toolbox.js"];

// 分类配置 + 关键词
const categoryConfig = [
    { catId: 1, catName: "文本 / 程序员开发工具", catIcon: "💻", match: ["json", "url", "base64", "timestamp", "hex", "hash", "regex", "xml", "cron", "sql", "text"] },
    { catId: 2, catName: "站长SEO运营工具", catIcon: "📈", match: ["sitemap", "robot", "meta", "nofollow", "seo", "http", "domain", "keyword", "canonical"] },
    { catId: 3, catName: "短视频新媒体文案", catIcon: "🎬", match: ["font", "symbol", "emoji", "title", "comment", "hashtag", "md"] },
    { catId: 4, catName: "单位换算 & 便民计算器", catIcon: "🧮", match: ["unit", "loan", "bmi", "age", "fuel", "tax", "date", "countdown", "lunar"] },
    { catId: 5, catName: "电商运营专用工具", catIcon: "🛒", match: ["profit", "freight", "sku", "ad", "price", "stock", "discount", "order"] },
    { catId: 6, catName: "随机数据/加密测试", catIcon: "🎲", match: ["pwd", "random", "salt", "id", "phone", "name", "card"] },
    { catId: 7, catName: "数学学习图表", catIcon: "📐", match: ["calc", "math", "chart", "fraction", "equation", "percent"] },
    { catId: 8, catName: "PDF & 文档工具", catIcon: "📕", match: ["pdf", "ppt", "word", "excel", "table", "srt", "ass"] },
    { catId: 9, catName: "图片处理工具", catIcon: "🖼️", match: ["img", "image", "gif", "rgb", "qrcode", "ico", "pixel"] },
    { catId: 10, catName: "CSV Excel表格", catIcon: "📊", match: ["csv", "json2csv", "excel"] },
    { catId: 11, catName: "FFmpeg视频工具", catIcon: "🎥", match: ["video", "audio", "mp3", "gif", "fps", "subtitle"] },
    { catId: 12, catName: "综合小工具", catIcon: "🔧", match: [] }
];
const DEFAULT_CAT_ID = 12;

// 图标匹配规则（优先级高于分类默认图标）
const iconRule = [
    { keys: ["json", "sql", "regex"], icon: "📄" },
    { keys: ["pdf"], icon: "📕" },
    { keys: ["img", "image", "gif"], icon: "🖼️" },
    { keys: ["video", "audio", "mp3"], icon: "🎥" },
    { keys: ["csv", "excel"], icon: "📊" },
    { keys: ["pwd", "random"], icon: "🎲" },
    { keys: ["loan", "bmi"], icon: "🧮" },
    { keys: ["seo", "sitemap"], icon: "📈" },
    { keys: ["font", "emoji"], icon: "🎬" },
    { keys: ["sku", "order"], icon: "🛒" },
];
const DEFAULT_ICON = "🔧";
// =========================================================================

// 根据文件名匹配分类ID
function getMatchCatId(filename) {
    const lowerName = filename.toLowerCase();
    for (const cat of categoryConfig) {
        for (const kw of cat.match) {
            if (lowerName.includes(kw)) {
                return cat.catId;
            }
        }
    }
    return DEFAULT_CAT_ID;
}

// 根据文件名匹配图标
function getToolIcon(filename) {
    const lowerName = filename.toLowerCase();
    for (const rule of iconRule) {
        for (const k of rule.keys) {
            if (lowerName.includes(k)) {
                return rule.icon;
            }
        }
    }
    return DEFAULT_ICON;
}

// 扫描所有工具html
function scanAllTools() {
    const files = fs.readdirSync(ROOT_DIR);
    const toolList = [];
    for (const filename of files) {
        const fullPath = path.join(ROOT_DIR, filename);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) continue;
        if (!filename.endsWith(".html")) continue;
        if (IGNORE_FILES.includes(filename)) continue;

        let htmlContent = fs.readFileSync(fullPath, "utf8");
        // 提取标题
        let name = filename.replace(".html", "");
        const titleMatch = htmlContent.match(/<title>([\s\S]*?)<\/title>/);
        if (titleMatch) name = titleMatch[1].trim();
        // 提取描述
        let desc = "本地在线工具";
        const descMatch = htmlContent.match(/meta name="description" content="([\s\S]*?)"/);
        if (descMatch) desc = descMatch[1].trim();

        const targetCatId = getMatchCatId(filename);
        const icon = getToolIcon(filename);

        toolList.push({
            name,
            desc,
            href: filename,
            icon: icon,
            catId: targetCatId,
            file: filename
        });
    }
    return toolList;
}

// 构建分类结构
function buildToolData(allScannedTools) {
    let toolData = categoryConfig.map(item => {
        return {
            catId: item.catId,
            catName: item.catName,
            catIcon: item.catIcon,
            catTotal: 0,
            tools: []
        }
    });
    const hrefSet = new Set();

    for (const tool of allScannedTools) {
        if (hrefSet.has(tool.href)) {
            console.log(`⚠️ 重复文件跳过：${tool.href}`);
            continue;
        }
        hrefSet.add(tool.href);
        const targetCat = toolData.find(c => c.catId === tool.catId);
        targetCat.tools.push({
            name: tool.name,
            desc: tool.desc,
            href: tool.href,
            icon: tool.icon
        });
        console.log(`✅【${targetCat.catName}】${tool.icon} ${tool.name}`);
    }
    return toolData;
}

// 生成 index.html
function generateIndexHtml(toolData) {
    let allTools = [];
    toolData.forEach(cat => {
        cat.tools.forEach(t => {
            t.catId = cat.catId;
            t.catName = cat.catName;
            allTools.push(t);
        })
    })
    const dataJson = JSON.stringify(toolData, null, 4);
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="keywords" content="在线工具箱,JSON格式化,视频压缩,单位换算,SEO工具,电商计算器,随机密码生成,PDF处理,图片工具,前端本地工具">
<meta name="description" content="全能在线工具箱，海量纯前端离线工具，所有运算在浏览器本地执行，保护隐私。">
<title>全能在线工具箱</title>
<style>
:root{
    --primary:#9b78e8;
    --sidebar-bg:#f4f1fc;
    --page-bg:#f7f8fa;
    --card-bg:#ffffff;
    --text-main:#1f2937;
    --text-second:#6b7280;
    --border:#e5e7eb;
    --radius:10px;
    --shadow:0 1px 3px rgba(0,0,0.06);
    --main-blue:#2478f5;
    --main-light:#e8f0ff;
}
.dark{
    --primary:#b89cf0;
    --sidebar-bg:#2a2438;
    --page-bg:#0f172a;
    --card-bg:#1e293b;
    --text-main:#f1f5f9;
    --text-second:#94a3b8;
    --border:#334155;
}
*{margin:0;padding:0;box-sizing:border-box;font-family:system-ui,-apple-system,Microsoft Yahei,sans-serif;}
html{scroll-behavior: smooth;}
body{background:var(--page);color:var(--text-main);height:100vh;display:flex;flex-direction:column;overflow:hidden;transition:0.3s;}
.top-bar{
    height:64px;
    background:var(--card-bg);
    border-bottom:1px solid var(--border);
    display:flex;
    align-items:center;
    padding:0 24px;
    gap:16px;
}
.top-bar .logo{
    font-weight:700;
    font-size:20px;
    width:180px;
    color:var(--main-blue);
}
.search-wrap{
    flex:1;
    max-width:750px;
}
#searchInput{
    width:100%;
    height:40px;
    border:1px solid var(--border);
    border-radius:8px;
    padding:0 16px;
    font-size:14px;
    background:var(--card-bg);
    color:var(--text-main);
}
#searchInput:focus{
    outline:none;
    border-color:var(--primary);
}
.top-right{
    display:flex;
    gap:16px;
    align-items:center;
}
.themeBtn{
    padding:8px 14px;
    border:1px solid var(--border);
    border-radius:8px;
    background:var(--card-bg);
    color:var(--text-main);
    cursor:pointer;
}
.main-wrap{
    display:flex;
    flex:1;
    overflow:hidden;
}
.sidebar{
    width:200px;
    background:var(--card-bg);
    border-right:1px solid var(--border);
    padding:16px 10px;
    overflow-y:auto;
}
.sidebar-menu .item{
    display:flex;
    align-items:center;
    padding:10px 12px;
    border-radius:var(--radius);
    cursor:pointer;
    font-size:14px;
    margin-bottom:6px;
    gap:8px;
    transition:0.2s;
}
.sidebar-menu .item.active{
    background:var(--sidebar-bg);
    color:var(--primary);
    font-weight:500;
}
.sidebar-menu .item:hover:not(.active){
    background:var(--page-bg);
}
.sidebar .split{
    height:1px;
    background:var(--border);
    margin:18px 6px;
}
.item .cat-num{
    margin-left:auto;
    font-size:12px;
    color:var(--text-second);
}
.content{
    flex:1;
    padding:24px;
    overflow-y:auto;
}
.content-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:24px;
}
.content-title h2{
    font-size:22px;
    font-weight:600;
}
.tool-count-tag{
    padding:5px 12px;
    background:var(--sidebar-bg);
    color:var(--primary);
    border-radius:16px;
    font-size:13px;
}
.tool-grid{
    display:grid;
    grid-template-columns:repeat(10, minmax(140px, 1fr));
    gap:14px;
}
.tool-card{
    background:var(--card-bg);
    border-radius:var(--radius);
    padding:14px 12px;
    border:1px solid var(--border);
    cursor:pointer;
    transition:0.2s;
    display:flex;
    gap:10px;
    text-decoration:none;
    color:inherit;
    align-items:flex-start;
    min-width:140px;
}
.tool-card:hover{
    box-shadow:var(--shadow);
    border-color:var(--primary);
    transform:translateY(-2px);
}
.tool-icon{
    width:32px;
    height:32px;
    flex-shrink:0;
    border-radius:6px;
    background:var(--main-light);
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:16px;
    color:var(--main-blue);
}
.tool-info{
    flex:1;
    min-width: 0;
}
.tool-name{
    font-size:13px;
    font-weight:500;
    line-height:1.4;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
}
.tool-desc{
    font-size:11px;
    line-height:1.4;
    color:var(--text-second);
    margin-top:2px;
}
.backTop{
    position:fixed;
    right:28px;
    bottom:28px;
    width:46px;
    border-radius:50%;
    background:var(--primary);
    color:#fff;
    border:none;
    font-size:20px;
    cursor:pointer;
    display:none;
    box-shadow:var(--shadow);
}
@media (max-width:1800px){.tool-grid{grid-template-columns:repeat(8, minmax(140px, 1fr));}}
@media (max-width:1440px){.tool-grid{grid-template-columns:repeat(6, minmax(140px, 1fr));}}
@media (max-width:1200px){.tool-grid{grid-template-columns:repeat(5, minmax(140px, 1fr));}}
@media (max-width:992px){.tool-grid{grid-template-columns:repeat(4, minmax(140px, 1fr));}}
@media (max-width:768px){.sidebar{width:160px}.tool-grid{grid-template-columns:repeat(3, minmax(140px));}}
@media (max-width:640px){.main-wrap{flex-direction:column}.sidebar{width:100%;border-right:none;border-bottom:1px solid var(--border)}.tool-grid{grid-template-columns:repeat(2, minmax(140px));}}
@media (max-width:400px){.tool-grid{grid-template-columns:repeat(1, minmax(140px));}}
</style>
</head>
<body>
<div class="top-bar">
    <div class="logo">全能在线工具箱</div>
    <div class="search-wrap">
        <input id="searchInput" placeholder="搜索工具名称">
    </div>
    <div class="top-right">
        <span class="tool-count-tag">共${allTools.length}款工具</span>
        <button class="themeBtn" onclick="toggleDark()">切换深色/浅色</button>
    </div>
</div>
<div class="main-wrap">
    <div class="sidebar">
        <div class="sidebar-menu">
            <div class="item active" data-catid="all">
                <span>📦</span>
                <span>全部工具</span>
                <span class="cat-num">${allTools.length}</span>
            </div>
        </div>
        <div class="split"></div>
        <div class="sidebar-menu" id="sidebarCatList"></div>
    </div>
    <div class="content">
        <div class="content-header">
            <div class="content-title"><h2 id="currentCatName">全部工具</h2></div>
            <div class="tool-count-tag" id="showCatCount">0 个工具</div>
        </div>
        <div class="tool-grid" id="toolGrid"></div>
    </div>
</div>
<button class="backTop" id="backTopBtn" onclick="window.scrollTo({top:0,behavior:'smooth'})">↑</button>
<script>
const toolData = ${dataJson};
let currentCatId = "all";
let allTools = [];
toolData.forEach(cat=>{
    cat.tools.forEach(t=>{
        t.catId = cat.catId;
        t.catName = cat.catName;
        allTools.push(t);
    })
})
function renderSidebarCat(){
    const wrap = document.getElementById("sidebarCatList");
    wrap.innerHTML = "";
    toolData.forEach(cat=>{
        const realCount = cat.tools.length;
        const div = document.createElement("div");
        div.className = "item";
        div.dataset.catid = cat.catId;
        div.innerHTML = \`<span>\${cat.catIcon}</span><span>\${cat.catName}</span><span class="cat-num">\${realCount}</span>\`;
        div.onclick = ()=>switchCat(cat.catId);
        wrap.appendChild(div);
    })
    document.querySelector('.sidebar-menu .item[data-catid="all"]').onclick = ()=>switchCat("all");
}
function switchCat(catId){
    currentCatId = catId;
    document.querySelectorAll('.sidebar-menu .item').forEach(i=>i.classList.remove("active"));
    document.querySelector(\`.sidebar-menu .item[data-catid="\${catId}"]\`).classList.add("active");
    const titleDom = document.getElementById("currentCatName");
    const countDom = document.getElementById("showCatCount");
    let list;
    if(catId === "all"){
        titleDom.innerText = "全部工具";
        list = allTools;
    }else{
        const c = toolData.find(x=>x.catId == catId);
        titleDom.innerText = c.catName;
        list = c.tools;
    }
    countDom.innerText = \`\${list.length} 个工具\`;
    renderTools(list);
}
function renderTools(list){
    const grid = document.getElementById("toolGrid");
    grid.innerHTML = "";
    list.forEach(tool=>{
        const a = document.createElement("a");
        a.className = "tool-card";
        a.href = tool.href;
        a.title = tool.desc;
        a.innerHTML = \`
            <div class="tool-icon">\${tool.icon}</div>
            <div class="tool-info">
                <div class="tool-name">\${tool.name}</div>
                <div class="tool-desc">\${tool.desc}</div>
        \`;
        grid.appendChild(a);
    })
}
let searchTimer = null;
document.getElementById("searchInput").oninput = ()=>{
    clearTimeout(searchTimer);
    searchTimer = setTimeout(searchFilter, 200);
}
function searchFilter(){
    const kw = document.getElementById("searchInput").value.trim().toLowerCase();
    if(!kw) return switchCat(currentCatId);
    const source = currentCatId === "all" ? allTools : toolData.find(c=>c.catId == catId).tools;
    const res = source.filter(t=>t.name.toLowerCase().includes(kw) || t.desc.toLowerCase().includes(kw));
    document.getElementById("showCatCount").innerText = \`搜索结果：\${res.length} 个\`;
    renderTools(res);
}
function toggleDark(){
    document.documentElement.classList.toggle("dark");
}
window.onscroll = ()=>{
    const btn = document.getElementById("backTopBtn");
    btn.style.display = window.scrollY > 400 ? "block" : "none";
}
window.onload = ()=>{
    renderSidebarCat();
    switchCat("all");
}
</script>
</body>
</html>`;
    return html.replaceAll("${allTools.length}", allTools.length);
}

// 主入口
function main(){
    console.log("==================== 工具箱自动扫描开始 ====================");
    const tools = scanAllTools();
    console.log(`\n共扫描到 ${tools.length} 个工具HTML`);
    console.log("------------------------------------------------------");
    const toolData = buildToolData(tools);
    const indexHtml = generateIndexHtml(toolData);
    fs.writeFileSync(path.join(ROOT_DIR, "index.html"), indexHtml, "utf8");
    console.log("------------------------------------------------------");
    console.log("✅ index.html 已自动生成并覆盖完成！");
}

main();