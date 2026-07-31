/* ============================================================
 *  72Tool · 全站构建配置（多语言 SEO 单一数据源）
 *  改这里 → 重跑 node _build/build-all.cjs → 全站 meta / sitemap / 聚合页同步更新
 * ============================================================ */

const BASE = 'https://72tool.com/';
const OG_IMAGE_BASE = BASE + 'og-cover';   // og-cover.png / og-cover-en.png ...

/* ---------------- 语种矩阵 ---------------- */
const LANGS = [
  {
    key: 'zh', dir: '', htmlLang: 'zh-CN', hreflang: 'zh-Hans', ogLocale: 'zh_CN',
    rtl: false, catPages: true,
    title: '72Tool在线工具箱｜免费在线工具、网站模板与开源源码',
    desc: '72Tool 一站式资源平台：353+ 款免费在线工具（JSON格式化、图片压缩、代码美化、多媒体转换），精美网站主题模板（星云风博客、暗黑静态主页、自适应作品集）与开源源码（无数据库博客、工具箱静态站、导航站 HTML）。无需注册、即开即用。',
    keywords: '在线工具,网站模板,开源源码,JSON格式化,图片压缩,代码美化,多媒体转换,星云博客模板,暗黑主页,静态博客源码,工具箱源码,导航站HTML,PDF转换,免费工具箱',
    ogTitle: '72Tool在线工具箱｜免费在线工具、网站模板与开源源码',
    ogDesc: '353+ 款免费在线工具、精美网站主题模板与开源源码，无需注册，浏览器即开即用。',
    schemaName: '72Tool 在线工具箱',
    schemaDesc: '一站式在线工具、网站主题模板与开源源码资源平台',
    crumbs: ['在线工具', '网站主题模板', '开源源码']
  },
  {
    key: 'en', dir: 'en/', htmlLang: 'en', hreflang: 'en', ogLocale: 'en_US',
    rtl: false, catPages: true,
    title: 'Free Online Tools, Website Templates & Open Source Code — 72Tool',
    desc: '353+ free online tools that run 100% in your browser: online JSON formatter, free image compressor, PDF converter, code beautifier and media converters. Plus dark mode responsive website templates and no-database static blog HTML source code. No sign-up, no install, MIT licensed.',
    keywords: 'free online tools, online json formatter, free image compressor, pdf converter online, code beautifier, dark mode responsive website template, no database static blog html, open source html source code, free web utility, browser based toolkit',
    ogTitle: '72Tool — 353+ Free Online Tools, Templates & Open Source Code',
    ogDesc: 'Free browser-based tools, dark-mode website templates and MIT-licensed static source code. No sign-up, no upload — everything runs client side.',
    schemaName: '72Tool — Free Online Toolkit',
    schemaDesc: 'One-stop platform for free online tools, website templates and open source code.',
    crumbs: ['Online Tools', 'Website Templates', 'Open Source Code']
  },
  {
    key: 'jp', dir: 'jp/', htmlLang: 'ja', hreflang: 'ja', ogLocale: 'ja_JP',
    rtl: false, catPages: false,
    title: '無料オンラインツール・Webテンプレート・オープンソース｜72Tool',
    desc: 'ブラウザだけで完結する無料オンラインツール353種以上。JSON整形、画像圧縮、PDF変換、コード整形、メディア変換に対応。ダークモード対応のレスポンシブWebテンプレートと、データベース不要の静的ブログHTMLソースコードも無料配布。登録不要・インストール不要。',
    keywords: '無料オンラインツール, json 整形, 画像 圧縮, pdf 変換, コード整形, ダークモード テンプレート, 静的ブログ ソースコード, 無料 html テンプレート',
    ogTitle: '72Tool — 無料オンラインツール・Webテンプレート・ソースコード',
    ogDesc: '登録不要・ブラウザ完結の無料ツール353種以上。テンプレートとソースコードも無料でダウンロード。',
    schemaName: '72Tool オンラインツール',
    schemaDesc: '無料オンラインツール・Webテンプレート・オープンソースの総合プラットフォーム',
    crumbs: ['オンラインツール', 'Webテンプレート', 'オープンソース']
  },
  {
    key: 'es', dir: 'es/', htmlLang: 'es', hreflang: 'es', ogLocale: 'es_ES',
    rtl: false, catPages: false,
    title: 'Herramientas Online Gratis, Plantillas Web y Código Abierto — 72Tool',
    desc: 'Más de 353 herramientas online gratuitas que funcionan 100% en tu navegador: formateador JSON online, compresor de imágenes gratis, conversor de PDF, embellecedor de código y conversores multimedia. Además, plantillas web responsive en modo oscuro y código fuente HTML de blog estático sin base de datos. Sin registro.',
    keywords: 'herramientas online gratis, formateador json online, comprimir imagenes gratis, convertir pdf online, plantilla web modo oscuro, codigo fuente blog estatico html, plantillas html gratis',
    ogTitle: '72Tool — Herramientas Online Gratis, Plantillas y Código Abierto',
    ogDesc: 'Herramientas gratuitas en el navegador, plantillas web y código fuente con licencia MIT. Sin registro ni instalación.',
    schemaName: '72Tool — Herramientas Online Gratis',
    schemaDesc: 'Plataforma integral de herramientas online, plantillas web y código abierto.',
    crumbs: ['Herramientas Online', 'Plantillas Web', 'Código Abierto']
  },
  {
    key: 'de', dir: 'de/', htmlLang: 'de', hreflang: 'de', ogLocale: 'de_DE',
    rtl: false, catPages: false,
    title: 'Kostenlose Online-Tools, Web-Vorlagen & Open Source — 72Tool',
    desc: 'Über 353 kostenlose Online-Tools, die vollständig im Browser laufen: JSON-Formatierer, Bild-Komprimierung, PDF-Konverter, Code-Beautifier und Medien-Konverter. Dazu responsive Website-Vorlagen im Dark Mode und datenbankfreier statischer Blog-HTML-Quellcode. Ohne Anmeldung, DSGVO-konform.',
    keywords: 'kostenlose online tools, json formatierer online, bilder komprimieren kostenlos, pdf konverter online, dark mode website vorlage, statischer blog quellcode html, html vorlagen kostenlos',
    ogTitle: '72Tool — Kostenlose Online-Tools, Vorlagen & Open Source',
    ogDesc: 'Kostenlose Browser-Tools, Website-Vorlagen und MIT-lizenzierter Quellcode. Keine Anmeldung, keine Uploads.',
    schemaName: '72Tool — Kostenlose Online-Tools',
    schemaDesc: 'Plattform für kostenlose Online-Tools, Website-Vorlagen und Open-Source-Code.',
    crumbs: ['Online-Tools', 'Website-Vorlagen', 'Open Source']
  },
  {
    key: 'ar', dir: 'ar/', htmlLang: 'ar', hreflang: 'ar', ogLocale: 'ar_AR',
    rtl: true, catPages: false,
    title: 'أدوات أونلاين مجانية وقوالب مواقع وشيفرة مفتوحة المصدر — 72Tool',
    desc: 'أكثر من 353 أداة أونلاين مجانية تعمل بالكامل داخل متصفحك: منسق JSON، ضغط الصور، تحويل PDF، تجميل الشيفرة ومحولات الوسائط. بالإضافة إلى قوالب مواقع متجاوبة بالوضع الداكن وشيفرة مدونة ثابتة بدون قاعدة بيانات. بدون تسجيل.',
    keywords: 'أدوات أونلاين مجانية, منسق json, ضغط الصور أونلاين, تحويل pdf, قالب موقع وضع داكن, شيفرة مدونة ثابتة, قوالب html مجانية',
    ogTitle: '72Tool — أدوات أونلاين مجانية وقوالب وشيفرة مفتوحة',
    ogDesc: 'أدوات مجانية تعمل في المتصفح، قوالب مواقع وشيفرة برخصة MIT. بدون تسجيل أو رفع ملفات.',
    schemaName: '72Tool — أدوات أونلاين مجانية',
    schemaDesc: 'منصة شاملة للأدوات الأونلاين وقوالب المواقع والشيفرة مفتوحة المصدر.',
    crumbs: ['أدوات أونلاين', 'قوالب المواقع', 'مفتوح المصدر']
  }
];

/* ---------------- 分类矩阵（聚合页 / sitemap / 长尾关键词）----------------
 * enKw = 海外用户真实搜索词（低竞争长尾），直接写进聚合页 title / h1 / description
 */
const CATEGORIES = {
  tool: {
    zh: '在线工具', en: 'Online Tools', icon: '🛠️',
    tags: {
      unit:     { zh: '单位换算', en: 'Unit Converters',     enKw: 'free online unit converter — length, weight, temperature, area' },
      text:     { zh: '文本工具', en: 'Text Tools',          enKw: 'free online text tools — word counter, case converter, diff checker' },
      img:      { zh: '图片工具', en: 'Image Tools',         enKw: 'free image compressor client side — resize, convert, crop online' },
      dev:      { zh: '开发工具', en: 'Developer Tools',     enKw: 'free online developer tools — encoder, decoder, formatter, generator' },
      pdf:      { zh: 'PDF 工具', en: 'PDF Tools',           enKw: 'free online pdf converter — merge, split, compress pdf in browser' },
      video:    { zh: '视频工具', en: 'Video Tools',         enKw: 'free online video converter — compress, trim, extract audio' },
      audio:    { zh: '音频工具', en: 'Audio Tools',         enKw: 'free online audio converter — cut, merge, denoise, change bitrate' },
      csv:      { zh: '表格工具', en: 'CSV & Table Tools',   enKw: 'csv to json converter online free — spreadsheet utilities' },
      business: { zh: '商务计算', en: 'Business Calculators', enKw: 'free business calculator online — loan, tax, ROI, margin' },
      url:      { zh: 'URL 工具', en: 'URL Tools',           enKw: 'url encoder decoder online free — parse and build query strings' },
      json:     { zh: 'JSON 工具', en: 'JSON Tools',         enKw: 'online json formatter free — validate, minify, convert json' },
      seo:      { zh: 'SEO 工具', en: 'SEO Tools',           enKw: 'free seo tools online — meta tag generator, robots, sitemap' },
      gif:      { zh: 'GIF 工具', en: 'GIF Tools',           enKw: 'video to gif converter online free — gif maker and optimizer' }
    }
  },
  theme: {
    zh: '网站主题模板', en: 'Website Templates', icon: '🎨',
    tags: {
      blog:     { zh: '博客主题',   en: 'Blog Templates',      enKw: 'free responsive blog html template download — no framework' },
      homepage: { zh: '个人主页',   en: 'Portfolio Templates',  enKw: 'free personal portfolio website template html css' },
      toolpage: { zh: '工具站模板', en: 'Tool Site Templates',  enKw: 'toolbox website template html free download' },
      dark:     { zh: '暗黑风',     en: 'Dark Templates',       enKw: 'dark mode responsive website template free download' },
      light:    { zh: '清新风',     en: 'Light Templates',      enKw: 'clean minimal light website template html free' }
    }
  },
  source: {
    zh: '网站开源源码', en: 'Open Source Code', icon: '💻',
    tags: {
      blogsrc: { zh: '博客源码',     en: 'Blog Source Code',       enKw: 'no database static blog html template source code' },
      navsrc:  { zh: '导航站源码',   en: 'Navigation Site Source',  enKw: 'bookmark navigation website source code html free' },
      toolsrc: { zh: '工具箱源码',   en: 'Toolkit Source Code',     enKw: 'online toolbox website source code free download' },
      newsrc:  { zh: '资讯站源码',   en: 'News Portal Source',      enKw: 'news portal website source code html static' }
    }
  }
};

const STATIC_PAGES = ['about.html', 'privacy.html', 'terms.html', 'contact.html', 'sitemap.html'];

module.exports = { BASE, OG_IMAGE_BASE, LANGS, CATEGORIES, STATIC_PAGES };
