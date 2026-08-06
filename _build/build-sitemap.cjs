/**
 * build-sitemap.cjs
 * ------------------------------------------------------------------
 * 生成多语言 sitemap 体系（取代旧的单文件 362 URL sitemap.xml）。
 *
 * 产出：
 *   sitemap.xml              —— sitemapindex 索引
 *   sitemap-pages.xml        —— 6 语言首页 + 静态页（about/privacy/terms/contact/sitemap）
 *   sitemap-categories.xml   —— 13 品类页 ×4 语言 + /c/ 主题&源码聚合页
 *   sitemap-tools.xml        —— 工具页 ×4 语言
 *   sitemap-resources.xml    —— 博客等资源页
 *
 * 要点：
 *   - 所有具备多语言版本的 URL 均带 <xhtml:link rel="alternate" hreflang>，
 *     与页面 <head> 内的 hreflang 保持一致（互指才会被搜索引擎采信）。
 *   - lastmod 取文件真实 mtime，而非统一写「今天」。
 *   - 页面清单从文件系统实际扫描得出，避免与磁盘状态不一致。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { BASE } = require('./site.config.cjs');

const ROOT = path.resolve(__dirname, '..');

// 从源文件抽取 JS 数组字面量（兼容未加引号的 key），供「数据驱动」sitemap 使用
function extractArray(srcText, marker) {
  const s0 = srcText.indexOf(marker);
  if (s0 < 0) return [];
  const s = srcText.indexOf('[', s0);
  if (s < 0) return [];
  let depth = 0, j = s;
  for (; j < srcText.length; j++) {
    const c = srcText[j];
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) { j++; break; } }
  }
  const ctx = {};
  vm.createContext(ctx);
  try { return vm.runInContext('(' + srcText.slice(s, j) + ')', ctx) || []; }
  catch (e) { return []; }
}
function loadSiteData() {
  try {
    const hr = fs.readFileSync(path.join(ROOT, 'home-render.js'), 'utf8');
    const td = fs.readFileSync(path.join(ROOT, 'tools-data.js'), 'utf8');
    return {
      TOOLS: extractArray(td, 'window.TOOLS_DATA ='),
      THEME: extractArray(hr, 'const THEME_DATA ='),
      SOURCE: extractArray(hr, 'const SOURCE_DATA =')
    };
  } catch (e) { return { TOOLS: [], THEME: [], SOURCE: [] }; }
}

// 拥有完整站点镜像的语言（翻转后：英文在根，中文在 /zh/）
const MIRROR = [
  { dir: 'zh', code: 'zh-Hans' },
  { dir: '', code: 'en' }
];
// 仅有首页的语言（本项目仅保留中文/英文，故为空）
const HOME_ONLY = [];

const STATIC_PAGES = ['about.html', 'privacy.html', 'terms.html', 'contact.html', 'sitemap.html'];

const EXCLUDE = ['standard-page-template.html', 'tool-admin.html'];
const EXCLUDE_RE = [/^baidu_verify.*\.html$/i];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// 输出层统一去除 .html（磁盘文件仍叫 xxx.html，Cloudflare 从 /xxx 自动解析）
const url = (dir, name) => {
  const n = name ? String(name).replace(/\.html$/, '') : '';
  return BASE + (dir ? dir + '/' : '') + n;
};

function mtime(file) {
  try { return fs.statSync(file).mtime.toISOString().slice(0, 10); }
  catch (e) { return new Date().toISOString().slice(0, 10); }
}

/** 生成 xhtml:link 备用语言块 */
function alts(list, nameOrEmpty) {
  const lines = list.map(l =>
    '    <xhtml:link rel="alternate" hreflang="' + l.code + '" href="' + esc(url(l.dir, nameOrEmpty)) + '"/>'
  );
  lines.push('    <xhtml:link rel="alternate" hreflang="x-default" href="' + esc(url('', nameOrEmpty)) + '"/>');
  return lines.join('\n');
}

function urlNode(u) {
  let s = '  <url>\n    <loc>' + esc(u.loc) + '</loc>\n';
  if (u.alt) s += u.alt + '\n';
  s += '    <lastmod>' + u.lastmod + '</lastmod>\n';
  s += '    <changefreq>' + u.freq + '</changefreq>\n';
  s += '    <priority>' + u.pri + '</priority>\n  </url>\n';
  return s;
}

function urlset(urls) {
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    urls.map(urlNode).join('') +
    '</urlset>\n';
}

/** 扫描出「四个语言目录都存在」的页面名 */
function sharedPages() {
  return fs.readdirSync(ROOT)
    .filter(f => f.endsWith('.html'))
    .filter(f => EXCLUDE.indexOf(f) === -1 && !EXCLUDE_RE.some(re => re.test(f)))
    .filter(f => f !== 'index.html' && !/-tools\.html$/i.test(f) && !/^tag-/.test(f))
    .filter(f => MIRROR.every(l => fs.existsSync(path.join(ROOT, l.dir, f))))
    .sort();
}

// ---------------------------------------------------------------- pages
function buildPages() {
  const urls = [];
  const allHomes = MIRROR.concat(HOME_ONLY);
  const homeAlts = allHomes
    .map(l => '    <xhtml:link rel="alternate" hreflang="' + l.code + '" href="' + esc(url(l.dir, '')) + '"/>')
    .concat(['    <xhtml:link rel="alternate" hreflang="x-default" href="' + esc(url('', '')) + '"/>'])
    .join('\n');

  allHomes.forEach(l => {
    urls.push({
      loc: url(l.dir, ''),
      alt: homeAlts,
      lastmod: mtime(path.join(ROOT, l.dir, 'index.html')),
      freq: 'daily',
      pri: l.dir === '' ? '1.0' : '0.9'
    });
  });

  STATIC_PAGES.forEach(name => {
    const langs = MIRROR.filter(l => fs.existsSync(path.join(ROOT, l.dir, name)));
    if (!langs.length) return;
    const a = langs.length > 1 ? alts(langs, name) : null;
    langs.forEach(l => {
      urls.push({
        loc: url(l.dir, name),
        alt: a,
        lastmod: mtime(path.join(ROOT, l.dir, name)),
        freq: name === 'sitemap.html' ? 'weekly' : 'yearly',
        pri: name === 'sitemap.html' ? '0.5' : '0.4'
      });
    });
  });
  return urls;
}

// ----------------------------------------------------------- categories
function buildCategories() {
  const urls = [];

  // 1) 既有品类页 *-tools.html（四语言镜像）
  const catNames = fs.readdirSync(ROOT).filter(f => /-tools\.html$/i.test(f)).sort();
  catNames.forEach(name => {
    const langs = MIRROR.filter(l => fs.existsSync(path.join(ROOT, l.dir, name)));
    if (!langs.length) return;
    const a = alts(langs, name);
    langs.forEach(l => {
      urls.push({
        loc: url(l.dir, name),
        alt: a,
        lastmod: mtime(path.join(ROOT, l.dir, name)),
        freq: 'weekly',
        pri: '0.8'
      });
    });
  });

  // 2) /c/ 主题与源码聚合页（zh + en）
  const cLangs = [{ dir: '', code: 'en' }, { dir: 'zh', code: 'zh-Hans' }];
  const cRoot = path.join(ROOT, 'c');
  if (fs.existsSync(cRoot)) {
    fs.readdirSync(cRoot).filter(f => f.endsWith('.html')).sort().forEach(f => {
      const name = 'c/' + f;
      const langs = cLangs.filter(l => fs.existsSync(path.join(ROOT, l.dir, 'c', f)));
      const a = langs.length > 1 ? alts(langs, name) : null;
      langs.forEach(l => {
        urls.push({
          loc: url(l.dir, name),
          alt: a,
          lastmod: mtime(path.join(ROOT, l.dir, 'c', f)),
          freq: 'weekly',
          pri: '0.75'
        });
      });
    });
  }
  return urls;
}

// ---------------------------------------------------------------- tools
// 数据驱动：优先从 TOOLS_DATA 读取全部工具，逐条发出「slug 页」URL（含 hreflang）；
// 再扫描仍存在于双语言镜像、但不属于 TOOLS_DATA 的遗留共享页（如旧博客页）补齐。
function buildTools() {
  const urls = [];
  const seen = {};
  const D = loadSiteData();
  const pushTool = (name) => {
    if (seen[name]) return;
    if (!MIRROR.every(l => fs.existsSync(path.join(ROOT, l.dir, name)))) return;
    seen[name] = 1;
    const a = alts(MIRROR, name);
    MIRROR.forEach(l => {
      urls.push({
        loc: url(l.dir, name),
        alt: a,
        lastmod: mtime(path.join(ROOT, l.dir, name)),
        freq: 'monthly',
        pri: l.dir === '' ? '0.7' : '0.65'
      });
    });
  };
  (D.TOOLS || []).forEach(t => { if (t && t.slug) pushTool(t.slug); });
  // 补齐非 TOOLS_DATA 的遗留共享页（双语言都存在）；
  // 排除 theme-*/source-* profile 页（由 buildDataEntries 单独处理，避免重复）
  sharedPages().filter(n => STATIC_PAGES.indexOf(n) === -1)
    .filter(n => !/^(theme|source)-\d+\.html$/.test(n))
    .forEach(pushTool);
  return { urls, count: urls.length / MIRROR.length };
}

// ----------------------------------------------------- 博客文章（数据驱动）
// 读取 gen-blog-pages.cjs 产出的 blog/articles.json 清单，发出每篇文章的
// 中/英双语 URL（带 hreflang 互指）。这些页是真实静态页，可被谷歌抓取。
function buildBlog() {
  const urls = [];
  const manifest = path.join(ROOT, 'blog', 'articles.json');
  if (!fs.existsSync(manifest)) {
    console.log('build-sitemap: 未找到 blog/articles.json（请先运行 gen-blog-pages.cjs），跳过博客文章。');
    return urls;
  }
  const list = JSON.parse(fs.readFileSync(manifest, 'utf8'));
  list.forEach(a => {
    const a2 = alts(MIRROR, a.file);
    MIRROR.forEach(l => {
      urls.push({
        loc: url(l.dir, a.file),
        alt: a2,
        lastmod: mtime(path.join(ROOT, l.dir, a.file)),
        freq: 'monthly',
        pri: '0.6'
      });
    });
  });
  return urls;
}

// --------------------------------------- 新条目静态 profile 页（数据驱动）
// 采集管线 daily_ingest.py 为新增的 theme / source 生成 theme-<idx>.html 与
// source-<idx>.html（英文在 root、中文在 /zh/）。此处据 THEME_DATA / SOURCE_DATA 发出这些 URL。
function buildDataEntries() {
  const urls = [];
  const D = loadSiteData();
  const pushEntry = (fname) => {
    if (!MIRROR.every(l => fs.existsSync(path.join(ROOT, l.dir, fname)))) return;
    const a = alts(MIRROR, fname);
    MIRROR.forEach(l => {
      urls.push({
        loc: url(l.dir, fname),
        alt: a,
        lastmod: mtime(path.join(ROOT, l.dir, fname)),
        freq: 'monthly',
        pri: '0.6'
      });
    });
  };
  (D.THEME || []).forEach(t => { if (t && t.idx != null) pushEntry('theme-' + t.idx + '.html'); });
  (D.SOURCE || []).forEach(s => { if (s && s.idx != null) pushEntry('source-' + s.idx + '.html'); });
  return urls;
}

// ------------------------------------------------------------ resources
function buildResources() {
  const urls = [];
  // 注：博客文章页已移至 sitemap-blog.xml（由 buildBlog 数据驱动生成），
  // 此处不再扫描 blog/，避免同一 URL 出现在两个子 sitemap。

  // tag 页（zh + en）
  const tagLangs = [{ dir: '', code: 'en' }, { dir: 'zh', code: 'zh-Hans' }];
  fs.readdirSync(ROOT).filter(f => f.startsWith('tag-') && f.endsWith('.html')).sort().forEach(f => {
    const langs = tagLangs.filter(l => fs.existsSync(path.join(ROOT, l.dir, f)));
    const a = langs.length > 1 ? alts(langs, f) : null;
    langs.forEach(l => {
      urls.push({
        loc: url(l.dir, f),
        alt: a,
        lastmod: mtime(path.join(ROOT, l.dir, f)),
        freq: 'weekly',
        pri: '0.65'
      });
    });
  });

  return urls;
}

// ------------------------------------------------------------------ run
function run() {
  const files = [];

  const pages = buildPages();
  const cats = buildCategories();
  const tools = buildTools();
  const res = buildResources();
  const blog = buildBlog();
  const data = buildDataEntries();

  // 跨子 sitemap 去重：同一 loc 只归到一个文件（优先级见下方顺序）
  const seen = new Set();
  const dedupe = (urls) => urls.filter(u => {
    if (seen.has(u.loc)) return false;
    seen.add(u.loc);
    return true;
  });

  const write = (name, urls) => {
    const kept = dedupe(urls);
    if (!kept.length) return 0;
    fs.writeFileSync(path.join(ROOT, name), urlset(kept), 'utf8');
    files.push(name);
    return kept.length;
  };

  const nPages = write('sitemap-pages.xml', pages);
  const nCats = write('sitemap-categories.xml', cats);
  const nTools = write('sitemap-tools.xml', tools.urls);
  const nRes = res.length ? write('sitemap-resources.xml', res) : 0;
  const nBlog = blog.length ? write('sitemap-blog.xml', blog) : 0;
  const nData = data.length ? write('sitemap-data.xml', data) : 0;

  // 索引
  const today = new Date().toISOString().slice(0, 10);
  let idx = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  files.forEach(f => {
    idx += '  <sitemap>\n    <loc>' + esc(BASE + f) + '</loc>\n    <lastmod>' + today + '</lastmod>\n  </sitemap>\n';
  });
  idx += '</sitemapindex>\n';
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), idx, 'utf8');

  const total = nPages + nCats + nTools + nRes + nBlog + nData;
  console.log('build-sitemap: 索引 + ' + files.length + ' 个子 sitemap，共 ' + total + ' 条 URL');
  console.log('  sitemap-pages.xml      : ' + nPages + ' (6 语言首页 + 静态页)');
  console.log('  sitemap-categories.xml : ' + nCats + ' (品类页 + 聚合页)');
  console.log('  sitemap-tools.xml      : ' + nTools + ' (' + tools.count + ' 页 × 4 语言)');
  if (nRes) console.log('  sitemap-resources.xml  : ' + nRes + ' (tag 页)');
  if (nBlog) console.log('  sitemap-blog.xml       : ' + nBlog + ' (博客文章 ×2 语言)');
  if (nData) console.log('  sitemap-data.xml       : ' + nData + ' (新条目 profile 页 ×2 语言)');
  return { total, files };
}

if (require.main === module) run();

module.exports = { run, sharedPages, loadSiteData, ROOT, BASE };
