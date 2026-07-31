/* 校验：内联 JS 语法 + JSON-LD 解析 + 语义标签闭合 */
const fs = require('fs');
const path = require('path');

const files = process.argv.slice(2);
if (!files.length) files.push('index.html');

let allOk = true;

files.forEach(function (f) {
  const p = path.resolve(process.cwd(), f);
  if (!fs.existsSync(p)) { console.log('MISSING: ' + f); allOk = false; return; }
  const html = fs.readFileSync(p, 'utf8');
  console.log('\n===== ' + f + ' (' + html.length + ' chars) =====');

  // 1) 内联 script 语法
  const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
  let m, i = 0;
  while ((m = re.exec(html))) {
    const tag = m[0].slice(0, m[0].indexOf('>') + 1);
    if (/type\s*=\s*["']application\/ld\+json["']/i.test(tag)) continue;
    i++;
    try { new Function(m[1]); console.log('  JS #' + i + ': OK (' + m[1].length + ')'); }
    catch (e) { allOk = false; console.log('  JS #' + i + ': SYNTAX ERROR -> ' + e.message); }
  }

  // 2) JSON-LD
  const ld = /<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g;
  let j = 0, k;
  while ((k = ld.exec(html))) {
    j++;
    try { const o = JSON.parse(k[1]); console.log('  JSON-LD #' + j + ': OK (@type=' + o['@type'] + ')'); }
    catch (e) { allOk = false; console.log('  JSON-LD #' + j + ': PARSE ERROR -> ' + e.message); }
  }

  // 3) 语义标签闭合
  ['main', 'header', 'section', 'footer', 'nav', 'article'].forEach(function (t) {
    const o = (html.match(new RegExp('<' + t + '[\\s>]', 'g')) || []).length;
    const c = (html.match(new RegExp('</' + t + '>', 'g')) || []).length;
    const flag = o === c ? 'OK' : 'MISMATCH';
    if (o !== c) allOk = false;
    if (o || c) console.log('  <' + t + '>: ' + o + ' open / ' + c + ' close  ' + flag);
  });

  // 4) SEO 必备项
  [['<title>', 'title'], ['name="description"', 'description'], ['rel="canonical"', 'canonical'],
   ['hreflang="x-default"', 'x-default'], ['og:image', 'og:image'], ['Content-Language', 'Content-Language']]
    .forEach(function (pair) {
      if (html.indexOf(pair[0]) === -1) { allOk = false; console.log('  MISSING SEO: ' + pair[1]); }
    });
});

console.log('\n' + (allOk ? 'ALL_OK' : 'HAS_ERROR'));
process.exit(allOk ? 0 : 1);
