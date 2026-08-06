const fs = require('fs');

// EN pages (root) missing description -> add English description
const en = {
  'dns-query': `Free online DNS lookup by 72Tool. Query A, AAAA, MX, TXT, CNAME and NS records for any domain instantly — no install, runs in your browser.`,
  'express-number-check': `Validate courier tracking numbers with 72Tool's free Tracking Number Validator. Detect carrier and check format for major shipping services in one click.`,
  'http-header-check': `Inspect HTTP response headers of any URL with 72Tool's free HTTP Header Checker. View status, caching, security and redirect headers instantly.`,
  'keyword-segment': `Split keywords into clean tokens with 72Tool's free Keyword Segmenter. Great for SEO, ad grouping and content planning — runs locally in your browser.`,
  'mac-generator': `Generate random MAC addresses instantly with 72Tool's free Random MAC Generator. Local, private and no sign-up required.`,
  'mobile-view-check': `Test how any page renders on mobile with 72Tool's free Mobile-Friendly Checker. Check viewport, tap targets and responsive layout.`,
  'og-generator': `Create Open Graph meta tags for social sharing with 72Tool's free OG Tag Generator. Preview how your link looks on Facebook and Twitter.`,
  'page-charset-detect': `Detect a webpage's character encoding with 72Tool's free Page Encoding Detector. Identify UTF-8, GBK and more to fix mojibake.`,
  'page-main-content': `Extract the main article content from any URL with 72Tool's free Webpage Main Content Extractor. Strip nav, ads and sidebars in your browser.`,
  'query-builder': `Build and encode URL query strings visually with 72Tool's free URL Query Builder. Add, sort and encode parameters without errors.`,
  'sitemap': `Browse the full 72Tool index of free online tools, dark-mode templates and open-source code. Find the utility you need — no sign-up, runs in your browser.`,
  'ssl-checker': `Check any domain's SSL certificate with 72Tool's free SSL Certificate Checker. View issuer, validity, expiry and chain in seconds.`,
  'title-length-simulator': `Preview and optimize your page titles with 72Tool's free Title Length Simulator. See how they truncate in Google and Bing results.`,
  'user-agent-analyze': `Parse and identify any User-Agent string with 72Tool's free User-Agent Analyzer. Detect browser, OS, device and bot signals.`,
};

// ZH pages (zh/) whose description is the wrong placeholder "URL & Encoding" -> replace
const zh = {
  'dns-query': `72Tool 免费在线 DNS 查询工具，一键查询域名 A、AAAA、MX、TXT、CNAME、NS 记录，浏览器本地运行，无需安装。`,
  'http-header-check': `72Tool 免费在线 HTTP 响应头检测工具，查看任意网址的状态码、缓存、安全与重定向头信息。`,
  'mobile-view-check': `72Tool 免费在线移动端适配检测工具，检查网页在手机上的视口、点击区域与响应式布局。`,
  'page-charset-detect': `72Tool 免费在线网页编码检测工具，识别 UTF-8、GBK 等字符集，解决乱码问题。`,
  'page-main-content': `72Tool 免费在线网页正文提取工具，一键提取文章主体内容，去除导航、广告与侧栏。`,
  'query-builder': `72Tool 免费在线 URL 参数拼接工具，可视化添加、排序与编码查询参数，避免手工拼接错误。`,
  'ssl-checker': `72Tool 免费在线 SSL 证书检测工具，查看域名证书颁发机构、有效期与证书链信息。`,
  'user-agent-analyze': `72Tool 免费在线 User-Agent 解析工具，识别浏览器、操作系统、设备与爬虫信号。`,
};

let log = [];

// EN: insert after </title> if no description present
for (const [name, desc] of Object.entries(en)) {
  const f = name + '.html';
  if (!fs.existsSync(f)) { log.push(`SKIP (missing file): ${f}`); continue; }
  let html = fs.readFileSync(f, 'utf8');
  if (/name\s*=\s*["']description["']/i.test(html)) { log.push(`SKIP (already has desc): ${f}`); continue; }
  const newTag = `<meta name="description" content="${desc}">`;
  if (/<title[\s>][\s\S]*?<\/title>/i.test(html)) {
    html = html.replace(/(<title[\s>][\s\S]*?<\/title>)/i, `$1\n<meta name="description" content="${desc}">`);
    fs.writeFileSync(f, html);
    log.push(`ADDED desc: ${f}`);
  } else {
    log.push(`SKIP (no title): ${f}`);
  }
}

// ZH: replace placeholder "URL & Encoding"
for (const [name, desc] of Object.entries(zh)) {
  const f = 'zh/' + name + '.html';
  if (!fs.existsSync(f)) { log.push(`SKIP (missing file): ${f}`); continue; }
  let html = fs.readFileSync(f, 'utf8');
  const re = /<meta name="description" content="URL & Encoding"[^>]*>/i;
  if (re.test(html)) {
    html = html.replace(re, `<meta name="description" content="${desc}">`);
    fs.writeFileSync(f, html);
    log.push(`REPLACED placeholder: ${f}`);
  } else {
    log.push(`SKIP (no placeholder): ${f}`);
  }
}

console.log(log.join('\n'));
console.log('\nDONE. EN added:', Object.keys(en).length, ' ZH replaced:', Object.keys(zh).length);
