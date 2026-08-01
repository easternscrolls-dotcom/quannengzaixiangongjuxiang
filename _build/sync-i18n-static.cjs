// 批量更新各语言首页的 .i18n-en 静态文本为对应语言翻译
const fs = require('fs');
const path = require('path');

// 基础目录（_build 的父目录，即项目根目录）
const BASE = path.resolve(__dirname, '..');

// 各语言的静态文本翻译
const I18N_STATIC = {
    // h1 标题
    h1: {
        zh: '72Tool &middot; \u4e00\u7ad9\u5f0f\u8d44\u6e90\u5e73\u53f0',
        en: '72Tool &middot; All-in-One Resource Platform',
        jp: '72Tool &middot; \u7dcf\u5408\u30ea\u30bd\u30fc\u30b9\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0',
        es: '72Tool &middot; Plataforma de Recursos Todo en Uno',
        de: '72Tool &middot; Alles-in-einem Ressourcen-Plattform',
        ar: '72Tool &middot; \u0645\u0646\u0635\u0629 \u0645\u0648\u0627\u0631\u062f \u0634\u0627\u0645\u0644\u0629'
    },
    // Banner 描述
    bannerDesc: {
        zh: '\u5728\u7ebf\u5de5\u5177\u3001\u7f51\u7ad9\u4e3b\u9898\u6a21\u677f\u4e0e\u5f00\u6e90\u6e90\u7801\uff0c\u4e00\u7ad9\u76f4\u8fbe\u3002\u6570\u767e\u6b3e\u514d\u8d39\u5de5\u5177\u5373\u5f00\u5373\u7528\uff0c\u7cbe\u7f8e\u6a21\u677f\u4e0e\u6e90\u7801\u4e00\u952e\u9884\u89c8\u4e0b\u8f7d\u3002',
        en: 'Online tools, website templates and open-source code in one place. Hundreds of free tools, beautiful templates and source ready to preview &amp; download.',
        jp: '\u30aa\u30f3\u30e9\u30a4\u30f3\u30c4\u30fc\u30eb\u3001\u30a6\u30a7\u30d6\u30b5\u30a4\u30c8\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8\u3001\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u30b3\u30fc\u30c9\u30921\u304b\u6240\u3067\u3002\u6570\u767e\u306e\u7121\u6599\u30c4\u30fc\u30eb\u3001\u7f8e\u3057\u3044\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8\u3068\u30bd\u30fc\u30b9\u30b3\u30fc\u30c9\u3092\u30d7\u30ec\u30d3\u30e5\u30fc&amp;\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9\u3002',
        es: 'Herramientas en l&iacute;nea, plantillas web y c&oacute;digo abierto en un solo lugar. Cientos de herramientas gratuitas, plantillas y c&oacute;digo listo para previsualizar y descargar.',
        de: 'Online-Tools, Website-Vorlagen und Open-Source-Code an einem Ort. Hunderte kostenlose Tools, Vorlagen und Quellcode zur Vorschau und zum Download.',
        ar: '\u0623\u062f\u0648\u0627\u062a \u0648\u0642\u0648\u0627\u0644\u0628 \u0648\u0645\u0648\u0627\u0642\u0639 \u0648\u0642\u0627\u0644\u0628 \u0648\u064a\u0628 \u0648\u0643\u0648\u062f \u0645\u0641\u062a\u0648\u062d \u0627\u0644\u0645\u0635\u062f\u0631 \u0641\u064a \u0645\u0643\u0627\u0646 \u0648\u0627\u062d\u062f\u3002 \u0645\u0626\u0627\u062a \u0627\u0644\u0623\u062f\u0648\u0627\u062a \u0627\u0644\u0645\u062c\u0627\u0646\u064a\u0629 \u0648\u0627\u0644\u0642\u0648\u0627\u0644\u0628 \u0648\u0627\u0644\u0623\u0643\u0648\u0627\u062f \u062c\u0627\u0647\u0632\u0629 \u0644\u0644\u0639\u0627\u064a\u0646\u0629 \u0648\u0627\u0644\u062a\u062d\u0645\u064a\u0644\u3002'
    },
    // h2 副标题
    h2: {
        zh: '\u4e00\u4e2a\u7ad9\u70b9\uff0c\u641e\u5b9a\u5de5\u5177\u3001\u6a21\u677f\u4e0e\u6e90\u7801',
        en: 'One Site for Tools, Templates &amp; Source',
        jp: '1\u30b5\u30a4\u30c8\u3067\u30c4\u30fc\u30eb\u30fb\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8\u30fb\u30bd\u30fc\u30b9\u30b3\u30fc\u30c9',
        es: 'Un Solo Sitio para Herramientas, Plantillas y C&oacute;digo',
        de: 'Eine Seite f&uuml;r Tools, Vorlagen und Quellcode',
        ar: '\u0645\u0648\u0642\u0639 \u0648\u0627\u062d\u062f \u0644\u0644\u0623\u062f\u0648\u0627\u062a \u0648\u0627\u0644\u0642\u0627\u0644\u0628 \u0648\u0627\u0644\u0643\u0648\u062f \u0627\u0644\u0645\u0635\u062f\u0631\u064a'
    },
    // SEO 介绍段落
    seoIntro: {
        zh: '72Tool \u805a\u5408 <span class="kw">\u5728\u7ebf JSON \u683c\u5f0f\u5316</span>\u3001<span class="kw">\u56fe\u7247\u538b\u7f29\u5de5\u5177</span>\u3001<span class="kw">\u4ee3\u7801\u7f8e\u5316\u5de5\u5177</span>\u3001<span class="kw">PDF \u8f6c\u6362</span> \u4e0e\u5404\u7c7b <span class="kw">\u591a\u5a92\u4f53\u8f6c\u6362\u5668</span>\uff0c\u5168\u90e8\u514d\u8d39\u3001\u65e0\u9700\u6ce8\u518c\u3001\u6d4f\u89c8\u5668\u5373\u7528\u3002\u9700\u8981\u5efa\u7ad9\uff1f\u8fd9\u91cc\u6709 <span class="kw">\u661f\u4e91\u98ce\u535a\u5ba2\u6a21\u677f</span>\u3001<span class="kw">\u6697\u9ed1\u9759\u6001\u4e3b\u9875</span>\u3001<span class="kw">\u81ea\u9002\u5e94\u4e2a\u4eba\u4f5c\u54c1\u96c6</span>\uff0c\u4ee5\u53ca <span class="kw">\u65e0\u6570\u636e\u5e93\u535a\u5ba2\u6e90\u7801</span>\u3001<span class="kw">\u5de5\u5177\u7bb1\u9759\u6001\u6e90\u7801</span>\u3001<span class="kw">\u5bfc\u822a\u7ad9 HTML \u6e90\u7801</span>\uff0c\u9884\u89c8\u5373\u4e0b\u8f7d\u3002<a href="#cat-tool" data-jump="tool">\u6d4f\u89c8\u5728\u7ebf\u5de5\u5177</a> &middot; <a href="#cat-theme" data-jump="theme">\u67e5\u770b\u7f51\u7ad9\u6a21\u677f</a> &middot; <a href="#cat-source" data-jump="source">\u83b7\u53d6\u5f00\u6e90\u6e90\u7801</a>',
        en: '72Tool gathers <span class="kw">online JSON formatter</span>, <span class="kw">image compressor</span>, <span class="kw">code beautifier</span>, <span class="kw">PDF converter</span> and <span class="kw">media converters</span> &mdash; all free, no sign-up. Need a site? Grab a <span class="kw">nebula blog template</span>, <span class="kw">dark static homepage</span>, <span class="kw">responsive portfolio</span>, plus <span class="kw">database-free blog source</span>, <span class="kw">static toolkit source</span> and <span class="kw">navigation site HTML</span>.<br><a href="#cat-tool" data-jump="tool">Browse tools</a> &middot; <a href="#cat-theme" data-jump="theme">View templates</a> &middot; <a href="#cat-source" data-jump="source">Get source</a>',
        jp: '72Tool\u306f <span class="kw">JSON \u6574\u5f62</span>\u3001<span class="kw">\u753b\u50cf\u5727\u7e2e</span>\u3001<span class="kw">\u30b3\u30fc\u30c9\u7f8e\u5316</span>\u3001<span class="kw">PDF \u5909\u63db</span>\u3001<span class="kw">\u30e1\u30c7\u30a3\u30a2\u5909\u63db</span> \u3092\u305f\u304f\u3055\u3093\u63d0\u4f9b\u2014\u3059\u3079\u3066\u7121\u6599\u3001\u767b\u9332\u4e0d\u8981\u3002\u30b5\u30a4\u30c8\u4f5c\u308a\u306b\u306f <span class="kw">\u30cd\u30d6\u30e9\u30d6\u30ed\u30b0\u30c6\u30f3\u30d7\u30ec</span>\u3001<span class="kw">\u30c0\u30fc\u30af\u30b9\u30bf\u30c6\u30a3\u30c3\u30af\u30db\u30fc\u30e0</span>\u3001<span class="kw">\u30ec\u30dd\u30f3\u30b7\u30d6\u30dd\u30fc\u30c8\u30d5\u30aa\u30ea\u30aa</span>\u3001<span class="kw">DB\u306a\u3057\u30d6\u30ed\u30b0\u30bd\u30fc\u30b9</span>\u3001<span class="kw">\u30b9\u30bf\u30c6\u30a3\u30c3\u30af\u30c4\u30fc\u30eb\u30bd\u30fc\u30b9</span>\u3001<span class="kw">\u30ca\u30d3\u30b5\u30a4\u30c8HTML</span> \u3002<br><a href="#cat-tool" data-jump="tool">\u30c4\u30fc\u30eb\u3092\u898b\u308b</a> &middot; <a href="#cat-theme" data-jump="theme">\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8\u3092\u898b\u308b</a> &middot; <a href="#cat-source" data-jump="source">\u30bd\u30fc\u30b9\u3092\u53d6\u5f97</a>',
        es: '72Tool re&uacute;ne <span class="kw">formateador JSON</span>, <span class="kw">compresor de im&aacute;genes</span>, <span class="kw">embellecedor de c&oacute;digo</span>, <span class="kw">conversor PDF</span> y <span class="kw">convertidores multimedia</span> &mdash; todo gratis, sin registro. &iquest;Necesitas un sitio? Consigue una <span class="kw">plantilla de blog nebular</span>, <span class="kw">p&aacute;gina est&aacute;tica oscura</span>, <span class="kw">portfolio responsivo</span>, m&aacute;s <span class="kw">fuente de blog sin base de datos</span>, <span class="kw">fuente de kit est&aacute;tico</span> y <span class="kw">HTML de sitio de navegaci&oacute;n</span>.<br><a href="#cat-tool" data-jump="tool">Explorar herramientas</a> &middot; <a href="#cat-theme" data-jump="theme">Ver plantillas</a> &middot; <a href="#cat-source" data-jump="source">Obtener c&oacute;digo</a>',
        de: '72Tool b&uuml;ndelt <span class="json-Formatter</span>, <span class="kw">Bildkomprimierung</span>, <span class="kw">Code-Sch&ouml;nheit</span>, <span class="kw">PDF-Konverter</span> und <span class="kw>Medienkonverter</span> &mdash; alles kostenlos, ohne Anmeldung. Eine Seite gebraucht? Hol dir eine <span class="kw>Nebel-Blogvorlage</span>, <span class="kw>dunkle statische Startseite</span>, <span class="kw>responsives Portfolio</span>, plus <span class="kw>Datenbankfreier Blog-Quellcode</span>, <span class="kw>statischer Toolkit-Quellcode</span> und <span class="kw>Navigationsseiten-HTML</span>.<br><a href="#cat-tool" data-jump="tool">Tools durchsuchen</a> &middot; <a href="#cat-theme" data-jump="theme">Vorlagen ansehen</a> &middot; <a href="#cat-source" data-jump="source">Quellcode abrufen</a>',
        ar: '72Tool \u064a\u062c\u0645\u0639 <span class="kw">\u0645\u0646\u0633\u0642 JSON</span>\u060c <span class="kw">\u0623\u062f\u0627\u0629 \u0636\u063a\u0637 \u0627\u0644\u0635\u0648\u0631</span>\u060c <span class="kw">\u0645\u0632\u064a\u0646 \u0627\u0644\u0643\u0648\u062f</span>\u060c <span class="kw">\u0645\u062d\u0648\u0644 PDF</span> \u0648 <span class="kw">\u0645\u062d\u0648\u0644\u0627\u062a \u0627\u0644\u0648\u0633\u0627\u0626\u0637 \u0627\u0644\u0645\u062a\u0639\u062f\u062f\u0629</span> \u2014 \u0643\u0644\u0644\u0647\u0627 \u0645\u062c\u0627\u0646\u064a\u0629 \u0628\u062f\u0648\u0646 \u062a\u0633\u062c\u064a\u0644\u3002 \u062a\u062d\u062a\u0627\u062c \u0644\u0645\u0648\u0642\u0639\u061f \u0627\u062d\u0635\u0644 \u0639\u0644\u0649 <span class="kw">\u0642\u0627\u0644\u0628 \u0645\u062f\u0648\u0646\u0629 \u0646\u0628\u0648\u0644\u064a</span>\u060c <span class="kw">\u0635\u0641\u062d\u0629 \u0631\u0626\u064a\u0633\u064a\u0629 \u062f\u0627\u0643\u0646\u0629</span>\u060c <span class="kw">\u0645\u0639\u0631\u0636 \u0645\u0633\u062a\u062c\u0648\u0628</span>\u060c \u0628\u0627\u0644\u0625\u0636\u0627\u0641\u0629 \u0625\u0644\u0649 <span class="kw">\u0643\u0648\u062f \u0645\u062f\u0648\u0646\u0629 \u0628\u062f\u0648\u0646 \u0642\u0627\u0639\u062f\u0629 \u0628\u064a\u0627\u0646\u0627\u062a</span>\u060c <span class="kw">\u0643\u0648\u062f \u0645\u0648\u0642\u0639 \u0623\u062f\u0648\u0627\u062a \u062b\u0627\u0628\u062a</span>\u060c <span class="kw">HTML \u0645\u0648\u0642\u0639 \u062a\u0641\u0648\u064a\u0642</span>\u3002<br><a href="#cat-tool" data-jump="tool">\u062a\u0635\u0641\u062d \u0627\u0644\u0623\u062f\u0648\u0627\u062a</a> &middot; <a href="#cat-theme" data-jump="theme">\u0639\u0631\u0636 \u0627\u0644\u0642\u0648\u0627\u0644\u0628</a> &middot; <a href="#cat-source" data-jump="source">\u0627\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u0627\u0644\u0643\u0648\u062f</a>'
    }
};

// 语言页映射（相对于项目根目录）
const LANG_PAGES = {
    'en/index.html': 'en',
    'jp/index.html': 'jp',
    'es/index.html': 'es',
    'de/index.html': 'de',
    'ar/index.html': 'ar'
};

let totalChanges = 0;

Object.entries(LANG_PAGES).forEach(([file, lang]) => {
    const fullPath = path.join(BASE, file);
    if (!fs.existsSync(fullPath)) { console.log('SKIP (not found): ' + file); return; }
    
    let html = fs.readFileSync(fullPath, 'utf8');
    let changed = 0;
    const t = {
        h1: I18N_STATIC.h1[lang],
        bannerDesc: I18N_STATIC.bannerDesc[lang],
        h2: I18N_STATIC.h2[lang],
        seoIntro: I18N_STATIC.seoIntro[lang]
    };
    
    // 1. 更新 h1 的 .i18n-en span
    const h1Old = /<span class="i18n-en"[^>]*>([^<]+All-in-One Resource Platform[^<]*)<\/span>/;
    if (h1Old.test(html)) {
        html = html.replace(h1Old, '<span class="i18n-en">' + t.h1 + '</span>');
        changed++;
    }
    
    // 2. 更新 Banner 描述的 .i18n-en span（匹配英文原文）
    const bannerOld = /<span class="i18n-en"[^>]*>[^<]*Online tools[^<]*preview &amp; download\.[^<]*<\/span>/;
    if (bannerOld.test(html)) {
        html = html.replace(bannerOld, '<span class="i18n-en">' + t.bannerDesc + '</span>');
        changed++;
    }
    
    // 3. 更新 h2 副标题的 .i18n-en span
    const h2Old = /<span class="i18n-en"[^>]*>[^<]*One Site for Tools[^<]*<\/span>/;
    if (h2Old.test(html)) {
        html = html.replace(h2Old, '<span class="i18n-en">' + t.h2 + '</span>');
        changed++;
    }
    
    // 4. 更新 SEO 介绍段落的 .i18n-en span（内容含 <a> 标签，以 Get source</a></span> 结尾）
    const seoOld = /<span class="i18n-en"[^>]*>72Tool gathers[\s\S]*?Get source<\/a><\/span>/;
    if (seoOld.test(html)) {
        html = html.replace(seoOld, '<span class="i18n-en">' + t.seoIntro + '</span>');
        changed++;
    }
    
    if (changed > 0) {
        fs.writeFileSync(fullPath, html, 'utf8');
        console.log('✅ ' + file + ': ' + changed + ' replacements (' + lang + ')');
        totalChanges += changed;
    } else {
        console.log('⚠️  ' + file + ': no changes made (patterns not found)');
    }
});

console.log('\n=== Total: ' + totalChanges + ' replacements across ' + Object.keys(LANG_PAGES).length + ' pages ===');
