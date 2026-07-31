/**
 * purify-lang-pages.cjs
 * ------------------------------------------------------------------
 * 修复 en/jp/es 镜像工具页的内容语言错配问题（P0-2）。
 *
 * 问题：
 *   镜像是从根目录中文页复制而来，保留了 i18n-zh/i18n-en 双语 span。
 *   Google 爬虫看到中文 + 英文混合内容，页面声明为 en/ja/es，
 *   实际内容却含大量中文 → 语言分类器紊乱 → hreflang 失效。
 *
 * 修复策略：
 *   EN（x-default）：去 i18n-zh span，保留纯英文内容。
 *   JP / ES（无翻译资源）：工具页加 noindex,follow（不索引但保持链接流）。
 *     sitemap 中不收录 jp/es 工具页，仅保留首页和品类页。
 *
 * 同时修复：
 *   - 导航链接 href="/" → href="/{lang}/"（避免跳回中文首页）
 *   - 去除语言切换栏（en 页不需要双语切换）
 *   - 品类页链接修正：href="X-tools.html" → href="/{lang}/X-tools.html"
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { BASE } = require('./site.config.cjs');

const ROOT = path.resolve(__dirname, '..');

// 品类页 (由 upgrade-cat.cjs 负责) 和首页 (build-i18n.cjs) 不在本脚本处理范围
const SKIP = ['index.html'];
const SKIP_RE = [/-tools\.html$/i, /about\.html$/i, /privacy\.html$/i, /terms\.html$/i, /contact\.html$/i, /sitemap\.html$/i, /^baidu_verify/i];

function isSkipped(f) {
  if (SKIP.indexOf(f) > -1) return true;
  return SKIP_RE.some(re => re.test(f));
}

// 工具页内部导航的常用固定链接名称
const INTERNAL_PAGES = ['index.html', 'about.html', 'privacy.html', 'terms.html', 'contact.html', 'sitemap.html'];

/**
 * 生成纯英文工具页
 */
function purifyEn(pagePath) {
  let html = fs.readFileSync(pagePath, 'utf8');

  // 1) 去掉语言切换栏
  html = html.replace(/<div class="switchbar">[\s\S]*?<\/div>\s*/g, '');

  // 2) span 级 i18n 替换（双向匹配）
  //    模式A：<span class="i18n-zh">中文</span><span class="i18n-en" hidden>English</span>
  //    模式B：<span class="i18n-zh" hidden>中文</span><span class="i18n-en">English</span>
  html = html.replace(
    /<span class="i18n-zh"[^>]*>[\s\S]*?<\/span>\s*<span class="i18n-en"([^>]*)>([\s\S]*?)<\/span>/gi,
    '<span class="i18n-en"$1>$2</span>'
  );

  // 3) div 级 i18n 替换（长尾正文块等）
  //    模式：<div class="i18n-zh" hidden>中文内容...</div>
  //            <div class="i18n-en" hidden>English content...</div>
  //    处理方式：找到 i18n-zh div 块（通常有 hidden），删除它；
  //            找到 i18n-en div 块，去掉 hidden
  let divBlocks = [];
  const divZhRe = /<div class="i18n-zh"([^>]*)>([\s\S]*?)<\/div>/gi;
  while (true) {
    const m = divZhRe.exec(html);
    if (!m) break;
    // 记录位置，后续替换
    if (m[0].indexOf('hidden') > -1) divBlocks.push({ start: m.index, end: m.index + m[0].length, full: m[0], enMatch: null });
  }

  // 找对应的 i18n-en div
  html = html.replace(
    /<div\s+class="i18n-en"([^>]*)>([\s\S]*?)<\/div>/gi,
    (full, attrs, content) => {
      // 去掉 hidden，保留内容
      attrs = attrs.replace(/\s*hidden="[^"]*"/gi, '');
      attrs = attrs.replace(/\s*hidden/gi, '');
      return '<div class="i18n-en"' + attrs + '>' + content + '</div>';
    }
  );

  // 删除所有 i18n-zh div 块
  html = html.replace(/<div\s+class="i18n-zh"[^>]*>[\s\S]*?<\/div>/gi, '');

  // 4) 清理残留 i18n-zh span
  html = html.replace(/<span class="i18n-zh"[^>]*>[\s\S]*?<\/span>/gi, '');

  // 5) span 级：解除 i18n-en 的 span 标签（保留内容）
  html = html.replace(/<span class="i18n-en"[^>]*>([\s\S]*?)<\/span>/gi, '$1');

  // 6) 移除 hidden 属性残留
  html = html.replace(/\s*hidden="[^"]*"/gi, '');
  html = html.replace(/\s+hiddens?/gi, '');

  // 7) data-i18n 属性删除
  html = html.replace(/\s+data-i18n="[^"]*"/gi, '');

  // 8) 清理多余空行
  html = html.replace(/\n{3,}/g, '\n\n');

  // 9) 替换硬编码中文（页脚/返回链接等不在 i18n span 中的文本）
  const HARDCODED = [
    ['关于我们', 'About'], ['联系我们', 'Contact'], ['隐私政策', 'Privacy'],
    ['使用条款', 'Terms'], ['版权 / DMCA', 'DMCA'], ['站点地图', 'Sitemap'],
    ['© 2026 72Tool 72tool.com 保留所有权利', '© 2026 72Tool 72tool.com. All rights reserved.']
  ];
  HARDCODED.forEach(([zh, en]) => { html = html.split(zh).join(en); });

  return html;
}

/**
 * 添加 noindex,follow（jp/es 工具页）
 */
function addNoindex(html) {
  if (html.indexOf('<meta name="robots"') > -1) {
    return html.replace(
      /<meta name="robots"[^>]*>/i,
      '<meta name="robots" content="noindex,follow">'
    );
  }
  // 在 charset 后插入
  return html.replace(
    /(<meta charset="[^"]*">)/,
    '$1\n<meta name="robots" content="noindex,follow">'
  );
}

/**
 * 修正导航链接 → 语言前缀
 */
function fixNavLinks(html, lang) {
  const prefix = '/' + lang + '/';

  // 保护资源文件（不添加语言前缀的路径）
  const RESOURCE_FILES = [
    'tools-data.js', 'i18n-runtime.js', 'ux-kit.js', 'ads.js',
    'autopush.js', 'nebula.css', 'favicon.svg', 'favicon-32.png',
    'favicon-180.png', 'favicon-192.png', 'og-cover', 'sitemap.xml',
    'sitemap-pages.xml', 'sitemap-categories.xml', 'sitemap-tools.xml',
    'sitemap-resources.xml', 'robots.txt'
  ];
  const RESOURCE_PATTERN = RESOURCE_FILES.map(f => f.replace(/\./g, '\\.')).join('|');

  // 绝对路径：href="/" → href="/{lang}/"（跳过资源文件和多语言已有前缀）
  html = html.replace(
    new RegExp('href="/(?!(' + RESOURCE_PATTERN + '|en|jp|es|de|ar)/)', 'g'),
    'href="' + prefix
  );

  // 相对路径内部页：href="index.html" → href="/en/index.html"
  INTERNAL_PAGES.forEach(p => {
    html = html.replace(
      new RegExp('href="' + p + '"', 'g'),
      'href="' + prefix + p + '"'
    );
  });

  // 相对路径品类页：href="img-tools.html" 等
  html = html.replace(
    /href="([a-z]+-tools\.html)"/g,
    'href="' + prefix + '$1"'
  );

  // 修复可能误伤的资源链接：href="/{lang}/nebula.css" → href="/nebula.css"
  RESOURCE_FILES.forEach(f => {
    html = html.replace(
      'href="' + prefix + f + '"',
      'href="/' + f + '"'
    );
  });

  return html;
}

function processDir(dir, lang, action) {
  const files = fs.readdirSync(path.join(ROOT, dir))
    .filter(f => f.endsWith('.html') && !isSkipped(f));

  let changed = 0;
  files.forEach(f => {
    const fp = path.join(ROOT, dir, f);
    let html = fs.readFileSync(fp, 'utf8');

    if (action === 'purify') {
      html = purifyEn(fp);
    } else if (action === 'noindex') {
      html = addNoindex(html);
    }

    html = fixNavLinks(html, lang);

    // 确保 <html lang> 正确
    const langMap = { en: 'en', jp: 'ja', es: 'es' };
    html = html.replace(
      /<html[^>]*>/,
      '<html lang="' + langMap[lang] + '">'
    );

    fs.writeFileSync(fp, html, 'utf8');
    changed++;
  });

  return changed;
}

function run() {
  let total = 0;
  const result = {};

  // EN: 纯英文
  const enCount = processDir('en', 'en', 'purify');
  console.log('  EN purify: ' + enCount + ' 页 (去中文 + 纯英文)');
  result.en = enCount;

  // JP: noindex
  const jpCount = processDir('jp', 'jp', 'noindex');
  console.log('  JP noindex: ' + jpCount + ' 页 (无日文翻译，标记不索引)');
  result.jp = jpCount;

  // ES: noindex
  const esCount = processDir('es', 'es', 'noindex');
  console.log('  ES noindex: ' + esCount + ' 页 (无西文翻译，标记不索引)');
  result.es = esCount;

  total = enCount + jpCount + esCount;
  console.log('purify-lang: ' + total + ' 个镜像页已修复');

  fs.writeFileSync(
    path.join(__dirname, 'purify-pages.json'),
    JSON.stringify(result, null, 1),
    'utf8'
  );
  return total;
}

if (require.main === module) run();

module.exports = { run, purifyEn, addNoindex, fixNavLinks, ROOT };
