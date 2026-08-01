/**
 * 批量同步卡片布局 CSS 修复到所有 6 个语言首页
 * 修复：标签遮挡 + 高度不一致 + 拥挤
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PAGES = [
    'index.html',
    'en/index.html',
    'jp/index.html',
    'es/index.html',
    'de/index.html',
    'ar/index.html'
];

// 定义所有需要替换的 CSS 规则（按出现顺序）
const REPLACEMENTS = [
    // 1. .resource-grid
    {
        from: `        display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
        gap:16px;
    }
    /* 侧栏模式下的右侧卡片网格（独立类，避免与容器冲突）*/
    .card-grid {
        display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
        gap:16px`,
        to: `        display:grid; grid-template-columns:repeat(auto-fill,minmax(245px,1fr));
        gap:18px;
    }
    /* 侧栏模式下的右侧卡片网格（独立类，避免与容器冲突）*/
    .card-grid {
        display:grid; grid-template-columns:repeat(auto-fill,minmax(245px,1fr));
        gap:18px`
    },
    // 2. .resource-card
    {
        from: `    .resource-card {
        border-radius:18px; background:var(--card); padding:22px;
        transition:all 0.35s cubic-bezier(0.175,0.885,0.32,1.275);
        position:relative; overflow:hidden; border:1px solid var(--line-color);
        cursor:pointer; display:block;
        content-visibility:auto; contain-intrinsic-size:auto 120px;
    }`,
        to: `    .resource-card {
        border-radius:16px; background:var(--card); padding:20px;
        transition:all 0.35s cubic-bezier(0.175,0.885,0.32,1.275);
        position:relative; overflow:hidden; border:1px solid var(--line-color);
        cursor:pointer; display:flex; flex-direction:column;
        content-visibility:auto; contain-intrinsic-size:auto 140px;
    }`
    },
    // 3. .card-badge
    {
        from: `    .card-badge {
        position:absolute; top:14px; right:16px; padding:3px 9px;
        font-size:11px; border-radius:7px; color:#fff; white-space:nowrap;z-index:2;
    }`,
        to: `    .card-badge {
        position:absolute; top:12px; right:14px; padding:2px 8px;
        font-size:10.5px; border-radius:6px; color:#fff; white-space:nowrap;z-index:2;
        box-shadow:0 2px 6px rgba(0,0,0,0.1);
    }`
    },
    // 4. .card-row + .card-icon-box + .card-info + .card-title + .card-desc (big block)
    {
        from: `    .card-row {
        display:flex; align-items:flex-start; gap:14px; position:relative;z-index:1;
    }
    .card-icon-box {
        flex:none; width:44px; height:44px; border-radius:13px;
        display:flex; align-items:center; justify-content:center;
        font-size:21px; box-shadow:0 4px 12px rgba(0,0,0,0.08);
    }
    .card-info { flex:1; min-width:0; }
    .card-title {
        font-size:15px; font-weight:700; color:var(--text-main);
        margin-bottom:5px; transition:0.3s;
        line-height:1.4; word-break:break-word; overflow-wrap:anywhere;
        display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;
        overflow:hidden;
    }
    .resource-card:hover .card-title { color:var(--nebula-cyan); }
    .card-desc {
        color:var(--text-sub); font-size:12.5px; line-height:1.55;
        display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical;
        overflow:hidden; position:relative;z-index:1;
    }`,
        to: `    .card-row {
        display:flex; align-items:flex-start; gap:12px; position:relative;z-index:1;
        flex:1;
        min-height:0;
    }
    .card-icon-box {
        flex:none; width:40px; height:40px; border-radius:11px;
        display:flex; align-items:center; justify-content:center;
        font-size:19px; box-shadow:0 3px 10px rgba(0,0,0,0.07);
    }
    .card-info { flex:1; min-width:0; padding-right:4px; }
    .card-title {
        font-size:14px; font-weight:700; color:var(--text-main);
        margin-bottom:4px; transition:0.3s;
        line-height:1.35; word-break:break-word; overflow-wrap:anywhere;
        display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical;
        overflow:hidden;
    }
    .resource-card:hover .card-title { color:var(--nebula-cyan); }
    .card-desc {
        color:var(--text-sub); font-size:12px; line-height:1.5;
        display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;
        overflow:hidden; position:relative;z-index:1;
    }`
    },
    // 5. .card-meta + .license-badge
    {
        from: `    .card-meta {
        display:flex; gap:12px; font-size:11px; color:var(--text-sub); margin-top:8px;
        position:relative; z-index:1;
    }
    .card-meta span { display:inline-flex; align-items:center; gap:3px; }
    .license-badge {
        position:absolute; bottom:14px; left:16px; z-index:2;
        padding:2px 8px; font-size:10px; border-radius:6px; color:#fff;
    }`,
        to: `    .card-meta {
        display:flex; gap:10px; font-size:10.5px; color:var(--text-sub); margin-top:auto; padding-top:8px;
        position:relative; z-index:1;
    }
    .card-meta span { display:inline-flex; align-items:center; gap:2px; }
    .license-badge {
        position:absolute; bottom:12px; left:14px; z-index:2;
        padding:2px 7px; font-size:9.5px; border-radius:5px; color:#fff;
    }`
    },
    // 6. RTL badge
    {
        from: `    html[dir="rtl"] .card-badge   { right: auto; left: 12px; }`,
        to: `    html[dir="rtl"] .card-badge   { right: auto; left: 14px; }`
    }
];

let totalChanges = 0;

PAGES.forEach(page => {
    const filePath = path.join(ROOT, page);
    if (!fs.existsSync(filePath)) {
        console.log('SKIP ' + page + ' (not found)');
        return;
    }

    let html = fs.readFileSync(filePath, 'utf8');
    let pageChanges = 0;

    REPLACEMENTS.forEach((r, i) => {
        if (html.includes(r.from)) {
            html = html.replace(r.from, r.to);
            pageChanges++;
        } else {
            console.log('  WARN ' + page + ': replacement #' + i + ' not found');
        }
    });

    fs.writeFileSync(filePath, html, 'utf8');
    totalChanges += pageChanges;
    console.log('OK ' + page + ' (' + pageChanges + ' replacements)');
});

console.log('\nDone! Total replacements: ' + totalChanges + ' across ' + PAGES.length + ' pages');
