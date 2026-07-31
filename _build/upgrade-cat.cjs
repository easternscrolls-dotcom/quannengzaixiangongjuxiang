/* ============================================================
 *  upgrade-cat.cjs —— 就地升级既有品类页 <cat>-tools.html
 *  覆盖 root(zh) / en / jp / es 四套，共 13 × 4 = 52 页
 *
 *  修复：
 *   1. hreflang 由「各语种首页」纠正为「同一品类页的各语种版本」
 *   2. 移除 no-cache 三件套（阻断 CDN 缓存，拖慢海外 LCP）
 *   3. 补 Content-Language / robots / canonical 自指
 *   4. 注入 CollectionPage + BreadcrumbList + ItemList + FAQPage 结构化数据
 *   5. 追加分类正文、FAQ（zh/en）与相关分类内链
 *
 *  幂等：内容块用 CATBOOST 标记包裹，重跑先清除再写入
 *  用法：node _build/upgrade-cat.cjs
 * ============================================================ */
const fs = require('fs');
const path = require('path');
const { BASE, CATEGORIES } = require('./site.config.cjs');
const COPY = require('./cat-copy.cjs');

const ROOT = path.resolve(__dirname, '..');

/* 语种矩阵：dir = 目录前缀，copy = 使用哪套文案（jp/es 暂无原生文案，走技术修复） */
const LANGS = [
  { key: 'zh', dir: '',    htmlLang: 'zh-CN', hreflang: 'zh-Hans', copy: 'zh' },
  { key: 'en', dir: 'en/', htmlLang: 'en',    hreflang: 'en',      copy: 'en' },
  { key: 'jp', dir: 'jp/', htmlLang: 'ja',    hreflang: 'ja',      copy: null },
  { key: 'es', dir: 'es/', htmlLang: 'es',    hreflang: 'es',      copy: null }
];

const TAGS = Object.keys(CATEGORIES.tool.tags);   // 13 个工具分类

const UI = {
  zh: { about: '关于这个分类', faq: '常见问题', rel: '相关分类', more: '更多工具分类' },
  en: { about: 'About this category', faq: 'Frequently asked questions', rel: 'Related categories', more: 'More categories' },
  jp: { about: 'このカテゴリについて', faq: 'よくある質問', rel: '関連カテゴリ', more: '他のカテゴリ' },
  es: { about: 'Sobre esta categoría', faq: 'Preguntas frecuentes', rel: 'Categorías relacionadas', more: 'Más categorías' }
};

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* 从页面里抽取工具卡片（名称 + 链接），用于生成 ItemList */
function extractCards(html, langKey) {
  const out = [];
  const re = /<a class="card" href="([^"]+)"[\s\S]*?<span class="nm">([\s\S]*?)<\/span><\/a>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1];
    const inner = m[2];
    const zh = (inner.match(/<span class="i18n-zh"[^>]*>([\s\S]*?)<\/span>/) || [])[1] || '';
    const en = (inner.match(/<span class="i18n-en"[^>]*>([\s\S]*?)<\/span>/) || [])[1] || '';
    const name = (langKey === 'zh' ? zh : en) || zh || en;
    if (href && name) out.push({ href: href.trim(), name: name.trim() });
  }
  return out;
}

/* ---------- 追加区块的样式（一次性注入，跟随原页配色）---------- */
const BOOST_CSS = `
<style id="catboost-css">
.cb-sec{margin:38px 0 0}
.cb-sec h2{font-size:19px;margin:0 0 12px;color:#111827}
.cb-sec p{color:#4b5563;font-size:14.5px;line-height:1.85;max-width:76ch}
.cb-faq details{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:13px 16px;margin-bottom:9px}
.cb-faq summary{cursor:pointer;font-weight:650;font-size:14.5px;color:#1f2937;min-height:26px}
.cb-faq details p{margin-top:8px;font-size:14px}
.cb-rel{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}
.cb-rel a{padding:9px 14px;background:#fff;border:1px solid #e5e7eb;border-radius:20px;color:#2478f5;text-decoration:none;font-size:13px;display:inline-flex;align-items:center;min-height:40px}
.cb-rel a:hover{border-color:#2478f5;box-shadow:0 3px 10px rgba(36,120,245,.12)}
@media (pointer:coarse){.cb-rel a,.card{min-height:48px}}
@media (prefers-color-scheme:dark){
 .cb-sec h2{color:#E8EDF5}.cb-sec p{color:#AAB6C8}
 .cb-faq details{background:#161E2C;border-color:#26303F}
 .cb-faq summary{color:#E8EDF5}
 .cb-rel a{background:#161E2C;border-color:#26303F;color:#3FE0C8}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
</style>`;

/* ---------- 生成正确的 hreflang 区块（页面级一一对应）---------- */
function buildHreflang(slug) {
  const lines = ['<link rel="alternate" hreflang="x-default" href="' + BASE + 'en/' + slug + '">'];
  LANGS.forEach(l => {
    lines.push('<link rel="alternate" hreflang="' + l.hreflang + '" href="' + BASE + l.dir + slug + '">');
  });
  return lines.join('\n');
}

/* ---------- 生成结构化数据 ---------- */
function buildJsonLd(o) {
  const { L, slug, label, mainLabel, cards, copy, title, desc } = o;
  const self = BASE + L.dir + slug;
  const today = new Date().toISOString().slice(0, 10);
  const blocks = [];

  blocks.push({
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    name: title, url: self, description: desc,
    inLanguage: L.htmlLang, dateModified: today,
    isPartOf: { '@type': 'WebSite', name: '72Tool', url: BASE }
  });

  blocks.push({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '72Tool', item: BASE + L.dir },
      { '@type': 'ListItem', position: 2, name: mainLabel, item: BASE + L.dir },
      { '@type': 'ListItem', position: 3, name: label, item: self }
    ]
  });

  blocks.push({
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: label, numberOfItems: cards.length,
    itemListElement: cards.slice(0, 60).map((c, i) => ({
      '@type': 'ListItem', position: i + 1, name: c.name,
      url: BASE + L.dir + c.href.replace(/^\.?\//, '')
    }))
  });

  if (copy && copy.faq) {
    blocks.push({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: copy.faq.map(f => ({
        '@type': 'Question', name: f[0],
        acceptedAnswer: { '@type': 'Answer', text: f[1] }
      }))
    });
  }

  return blocks.map(b => '<script type="application/ld+json">' + JSON.stringify(b) + '</script>').join('\n');
}

/* ---------- 生成页面底部内容区块 ---------- */
function buildBody(o) {
  const { L, tagKey, copy, related } = o;
  const u = UI[L.key];
  let html = '\n<!--CATBOOST_START-->\n';

  if (copy) {
    html += '<section class="cb-sec"><h2>' + u.about + '</h2><p>' + esc(copy.body) + '</p></section>\n';
    html += '<section class="cb-sec cb-faq"><h2>' + u.faq + '</h2>\n';
    copy.faq.forEach(f => {
      html += '<details><summary>' + esc(f[0]) + '</summary><p>' + esc(f[1]) + '</p></details>\n';
    });
    html += '</section>\n';
  }

  html += '<nav class="cb-sec" aria-label="' + u.rel + '"><h2>' + u.rel + '</h2><div class="cb-rel">\n';
  related.forEach(r => { html += '<a href="' + r.url + '">' + esc(r.label) + '</a>\n'; });
  html += '</div></nav>\n';
  html += '<!--CATBOOST_END-->\n';
  return html;
}

/* ---------- 主流程 ---------- */
function run() {
  const copyMap = COPY.TOOL;
  let done = 0, skipped = 0;
  const touched = [];

  LANGS.forEach(L => {
    TAGS.forEach(tagKey => {
      const slug = tagKey + '-tools.html';
      const file = path.join(ROOT, L.dir.replace(/\/$/, ''), slug);
      if (!fs.existsSync(file)) { console.warn('  ! 不存在，跳过: ' + L.dir + slug); skipped++; return; }

      let html = fs.readFileSync(file, 'utf8');
      const meta = CATEGORIES.tool.tags[tagKey];
      const label = (L.key === 'zh' ? meta.zh : meta.en);
      const mainLabel = (L.key === 'zh' ? CATEGORIES.tool.zh : CATEGORIES.tool.en);
      const copy = L.copy ? (copyMap[tagKey] || {})[L.copy] : null;
      const cards = extractCards(html, L.key);
      const self = BASE + L.dir + slug;

      /* --- 0) 幂等：清除上一次注入的内容 --- */
      html = html.replace(/\n?<!--CATBOOST_START-->[\s\S]*?<!--CATBOOST_END-->\n?/g, '\n');
      html = html.replace(/\n?<style id="catboost-css">[\s\S]*?<\/style>/g, '');
      html = html.replace(/\n?<!--CATBOOST_LD_START-->[\s\S]*?<!--CATBOOST_LD_END-->/g, '');

      /* --- 1) 移除 no-cache 三件套（阻断 CDN / 浏览器缓存）--- */
      html = html.replace(/[ \t]*<meta http-equiv="Cache-Control"[^>]*>\s*\n?/gi, '')
                 .replace(/[ \t]*<meta http-equiv="Pragma"[^>]*>\s*\n?/gi, '')
                 .replace(/[ \t]*<meta http-equiv="Expires"[^>]*>\s*\n?/gi, '');

      /* --- 2) Content-Language + robots（去重后重加）--- */
      html = html.replace(/[ \t]*<meta http-equiv="Content-Language"[^>]*>\s*\n?/gi, '')
                 .replace(/[ \t]*<meta name="robots"[^>]*>\s*\n?/gi, '');
      html = html.replace(/<meta charset="UTF-8">/i,
        '<meta charset="UTF-8">\n<meta http-equiv="Content-Language" content="' + L.htmlLang + '">\n' +
        '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">');

      /* --- 3) <html lang> 纠正 --- */
      html = html.replace(/<html[^>]*>/i, '<html lang="' + L.htmlLang + '" dir="ltr" data-site-lang="' + L.key + '">');

      /* --- 3.5) 标题 / 描述优化（仅 zh / en：有原生文案，避免产出错语种文本）
         原标题如「图片工具在线工具 - 免费无需登录」用词重复且无数量信息，
         带上工具数量既提高点击率，也让长尾词更完整。--- */
      if (copy) {
        const newTitle = L.key === 'zh'
          ? label + '｜' + cards.length + ' 款免费在线工具 - 72Tool'
          : label + ' — ' + cards.length + ' Free Online Tools | 72Tool';
        html = html.replace(/<title>[\s\S]*?<\/title>/i, '<title>' + esc(newTitle) + '</title>');
        const newDesc = copy.intro.replace(/\s+/g, ' ').trim().slice(0, 156);
        if (/<meta name="description"[^>]*>/i.test(html)) {
          html = html.replace(/<meta name="description"[^>]*>/i, '<meta name="description" content="' + esc(newDesc) + '">');
        } else {
          html = html.replace(/<\/title>/i, '</title>\n<meta name="description" content="' + esc(newDesc) + '">');
        }
        html = html.replace(/<meta property="og:title"[^>]*>/i, '<meta property="og:title" content="' + esc(newTitle) + '">');
        html = html.replace(/<meta property="og:description"[^>]*>/i, '<meta property="og:description" content="' + esc(newDesc) + '">');
      }

      /* --- 4) canonical 自指 --- */
      html = html.replace(/[ \t]*<link rel="canonical"[^>]*>\s*\n?/gi, '');
      html = html.replace(/<\/title>/i, '</title>\n<link rel="canonical" href="' + self + '">');

      /* --- 5) hreflang：全部替换为页面级一一对应 --- */
      html = html.replace(/[ \t]*<link rel="alternate" hreflang="[^"]*"[^>]*>\s*\n?/gi, '');
      html = html.replace(/<link rel="canonical"[^>]*>/i, m => m + '\n' + buildHreflang(slug));

      /* --- 6) JSON-LD 注入 --- */
      const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || label;
      const descM = html.match(/<meta name="description" content="([^"]*)"/i);
      const desc = descM ? descM[1] : (copy ? copy.intro.slice(0, 150) : label);
      const ld = buildJsonLd({ L, slug, label, mainLabel, cards, copy, title, desc });
      html = html.replace(/<\/head>/i, '<!--CATBOOST_LD_START-->\n' + ld + '\n<!--CATBOOST_LD_END-->\n</head>');

      /* --- 7) 样式 + 底部内容区块 --- */
      const related = TAGS.filter(t => t !== tagKey).slice(0, 8).map(t => ({
        label: (L.key === 'zh' ? CATEGORIES.tool.tags[t].zh : CATEGORIES.tool.tags[t].en),
        url: '/' + L.dir + t + '-tools.html'
      }));
      html = html.replace(/<\/head>/i, BOOST_CSS + '\n</head>');
      const body = buildBody({ L, tagKey, copy, related });
      if (html.indexOf('<script src="/nebula-bg.js"></script>') > -1) {
        html = html.replace('<script src="/nebula-bg.js"></script>', body + '<script src="/nebula-bg.js"></script>');
      } else {
        html = html.replace(/<\/body>/i, body + '</body>');
      }

      fs.writeFileSync(file, html, 'utf8');
      touched.push('/' + L.dir + slug);
      done++;
    });
  });

  console.log('upgrade-cat: ' + done + ' 个品类页已升级' + (skipped ? '（跳过 ' + skipped + '）' : ''));
  LANGS.forEach(L => {
    const n = touched.filter(t => t.startsWith('/' + L.dir) && (L.dir || t.split('/').length === 2)).length;
    console.log('  ' + (L.dir || 'root') + ': ' + touched.filter(t => {
      const p = t.replace(/^\//, '');
      return L.dir ? p.startsWith(L.dir) : p.indexOf('/') === -1;
    }).length + ' 页');
  });
  fs.writeFileSync(path.join(__dirname, 'cat-legacy-pages.json'), JSON.stringify(touched, null, 1), 'utf8');
  return touched;
}

if (require.main === module) run();

module.exports = { run, LANGS, TAGS, UI, esc, extractCards, ROOT, BASE, CATEGORIES, COPY, BOOST_CSS, buildHreflang, buildJsonLd, buildBody };
