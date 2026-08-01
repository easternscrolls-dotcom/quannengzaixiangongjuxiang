/**
 * build-static-i18n.cjs
 * ------------------------------------------------------------------
 * 从根目录的中文静态页（privacy/terms/about/contact）中提取 i18n-en 内容，
 * 生成独立的英文版页面到 /en/ 目录。
 *
 * 原始页面使用 <span class="i18n-zh">...</span><span class="i18n-en" hidden>...</span>
 * 双语模式。本脚本将英文内容「展开」为纯英文独立页面，并注入：
 *   - 完整的 SEO head（canonical/hreflang/OG/favicon）
 *   - 去除语言切换栏（英文页不需要中英切换按钮）
 *   - 修正内部链接前缀为 /en/
 *
 * 幂等：每次运行覆盖 /en/{page}.html。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { BASE } = require('./site.config.cjs');

const ROOT = path.resolve(__dirname, '..');
const PAGES = ['privacy', 'terms', 'about', 'contact'];

function extractEn(html) {
  // 移除 switchbar 语言切换
  html = html.replace(/<div class="switchbar">[\s\S]*?<\/div>\s*/g, '');
  // 展开 i18n-en：保留 en 内容，丢弃 zh
  html = html.replace(
    /<span class="i18n-zh">[\s\S]*?<\/span>\s*<span class="i18n-en"[^>]*>([\s\S]*?)<\/span>/gi,
    '$1'
  );
  return html;
}

function fixLinks(html) {
  // 内部链接加 /en/ 前缀（避免跳回中文版）
  const internal = ['index.html', 'privacy.html', 'terms.html', 'about.html', 'contact.html', 'sitemap.html'];
  internal.forEach(p => {
    html = html.replace(new RegExp('href=["\']' + p + '["\']', 'g'), 'href="/en/' + p + '"');
  });
  return html;
}

function buildSeoHead(pageKey, title, desc) {
  const url = BASE + 'en/' + pageKey + '.html';
  const today = new Date().toISOString().slice(0, 10);
  return [
    '<meta charset="UTF-8">',
    '<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">',
    '<meta http-equiv="Pragma" content="no-cache">',
    '<meta http-equiv="Expires" content="0">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '<title>' + title + '</title>',
    '<meta name="description" content="' + desc + '">',
    '<link rel="icon" type="image/svg+xml" href="/favicon.svg">',
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">',
    '<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180.png">',
    '<meta name="theme-color" content="#16C7B2">',
    '<link rel="canonical" href="' + url + '">',
    '<link rel="alternate" hreflang="x-default" href="' + BASE + 'en/' + pageKey + '.html">',
    '<link rel="alternate" hreflang="zh-Hans" href="' + BASE + pageKey + '.html">',
    '<link rel="alternate" hreflang="en" href="' + url + '">'
  ].join('\n') + '\n';
}

// 各页面的英文标题与描述
const META = {
  privacy: {
    title: 'Privacy Policy | 72Tool',
    desc: '72Tool Privacy Policy: All tools run locally in your browser — files are never uploaded. Learn about cookies, ads, GDPR & CCPA compliance.'
  },
  terms: {
    title: 'Terms of Service | 72Tool',
    desc: '72Tool Terms of Service: Rules and conditions for using our free online tools. No registration required; all processing happens in your browser.'
  },
  about: {
    title: 'About Us | 72Tool',
    desc: 'About 72Tool: A free online toolbox with 370+ browser-based utilities. No sign-up, no uploads — your data stays on your device.'
  },
  contact: {
    title: 'Contact Us | 72Tool',
    desc: 'Contact 72Tool: Have questions or feedback? Reach out via email. We typically respond within 24-48 hours.'
  }
};

// 硬编码中文 → 英文替换（用于不在 i18n span 中的纯文本标签）
const HARDCODED_EN = [
  ['关于我们', 'About Us'],
  ['联系我们', 'Contact Us'],
  ['隐私政策', 'Privacy Policy'],
  ['服务条款', 'Terms of Service'],
  ['← 返回工具箱首页', '← Back to Home'],
  ['© 2026 72Tool 72tool.com 保留所有权利', '© 2026 72Tool 72tool.com. All rights reserved.']
];

function run() {
  let total = 0;
  PAGES.forEach(key => {
    const src = path.join(ROOT, key + '.html');
    if (!fs.existsSync(src)) { console.warn('  ! 源文件不存在: ' + key + '.html'); return; }
    const meta = META[key];
    let html = fs.readFileSync(src, 'utf8');

    // 替换 head 中从 <title> 到 </head> 之前的内容为新的 SEO head
    html = extractEn(html);
    html = fixLinks(html);

    // 替换不在 i18n span 中的硬编码中文
    HARDCODED_EN.forEach(([zh, en]) => {
      html = html.split(zh).join(en);
    });

    // 替换 <head>...<style> 区块中的旧 head 为新 SEO head
    // 策略：找到第一个 <meta 或 <title> 到 <style> 之间的内容，替换
    const headRe = /(<head>\s*<meta[^>]*charset[^>]*>)([\s\S]*?)(<style)/;
    if (headRe.test(html)) {
      html = html.replace(headRe, '$1\n' + buildSeoHead(key, meta.title, meta.desc) + '\n$3');
    }

    // 替换 lang 属性
    html = html.replace(/<html[^>]*>/, '<html lang="en">');

    const dst = path.join(ROOT, 'en', key + '.html');
    fs.writeFileSync(dst, html, 'utf8');
    total++;
    console.log('  ✓ /en/' + key + '.html');
  });

  console.log('build-static-i18n: ' + total + ' 个英文静态页已生成');
  return total;
}

if (require.main === module) run();

module.exports = { run, PAGES, extractEn };
