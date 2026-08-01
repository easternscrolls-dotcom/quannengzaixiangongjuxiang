#!/usr/bin/env node
/**
 * fix-global-seo-v2.cjs — 修正版
 *
 * 1. 撤销工具页（非 index.html）上的 de/ar hreflang（因为 de/ar 没有工具页，会 404）
 * 2. 修复 SoftwareApplication JSON-LD（处理嵌套大括号）
 * 3. 仅在 index.html 上保留完整 8 条 hreflang
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LANGS = ['en', 'jp', 'es'];
let stats = { hreflangRemoved: 0, jsonldFixed: 0 };

function readHTML(f) { return fs.readFileSync(f, 'utf8'); }
function writeHTML(f, c) { fs.writeFileSync(f, c, 'utf8'); }
function getMeta(html, attr, key) {
  const re = new RegExp('<meta\\s+' + attr + '="' + key + '"\\s+content="([^"]*)"', 'i');
  const m = html.match(re);
  return m ? m[1] : null;
}

// ---- 1. Remove de/ar hreflang from non-index tool pages ----
function removeDeArHreflang(html, fileName) {
  if (fileName === 'index.html') return html; // keep on index pages
  let changed = false;

  // Remove de hreflang line
  if (html.includes('hreflang="de"')) {
    html = html.replace(/\s*<link\s+rel="alternate"\s+hreflang="de"\s+href="[^"]*"\s*>/gi, '');
    changed = true;
  }
  // Remove ar hreflang line
  if (html.includes('hreflang="ar"')) {
    html = html.replace(/\s*<link\s+rel="alternate"\s+hreflang="ar"\s+href="[^"]*"\s*>/gi, '');
    changed = true;
  }

  if (changed) stats.hreflangRemoved++;
  return html;
}

// ---- 2. Fix SoftwareApplication JSON-LD ----
function fixJsonLdV2(html) {
  let changed = false;
  const enTitle = getMeta(html, 'name', 'i18n-title-en');
  const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const canonUrl = canonicalMatch ? canonicalMatch[1] : '';

  // Match the entire <script type="application/ld+json">...</script> block containing SoftwareApplication
  const blockRe = /<script\s+type="application\/ld\+json">\s*([\s\S]*?)<\/script>/gi;
  html = html.replace(blockRe, (fullBlock, jsonContent) => {
    if (!jsonContent.includes('SoftwareApplication')) return fullBlock;

    let fixed = jsonContent;
    let modified = false;

    // Fix name: replace Chinese name with English
    if (enTitle && /[\u4e00-\u9fff]/.test(fixed)) {
      const shortName = enTitle.split('|')[0].trim().split(' - ')[0].trim();
      fixed = fixed.replace(/"name"\s*:\s*"[^"]*"/, '"name":"' + shortName.replace(/"/g, '\\"') + '"');
      modified = true;
    }

    // Fix priceCurrency: CNY → USD
    if (fixed.includes('"priceCurrency":"CNY"') || fixed.includes('"priceCurrency": "CNY"')) {
      fixed = fixed.replace(/"priceCurrency"\s*:\s*"CNY"/, '"priceCurrency":"USD"');
      modified = true;
    }

    // Fix url: point to current language page (canonical)
    if (canonUrl) {
      const urlRe = /"url"\s*:\s*"(https:\/\/72tool\.com\/[^"]*)"/;
      const urlMatch = fixed.match(urlRe);
      if (urlMatch && urlMatch[1] !== canonUrl) {
        fixed = fixed.replace(urlRe, '"url":"' + canonUrl + '"');
        modified = true;
      }
    }

    if (modified) {
      changed = true;
      return '<script type="application/ld+json">' + fixed + '</script>';
    }
    return fullBlock;
  });

  if (changed) stats.jsonldFixed++;
  return { html, changed };
}

// ---- Process ----
console.log('=== fix-global-seo-v2.cjs ===\n');

// Process ZH root tool pages
const zhFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && f !== 'index.html');
console.log(`Processing ZH: ${zhFiles.length} files...`);
for (const file of zhFiles) {
  const fp = path.join(ROOT, file);
  let html = readHTML(fp);
  let mod = false;

  // Remove de/ar hreflang from tool pages
  const before = html;
  html = removeDeArHreflang(html, file);
  if (html !== before) mod = true;

  if (mod) writeHTML(fp, html);
}

// Process EN/JP/ES tool pages
for (const lang of LANGS) {
  const dir = path.join(ROOT, lang);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  console.log(`Processing ${lang}/: ${files.length} files...`);

  for (const file of files) {
    const fp = path.join(dir, file);
    let html = readHTML(fp);
    let mod = false;

    // Remove de/ar hreflang from tool pages (keep on index.html)
    const beforeHl = html;
    html = removeDeArHreflang(html, file);
    if (html !== beforeHl) mod = true;

    // Fix JSON-LD
    const ldResult = fixJsonLdV2(html);
    if (ldResult.changed) { html = ldResult.html; mod = true; }

    if (mod) writeHTML(fp, html);
  }
}

// Also fix JSON-LD on de/ar index.html (they exist)
for (const lang of ['de', 'ar']) {
  const fp = path.join(ROOT, lang, 'index.html');
  if (fs.existsSync(fp)) {
    let html = readHTML(fp);
    const ldResult = fixJsonLdV2(html);
    if (ldResult.changed) { writeHTML(fp, ldResult.html); }
  }
}

console.log(`\n=== Summary ===`);
console.log(`de/ar hreflang removed from tool pages: ${stats.hreflangRemoved}`);
console.log(`JSON-LD fixed: ${stats.jsonldFixed}`);
console.log('Done.');
