const fs = require('fs');
const path = require('path');

// 需要同步的替换规则（从 index.html 到其他语言页）
const rootDir = path.resolve(__dirname, '..');
const pages = ['en/index.html', 'jp/index.html', 'es/index.html', 'de/index.html', 'ar/index.html'];
const root = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

let fixed = 0, skipped = 0;

// 规则1: nav-capsule 增加 isolation: isolate;
const rule1_old = `        transition: all 0.3s ease; width:92%; max-width:1200px;
    }`;
const rule1_new = `        transition: all 0.3s ease; width:92%; max-width:1200px;
        /* 创建层叠上下文，确保内部下拉菜单不脱离导航层级 */
        isolation: isolate;
    }`;

// 规则2: lang-menu 更紧凑
const rule2_old = `.lang-menu {
        position:absolute; top:calc(100%+8px); right:0; width:140px;
        background:var(--card);border-radius:12px;border:1px solid var(--line-color);
        box-shadow:0 8px 24px rgba(0,0,0,0.12); overflow:hidden;
        display:none; z-index:1001;
    }
    .lang-menu.open { display:block; }
    .lang-option {
        padding:10px 16px; cursor:pointer; font-size:14px; transition:0.2s;`;
const rule2_new = `.lang-menu {
        position:absolute; top:calc(100%+6px); right:0; width:130px;
        background:var(--card);border-radius:10px;border:1px solid var(--line-color);
        box-shadow:0 6px 20px rgba(0,0,0,0.12); overflow:hidden;
        display:none; z-index:1001;
    }
    .lang-menu.open { display:block; }
    .lang-option {
        padding:8px 14px; cursor:pointer; font-size:13px; transition:0.2s;`;

// 规则3: Banner padding 增加 + overflow + word-break
const rule3_old = `    /* ── Banner ── */
    .site-banner { padding:120px 20px 40px; text-align:center; }
    .site-banner h1 {
        font-size:clamp(32px,5vw,48px); font-weight:800; margin-bottom:16px;
        background:linear-gradient(90deg,var(--nebula-cyan),var(--nebula-purple),var(--nebula-pink));
        -webkit-background-clip:text; background-clip:text; color:transparent;
    }`;
const rule3_new = `    /* ── Banner ── */
    .site-banner { padding:130px 20px 40px; text-align:center; overflow:visible; }
    .site-banner h1 {
        font-size:clamp(32px,5vw,48px); font-weight:800; margin-bottom:16px;
        background:linear-gradient(90deg,var(--nebula-cyan),var(--nebula-purple),var(--nebula-pink));
        -webkit-background-clip:text; background-clip:text; color:transparent;
        word-break: break-word; max-width: 100%;
    }`;

// 规则4: 移动端 Banner padding
const rule4_old = `.site-banner{padding:100px 16px 30px;}`;
const rule4_new = `.site-banner{padding:110px 16px 30px;}`;

const rules = [
  [rule1_old, rule1_new, 'nav-capsule isolation'],
  [rule2_old, rule2_new, 'lang-menu compact'],
  [rule3_old, rule3_new, 'Banner padding+overflow'],
  [rule4_old, rule4_new, 'mobile Banner padding'],
];

pages.forEach(p => {
  const fullPath = path.join(rootDir, p);
  if (!fs.existsSync(fullPath)) { console.log('SKIP (not found): ' + p); return; }
  let html = fs.readFileSync(fullPath, 'utf8');
  let changed = false;
  
  rules.forEach(([old, nw, label]) => {
    if (html.includes(old)) {
      html = html.replace(old, nw);
      changed = true;
      fixed++;
    } else if (!html.includes(nw)) {
      console.log('  WARNING ' + p + ': pattern not found for "' + label + '"');
      skipped++;
    }
  });
  
  if (changed) {
    fs.writeFileSync(fullPath, html, 'utf8');
    console.log('UPDATED: ' + p);
  } else {
    console.log('PARTIAL (already applied): ' + p);
  }
});

console.log('\nDone: ' + fixed + ' replacements, ' + skipped + ' warnings');
