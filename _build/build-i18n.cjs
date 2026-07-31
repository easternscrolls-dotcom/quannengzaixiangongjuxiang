/* ============================================================
 *  build-i18n.cjs
 *  从根 index.html 一键生成各语种独立静态页：/en /jp /es /de /ar
 *  - 每个语种独立 title / description / keywords / OG / Schema
 *  - hreflang 全量互指，x-default 指向英文
 *  - 阿拉伯语自动 dir="rtl"
 *  用法：node _build/build-i18n.cjs
 * ============================================================ */
const fs = require('fs');
const path = require('path');
const { BASE, LANGS, STATIC_PAGES } = require('./site.config.cjs');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'index.html');

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function ogImageFor(langKey) {
  const cand = ['og-cover-' + langKey + '.png', 'og-cover-' + langKey + '.jpg', 'og-cover.png', 'og-cover.svg'];
  for (const c of cand) if (fs.existsSync(path.join(ROOT, c))) return BASE + c;
  return BASE + 'og-cover.png';
}

/* ---------- 生成 <head> 中的 SEO 区块 ---------- */
function buildSeoHead(L) {
  const url = BASE + L.dir;
  const img = ogImageFor(L.key);
  const today = new Date().toISOString().slice(0, 10);

  const hreflangs = LANGS.map(l =>
    `<link rel="alternate" hreflang="${l.hreflang}" href="${BASE}${l.dir}">`
  ).join('\n');

  const crumbItems = L.crumbs.map((name, i) => {
    const keys = ['tool', 'theme', 'source'];
    return `    {"@type":"ListItem","position":${i + 2},"name":${JSON.stringify(name)},"item":"${BASE}${L.catPages ? L.dir + 'c/' : ''}${L.catPages ? keys[i] + '.html' : ''}"}`;
  }).join(',\n');

  return `<!--SEO_HEAD_START-->
<title>${esc(L.title)}</title>
<meta name="description" content="${esc(L.desc)}">
<meta name="keywords" content="${esc(L.keywords)}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<meta name="author" content="72Tool">
<meta name="theme-color" content="#16C7B2">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180.png">
<link rel="canonical" href="${url}">
<!-- hreflang：真实同域路径，x-default 指向英文（海外搜索兜底）-->
<link rel="alternate" hreflang="x-default" href="${BASE}en/">
${hreflangs}
<!-- Open Graph / Twitter（每语种独立文案与封面）-->
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(L.ogTitle)}">
<meta property="og:description" content="${esc(L.ogDesc)}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="72Tool">
<meta property="og:locale" content="${L.ogLocale}">
${LANGS.filter(x => x.key !== L.key).map(x => `<meta property="og:locale:alternate" content="${x.ogLocale}">`).join('\n')}
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(L.ogTitle)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(L.ogTitle)}">
<meta name="twitter:description" content="${esc(L.ogDesc)}">
<meta name="twitter:image" content="${img}">
<!-- 结构化数据 -->
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"WebSite",
  "name":"72Tool",
  "alternateName":${JSON.stringify(L.schemaName)},
  "url":"${url}",
  "inLanguage":${JSON.stringify(LANGS.map(l => l.hreflang))},
  "description":${JSON.stringify(L.schemaDesc)},
  "potentialAction":{"@type":"SearchAction","target":"${url}?q={search_term_string}","query-input":"required name=search_term_string"}
}
</script>
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"ItemList",
  "name":${JSON.stringify(L.schemaName)},
  "numberOfItems":365,
  "itemListElement":[
${L.crumbs.map((n, i) => `    {"@type":"ListItem","position":${i + 1},"name":${JSON.stringify(n)},"url":"${url}"}`).join(',\n')}
  ]
}
</script>
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"BreadcrumbList",
  "itemListElement":[
    {"@type":"ListItem","position":1,"name":"72Tool","item":"${url}"},
${crumbItems}
  ]
}
</script>
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"Organization",
  "name":"72Tool",
  "url":"${BASE}",
  "logo":"${img}",
  "sameAs":["https://github.com/","https://x.com/","https://www.reddit.com/"]
}
</script>
<script type="application/ld+json" id="page-jsonld">
{
  "@context":"https://schema.org",
  "@type":"WebPage",
  "name":${JSON.stringify(L.title)},
  "url":"${url}",
  "inLanguage":${JSON.stringify(LANGS.map(l => l.hreflang))},
  "isFamilyFriendly":true,
  "license":"${BASE}terms.html",
  "dateModified":"${today}",
  "primaryImageOfPage":{"@type":"ImageObject","url":"${img}","width":1200,"height":630}
}
</script>
<!--SEO_HEAD_END-->`;
}

/* ---------- 主流程 ---------- */
function run() {
  if (!fs.existsSync(SRC)) { console.error('index.html not found'); process.exit(1); }
  let src = fs.readFileSync(SRC, 'utf8');

  if (src.indexOf('<!--SEO_HEAD_START-->') === -1 || src.indexOf('<!--SEO_HEAD_END-->') === -1) {
    console.error('index.html 缺少 <!--SEO_HEAD_START--> / <!--SEO_HEAD_END--> 标记'); process.exit(1);
  }

  let count = 0;
  LANGS.forEach(L => {
    if (L.key === 'zh') return;               // 中文站就是根 index.html
    let html = src;

    // 1) <html> 标签：语种 / 方向 / data-site-lang
    html = html.replace(
      /<html[^>]*>/,
      `<html lang="${L.htmlLang}" dir="${L.rtl ? 'rtl' : 'ltr'}" data-site-lang="${L.key}" data-theme="light" data-lang="${L.htmlLang}">`
    );

    // 2) Content-Language 响应式声明
    html = html.replace(
      /<meta http-equiv="Content-Language"[^>]*>/,
      `<meta http-equiv="Content-Language" content="${L.htmlLang}">`
    );

    // 3) 整块替换 SEO head
    const start = html.indexOf('<!--SEO_HEAD_START-->');
    const end = html.indexOf('<!--SEO_HEAD_END-->') + '<!--SEO_HEAD_END-->'.length;
    html = html.slice(0, start) + buildSeoHead(L) + html.slice(end);

    // 4) 站长验证 meta 仅保留在中文站（海外站无意义，且减少无用请求）
    html = html.replace(/<meta name="baidu-site-verification"[^>]*>\s*/g, '')
               .replace(/<meta name="bytedance-verification-code"[^>]*>\s*/g, '')
               .replace(/<meta name="shenma-site-verification"[^>]*>\s*/g, '')
               .replace(/<meta name="sogou-site-verification"[^>]*>\s*/g, '')
               .replace(/<!-- 搜索引擎站长验证（务必保留） -->\s*/g, '');

    // 5) 海外站去掉 autopush.js（百度自动推送，对 Google/Bing/Yandex 无用）
    html = html.split('<script defer src="/autopush.js"></script>').join('');
    html = html.split('<script src="/autopush.js"></script>').join('');
    html = html.split('<script defer src="autopush.js"></script>').join('');

    // 6) 翻转 i18n 语言 span：目标语言可见，中文隐藏（所有海外语言统一处理）
    if (L.key !== 'zh') {
      // 从所有 i18n-en 中移除 hidden（让它可见）
      html = html.split('i18n-en hidden').join('i18n-en');
      // 给没有 hidden 的 i18n-zh 加上 hidden
      html = html.split('i18n-zh">').join('i18n-zh" hidden>');
    }

    // 7) 修正页脚/导航内部链接指回中文站（所有海外语言）
    if (L.key !== 'zh') {
      const pages = ['index.html', 'about.html', 'privacy.html', 'terms.html', 'contact.html', 'sitemap.html'];
      pages.forEach(p => {
        html = html.replace(new RegExp('href="/' + p.replace(/\./g, '\\.') + '"', 'g'), 'href="/' + L.key + '/' + p + '"');
      });
      html = html.split('href="/terms.html#dmca"').join('href="/' + L.key + '/terms.html#dmca"');
    }

    // 5) 写入目标目录
    const outDir = path.join(ROOT, L.dir.replace(/\/$/, ''));
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
    console.log('  ✓ /' + L.dir + 'index.html   (' + L.htmlLang + (L.rtl ? ', RTL' : '') + ')');
    count++;
  });

  console.log('build-i18n: ' + count + ' language pages generated.');
}

run();
module.exports = { buildSeoHead, ogImageFor };
