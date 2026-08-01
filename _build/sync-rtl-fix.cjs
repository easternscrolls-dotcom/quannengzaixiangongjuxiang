/**
 * 同步 RTL/Banner 修复到所有 6 个语言首页
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PAGES = ['index.html', 'en/index.html', 'jp/index.html', 'es/index.html', 'de/index.html', 'ar/index.html'];

const REPLACEMENTS = [
    // 1. body overflow-x 后增加 banner 防裁切
    {
        from: `    html, body { max-width: 100vw; overflow-x: hidden; }

    /* ── 3. 暗色模式`,
        to: `    html, body { max-width: 100vw; overflow-x: hidden; }

    /* Banner 标题在 RTL/长文本下不被裁切 */
    .site-banner { overflow: visible; }
    .site-banner h1 { overflow-wrap: break-word; word-break: break-word; }

    /* ── 3. 暗色模式`
    },
    // 2. RTL 区块增加 lang-menu + banner h1 覆盖
    {
        from: `    html[dir="rtl"] .license-badge{ right: auto; left: 12px; }
    html[dir="rtl"] .modal-close  { right: auto; left: 20px; }`,
        to: `    html[dir="rtl"] .license-badge{ right: auto; left: 12px; }
    html[dir="rtl"] .modal-close  { right: auto; left: 20px; }
    html[dir="rtl"] .lang-menu   { right: auto; left: 0; }
    html[dir="rtl"] .site-banner h1 { font-size: clamp(28px,4.5vw,42px); }`
    }
];

let totalChanges = 0;
PAGES.forEach(page => {
    const fp = path.join(ROOT, page);
    if (!fs.existsSync(fp)) return;
    let html = fs.readFileSync(fp, 'utf8');
    let c = 0;
    REPLACEMENTS.forEach(r => {
        if (html.includes(r.from)) { html = html.replace(r.from, r.to); c++; }
    });
    fs.writeFileSync(fp, html, 'utf8');
    totalChanges += c;
    console.log((c === REPLACEMENTS.length ? 'OK' : 'PARTIAL') + ' ' + page + ' (' + c + '/' + REPLACEMENTS.length + ')');
});
console.log('\nDone! Total: ' + totalChanges);
