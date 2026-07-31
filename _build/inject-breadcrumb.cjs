/**
 * inject-breadcrumb.cjs
 * ------------------------------------------------------------------
 * P2-4: 为工具页注入 BreadcrumbList JSON-LD 结构化数据。
 *
 * 当前仅品类页和首页有面包屑 JSON-LD。工具页缺少 → Google SERP
 * 无法展示层级路径 → 点击率下降。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { BASE } = require('./site.config.cjs');

const ROOT = path.resolve(__dirname, '..');

// 品类 slug → hreflang 显示名
const CAT_NAMES = {
  zh: { img: '图片工具', pdf: 'PDF 工具', dev: '开发工具', text: '文本工具', audio: '音频工具',
        video: '视频工具', csv: 'CSV 工具', unit: '单位换算', url: 'URL 工具', json: 'JSON 工具',
        seo: 'SEO 工具', gif: 'GIF 工具', business: '商务工具' },
  en: { img: 'Image Tools', pdf: 'PDF Tools', dev: 'Dev Tools', text: 'Text Tools', audio: 'Audio Tools',
        video: 'Video Tools', csv: 'CSV Tools', unit: 'Unit Converter', url: 'URL Tools', json: 'JSON Tools',
        seo: 'SEO Tools', gif: 'GIF Tools', business: 'Business Tools' }
};

// 从 tools-data.js 加载 slug → category 映射
function loadCategoryMap() {
  const code = fs.readFileSync(path.join(ROOT, 'tools-data.js'), 'utf8');
  const g = {};
  new Function('window', code)(g);
  const map = {};
  (g.TOOLS_DATA || []).forEach(t => {
    if (t.slug && t.cat) map[t.slug] = t.cat;
  });
  return map;
}

function buildBreadcrumbLD(pagePath, cat, lang) {
  const fname = path.basename(pagePath);
  const slug = fname.replace('.html', '');
  const prefix = lang === 'en' ? 'en/' : '';

  // 从 h1 提取工具名
  let html = fs.readFileSync(pagePath, 'utf8');
  let toolName = slug;
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (h1Match) {
    toolName = h1Match[1].replace(/<[^>]+>/g, '').trim();
    // 截取 | 前的主要部分
    const barIdx = toolName.indexOf('|');
    if (barIdx > 0) toolName = toolName.slice(0, barIdx).trim();
    if (!toolName) toolName = slug;
  }

  const catName = (CAT_NAMES[lang] && CAT_NAMES[lang][cat]) || cat;
  const catFile = cat + '-tools.html';

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': '72Tool', 'item': BASE + prefix },
      { '@type': 'ListItem', 'position': 2, 'name': catName, 'item': BASE + prefix + catFile },
      { '@type': 'ListItem', 'position': 3, 'name': toolName, 'item': BASE + prefix + fname }
    ]
  };

  return ld;
}

function inject(html, ld) {
  // 已有 BreadcrumbList 则跳过
  if (html.indexOf('"BreadcrumbList"') > -1) return { html, changed: false };

  const tag = '<script type="application/ld+json">\n' + JSON.stringify(ld, null, 2) + '\n</script>';

  // 注入在最后一个 JSON-LD 脚本之后（如果存在），否则在 </head> 之前
  const lastLD = html.lastIndexOf('application/ld+json');
  if (lastLD > -1) {
    const endTag = html.indexOf('</script>', lastLD);
    if (endTag > -1) {
      return { html: html.slice(0, endTag + 9) + '\n' + tag + html.slice(endTag + 9), changed: true };
    }
  }

  return { html: html.replace('</head>', tag + '\n</head>'), changed: true };
}

function run() {
  const catMap = loadCategoryMap();
  const dirs = [
    { dir: '', lang: 'zh' },
    { dir: 'en/', lang: 'en' }
  ];

  let total = 0;
  dirs.forEach(({ dir, lang }) => {
    const d = path.join(ROOT, dir);
    fs.readdirSync(d).filter(f => {
      if (!f.endsWith('.html')) return false;
      if (f === 'index.html') return false;
      if (/-tools\.html$/i.test(f)) return false;
      if (/^tag-/i.test(f)) return false;
      if (/^baidu_verify/i.test(f)) return false;
      return true;
    }).forEach(f => {
      const slug = f; // tools-data.js 中的 slug 已含 .html 扩展名
      const cat = catMap[slug];
      if (!cat) return;

      const fp = path.join(d, f);
      const ld = buildBreadcrumbLD(fp, cat, lang);
      let html = fs.readFileSync(fp, 'utf8');

      const result = inject(html, ld);
      if (!result.changed) return;

      fs.writeFileSync(fp, result.html, 'utf8');
      total++;
    });
  });

  console.log('inject-breadcrumb: ' + total + ' 个工具页已注入 BreadcrumbList');
  return total;
}

if (require.main === module) run();

module.exports = { run, loadCategoryMap };
