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
const { BASE } = require('./site.config.cjs');

const ROOT = path.resolve(__dirname, '..');

// 拥有完整站点镜像的语言
const MIRROR = [
  { dir: '', code: 'zh-Hans' },
  { dir: 'en', code: 'en' },
  { dir: 'jp', code: 'ja' },
  { dir: 'es', code: 'es' }
];
// 仅有首页的语言
const HOME_ONLY = [
  { dir: 'de', code: 'de' },
  { dir: 'ar', code: 'ar' }
];

const STATIC_PAGES = ['about.html', 'privacy.html', 'terms.html', 'contact.html', 'sitemap.html'];

const EXCLUDE = ['standard-page-template.html', 'tool-admin.html'];
const EXCLUDE_RE = [/^baidu_verify.*\.html$/i];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const url = (dir, name) => BASE + (dir ? dir + '/' : '') + (name || '');

function mtime(file) {
  try { return fs.statSync(file).mtime.toISOString().slice(0, 10); }
  catch (e) { return new Date().toISOString().slice(0, 10); }
}

/** 生成 xhtml:link 备用语言块 */
function alts(list, nameOrEmpty) {
  const lines = list.map(l =>
    '    <xhtml:link rel="alternate" hreflang="' + l.code + '" href="' + esc(url(l.dir, nameOrEmpty)) + '"/>'
  );
  lines.push('    <xhtml:link rel="alternate" hreflang="x-default" href="' + esc(url('en', nameOrEmpty)) + '"/>');
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
    .filter(f => f !== 'index.html' && !/-tools\.html$/i.test(f))
    .filter(f => MIRROR.every(l => fs.existsSync(path.join(ROOT, l.dir, f))))
    .sort();
}

// ---------------------------------------------------------------- pages
function buildPages() {
  const urls = [];
  const allHomes = MIRROR.concat(HOME_ONLY);
  const homeAlts = allHomes
    .map(l => '    <xhtml:link rel="alternate" hreflang="' + l.code + '" href="' + esc(url(l.dir, '')) + '"/>')
    .concat(['    <xhtml:link rel="alternate" hreflang="x-default" href="' + esc(url('en', '')) + '"/>'])
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
  const cLangs = [{ dir: '', code: 'zh-Hans' }, { dir: 'en', code: 'en' }];
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
function buildTools() {
  const urls = [];
  const names = sharedPages().filter(n => STATIC_PAGES.indexOf(n) === -1);
  names.forEach(name => {
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
  });
  return { urls, count: names.length };
}

// ------------------------------------------------------------ resources
function buildResources() {
  const urls = [];
  // blog
  const blogDir = path.join(ROOT, 'blog');
  if (fs.existsSync(blogDir)) {
    fs.readdirSync(blogDir).filter(f => f.endsWith('.html')).sort().forEach(f => {
      urls.push({
        loc: url('', 'blog/' + f),
        alt: null,
        lastmod: mtime(path.join(blogDir, f)),
        freq: 'monthly',
        pri: f === 'index.html' ? '0.6' : '0.55'
      });
    });
  }

  // tag 页（zh + en）
  const tagLangs = [{ dir: '', code: 'zh-Hans' }, { dir: 'en', code: 'en' }];
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

  const write = (name, urls) => {
    fs.writeFileSync(path.join(ROOT, name), urlset(urls), 'utf8');
    files.push(name);
    return urls.length;
  };

  const nPages = write('sitemap-pages.xml', pages);
  const nCats = write('sitemap-categories.xml', cats);
  const nTools = write('sitemap-tools.xml', tools.urls);
  const nRes = res.length ? write('sitemap-resources.xml', res) : 0;

  // 索引
  const today = new Date().toISOString().slice(0, 10);
  let idx = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  files.forEach(f => {
    idx += '  <sitemap>\n    <loc>' + esc(BASE + f) + '</loc>\n    <lastmod>' + today + '</lastmod>\n  </sitemap>\n';
  });
  idx += '</sitemapindex>\n';
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), idx, 'utf8');

  const total = nPages + nCats + nTools + nRes;
  console.log('build-sitemap: 索引 + ' + files.length + ' 个子 sitemap，共 ' + total + ' 条 URL');
  console.log('  sitemap-pages.xml      : ' + nPages + ' (6 语言首页 + 静态页)');
  console.log('  sitemap-categories.xml : ' + nCats + ' (品类页 + 聚合页)');
  console.log('  sitemap-tools.xml      : ' + nTools + ' (' + tools.count + ' 页 × 4 语言)');
  if (nRes) console.log('  sitemap-resources.xml  : ' + nRes + ' (博客)');
  return { total, files };
}

if (require.main === module) run();

module.exports = { run, sharedPages, ROOT, BASE };
