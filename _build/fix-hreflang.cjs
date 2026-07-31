/**
 * fix-hreflang.cjs
 * ------------------------------------------------------------------
 * 修复全站「工具页」的 hreflang 互指。
 *
 * 问题背景：
 *   1) 根目录工具页沿用旧的查询参数方案：hreflang="en" 指向 `X.html?lang=en`，
 *      而该 URL 的 canonical 指向无参数版本 —— hreflang 指向非规范 URL，Google 会整组忽略。
 *   2) en/ jp/ es/ 镜像里的工具页 hreflang 全部指向「语言首页」(/en/ /jp/ /es/)，
 *      而不是对应的同名工具页 —— 不构成互指关系，同样会被忽略。
 *
 * 修复标准（与 index.html / *-tools.html 保持一致）：
 *   x-default -> /en/X.html      （面向海外，英文为默认回退）
 *   zh-Hans   -> /X.html
 *   en        -> /en/X.html
 *   ja        -> /jp/X.html
 *   es        -> /es/X.html
 *   de/ar 仅有首页，故工具页不产出这两个 alternate。
 *
 * 幂等：每次运行先清除页面上所有已存在的 hreflang alternate，再重新写入。
 *
 * 归属划分（避免多脚本互相覆盖）：
 *   index.html      -> build-i18n.cjs
 *   *-tools.html    -> upgrade-cat.cjs
 *   其余工具/静态页 -> 本脚本
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { BASE } = require('./site.config.cjs');

const ROOT = path.resolve(__dirname, '..');

// 语言目录 -> hreflang 代码
const LOCALES = [
  { dir: '', code: 'zh-Hans' },
  { dir: 'en', code: 'en' },
  { dir: 'jp', code: 'ja' },
  { dir: 'es', code: 'es' }
];

// 不参与 hreflang / 不应被索引的页面
const EXCLUDE = [
  'standard-page-template.html',
  'tool-admin.html'
];
const EXCLUDE_RE = [
  /^baidu_verify.*\.html$/i,
  /-tools\.html$/i,        // 由 upgrade-cat.cjs 负责
  /^index\.html$/i         // 由 build-i18n.cjs 负责
];

function isExcluded(name) {
  if (EXCLUDE.indexOf(name) > -1) return true;
  return EXCLUDE_RE.some(re => re.test(name));
}

const url = (dir, name) => BASE + (dir ? dir + '/' : '') + name;

/** 构造某页面的 hreflang 区块 */
function buildBlock(name) {
  const lines = [
    '<link rel="alternate" hreflang="x-default" href="' + url('en', name) + '">',
    '<link rel="alternate" hreflang="zh-Hans" href="' + url('', name) + '">',
    '<link rel="alternate" hreflang="en" href="' + url('en', name) + '">',
    '<link rel="alternate" hreflang="ja" href="' + url('jp', name) + '">',
    '<link rel="alternate" hreflang="es" href="' + url('es', name) + '">'
  ];
  return lines.join('\n');
}

/** 清除已有 hreflang（保留 RSS 等其它 rel=alternate） */
function stripHreflang(html) {
  return html
    .replace(/[ \t]*<link\b[^>]*\bhreflang=(["'])[^"']*\1[^>]*>[ \t]*\r?\n?/gi, '')
    .replace(/\n{3,}/g, '\n\n');
}

/** 确保 canonical 正确指向自身，并在其后插入 hreflang 区块 */
function applyPage(file, dir, name) {
  let html = fs.readFileSync(file, 'utf8');
  const before = html;

  html = stripHreflang(html);

  const selfUrl = url(dir, name);
  const block = buildBlock(name);

  // 修正 canonical 为自身语言版本
  const canonRe = /<link\b[^>]*\brel=(["'])canonical\1[^>]*>/i;
  const canonTag = '<link rel="canonical" href="' + selfUrl + '">';

  if (canonRe.test(html)) {
    html = html.replace(canonRe, canonTag + '\n' + block);
  } else if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, canonTag + '\n' + block + '\n</head>');
  } else {
    return { changed: false, reason: 'no-head' };
  }

  if (html === before) return { changed: false, reason: 'same' };
  fs.writeFileSync(file, html, 'utf8');
  return { changed: true };
}

function run() {
  // 以根目录为基准，取「四个语言目录都存在」的页面
  const rootFiles = fs.readdirSync(ROOT)
    .filter(f => f.endsWith('.html') && !isExcluded(f));

  const shared = rootFiles.filter(name =>
    LOCALES.every(l => fs.existsSync(path.join(ROOT, l.dir, name)))
  );
  const rootOnly = rootFiles.filter(name => shared.indexOf(name) === -1);

  let changed = 0, skipped = 0;
  const perDir = {};

  LOCALES.forEach(l => {
    perDir[l.dir || 'root'] = 0;
    shared.forEach(name => {
      const file = path.join(ROOT, l.dir, name);
      const r = applyPage(file, l.dir, name);
      if (r.changed) { changed++; perDir[l.dir || 'root']++; }
      else skipped++;
    });
  });

  console.log('fix-hreflang: ' + shared.length + ' 个页面 × 4 语言');
  Object.keys(perDir).forEach(k => console.log('  ' + k + ': ' + perDir[k] + ' 页已更新'));
  if (skipped) console.log('  未变更: ' + skipped + ' 页');
  if (rootOnly.length) {
    console.log('  仅根目录存在（跳过 hreflang）: ' + rootOnly.length + ' 页 -> ' + rootOnly.join(', '));
  }

  fs.writeFileSync(
    path.join(__dirname, 'hreflang-pages.json'),
    JSON.stringify({ shared, rootOnly }, null, 1),
    'utf8'
  );
  return shared;
}

if (require.main === module) run();

module.exports = { run, LOCALES, isExcluded, ROOT };
