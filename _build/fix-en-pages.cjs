/* fix-en-pages.cjs — make the 13 uniform EN tool pages genuinely English.
 * Strategy: remove the Chinese longtail region (between `<!-- Cookie弹窗结束 -->`
 * and the first `<div class="i18n-en">`), keeping the parallel English `.i18n-en`
 * block; fix <title> to English; fix crumb "首页" -> "Home".
 */
const fs = require('fs');

const EN_TITLE = {
  'dns-query': 'DNS Record Lookup — Free Online Tool | 72Tool',
  'express-number-check': 'Tracking Number Validator — Free Online Tool | 72Tool',
  'http-header-check': 'HTTP Header Checker — Free Online Tool | 72Tool',
  'keyword-segment': 'Keyword Segmenter — Free Online Tool | 72Tool',
  'mac-generator': 'Random MAC Generator — Free Online Tool | 72Tool',
  'mobile-view-check': 'Mobile-Friendly Checker — Free Online Tool | 72Tool',
  'og-generator': 'Open Graph Tag Generator — Free Online Tool | 72Tool',
  'page-charset-detect': 'Page Encoding Detector — Free Online Tool | 72Tool',
  'page-main-content': 'Webpage Main Content Extractor — Free Online Tool | 72Tool',
  'query-builder': 'URL Query Builder — Free Online Tool | 72Tool',
  'ssl-checker': 'SSL Certificate Checker — Free Online Tool | 72Tool',
  'title-length-simulator': 'Title Length Simulator — Free Online Tool | 72Tool',
  'user-agent-analyze': 'User-Agent Analyzer — Free Online Tool | 72Tool',
};

const pages = Object.keys(EN_TITLE);
const cookieEnd = '<!-- Cookie弹窗结束 -->';
let report = [];

for (const p of pages) {
  const file = p + '.html';
  let s = fs.readFileSync(file, 'utf8');
  const beforeZh = (s.match(/[一-鿿]/g) || []).length;

  // 1) title -> English
  s = s.replace(/<title>[^<]*<\/title>/, '<title>' + EN_TITLE[p] + '</title>');

  // 2) crumb 首页 -> Home (only the /index crumb anchor)
  s = s.replace(/(<a href="\/index"[^>]*>)首页(<\/a>)/, '$1Home$2');

  // 3) delete Chinese longtail region (after cookie box end -> before first i18n-en div)
  const idxA = s.indexOf(cookieEnd);
  const idxB = s.indexOf('<div class="i18n-en">');
  if (idxA === -1 || idxB === -1 || idxB <= idxA) {
    report.push(`SKIP ${p}: cookieEnd=${idxA} i18nEnDiv=${idxB} (unexpected)`);
    continue;
  }
  s = s.slice(0, idxA + cookieEnd.length) + '\n' + s.slice(idxB);

  const afterZh = (s.match(/[一-鿿]/g) || []).length;
  fs.writeFileSync(file, s, 'utf8');
  report.push(`OK   ${p}: zh ${beforeZh} -> ${afterZh} (removed ${beforeZh - afterZh})`);
}

console.log(report.join('\n'));
