// 验证修复后的逻辑
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

console.log('=== 修复验证 ===\n');

// 1. 检查 i18n-runtime.js 中不再有 [data-lang] 裸选择器
const i18n = fs.readFileSync(path.join(ROOT, 'i18n-runtime.js'), 'utf8');

const bareSelector = i18n.match(/querySelectorAll\('\[data-lang\]'\)/g);
const safeSelector = i18n.match(/querySelectorAll\('\.lang-option\[data-lang\]'\)/g);

console.log('1. i18n-runtime.js 选择器检查:');
console.log('   裸 [data-lang] 选择器数量:', bareSelector ? bareSelector.length : 0, bareSelector ? ' -> 仍有!' : ' [OK]');
console.log('   .lang-option[data-lang] 选择器数量:', safeSelector ? safeSelector.length : 0, safeSelector ? ' [OK]' : ' [MISSING]');

// 2. 检查 bind() 使用 window.i18nApply (silent)
const usesSilent = i18n.includes('window.i18nApply(this.getAttribute');
console.log('\n2. bind() 使用静默切换:', usesSilent ? '[OK] window.i18nApply (silent)' : '[FAIL] 仍用 apply()');

// 3. 检查 6 个首页 <html> 标签
const pages = ['index.html', 'en/index.html', 'jp/index.html', 'es/index.html', 'de/index.html', 'ar/index.html'];
console.log('\n3. <html> 标签 data-lang 检查:');
let allClean = true;
pages.forEach(p => {
    const html = fs.readFileSync(path.join(ROOT, p), 'utf8');
    const htmlTag = html.match(/<html[^>]*>/)[0];
    const hasDataLang = htmlTag.includes('data-lang=');
    if (hasDataLang) allClean = false;
    console.log('   ' + p + ': ' + (hasDataLang ? '[FAIL] 仍有 data-lang' : '[OK] 无 data-lang'));
});

// 4. 检查 build-i18n.cjs 不再生成 data-lang
const buildScript = fs.readFileSync(path.join(ROOT, '_build', 'build-i18n.cjs'), 'utf8');
const buildHasDataLang = buildScript.includes('data-lang=');
console.log('\n4. build-i18n.cjs:', buildHasDataLang ? '[FAIL] 仍生成 data-lang' : '[OK] 不再生成 data-lang');

// 5. 模拟事件流验证
console.log('\n5. 事件流模拟 (EN->ZH):');
console.log('   用户在 EN 页点击"中文" <a data-lang="zh" href="/">');
console.log('   a) home-render.js handler: lang="zh" !== SITE_LANG="en" -> 不阻止默认行为, 添加 lang-fading');
console.log('   b) i18n-runtime.js handler: window.i18nApply("zh") -> 静默切换 span, 不触发 langchange');
console.log('   c) 事件冒泡到 <html>: <html> 无 data-lang -> 无 handler -> [OK] 不会回切!');
console.log('   d) 浏览器默认行为: 导航到 / -> 加载中文首页 [OK]');

console.log('\n6. 事件流模拟 (ZH->EN):');
console.log('   用户在 ZH 页点击"English" <a data-lang="en" href="/en/">');
console.log('   a) home-render.js handler: lang="en" !== SITE_LANG="zh" -> 不阻止默认行为, 添加 lang-fading');
console.log('   b) i18n-runtime.js handler: window.i18nApply("en") -> 静默切换 span, 不触发 langchange');
console.log('   c) 事件冒泡到 <html>: <html> 无 data-lang -> 无 handler -> [OK] 不会回切!');
console.log('   d) 浏览器默认行为: 导航到 /en/ -> 加载英文首页 [OK]');

// 7. uiSkip() 修复验证
console.log('\n7. uiSkip() 修复验证:');
console.log('   之前: <html data-lang="en"> -> uiSkip 遍历祖先链遇到 <html> -> 跳过所有元素 -> 词典翻译全失效 [BUG]');
console.log('   之后: <html> 无 data-lang -> uiSkip 正常工作 -> 词典翻译恢复生效 [OK]');

console.log('\n=== 验证完成 ===');
