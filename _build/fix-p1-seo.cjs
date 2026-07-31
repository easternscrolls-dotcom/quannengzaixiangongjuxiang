/**
 * fix-p1-seo.cjs
 * ------------------------------------------------------------------
 * 批量修复 P1 问题：
 *   P1-1: 海外页（en/jp/es/de/ar）去除 autopush.js 引用
 *   P1-2: 13 个缺少 <meta name="description"> 的根目录工具页补描述
 *   P1-4: en/jp/es 工具页注入 og:image（当前仅有根目录和首页有）
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { BASE } = require('./site.config.cjs');

const ROOT = path.resolve(__dirname, '..');

// ----------------------------------------------------------- P1-1
const AUTOPUSH_TAG = '<script defer src="autopush.js"></script>';
const OVERSEAS = ['en', 'jp', 'es', 'de', 'ar'];

function removeAutopush() {
  let count = 0;
  OVERSEAS.forEach(dir => {
    const d = path.join(ROOT, dir);
    if (!fs.existsSync(d)) return;
    fs.readdirSync(d).filter(f => f.endsWith('.html')).forEach(f => {
      const fp = path.join(d, f);
      let html = fs.readFileSync(fp, 'utf8');
      if (html.indexOf(AUTOPUSH_TAG) === -1) return;
      html = html.split(AUTOPUSH_TAG).join('');
      // 还可能有不 defer 的版本
      html = html.split('<script src="autopush.js"></script>').join('');
      fs.writeFileSync(fp, html, 'utf8');
      count++;
    });
  });
  return count;
}

// ----------------------------------------------------------- P1-2
// 从 tools-data.js 中找对应 slug 的英文描述
function loadToolDescriptions() {
  const code = fs.readFileSync(path.join(ROOT, 'tools-data.js'), 'utf8');
  const g = {};
  new Function('window', code)(g);
  const map = {};
  (g.TOOLS_DATA || []).forEach(t => {
    if (t.slug && (t.desc || t.en)) {
      map[t.slug + '.html'] = t.en || t.desc || '';
    }
  });
  return map;
}

function addDescriptions() {
  const toolDesc = loadToolDescriptions();
  let count = 0;

  fs.readdirSync(ROOT).filter(f => {
    if (!f.endsWith('.html')) return false;
    if (f === 'index.html' || /-tools\.html$/i.test(f)) return false;
    if (/^baidu_verify/i.test(f)) return false;
    return true;
  }).forEach(f => {
    const fp = path.join(ROOT, f);
    let html = fs.readFileSync(fp, 'utf8');
    if (html.indexOf('<meta name="description"') > -1) return;

    // 从 tools-data 取描述
    let desc = toolDesc[f] || '';
    // 如果 tools-data 没有，从 i18n-en span 提取
    if (!desc) {
      const m = html.match(/<span class="i18n-en"[^>]*>([\s\S]*?)<\/span>/);
      if (m) desc = m[1].replace(/<[^>]+>/g, '').trim().slice(0, 160);
    }
    if (!desc) desc = '72Tool free online tool — runs in your browser, no upload, no registration.';

    // 注入 description meta
    const tag = '<meta name="description" content="' + desc.replace(/"/g, '&quot;') + '">';
    html = html.replace(
      /(<meta charset="[^"]*">)/,
      '$1\n' + tag
    );

    fs.writeFileSync(fp, html, 'utf8');
    count++;
    console.log('  ✓ description: ' + f);
  });
  return count;
}

// ----------------------------------------------------------- P1-4
function injectOGImages() {
  const langMap = { en: 'en', jp: 'jp', es: 'es' };
  let count = 0;

  ['en', 'jp', 'es'].forEach(dir => {
    const d = path.join(ROOT, dir);
    fs.readdirSync(d).filter(f => f.endsWith('.html') && f !== 'index.html').forEach(f => {
      const fp = path.join(d, f);
      let html = fs.readFileSync(fp, 'utf8');
      if (html.indexOf('og:image') > -1) return;

      const imgTag = (
        '<meta property="og:image" content="' + BASE + 'og-cover-' + langMap[dir] + '.png">\n' +
        '<meta property="og:image:width" content="1200">\n' +
        '<meta property="og:image:height" content="630">'
      );

      // 注入在第一个 hreflang alternate 之前
      html = html.replace(
        /(<link rel="alternate" hreflang="x-default")/,
        '<!-- Open Graph -->\n' + imgTag + '\n$1'
      );
      fs.writeFileSync(fp, html, 'utf8');
      count++;
    });
  });
  return count;
}

// ----------------------------------------------------------- run
function run() {
  let total = 0;

  const ap = removeAutopush();
  console.log('P1-1 autopush: ' + ap + ' 页已移除 (en/jp/es/de/ar)');
  total += ap;

  const desc = addDescriptions();
  console.log('P1-2 description: ' + desc + ' 页已补充');
  total += desc;

  const og = injectOGImages();
  console.log('P1-4 og:image: ' + og + ' 页已注入');
  total += og;

  console.log('fix-p1-seo: ' + total + ' 项修复完成');
  return total;
}

if (require.main === module) run();

module.exports = { run, removeAutopush, addDescriptions, injectOGImages };
