/**
 * build-tag-en.cjs
 * ------------------------------------------------------------------
 * P1-5: 为 26 个中文 tag 页生成英文版本到 /en/ 目录。
 *
 * 策略：tag 页已内嵌 i18n-desc-en 描述，hreflang 已指向 en/jp/es tag 页。
 * 英文版使用与根 tag 页相同的页面模板，替换标题/描述/h1。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { BASE } = require('./site.config.cjs');

const ROOT = path.resolve(__dirname, '..');

// 标签名映射（中文 → 英文 slug + 显示名）
const TAG_EN = {
  'bgremove':  'Background Remover',
  'calc':      'Calculator',
  'check':     'Checker & Validator',
  'clean':     'Cleaner & Formatter',
  'clip':      'Clipping Tools',
  'compare':   'Comparison Tools',
  'compress':  'Compression',
  'convert':   'Format Converter',
  'count':     'Counter & Statistics',
  'crop':      'Cropping & Resize',
  'decode':    'Decoder',
  'decrypt':   'Decryption',
  'dev':       'Developer Utilities',
  'edit':      'Editor Tools',
  'encode':    'Encoder',
  'encrypt':   'Encryption & Hash',
  'extract':   'Extraction Tools',
  'filter':    'Filters & Effects',
  'format':    'Formatter',
  'generate':  'Generator',
  'merge':     'Merge & Combine',
  'optimize':  'Optimization',
  'query':     'Query Tools',
  'read':      'Reader & Viewer',
  'remove':    'Removal Tools',
  'replace':   'Replace & Substitute',
  'resize':    'Resizer',
  'rotate':    'Rotation & Flip',
  'speed':     'Speed Tools',
  'split':     'Split & Separate',
  'text':      'Text Processing',
  'typeset':   'Typesetter',
  'validate':  'Validator',
  'watermark': 'Watermark Tools'
};

function generateEn(f) {
  const tagKey = f.replace('tag-', '').replace('.html', '');
  const enName = TAG_EN[tagKey];
  if (!enName) { console.warn('  ! 无英文名: ' + tagKey); return null; }

  let html = fs.readFileSync(path.join(ROOT, f), 'utf8');

  // 去除中文 span，保留英文
  html = html.replace(
    /<span class="i18n-zh"[^>]*>[\s\S]*?<\/span>\s*<span class="i18n-en"([^>]*)>([\s\S]*?)<\/span>/gi,
    '<span class="i18n-en"$1>$2</span>'
  );
  html = html.replace(/<span class="i18n-zh"[^>]*>[\s\S]*?<\/span>/gi, '');
  html = html.replace(/<span class="i18n-en"[^>]*>([\s\S]*?)<\/span>/gi, '$1');
  html = html.replace(/\s*hidden="[^"]*"/gi, '');
  html = html.replace(/\s+hiddens?/gi, '');

  const enUrl = BASE + 'en/' + f;

  // 替换 title
  html = html.replace(
    /<title>[^<]*<\/title>/,
    '<title>' + enName + ' | Free Online Tools - 72Tool</title>'
  );
  // 替换 description
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    '<meta name="description" content="Free ' + enName.toLowerCase() + ' by 72Tool — browser-based, no download, no sign-up.">'
  );
  // 替换 canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*">/,
    '<link rel="canonical" href="' + enUrl + '">'
  );
  html = html.replace(/<html[^>]*>/, '<html lang="en">');

  // 清理多余空行
  html = html.replace(/\n{3,}/g, '\n\n');

  // 修正源内容中的格式问题
  html = html.replace(/Online Online/g, 'Online');
  html = html.replace(/Free Online Online/g, 'Free Online');
  // 文件名出现在h1中的修正
  html = html.replace(/<h1>tag-[a-z]+\.html \|/gi, '<h1>' + enName + ' |');

  return html;
}

function run() {
  const tags = fs.readdirSync(ROOT).filter(f => f.startsWith('tag-') && f.endsWith('.html'));
  const outDir = path.join(ROOT, 'en');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  let count = 0;
  tags.forEach(f => {
    const html = generateEn(f);
    if (!html) return;
    fs.writeFileSync(path.join(outDir, f), html, 'utf8');
    console.log('  ✓ /en/' + f);
    count++;
  });

  console.log('build-tag-en: ' + count + ' 个英文 tag 页已生成');
  return count;
}

if (require.main === module) run();

module.exports = { run, TAG_EN };
