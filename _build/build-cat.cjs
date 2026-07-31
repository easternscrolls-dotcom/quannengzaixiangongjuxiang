/* ============================================================
 *  build-cat.cjs —— 生成分类聚合页
 *  输出： /c/<main>-<tag>.html        （中文）
 *        /en/c/<main>-<tag>.html     （英文，自动排除中文专属工具）
 *  用法： node _build/build-cat.cjs
 * ============================================================ */
const fs = require('fs');
const path = require('path');
const { BASE, CATEGORIES } = require('./site.config.cjs');
const COPY = require('./cat-copy.cjs');

const ROOT = path.resolve(__dirname, '..');
const CAT_LANGS = ['zh', 'en'];

/* ---------- 数据装载 ---------- */
function loadTools() {
  const g = {};
  const code = fs.readFileSync(path.join(ROOT, 'tools-data.js'), 'utf8');
  new Function('window', code)(g);
  return (g.TOOLS_DATA || []).filter(t => t.cat);
}

function loadLocalOnly() {
  const s = fs.readFileSync(path.join(ROOT, 'i18n-runtime.js'), 'utf8');
  const m = s.match(/window\.I18N_LOCAL_ONLY\s*=\s*\[([\s\S]*?)\];/);
  if (!m) return [];
  return m[1].split('\n').map(l => { const q = l.match(/'([^']+)'/); return q ? q[1] : null; }).filter(Boolean);
}

function loadResourceData(name) {
  const s = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const start = s.indexOf('const ' + name + ' = [');
  if (start === -1) return [];
  const end = s.indexOf('\n];', start);
  const body = s.slice(start + ('const ' + name + ' = ').length, end + 2);
  return new Function('return ' + body)();
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ---------- 页面样式（内联，零外部依赖，明暗自适应）---------- */
const CSS = `*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#F5F7FA;--card:#FFFFFF;--text:#1A2230;--sub:#5A6678;--line:#E3E8EF;--brand:#0E9E8C;--brand2:#16C7B2}
@media (prefers-color-scheme:dark){:root{--bg:#0E1420;--card:#161E2C;--text:#E8EDF5;--sub:#AAB6C8;--line:#26303F;--brand:#16C7B2;--brand2:#3FE0C8}}
body{font-family:system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif;background:var(--bg);color:var(--text);line-height:1.75;-webkit-font-smoothing:antialiased}
.wrap{max-width:1080px;margin:0 auto;padding:0 20px}
a{color:var(--brand);text-decoration:none}
a:hover{text-decoration:underline}
a:focus-visible,button:focus-visible{outline:2px solid var(--brand2);outline-offset:2px}
header.top{border-bottom:1px solid var(--line);background:var(--card);position:sticky;top:0;z-index:9}
.top .wrap{display:flex;align-items:center;justify-content:space-between;height:60px;gap:12px}
.logo{font-weight:800;font-size:19px;color:var(--text);letter-spacing:.3px}
.logo span{color:var(--brand)}
.top nav{display:flex;gap:8px;flex-wrap:wrap}
.top nav a{font-size:14px;padding:8px 12px;border-radius:8px;color:var(--sub)}
.top nav a:hover{background:var(--bg);text-decoration:none}
.top nav a.on{color:var(--brand);font-weight:700}
.crumb{font-size:13px;color:var(--sub);padding:18px 0 4px}
.crumb a{color:var(--sub)}
h1{font-size:30px;line-height:1.35;margin:6px 0 12px;letter-spacing:-.2px}
.intro{font-size:16px;color:var(--sub);max-width:78ch}
.meta{display:flex;gap:10px;flex-wrap:wrap;margin:16px 0 8px}
.chip{font-size:12px;padding:5px 11px;border-radius:999px;background:var(--card);border:1px solid var(--line);color:var(--sub)}
h2{font-size:21px;margin:40px 0 14px;padding-top:6px}
.body-txt{color:var(--sub);max-width:78ch}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(212px,1fr));gap:12px;margin-top:16px}
.item{display:block;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 15px;color:var(--text);transition:.16s;min-height:48px;overflow-wrap:anywhere}
.item:hover{border-color:var(--brand);transform:translateY(-2px);box-shadow:0 6px 18px rgba(14,158,140,.13);text-decoration:none}
.item b{display:block;font-size:14.5px;font-weight:600;margin-bottom:3px}
.item i{font-style:normal;font-size:12px;color:var(--sub)}
.res{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px 20px;margin-bottom:12px}
.res h3{font-size:16.5px;margin-bottom:6px}
.res p{font-size:14px;color:var(--sub);margin-bottom:10px}
.lic{font-size:11.5px;padding:3px 9px;border-radius:6px;background:rgba(22,199,178,.12);color:var(--brand);font-weight:700;letter-spacing:.4px}
.faq details{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 18px;margin-bottom:10px}
.faq summary{cursor:pointer;font-weight:650;font-size:15px;min-height:28px}
.faq p{margin-top:9px;color:var(--sub);font-size:14.5px}
.rel{display:flex;flex-wrap:wrap;gap:9px;margin-top:14px}
.rel a{font-size:13.5px;padding:8px 14px;border-radius:9px;background:var(--card);border:1px solid var(--line);color:var(--sub);min-height:40px;display:inline-flex;align-items:center}
.rel a:hover{border-color:var(--brand);color:var(--brand);text-decoration:none}
.cta{display:inline-block;margin-top:20px;background:var(--brand);color:#fff;padding:13px 24px;border-radius:11px;font-weight:700;font-size:15px}
.cta:hover{background:var(--brand2);text-decoration:none}
footer{margin-top:56px;border-top:1px solid var(--line);background:var(--card);padding:26px 0 34px}
footer .wrap{font-size:13.5px;color:var(--sub)}
.flangs{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:10px}
@media (max-width:640px){h1{font-size:24px}.grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}.top .wrap{height:auto;padding-top:10px;padding-bottom:10px;flex-wrap:wrap}}
@media (pointer:coarse){.item,.rel a,.top nav a{min-height:48px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}`;

/* ---------- 界面固定文案 ---------- */
const UI = {
  zh: {
    home: '首页', tools: '在线工具', themes: '网站模板', sources: '开源源码',
    allTools: '全部工具', browse: '在工具箱中浏览本分类 ›', listTitle: '本分类工具列表',
    resTitle: '本分类资源列表', about: '关于这个分类', faqTitle: '常见问题',
    relTitle: '相关分类', count: n => '共 ' + n + ' 款工具', free: '完全免费',
    local: '浏览器本地运行', noReg: '无需注册',
    copyright: '© 2026 72Tool · 72tool.com 保留所有权利',
    priv: '隐私政策', terms: '使用条款', map: '网站地图',
    view: '查看与下载 ›', htmlLang: 'zh-CN', dirPrefix: '', ogLocale: 'zh_CN'
  },
  en: {
    home: 'Home', tools: 'Online Tools', themes: 'Templates', sources: 'Open Source',
    allTools: 'All Tools', browse: 'Browse this category in the toolbox ›', listTitle: 'Tools in this category',
    resTitle: 'Resources in this category', about: 'About this category', faqTitle: 'Frequently asked questions',
    relTitle: 'Related categories', count: n => n + ' tools', free: '100% free',
    local: 'Runs in your browser', noReg: 'No sign-up',
    copyright: '© 2026 72tool.com. All rights reserved.',
    priv: 'Privacy', terms: 'Terms', map: 'Sitemap',
    view: 'View & download ›', htmlLang: 'en', dirPrefix: 'en/', ogLocale: 'en_US'
  }
};

const MAIN_LABEL = {
  tool: { zh: '在线工具', en: 'Online Tools' },
  theme: { zh: '网站主题模板', en: 'Website Templates' },
  source: { zh: '网站开源源码', en: 'Open Source Code' }
};

/* ---------- 单页渲染 ---------- */
function renderPage(opt) {
  const { lang, main, tagKey, tagMeta, copy, items, related } = opt;
  const u = UI[lang];
  const isTool = main === 'tool';
  const label = tagMeta[lang] || tagMeta.en;
  const mainLabel = MAIN_LABEL[main][lang];
  const selfUrl = BASE + u.dirPrefix + 'c/' + main + '-' + tagKey + '.html';
  const zhUrl = BASE + 'c/' + main + '-' + tagKey + '.html';
  const enUrl = BASE + 'en/c/' + main + '-' + tagKey + '.html';
  const homeUrl = '/' + u.dirPrefix;
  const q = lang === 'en' ? '?lang=en' : '';
  const today = new Date().toISOString().slice(0, 10);

  const title = isTool
    ? (lang === 'zh'
        ? label + '｜' + items.length + ' 款免费在线' + label.replace(/工具$/, '') + '工具 - 72Tool'
        : label + ' — ' + items.length + ' Free Online ' + label + ' | 72Tool')
    : (lang === 'zh' ? label + '｜免费' + mainLabel + '下载 - 72Tool'
                     : label + ' — Free ' + mainLabel + ' Download | 72Tool');

  const h1 = isTool
    ? (lang === 'zh' ? '免费在线' + label + '（' + items.length + ' 款）'
                     : 'Free Online ' + label + ' — ' + items.length + ' Browser-Based Utilities')
    : (lang === 'zh' ? '免费' + label + '下载'
                     : 'Free ' + label + ' — Download & Deploy');

  const desc = copy.intro.replace(/\s+/g, ' ').slice(0, 158);
  const kw = isTool
    ? (lang === 'en' ? tagMeta.enKw : label + ',免费' + label + ',在线' + label + ',72Tool')
    : (lang === 'en' ? tagMeta.enKw : label + ',' + mainLabel + '下载,免费' + label + ',72Tool');

  /* 条目列表 */
  let listHtml = '';
  if (isTool) {
    listHtml = '<div class="grid">\n' + items.map(t => {
      const name = lang === 'zh' ? (t.zh || t.en) : (t.en || t.zh);
      const sub = lang === 'zh' ? (t.type_cn || '') : (t.type || '');
      return '<a class="item" href="/' + t.slug + q + '"><b>' + esc(name) + '</b><i>' + esc(sub) + '</i></a>';
    }).join('\n') + '\n</div>';
  } else {
    listHtml = items.map((r, i) => {
      const name = lang === 'zh' ? r.zh : r.en;
      const d = lang === 'zh' ? r.desc_zh : r.desc_en;
      const lic = (i % 2 === 0) ? 'MIT' : 'Apache-2.0';
      return '<article class="res"><h3>' + esc(name) + ' <span class="lic">' + lic + '</span></h3>'
        + '<p>' + esc(d) + '</p>'
        + '<a href="' + homeUrl + '?main=' + main + '&amp;sub=' + tagKey + '">' + u.view + '</a></article>';
    }).join('\n');
  }

  /* JSON-LD */
  const itemListLd = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: label, numberOfItems: items.length,
    itemListElement: items.slice(0, 60).map((t, i) => ({
      '@type': 'ListItem', position: i + 1,
      name: isTool ? (lang === 'zh' ? (t.zh || t.en) : (t.en || t.zh)) : (lang === 'zh' ? t.zh : t.en),
      url: isTool ? BASE + t.slug : selfUrl
    }))
  };
  const crumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '72Tool', item: BASE + u.dirPrefix },
      { '@type': 'ListItem', position: 2, name: mainLabel, item: BASE + u.dirPrefix },
      { '@type': 'ListItem', position: 3, name: label, item: selfUrl }
    ]
  };
  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: copy.faq.map(f => ({
      '@type': 'Question', name: f[0],
      acceptedAnswer: { '@type': 'Answer', text: f[1] }
    }))
  };
  const pageLd = {
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    name: title, url: selfUrl, description: desc,
    inLanguage: u.htmlLang, dateModified: today,
    isPartOf: { '@type': 'WebSite', name: '72Tool', url: BASE }
  };

  const faqHtml = copy.faq.map(f =>
    '<details><summary>' + esc(f[0]) + '</summary><p>' + esc(f[1]) + '</p></details>'
  ).join('\n');

  const relHtml = related.map(r =>
    '<a href="' + r.url + '">' + esc(r.label) + '</a>'
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="${u.htmlLang}" dir="ltr" data-site-lang="${lang}">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Language" content="${u.htmlLang}">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="keywords" content="${esc(kw)}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
<meta name="theme-color" content="#16C7B2">
<link rel="canonical" href="${selfUrl}">
<link rel="alternate" hreflang="x-default" href="${enUrl}">
<link rel="alternate" hreflang="zh-Hans" href="${zhUrl}">
<link rel="alternate" hreflang="en" href="${enUrl}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${selfUrl}">
<meta property="og:site_name" content="72Tool">
<meta property="og:locale" content="${u.ogLocale}">
<meta property="og:image" content="${BASE}og-cover.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${BASE}og-cover.png">
<script type="application/ld+json">${JSON.stringify(pageLd)}</script>
<script type="application/ld+json">${JSON.stringify(crumbLd)}</script>
<script type="application/ld+json">${JSON.stringify(itemListLd)}</script>
<script type="application/ld+json">${JSON.stringify(faqLd)}</script>
<style>${CSS}</style>
</head>
<body>
<header class="top"><div class="wrap">
  <a class="logo" href="${homeUrl}">72<span>Tool</span></a>
  <nav>
    <a href="${homeUrl}">${u.home}</a>
    <a href="${homeUrl}?main=tool" class="${main === 'tool' ? 'on' : ''}">${u.tools}</a>
    <a href="${homeUrl}?main=theme" class="${main === 'theme' ? 'on' : ''}">${u.themes}</a>
    <a href="${homeUrl}?main=source" class="${main === 'source' ? 'on' : ''}">${u.sources}</a>
  </nav>
</div></header>

<main class="wrap">
  <nav class="crumb" aria-label="breadcrumb">
    <a href="${homeUrl}">72Tool</a> › <a href="${homeUrl}?main=${main}">${esc(mainLabel)}</a> › <span>${esc(label)}</span>
  </nav>
  <h1>${esc(h1)}</h1>
  <p class="intro">${esc(copy.intro)}</p>
  <div class="meta">
    <span class="chip">${isTool ? u.count(items.length) : items.length + (lang === 'zh' ? ' 套资源' : ' resources')}</span>
    <span class="chip">${u.free}</span>
    <span class="chip">${u.local}</span>
    <span class="chip">${u.noReg}</span>
  </div>

  <section>
    <h2>${isTool ? u.listTitle : u.resTitle}</h2>
    ${listHtml}
    <a class="cta" href="${homeUrl}?main=${main}&amp;sub=${tagKey}">${u.browse}</a>
  </section>

  <section>
    <h2>${u.about}</h2>
    <p class="body-txt">${esc(copy.body)}</p>
  </section>

  <section class="faq">
    <h2>${u.faqTitle}</h2>
    ${faqHtml}
  </section>

  <section>
    <h2>${u.relTitle}</h2>
    <div class="rel">${relHtml}</div>
  </section>
</main>

<footer><div class="wrap">
  <div class="flangs">
    <a href="${zhUrl}" hreflang="zh-Hans">简体中文</a>
    <a href="${enUrl}" hreflang="en">English</a>
  </div>
  <div>
    <a href="${homeUrl}">${u.home}</a> ·
    <a href="/privacy.html">${u.priv}</a> ·
    <a href="/terms.html">${u.terms}</a> ·
    <a href="/sitemap.xml">${u.map}</a>
  </div>
  <div style="margin-top:8px">${u.copyright}</div>
</div></footer>
</body>
</html>`;
}

/* ---------- 主流程 ---------- */
// 不生成聚合页的主分类（其权威页面已存在于站内根目录）
const SKIP_MAINS = ['tool'];

function run() {
  const tools = loadTools();
  const localOnly = loadLocalOnly();
  const themes = loadResourceData('THEME_DATA');
  const sources = loadResourceData('SOURCE_DATA');
  const copyMap = { tool: COPY.TOOL, theme: COPY.THEME, source: COPY.SOURCE };
  const dataMap = { theme: themes, source: sources };

  // 所有分类的扁平清单（用于生成"相关分类"内链）
  const allCats = [];
  ['tool', 'theme', 'source'].forEach(main => {
    Object.keys(CATEGORIES[main].tags).forEach(tagKey => {
      allCats.push({ main, tagKey, meta: CATEGORIES[main].tags[tagKey] });
    });
  });

  let total = 0;
  const written = [];

  CAT_LANGS.forEach(lang => {
    const prefix = UI[lang].dirPrefix;
    const outRoot = path.join(ROOT, prefix.replace(/\/$/, ''), 'c');
    fs.mkdirSync(outRoot, { recursive: true });

    allCats.forEach(cat => {
      const { main, tagKey, meta } = cat;
      // 工具品类不生成 /c/tool-*.html：站内已有 *-tools.html 作为权威品类页，
      // 再生成一份会造成重复内容并稀释权重（由 upgrade-cat.cjs 负责升级既有页）。
      if (SKIP_MAINS.indexOf(main) > -1) return;
      const copy = (copyMap[main][tagKey] || {})[lang];
      if (!copy) { console.warn('  ! 缺少文案: ' + main + '-' + tagKey + '/' + lang); return; }

      // 条目
      let items;
      if (main === 'tool') {
        items = tools.filter(t => t.cat === tagKey);
        if (lang === 'en') items = items.filter(t => localOnly.indexOf(t.slug) === -1);
        items.sort((a, b) => String(lang === 'zh' ? a.zh : a.en).localeCompare(String(lang === 'zh' ? b.zh : b.en)));
      } else {
        items = dataMap[main].filter(r => r.subCate.indexOf(tagKey) > -1);
      }
      if (!items.length) { console.warn('  ! 无条目，跳过: ' + main + '-' + tagKey); return; }

      // 相关分类：同主分类其它标签优先，再补跨主分类
      const sameMain = allCats.filter(c => c.main === main && c.tagKey !== tagKey);
      const other = allCats.filter(c => c.main !== main);
      const pick = sameMain.slice(0, 6).concat(other.slice(0, 3));
      const related = pick.map(c => ({
        label: c.meta[lang] || c.meta.en,
        // 工具品类沿用站内既有的 *-tools.html 权威页面，不使用 /c/tool-* （避免重复内容）
        url: c.main === 'tool'
          ? '/' + prefix + c.tagKey + '-tools.html'
          : '/' + prefix + 'c/' + c.main + '-' + c.tagKey + '.html'
      }));

      const html = renderPage({ lang, main, tagKey, tagMeta: meta, copy, items, related });
      const file = path.join(outRoot, main + '-' + tagKey + '.html');
      fs.writeFileSync(file, html, 'utf8');
      written.push('/' + prefix + 'c/' + main + '-' + tagKey + '.html');
      total++;
    });
  });

  console.log('build-cat: ' + total + ' 个聚合页已生成');
  console.log('  中文: ' + written.filter(w => !w.startsWith('/en/')).length + ' 页');
  console.log('  英文: ' + written.filter(w => w.startsWith('/en/')).length + ' 页');
  fs.writeFileSync(path.join(__dirname, 'cat-pages.json'), JSON.stringify(written, null, 1), 'utf8');
  return written;
}

if (require.main === module) run();

module.exports = { run, loadTools, loadLocalOnly, loadResourceData, esc, ROOT, BASE, CAT_LANGS, CATEGORIES, COPY, CSS, renderPage, UI };
