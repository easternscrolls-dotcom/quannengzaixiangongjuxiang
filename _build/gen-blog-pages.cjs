/**
 * gen-blog-pages.cjs
 * ------------------------------------------------------------------
 * 把「博客页」在运行时由 JS 生成的文章，落地为「真实可抓取的静态 HTML 页」，
 * 从而让每日向谷歌 ping 的 sitemap 真正包含这些 URL（运行时 blob: 文章页
 * 对搜索引擎完全不可见，是之前 SEO 失效的根因）。
 *
 * 产物：
 *   blog/<idx>.html        —— 中文文章页（<idx> 中的 '.' 已规范为 '-'）
 *   blog/en/<idx>.html     —— 英文文章页
 *   blog/articles.json     —— 文章清单（供 build-sitemap.cjs 读取）
 *   blog/index.html        —— 双语文章列表页（便于发现与内链）
 *
 * 数据来源：tools-data.js（TOOLS_DATA）+ home-render.js
 *          （THEME_DATA / SOURCE_DATA / BLOG_ARTICLES）。
 * 文章生成逻辑端口自 home-render.js 的 genBlogArticles / buildArticleHtml。
 *
 * 用法：node _build/gen-blog-pages.cjs
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://72tool.com/';
const BLOG = path.join(ROOT, 'blog');
const BLOG_ZH = path.join(ROOT, 'zh', 'blog');

// ---------- 从源文件抽取 JS 数组字面量（兼容未加引号的 key） ----------
function extractArray(srcText, marker) {
  const start0 = srcText.indexOf(marker);
  if (start0 < 0) return [];
  const start = srcText.indexOf('[', start0);
  if (start < 0) return [];
  let depth = 0, j = start;
  for (; j < srcText.length; j++) {
    const c = srcText[j];
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) { j++; break; } }
  }
  const arrText = srcText.slice(start, j);
  const ctx = {};
  vm.createContext(ctx);
  try {
    return vm.runInContext('(' + arrText + ')', ctx) || [];
  } catch (e) {
    console.error('[gen-blog-pages] 解析数组失败 (' + marker + '): ' + e.message);
    return [];
  }
}

function loadData() {
  const toolsSrc = fs.readFileSync(path.join(ROOT, 'tools-data.js'), 'utf8');
  const hrSrc = fs.readFileSync(path.join(ROOT, 'home-render.js'), 'utf8');
  return {
    TOOLS_DATA: extractArray(toolsSrc, 'window.TOOLS_DATA ='),
    THEME_DATA: extractArray(hrSrc, 'const THEME_DATA ='),
    SOURCE_DATA: extractArray(hrSrc, 'const SOURCE_DATA ='),
    BLOG_ARTICLES: extractArray(hrSrc, 'const BLOG_ARTICLES =')
  };
}

// ---------- 端口自 home-render.js 的辅助函数 ----------
function _sceneOf(subCate) {
  const m = { blog:'博客', homepage:'个人主页', toolpage:'工具站', dark:'暗黑风站点', light:'清新风站点',
              blogsrc:'博客', navsrc:'导航站', toolsrc:'工具箱', newsrc:'资讯站' };
  if (!Array.isArray(subCate)) return '网站';
  for (let i = 0; i < subCate.length; i++) { if (m[subCate[i]]) return m[subCate[i]]; }
  return '网站';
}
function _escXml(s) { return ('' + s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function blogCover(a, lang) {
  const t = lang === 'zh';
  const title = t ? (a.title_zh || a.title_en) : (a.title_en || a.title_zh);
  const c1 = '#6366f1', c2 = '#a855f7';
  const safe = ('' + title).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">'
    + '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">'
    + '<stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient></defs>'
    + '<rect width="640" height="360" fill="url(#g)"/>'
    + '<text x="40" y="200" font-family="sans-serif" font-size="38" font-weight="700" fill="#fff">' + safe + '</text>'
    + '<text x="40" y="250" font-family="sans-serif" font-size="18" fill="rgba(255,255,255,.85)">72Tool · ' + (t ? '博客' : 'Blog') + '</text>'
    + '</svg>';
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

const ARTICLE_CSS = [
  '.art-nav{display:flex;align-items:center;gap:10px;padding:14px 22px;background:#fff;border-bottom:1px solid #e5e7eb}',
  '.art-nav b{font-size:17px}.art-nav nav{margin-left:auto;display:flex;gap:18px}.art-nav nav a{color:#57606a;text-decoration:none;font-size:14px}',
  '.art-main{max-width:760px;margin:0 auto;padding:28px 20px}',
  '.art-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:30px 34px;box-shadow:0 1px 3px rgba(0,0,0,.04)}',
  '.art-cat{display:inline-block;padding:3px 12px;border-radius:999px;font-size:12px;font-weight:700;color:#fff;background:#6366f1;margin-bottom:12px}',
  '.art-title{font-size:32px;line-height:1.25;margin-bottom:14px}',
  '.art-meta{display:flex;align-items:center;gap:8px;font-size:13px;color:#57606a;margin-bottom:18px;flex-wrap:wrap}',
  '.art-av{width:26px;height:26px;border-radius:50%;background:#e5e7eb;display:inline-flex}',
  '.art-cover{width:100%;height:240px;border-radius:12px;object-fit:cover;margin-bottom:20px}',
  '.art-body{font-size:17px;color:#374151;line-height:1.85}',
  '.art-body h2{font-size:22px;margin:24px 0 10px;color:#1f2328}.art-body p{margin:10px 0}',
  '.art-foot{padding:26px 20px;text-align:center;color:#8b949e;font-size:12px;border-top:1px solid #e5e7eb;margin-top:30px;background:#fff}',
  '.art-ref{display:inline-block;margin:16px 0 4px;padding:5px 12px;border-radius:8px;background:#f3f4f6;color:#374151;font-size:13px}',
  '.art-cta-wrap{margin:22px 0 6px}',
  '.art-cta{display:inline-block;padding:12px 22px;border-radius:10px;background:#6366f1;color:#fff;font-weight:700;text-decoration:none;font-size:15px}',
  '.art-cta:hover{background:#4f46e5}'
].join('');

// ---------- 端口自 genBlogArticles（按语言设定 cta.url） ----------
function genArticles(lang, D) {
  const t = lang === 'zh';
  const arts = [];
  (D.TOOLS_DATA || []).forEach(function (it) {
    const name = t ? it.zh : it.en;
    const cat = t ? (it.type_cn || it.type) : (it.type || it.type_cn);
    const url = t ? ('/zh/' + it.slug) : ('/' + it.slug);
    arts.push({ idx: 'a-tool-' + it.slug + '-lead', atype: 'lead', target: { type: 'tool', name: name },
      title_zh: '推荐 ' + it.zh + '：免费在线 ' + cat + ' 工具（附直达入口）', title_en: 'Try ' + it.en + ': Free Online ' + (it.type || '') + ' Tool',
      date: '2026-07', tag: t ? '工具推荐' : 'Tool Pick',
      excerpt_zh: '一文看懂 ' + it.zh + ' 能做什么、适合谁、怎么用，并附上直达使用入口。',
      excerpt_en: 'What ' + it.en + ' does, who it is for, and how to use it — with a direct link.',
      body_zh: '<h2>什么是 ' + it.zh + '？</h2><p>' + it.zh + ' 是一款免费的在线 ' + cat + ' 工具，无需下载安装，打开网页即可使用。它面向' + cat + '场景，帮你快速完成任务、省去重复操作。</p><h2>主要能力</h2><ul><li>纯网页运行，跨平台、即开即用</li><li>界面简洁，零学习成本</li><li>本地处理，保护隐私</li></ul><h2>适合谁</h2><p>无论你是' + cat + '新手，还是日常需要频繁处理此类任务的用户，' + it.zh + ' 都能让你事半功倍。</p>',
      body_en: '<h2>What is ' + it.en + '?</h2><p>' + it.en + ' is a free online ' + (it.type || '') + ' tool that runs in your browser — no install needed. It handles everyday ' + (it.type || '') + ' tasks in seconds.</p><h2>Highlights</h2><ul><li>Runs in the browser, cross-platform</li><li>Simple UI, zero learning curve</li><li>Processed locally for privacy</li></ul><h2>Who it is for</h2><p>From beginners to power users, ' + it.en + ' saves you time on repetitive ' + (it.type || '') + ' work.</p>',
      cta: { label_zh: '立即使用 ' + it.zh, label_en: 'Open ' + it.en, url: url } });
    arts.push({ idx: 'a-tool-' + it.slug + '-tut', atype: 'tut', target: { type: 'tool', name: name },
      title_zh: it.zh + ' 使用教程：从打开到上手（图文）', title_en: it.en + ' Tutorial: From Open to Done',
      date: '2026-07', tag: t ? '使用教程' : 'Tutorial',
      excerpt_zh: '手把手教你使用 ' + it.zh + '，几步即可完成，新手也能快速上手。',
      excerpt_en: 'A step-by-step guide to using ' + it.en + ' — beginners welcome.',
      body_zh: '<h2>使用步骤</h2><p>1. 点击文末「立即使用」打开 ' + it.zh + '。2. 按页面提示上传或输入内容。3. 一键处理并下载结果。整个过程通常只需十几秒。</p><h2>小技巧</h2><p>处理前先确认输入格式符合要求；结果可多次生成对比，挑最满意的一版保存。</p>',
      body_en: '<h2>Steps</h2><p>1. Tap "Open" below to launch ' + it.en + '. 2. Upload or paste your input as prompted. 3. Process with one click and download the result — usually in seconds.</p><h2>Tips</h2><p>Check the required input format first; regenerate to compare and keep the best version.</p>',
      cta: { label_zh: '打开 ' + it.zh, label_en: 'Open ' + it.en, url: url } });
  });
  (D.THEME_DATA || []).forEach(function (it) {
    const name = t ? it.zh : it.en, scene = _sceneOf(it.subCate);
    const themeUrl = (it.previewUrl && it.previewUrl !== '#') ? it.previewUrl : it.downloadUrl;
    arts.push({ idx: 'a-theme-' + it.idx + '-lead', atype: 'lead', target: { type: 'theme', name: name },
      title_zh: '推荐 ' + it.zh + '：开源' + scene + '主题模板（附演示与下载）', title_en: 'Featured ' + it.en + ': Open-source ' + scene + ' Theme',
      date: '2026-07', tag: t ? '主题推荐' : 'Theme Pick',
      excerpt_zh: it.desc_zh + ' 附在线演示与源码下载入口。',
      excerpt_en: (it.desc_en || '') + ' Live demo & source included.',
      body_zh: '<h2>关于 ' + it.zh + '</h2><p>' + it.desc_zh + '</p><h2>亮点</h2><ul><li>开源免费，可自由修改</li><li>响应式设计，移动端友好</li><li>社区活跃，文档齐全</li></ul><h2>适合谁</h2><p>想快速搭建' + scene + '站点的个人与团队，' + it.zh + ' 都是省心的选择。</p>',
      body_en: '<h2>About ' + it.en + '</h2><p>' + (it.desc_en || '') + '</p><h2>Highlights</h2><ul><li>Open source and free to modify</li><li>Responsive, mobile-friendly</li><li>Active community & good docs</li></ul><h2>Who it is for</h2><p>Anyone building a ' + scene + ' site — ' + it.en + ' gets you started fast.</p>',
      cta: { label_zh: '查看在线演示', label_en: 'Live Demo', url: themeUrl } });
    arts.push({ idx: 'a-theme-' + it.idx + '-tut', atype: 'tut', target: { type: 'theme', name: name },
      title_zh: it.zh + ' 部署教程：从克隆到上线（图文）', title_en: it.en + ' Deploy Guide: From Clone to Live',
      date: '2026-07', tag: t ? '部署教程' : 'Deploy',
      excerpt_zh: '手把手教你把 ' + it.zh + ' 跑起来并部署到静态托管。',
      excerpt_en: 'Step-by-step: run ' + it.en + ' locally and ship it to static hosting.',
      body_zh: '<h2>快速上手</h2><p>1. 点文末「获取源码」克隆或下载 ' + it.zh + '。2. 按主题文档安装依赖（如 Hugo/Hexo/Astro 对应命令）。3. 本地预览并替换为自己的内容。4. 部署到 GitHub Pages / Vercel / Netlify 等静态托管。</p><h2>发布建议</h2><p>绑定自定义域名、开启 HTTPS，并配置站点的 SEO 与站点地图，让内容更容易被收录。</p>',
      body_en: '<h2>Quick start</h2><p>1. Tap "Get Source" to clone or download ' + it.en + '. 2. Install deps per the theme docs (Hugo/Hexo/Astro commands). 3. Preview locally and swap in your content. 4. Deploy to GitHub Pages / Vercel / Netlify.</p><h2>Publishing tips</h2><p>Use a custom domain with HTTPS, and set up SEO and a sitemap so your content gets indexed.</p>',
      cta: { label_zh: '获取主题源码', label_en: 'Get Source', url: it.downloadUrl } });
  });
  (D.SOURCE_DATA || []).forEach(function (it) {
    const name = t ? it.zh : it.en, scene = _sceneOf(it.subCate);
    arts.push({ idx: 'a-source-' + it.idx + '-lead', atype: 'lead', target: { type: 'source', name: name },
      title_zh: '推荐 ' + it.zh + '：开源' + scene + '项目（附 GitHub 入口）', title_en: 'Featured ' + it.en + ': Open-source ' + scene + ' Project',
      date: '2026-07', tag: t ? '源码推荐' : 'Source Pick',
      excerpt_zh: it.desc_zh + ' 附 GitHub 仓库直达。',
      excerpt_en: (it.desc_en || '') + ' Direct GitHub link included.',
      body_zh: '<h2>关于 ' + it.zh + '</h2><p>' + it.desc_zh + '</p><h2>为什么值得关注</h2><ul><li>开源协议，可自由使用与二次开发</li><li>社区维护，持续更新</li><li>文档与示例完整，便于落地</li></ul>',
      body_en: '<h2>About ' + it.en + '</h2><p>' + (it.desc_en || '') + '</p><h2>Why it matters</h2><ul><li>Open license — free to use and fork</li><li>Community-maintained, actively updated</li><li>Complete docs & examples</li></ul>',
      cta: { label_zh: '前往 GitHub', label_en: 'View on GitHub', url: it.downloadUrl } });
    arts.push({ idx: 'a-source-' + it.idx + '-tut', atype: 'tut', target: { type: 'source', name: name },
      title_zh: it.zh + ' 教程：从克隆仓库到本地运行（图文）', title_en: it.en + ' Guide: Clone to Running Locally',
      date: '2026-07', tag: t ? '运行教程' : 'Run Guide',
      excerpt_zh: '一步步把 ' + it.zh + ' 跑起来，新手也能照做。',
      excerpt_en: 'Get ' + it.en + ' running locally, step by step.',
      body_zh: '<h2>从零跑起来</h2><p>1. 克隆仓库：<code>git clone ' + (it.repo ? ('https://github.com/' + it.repo + '.git') : '') + '</code>。2. 进入目录安装依赖。3. 启动本地服务预览。4. 阅读文档，按需二次开发。</p><h2>进阶</h2><p>改配置、加功能、提 PR，或把它作为你下一个项目的起点。</p>',
      body_en: '<h2>From zero to running</h2><p>1. Clone: <code>git clone ' + (it.repo ? ('https://github.com/' + it.repo + '.git') : '') + '</code>. 2. Enter the folder and install deps. 3. Start the local dev server. 4. Read the docs and customize.</p><h2>Next steps</h2><p>Edit config, add features, open a PR, or use it as the base for your next project.</p>',
      cta: { label_zh: '克隆仓库', label_en: 'Clone Repo', url: it.downloadUrl } });
  });
  (D.BLOG_ARTICLES || []).forEach(function (a) { arts.push(Object.assign({}, a)); });
  return arts;
}

// idx -> 文件名（把可能包含的 '.' 规范为 '-'，避免路径歧义）
function artFile(a) { return ('' + a.idx).replace(/\./g, '-') + '.html'; }

function renderArticle(a, lang) {
  const t = lang === 'zh';
  const title = t ? (a.title_zh || a.title_en) : (a.title_en || a.title_zh);
  const body = t ? (a.body_zh || '') : (a.body_en || '');
  const date = a.date || '2026-07';
  const cover = blogCover(a, lang);
  const excerpt = t ? (a.excerpt_zh || '') : (a.excerpt_en || '');
  const refHtml = a.target ? ('<div class="art-ref">' + (t ? '本文针对：' : 'About: ') + _escXml(a.target.name) + '</div>') : '';
  const ctaHtml = a.cta ? ('<div class="art-cta-wrap"><a class="art-cta" href="' + _escXml(a.cta.url) + '" target="_blank" rel="noopener">' + _escXml(t ? (a.cta.label_zh || '前往') : (a.cta.label_en || 'Open')) + '</a></div>') : '';
  const f = artFile(a);
  const fNo = f.replace(/\.html$/, '');
  const canon = (lang === 'zh' ? BASE + 'zh/blog/' : BASE + 'blog/') + fNo;
  const altZh = BASE + 'zh/blog/' + fNo;
  const altEn = BASE + 'blog/' + fNo;
  const home = lang === 'zh' ? '/zh/' : '/';
  const blogIdx = lang === 'zh' ? '/zh/blog/' : '/blog/';
  const about = lang === 'zh' ? '/zh/about' : '/about';
  return '<!DOCTYPE html><html lang="' + (t ? 'zh' : 'en') + '"><head>'
    + '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>' + _escXml(title) + ' — 72Tool</title>'
    + '<meta name="description" content="' + _escXml(excerpt) + '">'
    + '<link rel="canonical" href="' + _escXml(canon) + '">'
    + '<link rel="alternate" hreflang="zh-Hans" href="' + _escXml(altZh) + '">'
    + '<link rel="alternate" hreflang="en" href="' + _escXml(altEn) + '">'
    + '<link rel="alternate" hreflang="x-default" href="' + _escXml(altEn) + '">'
    + '<meta property="og:type" content="article">'
    + '<meta property="og:title" content="' + _escXml(title) + '">'
    + '<meta property="og:description" content="' + _escXml(excerpt) + '">'
    + '<style>' + ARTICLE_CSS + '</style></head>'
    + '<body style="background:#fff;color:#1f2328">'
    + '<header class="art-nav"><span class="art-logo"></span><b>72Tool</b><nav>'
    + '<a href="' + home + '">' + (t ? '首页' : 'Home') + '</a>'
    + '<a href="' + blogIdx + '">' + (t ? '博客' : 'Blog') + '</a>'
    + '<a href="' + about + '">' + (t ? '关于' : 'About') + '</a></nav></header>'
    + '<main class="art-main"><article class="art-card">'
    + '<span class="art-cat">' + _escXml(a.tag || (t ? '文章' : 'Article')) + '</span>'
    + '<h1 class="art-title">' + _escXml(title) + '</h1>'
    + '<div class="art-meta"><span class="art-av"></span><b>72Tool</b> · <span>' + _escXml(date) + '</span> · ' + (t ? '5 分钟阅读' : '5 min read') + '</div>'
    + '<img class="art-cover" src="' + cover + '" alt="' + _escXml(title) + '">'
    + '<div class="art-body">' + body + '</div>'
    + refHtml + ctaHtml
    + '</article></main>'
    + '<footer class="art-foot">© 2026 72Tool · ' + (t ? '内容均为示例，可在源码中替换' : 'Sample content, replaceable') + '</footer>'
    + '</body></html>';
}

function renderIndex(articles) {
  const zh = articles.filter(function (a) { return true; });
  function list(lang) {
    const t = lang === 'zh';
    const items = articles.map(function (a) {
      const f = artFile(a);
      const fNo = f.replace(/\.html$/, '');
      const title = t ? (a.title_zh || a.title_en) : (a.title_en || a.title_zh);
      return '<li><a href="' + (t ? 'zh/blog/' : 'blog/') + fNo + '">' + _escXml(title) + '</a></li>';
    }).join('');
    return '<div class="col"><h2>' + (t ? '中文文章' : 'English Articles') + '</h2><ul>' + items + '</ul></div>';
  }
  return '<!DOCTYPE html><html lang="zh"><head><meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>72Tool 博客文章索引</title>'
    + '<meta name="description" content="72Tool 全部工具 / 主题 / 源码的引流文章与教程索引。">'
    + '<style>body{max-width:900px;margin:0 auto;padding:28px 20px;font-family:sans-serif;color:#1f2328}'
    + 'h1{font-size:28px}.cols{display:flex;gap:40px;flex-wrap:wrap}.col{flex:1;min-width:280px}'
    + 'ul{list-style:none;padding:0}li{padding:8px 0;border-bottom:1px solid #eee}'
    + 'a{color:#2478f5;text-decoration:none}.lang{margin-bottom:12px}a.switch{margin-right:14px;color:#6b7280;font-size:14px}</style></head>'
    + '<body><h1>72Tool 博客文章索引</h1>'
    + '<div class="lang"><a class="switch" href="/zh/blog/">中文</a><a class="switch" href="/blog/">English</a></div>'
    + '<div class="cols">' + list('zh') + list('en') + '</div>'
    + '<footer style="margin-top:30px;color:#8b949e;font-size:12px">© 2026 72Tool</footer></body></html>';
}

// ------------------------------------------------------------------ run
function run() {
  const D = loadData();
  let count = 0;
  const manifest = [];

  [['zh', BLOG_ZH], ['en', BLOG]].forEach(function (pair) {
    const lang = pair[0], dir = pair[1];
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  ['zh', 'en'].forEach(function (lang) {
    const arts = genArticles(lang, D);
    const dir = lang === 'zh' ? BLOG_ZH : BLOG;
    arts.forEach(function (a) {
      const f = artFile(a);
      const html = renderArticle(a, lang);
      fs.writeFileSync(path.join(dir, f), html, 'utf8');
      if (lang === 'zh') {
        manifest.push({
          idx: a.idx, file: 'zh/blog/' + f,
          title_zh: a.title_zh || '', title_en: a.title_en || ''
        });
      }
      count++;
    });
  });

  fs.writeFileSync(path.join(BLOG, 'articles.json'),
    JSON.stringify(manifest, null, 1), 'utf8');
  fs.writeFileSync(path.join(BLOG, 'index.html'),
    renderIndex(manifest), 'utf8');

  console.log('gen-blog-pages: 生成 ' + manifest.length + ' 篇文章 × 2 语言 = ' + count + ' 个静态页，清单 ' + manifest.length + ' 条');
  return { count: manifest.length };
}

if (require.main === module) run();

module.exports = { run, artFile };
