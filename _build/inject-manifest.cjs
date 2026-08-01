#!/usr/bin/env node
/**
 * inject-manifest.cjs — 给所有 HTML 页面注入 PWA manifest 链接
 * 在 favicon link 之后插入 <link rel="manifest" href="/manifest.json">
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
let count = 0;

function injectManifest(file) {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('rel="manifest"')) return false;

  // Insert after the first favicon link
  const faviconRe = /(<link\s+rel="icon"[^>]*>)/i;
  if (faviconRe.test(html)) {
    html = html.replace(faviconRe, '$1\n<link rel="manifest" href="/manifest.json">');
  } else {
    // Fallback: insert after charset
    html = html.replace(/(<meta\s+charset="[^"]*">)/i, '$1\n<link rel="manifest" href="/manifest.json">');
  }

  fs.writeFileSync(file, html, 'utf8');
  return true;
}

// Process root
const rootFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
for (const f of rootFiles) {
  if (injectManifest(path.join(ROOT, f))) count++;
}

// Process language dirs
for (const lang of ['en', 'jp', 'es', 'de', 'ar', 'blog', 'c']) {
  const dir = path.join(ROOT, lang);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  for (const f of files) {
    if (injectManifest(path.join(dir, f))) count++;
  }
}

// Process en/c if exists
const enCDir = path.join(ROOT, 'en', 'c');
if (fs.existsSync(enCDir)) {
  const files = fs.readdirSync(enCDir).filter(f => f.endsWith('.html'));
  for (const f of files) {
    if (injectManifest(path.join(enCDir, f))) count++;
  }
}

console.log(`Manifest link injected into ${count} HTML files.`);
