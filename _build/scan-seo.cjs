const fs = require('fs');
const path = require('path');

const roots = ['.', 'zh'];
const ext = '.html';

function stripComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, '');
}

function scanFile(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const html = stripComments(raw);
  const lower = html.toLowerCase();

  // meta description count
  const descCount = (lower.match(/<meta[^>]+name\s*=\s*["']description["']/g) || []).length;
  // h1 count
  const h1Count = (lower.match(/<h1[\s>]/g) || []).length;
  // canonical link count
  const canonCount = (lower.match(/<link[^>]+rel\s*=\s*["'][^"']*canonical[^"']*["']/g) || []).length;
  // title
  const hasTitle = /<title[\s>][\s\S]*?<\/title>/i.test(raw);

  return { file, descCount, h1Count, canonCount, hasTitle, bytes: raw.length };
}

const issues = {
  missingDesc: [],
  multiDesc: [],
  missingH1: [],
  multiH1: [],
  multiCanon: [],
  missingTitle: [],
};

let total = 0;
for (const root of roots) {
  const dir = path.resolve(root);
  if (!fs.existsSync(dir)) continue;
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(ext)) continue;
    if (/baidu_verify/.test(name)) continue; // verification tokens: bare on purpose, excluded via robots.txt
    const file = path.join(dir, name);
    if (!fs.statSync(file).isFile()) continue;
    total++;
    const r = scanFile(file);
    if (r.descCount === 0) issues.missingDesc.push(r);
    if (r.descCount > 1) issues.multiDesc.push(r);
    if (r.h1Count === 0) issues.missingH1.push(r);
    if (r.h1Count > 1) issues.multiH1.push(r);
    if (r.canonCount > 1) issues.multiCanon.push(r);
    if (!r.hasTitle) issues.missingTitle.push(r);
  }
}

console.log('TOTAL HTML files scanned:', total);
for (const [k, v] of Object.entries(issues)) {
  console.log(`\n===== ${k} (${v.length}) =====`);
  for (const r of v) {
    console.log(`${r.file}  | desc=${r.descCount} h1=${r.h1Count} canon=${r.canonCount} title=${r.hasTitle} bytes=${r.bytes}`);
  }
}
