#!/usr/bin/env node
/**
 * fix-global-seo.cjs — 全球市场 SEO 批量修复
 *
 * P0-1: 海外工具页 OG/Twitter 标签从中文替换为英文（用 i18n-title-en / i18n-desc-en）
 * P0-2: 海外工具页结构化数据 name 英文化 + priceCurrency CNY→USD + url 指向对应语言
 * P0-3: 所有工具页补全 de 和 ar hreflang
 * P1-2: ZH 工具页补 og:image
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LANGS = ['en', 'jp', 'es', 'de', 'ar'];
const HREFLANG_MAP = {
  'zh-Hans': '',
  'en': 'en/',
  'ja': 'jp/',
  'es': 'es/',
  'de': 'de/',
  'ar': 'ar/'
};

let stats = {
  ogFixed: 0,
  jsonldFixed: 0,
  hreflangAdded: 0,
  ogImageAdded: 0,
  filesScanned: 0
};

// ---- Helpers ----
function readHTML(file) {
  return fs.readFileSync(file, 'utf8');
}
function writeHTML(file, content) {
  fs.writeFileSync(file, content, 'utf8');
}

// Extract meta content by name or property
function getMeta(html, attr, key) {
  const re = new RegExp('<meta\\s+' + attr + '="' + key + '"\\s+content="([^"]*)"', 'i');
  const m = html.match(re);
  return m ? m[1] : null;
}

// ---- P0-1: Fix OG/Twitter tags on overseas tool pages ----
function fixOGTwitter(html, langPrefix) {
  let changed = false;
  const enTitle = getMeta(html, 'name', 'i18n-title-en');
  const enDesc = getMeta(html, 'name', 'i18n-desc-en');

  if (!enTitle || !enDesc) return { html, changed };

  // og:title
  if (html.includes('og:title') && /[\u4e00-\u9fff]/.test(getMeta(html, 'property', 'og:title') || '')) {
    html = html.replace(
      /<meta\s+property="og:title"\s+content="[^"]*"/i,
      '<meta property="og:title" content="' + enTitle.replace(/"/g, '&quot;') + '"'
    );
    changed = true;
  }

  // og:description
  if (html.includes('og:description') && /[\u4e00-\u9fff]/.test(getMeta(html, 'property', 'og:description') || '')) {
    html = html.replace(
      /<meta\s+property="og:description"\s+content="[^"]*"/i,
      '<meta property="og:description" content="' + enDesc.replace(/"/g, '&quot;') + '"'
    );
    changed = true;
  }

  // og:url — point to current language page
  const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
  if (canonicalMatch) {
    const canonUrl = canonicalMatch[1];
    const oldOgUrl = getMeta(html, 'property', 'og:url');
    if (oldOgUrl && oldOgUrl !== canonUrl) {
      html = html.replace(
        /<meta\s+property="og:url"\s+content="[^"]*"/i,
        '<meta property="og:url" content="' + canonUrl + '"'
      );
      changed = true;
    }
  }

  // og:site_name — English
  const oldSiteName = getMeta(html, 'property', 'og:site_name');
  if (oldSiteName && /[\u4e00-\u9fff]/.test(oldSiteName)) {
    html = html.replace(
      /<meta\s+property="og:site_name"\s+content="[^"]*"/i,
      '<meta property="og:site_name" content="72Tool"'
    );
    changed = true;
  }

  // twitter:title
  if (html.includes('twitter:title') && /[\u4e00-\u9fff]/.test(getMeta(html, 'name', 'twitter:title') || '')) {
    html = html.replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"/i,
      '<meta name="twitter:title" content="' + enTitle.replace(/"/g, '&quot;') + '"'
    );
    changed = true;
  }

  // twitter:description
  if (html.includes('twitter:description') && /[\u4e00-\u9fff]/.test(getMeta(html, 'name', 'twitter:description') || '')) {
    html = html.replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"/i,
      '<meta name="twitter:description" content="' + enDesc.replace(/"/g, '&quot;') + '"'
    );
    changed = true;
  }

  // twitter:card — upgrade to summary_large_image if og:image exists
  const ogImage = getMeta(html, 'property', 'og:image');
  if (ogImage) {
    html = html.replace(
      /<meta\s+name="twitter:card"\s+content="summary"/i,
      '<meta name="twitter:card" content="summary_large_image"'
    );
    // Add twitter:image if missing
    if (!html.includes('twitter:image')) {
      html = html.replace(
        /(<meta\s+name="twitter:description"\s+content="[^"]*"\s*>)/i,
        '$1\n    <meta name="twitter:image" content="' + ogImage + '">'
      );
    }
  }

  return { html, changed };
}

// ---- P0-2: Fix structured data on overseas tool pages ----
function fixJsonLd(html, langPrefix) {
  let changed = false;
  const enTitle = getMeta(html, 'name', 'i18n-title-en');
  const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const canonUrl = canonicalMatch ? canonicalMatch[1] : '';

  // Fix SoftwareApplication JSON-LD
  const saRe = /(\{[^{}]*"@type":"SoftwareApplication"[^{}]*\})/g;
  html = html.replace(saRe, (match) => {
    let fixed = match;
    let modified = false;

    // Fix name: replace Chinese name with English title
    if (enTitle && /[\u4e00-\u9fff]/.test(match)) {
      const shortName = enTitle.split('|')[0].trim().split(' - ')[0].trim();
      fixed = fixed.replace(/"name":"[^"]*"/, '"name":"' + shortName.replace(/"/g, '\\"') + '"');
      modified = true;
    }

    // Fix priceCurrency: CNY → USD
    if (fixed.includes('"priceCurrency":"CNY"')) {
      fixed = fixed.replace('"priceCurrency":"CNY"', '"priceCurrency":"USD"');
      modified = true;
    }

    // Fix url: point to current language page
    if (canonUrl && fixed.includes('"url":"https://72tool.com/') && !fixed.includes('"url":"' + canonUrl + '"')) {
      fixed = fixed.replace(/"url":"https:\/\/72tool\.com\/[^"]*"/, '"url":"' + canonUrl + '"');
      modified = true;
    }

    if (modified) changed = true;
    return fixed;
  });

  return { html, changed };
}

// ---- P0-3: Add missing de and ar hreflang ----
function fixHreflang(html, pageName) {
  let changed = false;

  // Check if de hreflang exists
  if (!html.includes('hreflang="de"')) {
    const deUrl = 'https://72tool.com/de/' + pageName;
    // Insert after the last hreflang line
    html = html.replace(
      /(<link\s+rel="alternate"\s+hreflang="es"\s+href="[^"]*"\s*>)/i,
      '$1\n<link rel="alternate" hreflang="de" href="' + deUrl + '">\n<link rel="alternate" hreflang="ar" href="https://72tool.com/ar/' + pageName + '">'
    );
    changed = true;
  }

  return { html, changed };
}

// ---- P1-2: Add og:image to ZH tool pages ----
function addOgImage(html) {
  let changed = false;
  if (!html.includes('og:image') && html.includes('SoftwareApplication')) {
    const ogImg = '<meta property="og:image" content="https://72tool.com/og-cover-zh.png">\n    <meta property="og:image:width" content="1200">\n    <meta property="og:image:height" content="630">';
    // Insert after og:description or after canonical
    if (html.includes('og:description')) {
      html = html.replace(
        /(<meta\s+property="og:description"\s+content="[^"]*"\s*>)/i,
        '$1\n    ' + ogImg
      );
      changed = true;
    } else if (html.includes('rel="canonical"')) {
      html = html.replace(
        /(<link\s+rel="canonical"\s+href="[^"]*"\s*>)/i,
        '$1\n    ' + ogImg
      );
      changed = true;
    }
  }
  return { html, changed };
}

// ---- Main: Process all files ----
function processLangDir(langDir, langPrefix) {
  const dir = path.join(ROOT, langDir);
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  console.log(`  [${langDir}] Processing ${files.length} files...`);

  for (const file of files) {
    const filePath = path.join(dir, file);
    let html = readHTML(filePath);
    let modified = false;
    stats.filesScanned++;

    // P0-1: Fix OG/Twitter
    const ogResult = fixOGTwitter(html, langPrefix);
    if (ogResult.changed) { html = ogResult.html; modified = true; stats.ogFixed++; }

    // P0-2: Fix structured data
    const ldResult = fixJsonLd(html, langPrefix);
    if (ldResult.changed) { html = ldResult.html; modified = true; stats.jsonldFixed++; }

    // P0-3: Fix hreflang
    const hlResult = fixHreflang(html, file);
    if (hlResult.changed) { html = hlResult.html; modified = true; stats.hreflangAdded++; }

    if (modified) writeHTML(filePath, html);
  }
}

function processZhDir() {
  const dir = ROOT;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');
  console.log(`  [zh] Processing ${files.length} files...`);

  for (const file of files) {
    const filePath = path.join(dir, file);
    let html = readHTML(filePath);
    let modified = false;
    stats.filesScanned++;

    // P0-3: Fix hreflang (ZH pages also missing de/ar)
    const hlResult = fixHreflang(html, file);
    if (hlResult.changed) { html = hlResult.html; modified = true; stats.hreflangAdded++; }

    // P1-2: Add og:image
    const ogResult = addOgImage(html);
    if (ogResult.changed) { html = ogResult.html; modified = true; stats.ogImageAdded++; }

    if (modified) writeHTML(filePath, html);
  }
}

// ---- Run ----
console.log('=== fix-global-seo.cjs: Global SEO Batch Fix ===\n');

console.log('Processing ZH root pages...');
processZhDir();

for (const lang of LANGS) {
  console.log(`Processing ${lang}/ ...`);
  processLangDir(lang, lang + '/');
}

console.log('\n=== Summary ===');
console.log(`Files scanned:    ${stats.filesScanned}`);
console.log(`OG/Twitter fixed: ${stats.ogFixed}`);
console.log(`JSON-LD fixed:    ${stats.jsonldFixed}`);
console.log(`Hreflang added:   ${stats.hreflangAdded}`);
console.log(`OG image added:   ${stats.ogImageAdded}`);
console.log('Done.');
