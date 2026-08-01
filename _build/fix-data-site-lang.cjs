#!/usr/bin/env node
/**
 * fix-data-site-lang.cjs — 给海外工具页添加 data-site-lang="en"
 *
 * 问题：JP/ES 工具页 <html lang="ja"/es"> 但无 data-site-lang
 * i18n-runtime.js detect() 读不到 data-site-lang，lang 又不以 "en" 开头
 * → fallback 返回 'zh' → apply('zh') 显示中文 span，隐藏英文 span
 *
 * 修复：给所有海外工具页的 <html> 标签添加 data-site-lang="en"
 * （所有海外语言统一显示英文兜底内容）
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
let count = 0;

function fixHtmlTag(file) {
  let html = fs.readFileSync(file, 'utf8');
  
  // Skip if already has data-site-lang
  if (html.includes('data-site-lang=')) return false;
  
  // Add data-site-lang="en" to <html> tag
  // Match: <html lang="en"> or <html lang="ja"> etc.
  const htmlTagRe = /<html\s+lang="([^"]*)"([^>]*)>/i;
  const m = html.match(htmlTagRe);
  if (m) {
    const newTag = `<html lang="${m[1]}" data-site-lang="en"${m[2]}>`;
    html = html.replace(htmlTagRe, newTag);
    fs.writeFileSync(file, html, 'utf8');
    return true;
  }
  return false;
}

// Process EN, JP, ES directories
for (const lang of ['en', 'jp', 'es']) {
  const dir = path.join(ROOT, lang);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  console.log(`Processing ${lang}/: ${files.length} files...`);
  for (const f of files) {
    if (fixHtmlTag(path.join(dir, f))) count++;
  }
}

console.log(`\nFixed ${count} files with data-site-lang="en"`);
