// ===================== 一级 + 二级分类配置 =====================
(function(){
'use strict';

const MAIN_CONFIG = {
    tool: {
        zh:'在线工具', en:'Online Tools', icon:'🛠️',
        tags:[
            {key:'all', zh:'全部', en:'All'},
            {key:'unit', zh:'单位换算', en:'Unit'},
            {key:'text', zh:'文本工具', en:'Text'},
            {key:'img', zh:'图片工具', en:'Image'},
            {key:'dev', zh:'开发工具', en:'Dev'},
            {key:'pdf', zh:'PDF 工具', en:'PDF'},
            {key:'video', zh:'视频工具', en:'Video'},
            {key:'audio', zh:'音频工具', en:'Audio'},
            {key:'csv', zh:'表格工具', en:'CSV'},
            {key:'business', zh:'商务计算', en:'Business'},
            {key:'url', zh:'URL 工具', en:'URL'},
            {key:'json', zh:'JSON 工具', en:'JSON'},
            {key:'seo', zh:'SEO 工具', en:'SEO'},
            {key:'gif', zh:'GIF 工具', en:'GIF'}
        ]
    },
    theme: {
        zh:'网站主题模板', en:'Website Templates', icon:'🎨',
        tags:[
            {key:'all', zh:'全部', en:'All'},
            {key:'blog', zh:'博客主题', en:'Blog'},
            {key:'homepage', zh:'个人主页', en:'Portfolio'},
            {key:'toolpage', zh:'工具站模板', en:'Tool Site'},
            {key:'dark', zh:'暗黑风', en:'Dark'},
            {key:'light', zh:'清新风', en:'Light'}
        ]
    },
    source: {
        zh:'网站开源源码', en:'Open Source', icon:'💻',
        tags:[
            {key:'all', zh:'全部', en:'All'},
            {key:'blogsrc', zh:'博客源码', en:'Blog Src'},
            {key:'navsrc', zh:'导航站源码', en:'Nav Src'},
            {key:'toolsrc', zh:'工具箱源码', en:'Toolkit Src'},
            {key:'newsrc', zh:'资讯站源码', en:'News Src'}
        ]
    },
    blog: {
        zh:'博客页', en:'Blog', icon:'📝',
        tags:[
            {key:'all', zh:'全部', en:'All'},
            {key:'article', zh:'站点文章', en:'Articles'},
            {key:'theme', zh:'博客主题', en:'Blog Themes'},
            {key:'source', zh:'博客源码', en:'Blog Source'},
            {key:'tutorial', zh:'图文教程', en:'Tutorials'}
        ]
    }
};

// 工具 cat -> 中文标签 / 徽章
const TYPE_CN_MAP = {
    dev:'开发工具', text:'文本工具', img:'图片工具', pdf:'PDF工具',
    video:'视频工具', audio:'音频工具', csv:'表格工具',
    business:'商务计算', unit:'单位换算', url:'URL工具',
    json:'JSON工具', seo:'SEO工具', gif:'GIF工具'
};
const BADGE_MAP = {
    dev:'badge-dev', text:'badge-text', img:'badge-img', pdf:'badge-pdf',
    video:'badge-video', audio:'badge-audio', csv:'badge-tool',
    business:'badge-tool', unit:'badge-tool', url:'badge-tool',
    json:'badge-tool', seo:'badge-tool', gif:'badge-tool'
};
// 分类 -> 图标 / 渐变（小磁贴用）
const CAT_EMOJI = {
    unit:'📐', text:'📝', img:'🖼️', dev:'💻', pdf:'📄', video:'🎬',
    audio:'🎵', csv:'📊', business:'💼', url:'🔗', json:'🧩', seo:'🔍', gif:'🎞️'
};
const CAT_GRAD = {
    unit:'linear-gradient(135deg,#22d1ee,#67e8f9)',
    text:'linear-gradient(135deg,#8b5cf6,#a78bfa)',
    img:'linear-gradient(135deg,#f59e0b,#fbbf24)',
    dev:'linear-gradient(135deg,#6366f1,#818cf8)',
    pdf:'linear-gradient(135deg,#ef4444,#f87171)',
    video:'linear-gradient(135deg,#ec4899,#f472b6)',
    audio:'linear-gradient(135deg,#14b8a6,#2dd4bf)',
    csv:'linear-gradient(135deg,#0ea5e9,#38bdf8)',
    business:'linear-gradient(135deg,#f59e0b,#fbbf24)',
    url:'linear-gradient(135deg,#10b981,#34d399)',
    json:'linear-gradient(135deg,#8b5cf6,#c4b5fd)',
    seo:'linear-gradient(135deg,#f43f5e,#fb7185)',
    gif:'linear-gradient(135deg,#ec4899,#f9a8d4)'
};
const DEFAULT_GRAD = 'linear-gradient(135deg,var(--nebula-cyan),var(--nebula-purple))';

/* ============================================================
   网站主题模板 / 开源源码 —— 示例数据（待替换为真实数据）
   字段：idx, subCate[], zh, en, desc_zh, desc_en, previewUrl, downloadUrl
   ============================================================ */
const THEME_DATA = [
    {idx:0, subCate:['blog'], zh:'Hugo PaperMod 博客主题', en:'Hugo PaperMod Theme',
     desc_zh:'极快、简洁、响应式的 Hugo 博客主题，内置明暗模式、客户端搜索与多语言支持。',
     desc_en:'Fast, clean, responsive Hugo blog theme with dark mode, search and i18n.',
     previewUrl:'https://adityatelange.github.io/hugo-PaperMod/', downloadUrl:'https://github.com/adityatelange/hugo-PaperMod', repo:'adityatelange/hugo-PaperMod'},
    {idx:1, subCate:['blog'], zh:'Hexo NexT 博客主题', en:'Hexo NexT Theme',
     desc_zh:'历史最悠久、生态最丰富的 Hexo 博客主题，文档完善，插件众多。',
     desc_en:'The most established Hexo blog theme with the richest ecosystem and docs.',
     previewUrl:'https://theme-next.js.org/', downloadUrl:'https://github.com/next-theme/hexo-theme-next', repo:'next-theme/hexo-theme-next'},
    {idx:2, subCate:['blog'], zh:'Hugo Stack 博客主题', en:'Hugo Stack Theme',
     desc_zh:'卡片式设计的 Hugo 博客主题，响应式布局，开箱即用的文章与标签系统。',
     desc_en:'Card-style Hugo blog theme, responsive, ready-to-use posts and tags.',
     previewUrl:'https://stack.jimmycai.com/', downloadUrl:'https://github.com/CaiJimmy/hugo-theme-stack', repo:'CaiJimmy/hugo-theme-stack'},
    {idx:3, subCate:['blog'], zh:'Tailwind Next.js 博客', en:'Tailwind Next.js Blog',
     desc_zh:'Next.js + Tailwind CSS 的极速博客模板，支持暗黑模式、SEO 与 MDX 写作。',
     desc_en:'Next.js + Tailwind blog starter with dark mode, SEO and MDX.',
     previewUrl:'https://tailwind-nextjs-starter-blog.vercel.app/', downloadUrl:'https://github.com/timlrx/tailwind-nextjs-starter-blog', repo:'timlrx/tailwind-nextjs-starter-blog'},
    {idx:4, subCate:['homepage'], zh:'Hugo Profile 个人主页', en:'Hugo Profile Homepage',
     desc_zh:'开箱即用的个人主页 / 简历主题，含关于、作品集与联系方式模块。',
     desc_en:'Ready-to-use personal homepage / resume theme with about, portfolio & contact.',
     previewUrl:'https://hugo-profile.vercel.app/', downloadUrl:'https://github.com/gurusabarish/hugo-profile', repo:'gurusabarish/hugo-profile'},
    {idx:5, subCate:['homepage'], zh:'Hugo Creative 作品集', en:'Hugo Creative Portfolio',
     desc_zh:'为设计师与创意工作者打造的作品集主题，动画流畅，视觉优先。',
     desc_en:'Portfolio theme for designers, smooth animations, visually focused.',
     previewUrl:'https://hugo-creative-portfolio.netlify.app/', downloadUrl:'https://github.com/kishaningithub/hugo-creative-portfolio-theme', repo:'kishaningithub/hugo-creative-portfolio-theme'},
    {idx:6, subCate:['homepage'], zh:'Hugo Blox 主页生成器', en:'Hugo Blox Builder',
     desc_zh:'由 Wowchemy 演进而来的个人主页 / 学术站点生成器，模块丰富，拖拽建站。',
     desc_en:'Personal / academic site builder evolved from Wowchemy, modular and drag-and-drop.',
     previewUrl:'https://hugoblox.com/', downloadUrl:'https://github.com/HugoBlox/hugo-blox-builder', repo:'HugoBlox/hugo-blox-builder'},
    {idx:7, subCate:['toolpage'], zh:'it-tools 在线工具箱', en:'it-tools Web Toolkit',
     desc_zh:'基于 Vue 的自托管在线工具集合，50+ 实用小工具，界面美观，可一键部署。',
     desc_en:'Vue-based self-hosted toolkit with 50+ utilities, beautiful UI, one-click deploy.',
     previewUrl:'https://it-tools.tech/', downloadUrl:'https://github.com/CorentinTh/it-tools', repo:'CorentinTh/it-tools'},
    {idx:8, subCate:['toolpage'], zh:'Dashy 自托管仪表盘', en:'Dashy Dashboard',
     desc_zh:'高度可定制的个人信息仪表盘，书签、小部件、搜索与暗黑模式一应俱全。',
     desc_en:'Highly customizable personal dashboard: bookmarks, widgets, search & dark mode.',
     previewUrl:'https://dashy.to/', downloadUrl:'https://github.com/Lissy93/dashy', repo:'Lissy93/dashy'},
    {idx:9, subCate:['toolpage'], zh:'Homarr 自托管首页', en:'Homarr Startpage',
     desc_zh:'美观的自托管起始页 / 仪表盘，聚合应用、集成 Docker 与智能家居。',
     desc_en:'Beautiful self-hosted startpage / dashboard aggregating apps, Docker & smart home.',
     previewUrl:'https://homarr.app/', downloadUrl:'https://github.com/homarr-labs/homarr', repo:'homarr-labs/homarr'},
    {idx:10, subCate:['dark'], zh:'Hugo Book 文档主题', en:'Hugo Book Theme',
     desc_zh:'极简暗色文档主题，左侧目录、右侧内容，适合技术文档与知识库。',
     desc_en:'Minimal dark docs theme, TOC sidebar + content, great for docs & wiki.',
     previewUrl:'https://hugo-book.netlify.app/', downloadUrl:'https://github.com/thegeeklab/hugo-book', repo:'thegeeklab/hugo-book'},
    {idx:11, subCate:['dark'], zh:'Hugo Terminal 极简主题', en:'Hugo Terminal Theme',
     desc_zh:'复古极简的暗色博客主题，零依赖、加载极快，专注文字内容。',
     desc_en:'Retro minimal dark blog theme, zero-dependency, ultra fast, text-focused.',
     previewUrl:'https://panr.github.io/hugo-theme-terminal-demo/', downloadUrl:'https://github.com/panr/hugo-theme-terminal', repo:'panr/hugo-theme-terminal'},
    {idx:12, subCate:['dark'], zh:'Docusaurus 文档站', en:'Docusaurus Docs',
     desc_zh:'Meta 开源的文档 / 博客站框架，暗黑模式、版本化文档与全文搜索。',
     desc_en:'Meta’s open docs / blog framework with dark mode, versioned docs & search.',
     previewUrl:'https://docusaurus.io/', downloadUrl:'https://github.com/facebook/docusaurus', repo:'facebook/docusaurus'},
    {idx:13, subCate:['light'], zh:'Hugo Bear Blog 主题', en:'Hugo Bear Blog Theme',
     desc_zh:'极简、护眼的浅色博客主题，无多余装饰，强调可读性与轻量化。',
     desc_en:'Minimal, eye-friendly light blog theme, no clutter, readability first.',
     previewUrl:'https://hugo-bearblog.netlify.app/', downloadUrl:'https://github.com/janraasch/hugo-bearblog', repo:'janraasch/hugo-bearblog'},
    {idx:14, subCate:['light'], zh:'Hugo Ananke 主题', en:'Hugo Ananke Theme',
     desc_zh:'经典明亮的 Hugo 入门主题，导航、封面与文章列表俱全，社区活跃。',
     desc_en:'Classic bright Hugo starter theme with nav, hero and posts, active community.',
     previewUrl:'https://ananke-theme.netlify.app/', downloadUrl:'https://github.com/theNewDynamic/gohugo-theme-ananke', repo:'theNewDynamic/gohugo-theme-ananke'},
    {idx:15, subCate:['light'], zh:'Hugo Docsy 文档主题', en:'Hugo Docsy Theme',
     desc_zh:'Google 开源的技术文档主题，多版本文档、搜索与国际化，适合大型项目。',
     desc_en:'Google’s open docs theme with multi-version, search & i18n for big projects.',
     previewUrl:'https://www.docsy.dev/', downloadUrl:'https://github.com/google/docsy', repo:'google/docsy'},
    {idx:16, subCate:["blog"], zh:'kit', en:'kit', desc_zh:'🧱 Describe your site, AI builds it, you own it as Markdown. Snap together Tailwind blocks like Lego — landing pages, blogs, portfolios, docs & more. No AI slop. Free to deploy anywhere 👇', desc_en:'🧱 Describe your site, AI builds it, you own it as Markdown. Snap together Tailwind blocks like Lego — landing pages, blogs, portfolios, docs & more. No AI slop. Free to deploy anywhere 👇', previewUrl:'https://hugoblox.com', downloadUrl:'https://github.com/HugoBlox/kit', repo:'HugoBlox/kit'},
    {idx:17, subCate:["blog"], zh:'hugo-theme-academic-cv', en:'hugo-theme-academic-cv', desc_zh:'🎓 Academic portfolio that boosts citations. AI generates pages, you own as Markdown. BibTeX auto-import, Jupyter, LaTeX, slides, visual block editor — free to host forever. 学术主页，AI 生成，Markdown 拥有 👇', desc_en:'🎓 Academic portfolio that boosts citations. AI generates pages, you own as Markdown. BibTeX auto-import, Jupyter, LaTeX, slides, visual block editor — free to host forever. 学术主页，AI 生成，Markdown 拥有 👇', previewUrl:'https://hugoblox.com/templates/academic-cv', downloadUrl:'https://github.com/HugoBlox/hugo-theme-academic-cv', repo:'HugoBlox/hugo-theme-academic-cv'},
    {idx:18, subCate:["blog"], zh:'hugo-book', en:'hugo-book', desc_zh:'Hugo documentation theme as simple as plain book', desc_en:'Hugo documentation theme as simple as plain book', previewUrl:'https://book.alxs.dev', downloadUrl:'https://github.com/alex-shpak/hugo-book', repo:'alex-shpak/hugo-book'},
    {idx:19, subCate:["blog"], zh:'LoveIt', en:'LoveIt', desc_zh:'❤️A clean, elegant but advanced blog theme for Hugo 一个简洁、优雅且高效的 Hugo 主题', desc_en:'❤️A clean, elegant but advanced blog theme for Hugo 一个简洁、优雅且高效的 Hugo 主题', previewUrl:'https://hugoloveit.com', downloadUrl:'https://github.com/dillonzq/LoveIt', repo:'dillonzq/LoveIt'}
];

const SOURCE_DATA = [
    {idx:0, subCate:['blogsrc'], zh:'Hugo 静态站点生成器', en:'Hugo Static Site Generator',
     desc_zh:'用 Go 编写的极速静态站点生成器，Markdown 写作、主题生态丰富、零运行时依赖。',
     desc_en:'Blazing-fast Go SSG, Markdown-first, rich themes, zero runtime deps.',
     previewUrl:'#', downloadUrl:'https://github.com/gohugoio/hugo', repo:'gohugoio/hugo'},
    {idx:1, subCate:['blogsrc'], zh:'Hexo 博客框架', en:'Hexo Blog Framework',
     desc_zh:'基于 Node.js 的静态博客框架，插件与主题生态成熟，支持 Markdown 与一键部署。',
     desc_en:'Node.js static blog framework, mature plugins & themes, Markdown & one-click deploy.',
     previewUrl:'#', downloadUrl:'https://github.com/hexojs/hexo', repo:'hexojs/hexo'},
    {idx:2, subCate:['blogsrc'], zh:'Astro 内容站框架', en:'Astro Content Framework',
     desc_zh:'群岛架构的内容站框架，组件化写作，默认零 JS，按需注水，极致性能。',
     desc_en:'Islands-architecture content framework, component-driven, zero-JS by default.',
     previewUrl:'#', downloadUrl:'https://github.com/withastro/astro', repo:'withastro/astro'},
    {idx:3, subCate:['blogsrc'], zh:'VitePress 文档 / 内容站', en:'VitePress Docs & Content',
     desc_zh:'基于 Vite 与 Vue 的极速静态站点生成器，适合文档、博客与技术站点。',
     desc_en:'Vite + Vue powered fast SSG, ideal for docs, blogs and tech sites.',
     previewUrl:'#', downloadUrl:'https://github.com/vitepress/vitepress', repo:'vitepress/vitepress'},
    {idx:4, subCate:['navsrc'], zh:'WebStackPage 导航站', en:'WebStackPage Nav Site',
     desc_zh:'经典的静态响应式网址导航站，分组书签、免后端，下载即可部署上线。',
     desc_en:'Classic static responsive nav site, grouped bookmarks, backend-free, deploy ready.',
     previewUrl:'#', downloadUrl:'https://github.com/WebStackPage/WebStackPage.github.io', repo:'WebStackPage/WebStackPage.github.io'},
    {idx:5, subCate:['navsrc'], zh:'BYR-Navi 高校导航', en:'BYR-Navi Campus Nav',
     desc_zh:'清新优雅的高校导航站源码，分组清晰，适合社团与个人站点。',
     desc_en:'Clean elegant campus nav source, clear grouping, for clubs and personal sites.',
     previewUrl:'#', downloadUrl:'https://github.com/BYR-Navi/BYR-Navi', repo:'BYR-Navi/BYR-Navi'},
    {idx:6, subCate:['navsrc'], zh:'Homer 自托管起始页', en:'Homer Startpage',
     desc_zh:'极简的 PHP 自托管起始页 / 导航，YAML 配置书签，图标美观，轻量易部署。',
     desc_en:'Minimal PHP self-hosted startpage, YAML bookmarks, pretty icons, lightweight.',
     previewUrl:'#', downloadUrl:'https://github.com/bastienwirtz/homer', repo:'bastienwirtz/homer'},
    {idx:7, subCate:['toolsrc'], zh:'it-tools 在线工具箱', en:'it-tools Web Toolkit',
     desc_zh:'基于 Vue 3 的自托管在线工具集合，50+ 加密、转换、开发小工具，PWA 可离线。',
     desc_en:'Vue 3 self-hosted toolkit with 50+ crypto/convert/dev utilities, PWA offline.',
     previewUrl:'#', downloadUrl:'https://github.com/CorentinTh/it-tools', repo:'CorentinTh/it-tools'},
    {idx:8, subCate:['toolsrc'], zh:'Vue Element Admin 后台', en:'Vue Element Admin',
     desc_zh:'基于 Vue 与 Element UI 的后台管理前端解决方案，含丰富组件与权限示例。',
     desc_en:'Vue + Element UI admin frontend solution with rich components & auth demos.',
     previewUrl:'#', downloadUrl:'https://github.com/PanJiaChen/vue-element-admin', repo:'PanJiaChen/vue-element-admin'},
    {idx:9, subCate:['toolsrc'], zh:'Homarr 自托管仪表盘', en:'Homarr Dashboard',
     desc_zh:'美观的自托管起始页 / 仪表盘，聚合应用、Docker 集成与智能家居控制。',
     desc_en:'Beautiful self-hosted startpage / dashboard aggregating apps, Docker & smart home.',
     previewUrl:'#', downloadUrl:'https://github.com/homarr-labs/homarr', repo:'homarr-labs/homarr'},
    {idx:10, subCate:['newsrc'], zh:'NewsNow 实时资讯', en:'NewsNow Live News',
     desc_zh:'优雅的实时资讯聚合站，多源订阅、自动刷新，自托管部署简单。',
     desc_en:'Elegant real-time news aggregator, multi-source, auto-refresh, easy self-host.',
     previewUrl:'#', downloadUrl:'https://github.com/ourongxing/newsnow', repo:'ourongxing/newsnow'},
    {idx:11, subCate:['newsrc'], zh:'RSSHub 万物 RSS', en:'RSSHub RSS Generator',
     desc_zh:'开源的 RSS 聚合生成器，把任意站点 / 平台变为 RSS，规则生态庞大。',
     desc_en:'Open RSS generator turning any site/platform into RSS, huge rule ecosystem.',
     previewUrl:'#', downloadUrl:'https://github.com/diygod/rsshub', repo:'diygod/rsshub'},
    {idx:12, subCate:['newsrc'], zh:'Miniflux RSS 阅读器', en:'Miniflux RSS Reader',
     desc_zh:'极简自托管的 RSS 阅读器，专注阅读体验，支持全文抓取与多端同步。',
     desc_en:'Minimal self-hosted RSS reader, reading-first, full-content fetch & sync.',
     previewUrl:'#', downloadUrl:'https://github.com/miniflux/v2', repo:'miniflux/v2'},
    {idx:13, subCate:['newsrc'], zh:'FreshRSS 资讯聚合器', en:'FreshRSS News Aggregator',
     desc_zh:'免费自托管的 RSS 聚合器，支持多用户、筛选规则与第三方客户端。',
     desc_en:'Free self-hosted RSS aggregator with multi-user, filters & 3rd-party clients.',
     previewUrl:'#', downloadUrl:'https://github.com/FreshRSS/FreshRSS', repo:'FreshRSS/FreshRSS'},
    {idx:14, subCate:["blogsrc"], zh:'public-apis', en:'public-apis', desc_zh:'A collective list of free APIs', desc_en:'A collective list of free APIs', previewUrl:'#', downloadUrl:'https://github.com/public-apis/public-apis', repo:'public-apis/public-apis'},
    {idx:15, subCate:["blogsrc"], zh:'prompts.chat', en:'prompts.chat', desc_zh:'f.k.a. Awesome ChatGPT Prompts. Share, discover, and collect prompts from the community. Free and open source — self-host for your organization with complete privacy.', desc_en:'f.k.a. Awesome ChatGPT Prompts. Share, discover, and collect prompts from the community. Free and open source — self-host for your organization with complete privacy.', previewUrl:'#', downloadUrl:'https://github.com/f/prompts.chat', repo:'f/prompts.chat'},
    {idx:16, subCate:["blogsrc"], zh:'langchain', en:'langchain', desc_zh:'The agent engineering platform.', desc_en:'The agent engineering platform.', previewUrl:'#', downloadUrl:'https://github.com/langchain-ai/langchain', repo:'langchain-ai/langchain'},
    {idx:17, subCate:["blogsrc"], zh:'system-prompts-and-models-of-ai-tools', en:'system-prompts-and-models-of-ai-tools', desc_zh:'FULL Augment Code, Claude Code, Cluely, CodeBuddy, Comet, Cursor, Devin AI, Junie, Kiro, Leap.new, Lovable, Manus, NotionAI, Orchids.app, Perplexity, Poke, Qoder, Replit, Same.dev, Trae, Traycer AI, VSCode Agent, Warp.dev, Windsurf, Xcode, Z.ai Code, Dia & v0. (And other Open Sourced) System Prompts, Internal Tools & AI Models', desc_en:'FULL Augment Code, Claude Code, Cluely, CodeBuddy, Comet, Cursor, Devin AI, Junie, Kiro, Leap.new, Lovable, Manus, NotionAI, Orchids.app, Perplexity, Poke, Qoder, Replit, Same.dev, Trae, Traycer AI, VSCode Agent, Warp.dev, Windsurf, Xcode, Z.ai Code, Dia & v0. (And other Open Sourced) System Prompts, Internal Tools & AI Models', previewUrl:'#', downloadUrl:'https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools', repo:'x1xhlol/system-prompts-and-models-of-ai-tools'}
];

// 全局状态（标签切换：同一时间只显示一个主分类）
let activeMain = 'tool';
let activeSub = 'all';
let _blogPage = 1;
const _BLOG_PAGE_SIZE = 20;
const MAIN_KEYS = ['tool','theme','source','blog'];
const htmlDom = document.documentElement;

// ===================== 安全本地存储（隐私/无痕模式不报错）=====================
const safeStorage = {
    get:function(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } },
    set:function(k,v){ try{ localStorage.setItem(k,String(v)); }catch(e){} },
    getJSON:function(k){ try{ return JSON.parse(localStorage.getItem(k)); }catch(e){ return null; } },
    setJSON:function(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
};

// ===================== 数字 / 计数格式化（全球扩展预留）=====================
function formatNumber(n, lang){
    lang = lang || (LANG === 'en' ? 'en-US' : 'zh-CN');
    try{ return new Intl.NumberFormat(lang).format(n); }catch(e){ return String(n); }
}
function formatCount(n, lang){
    if(n >= 1000){
        try{ return new Intl.NumberFormat(lang==='en'?'en-US':'zh-CN',{notation:'compact'}).format(n); }catch(e){}
    }
    return formatNumber(n, lang==='en'?'en-US':'zh-CN');
}

// ===================== 全局错误兜底（避免单点报错中断整页）=====================
window.addEventListener('error', function(e){
    if(window.console && console.warn) console.warn('[72Tool] runtime error captured:', e.message);
});

// 当前站点语种（由页面 data-site-lang 决定，每个语种是独立静态页）
const SITE_LANG = (document.documentElement.getAttribute('data-site-lang') || 'zh').toLowerCase();
const RTL_LANGS = ['ar','fa','he','ur'];
const IS_RTL = RTL_LANGS.indexOf(SITE_LANG) > -1;

// 当前语言：只有中文站用 zh 数据，其余语种统一走英文数据（数据层暂无多语种字段）
function curLang(){
    return SITE_LANG === 'zh' ? 'zh' : 'en';
}
let LANG = curLang();

// BCP-47 语言标签（用于 Intl 日期/数字本地化）
const LOCALE_MAP = { zh:'zh-CN', en:'en-US' };
const LOCALE = LOCALE_MAP[SITE_LANG] || 'en-US';

// ===================== 时间 / 日期国际化（访客本地时区，不显示 UTC+8）=====================
// 英文/欧美习惯输出 "Month Day, Year"；中文站输出 "YYYY年MM月DD日"
function formatDateLocal(d, withTime){
    try{
        var date = (d instanceof Date) ? d : new Date(d);
        if(isNaN(date.getTime())) return '';
        var opt = { year:'numeric', month:'long', day:'numeric', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
        if(withTime){ opt.hour='2-digit'; opt.minute='2-digit'; }
        return new Intl.DateTimeFormat(LOCALE, opt).format(date);
    }catch(e){ return String(d); }
}
/* 站内资源路径：根相对 + 语种镜像感知
   /en/ /jp/ /es/ 是完整站点镜像（各含全量工具页），首页必须链到同语种镜像，
   否则英文用户会被扔到中文工具页。de/ar 暂无镜像，回退英文镜像而非中文。*/
const MIRROR_LANGS = ['en'];          // 已有完整镜像目录的语种
const LANG_PREFIX = (function(){
    if(SITE_LANG === 'en') return '/';
    if(SITE_LANG === 'zh') return '/zh/';
    return '/';                                // de / ar 等回退到英文根
})();
function toolUrl(slug){
    if(!slug) return LANG_PREFIX;
    if(/^https?:\/\//i.test(slug) || slug.charAt(0) === '/') return slug;
    return LANG_PREFIX + slug;
}

// ===================== 导航状态持久化（刷新不丢失分类）=====================
function saveNavState(){
    safeStorage.setJSON('navState', { main:activeMain, sub:activeSub });
}
(function restoreNavState(){
    var s = safeStorage.getJSON('navState');
    if(s && s.main && MAIN_CONFIG[s.main]){
        activeMain = s.main;
        activeSub = (typeof s.sub === 'string') ? s.sub : 'all';
    }
})();

// ===================== 渲染一级导航（标签切换分类）=====================
function renderMainNav(){
    var nav = document.getElementById('mainNav');
    var html = '';
    MAIN_KEYS.forEach(function(k){
        var cfg = MAIN_CONFIG[k];
        var label = LANG === 'zh' ? cfg.zh : cfg.en;
        html += '<a class="nav-item'+(activeMain===k?' active':'')+'" data-main="'+k+'" role="tab" aria-selected="'+(activeMain===k?'true':'false')+'">'+label+'</a>';
    });
    nav.innerHTML = html;
    nav.querySelectorAll('.nav-item').forEach(function(el){
        el.addEventListener('click', function(){
            nav.querySelectorAll('.nav-item').forEach(function(n){ n.classList.remove('active'); });
            this.classList.add('active');
            activeMain = this.dataset.main;
            activeSub = 'all';
            saveNavState();
            renderSubTags();
            renderAll();
        });
    });
}

// ===================== 渲染二级分类标签 =====================
function renderSubTags(){
    var bar = document.getElementById('subTagBar');
    if(!bar) return;
    var cfg = MAIN_CONFIG[activeMain];
    var html = '';
    cfg.tags.forEach(function(t){
        var label = LANG === 'zh' ? t.zh : t.en;
        html += '<div class="sub-tag-item'+(activeSub===t.key?' active':'')+'" data-sub="'+t.key+'">'+label+'</div>';
    });
    bar.innerHTML = html;
    bar.querySelectorAll('.sub-tag-item').forEach(function(el){
        el.addEventListener('click', function(){
            activeSub = this.dataset.sub;
            _blogPage = 1;
            saveNavState();
            renderSubTags();
            renderAll();
        });
    });
}

// ===================== 取当前栏目数据 =====================
function getActiveList(){
    if(activeMain === 'tool'){
        var D = window.TOOLS_DATA || [];
        return activeSub === 'all' ? D.slice() : D.filter(function(t){ return t.cat === activeSub; });
    }
    if(activeMain === 'blog'){
        if(activeSub === 'all'){
            var feed = [];
            getBlogArticles().slice(0,12).forEach(function(a){ feed.push(a); });
            THEME_DATA.filter(function(t){ return t.subCate.indexOf('blog') > -1; }).forEach(function(t){ feed.push(Object.assign({_k:'theme'}, t)); });
            SOURCE_DATA.filter(function(t){ return t.subCate.indexOf('blogsrc') > -1; }).forEach(function(t){ feed.push(Object.assign({_k:'source'}, t)); });
            return feed;
        }
        if(activeSub === 'article'){
            var allArts = getBlogArticles();
            var totalPages = Math.max(1, Math.ceil(allArts.length / _BLOG_PAGE_SIZE));
            if(_blogPage < 1) _blogPage = 1;
            if(_blogPage > totalPages) _blogPage = totalPages;
            return allArts.slice((_blogPage - 1) * _BLOG_PAGE_SIZE, _blogPage * _BLOG_PAGE_SIZE);
        }
        if(activeSub === 'theme') return THEME_DATA.filter(function(t){ return t.subCate.indexOf('blog') > -1; }).map(function(t){ return Object.assign({_k:'theme'}, t); });
        if(activeSub === 'source' || activeSub === 'tutorial') return SOURCE_DATA.filter(function(t){ return t.subCate.indexOf('blogsrc') > -1; }).map(function(t){ return Object.assign({_k: activeSub}, t); });
    }

    if(activeMain === 'theme'){
        return activeSub === 'all' ? THEME_DATA.slice() : THEME_DATA.filter(function(t){ return t.subCate.indexOf(activeSub) > -1; });
    }
    return activeSub === 'all' ? SOURCE_DATA.slice() : SOURCE_DATA.filter(function(t){ return t.subCate.indexOf(activeSub) > -1; });
}

// ===================== 博客文章分页导航 =====================
(function(){
    var _pgCssInjected = false;
    function _injectPgCss(){
        if(_pgCssInjected) return;
        _pgCssInjected = true;
        var s = document.createElement('style');
        s.textContent = [
            '.blog-pagination{display:flex;align-items:center;justify-content:center;gap:5px;padding:28px 0 16px;flex-wrap:nowrap}',
            '.pg-btn,.pg-num{display:inline-flex;align-items:center;justify-content:center;min-width:32px;height:34px;border:1px solid #d0d5dd;border-radius:8px;background:#fff;color:#374151;font-size:13px;font-weight:500;cursor:pointer;padding:0 8px;transition:all .15s;flex-shrink:0}',
            '.pg-btn:hover,.pg-num:hover{border-color:#6366f1;color:#6366f1;background:#f5f3ff}',
            '.pg-num.active{border-color:#6366f1;background:#6366f1;color:#fff;cursor:default}',
            '.pg-btn:disabled{opacity:.4;cursor:not-allowed;background:#f9fafb;border-color:#e5e7eb;color:#9ca3af}',
            '.pg-info{margin-left:10px;font-size:12px;color:#8b949e;white-space:nowrap;flex-shrink:0}'
        ].join('\n');
        document.head.appendChild(s);
    }
    window._injectPgCss = _injectPgCss;
})();
function renderBlogPagination(container, totalItems){
    window._injectPgCss();
    var totalPages = Math.max(1, Math.ceil(totalItems / _BLOG_PAGE_SIZE));
    if(totalPages <= 1) return;
    var existing = container.querySelector('.blog-pagination');
    if(existing) existing.remove();
    var nav = document.createElement('div');
    nav.className = 'blog-pagination';
    var zh = isZh();
    var prevLbl = zh ? '上一页' : 'Prev';
    var nextLbl = zh ? '下一页' : 'Next';
    var pageLbl = zh ? '第 {p} / {t} 页' : 'Page {p} of {t}';
    var html = '<button class="pg-btn"'+(_blogPage<=1?' disabled':'')+' data-pg="'+(_blogPage-1)+'">'+prevLbl+'</button>';
    // 页码：最多显示 5 个，当前页居中
    var start = Math.max(1, _blogPage - 2);
    var end = Math.min(totalPages, start + 4);
    if(end - start < 4){ start = Math.max(1, end - 4); }
    for(var i=start; i<=end; i++){
        html += '<button class="pg-num'+(i===_blogPage?' active':'')+'" data-pg="'+i+'">'+i+'</button>';
    }
    html += '<button class="pg-btn"'+(_blogPage>=totalPages?' disabled':'')+' data-pg="'+(_blogPage+1)+'">'+nextLbl+'</button>';
    html += '<span class="pg-info">'+pageLbl.replace('{p}',_blogPage).replace('{t}',totalPages)+'</span>';
    nav.innerHTML = html;
    nav.querySelectorAll('button').forEach(function(btn){
        btn.addEventListener('click', function(){
            var p = Number(this.dataset.pg);
            if(!p || p<1 || p>totalPages || p===_blogPage) return;
            _blogPage = p;
            renderAll();
            // 滚动到容器顶部
            var c = document.getElementById('resourceContainer');
            if(c) c.scrollIntoView({behavior:'smooth', block:'start'});
        });
    });
    container.appendChild(nav);
}

// ===================== 渲染当前栏目全部卡片（无分页）=====================
function renderAll(){
    var cfg = MAIN_CONFIG[activeMain];
    document.getElementById('sectionIcon').textContent = cfg.icon;
    document.getElementById('currentCateName').textContent = LANG === 'zh' ? cfg.zh : cfg.en;
    var grid = document.getElementById('resourceContainer');
    grid.innerHTML = '';
    grid.classList.remove('has-sidebar'); // 重置容器样式
    // 在线工具 + 全部：左侧栏 + 右侧卡片
    if(activeMain === 'tool' && activeSub === 'all'){
        renderToolSidebar(grid);
        renderRelated(); injectToolJsonLd();
        return;
    }
    var list = getActiveList();
    renderList(grid, list, activeMain, function(){
        // 博客站点文章：分页导航（等卡片全部渲染完再追加到底部）
        if(activeMain === 'blog' && activeSub === 'article'){
            renderBlogPagination(grid, getBlogArticles().length);
        }
    });
    renderRelated(); injectToolJsonLd();
}

// ===================== 在线工具「全部」：左侧分类导航 + 右侧卡片网格 =====================
function renderToolSidebar(container){
    var D = window.TOOLS_DATA || [];
    var tags = MAIN_CONFIG.tool.tags;
    var groups = [];
    tags.forEach(function(t){
        if(t.key === 'all') return;
        var items = D.filter(function(x){ return x.cat === t.key; });
        if(!items.length) return;
        groups.push({ key:t.key, label:isZh()?t.zh:t.en, items:items });
    });
    // 未归类
    var others = D.filter(function(x){ return !x.cat; });
    if(others.length) groups.push({ key:'other', label:lbl('others'), items:others });

    // 容器重置为普通流（避免 resource-grid 的 display:grid 冲突）
    container.classList.add('has-sidebar');

    // 布局容器
    var layout = document.createElement('div');
    layout.className = 'cate-layout';

    // 左侧分类导航（首项：全部工具）
    var sidebar = document.createElement('div');
    sidebar.className = 'cate-sidebar';

    // 全部工具
    var allItem = document.createElement('div');
    allItem.className = 'cate-sidebar-item active';
    allItem.innerHTML = '<span>'+lbl('allTools')+'</span><span class="count">('+formatCount(D.length)+')</span>';
    allItem.dataset.gkey = '__all__';
    allItem.addEventListener('click', function(){
        sidebar.querySelectorAll('.cate-sidebar-item').forEach(function(s){ s.classList.remove('active'); });
        this.classList.add('active');
        renderRightCards('__all__', groups, D);
    });
    sidebar.appendChild(allItem);

    groups.forEach(function(g, i){
        var item = document.createElement('div');
        item.className = 'cate-sidebar-item';
        item.innerHTML = '<span>'+g.label+'</span><span class="count">('+formatCount(g.items.length)+')</span>';
        item.dataset.gkey = g.key;
        item.addEventListener('click', function(){
            sidebar.querySelectorAll('.cate-sidebar-item').forEach(function(s){ s.classList.remove('active'); });
            this.classList.add('active');
            renderRightCards(g.key, groups, D);
        });
        sidebar.appendChild(item);
    });
    layout.appendChild(sidebar);

    // 右侧卡片区域（默认显示全部，分批渲染）
    var rightArea = document.createElement('div');
    rightArea.className = 'card-grid';
    rightArea.id = 'rightCardGrid';
    renderList(rightArea, D, 'tool');
    layout.appendChild(rightArea);

    container.appendChild(layout);
}

// 右侧卡片根据选中分类切换（分批渲染）
function renderRightCards(gkey, groups, D){
    var rightArea = document.getElementById('rightCardGrid');
    if(!rightArea) return;
    var list = (gkey === '__all__') ? D : (groups.filter(function(x){ return x.key === gkey; })[0] || {}).items || [];
    renderList(rightArea, list, 'tool');
}

// ===================== 卡片（缩略图 + 标题 + 描述 + 计数 + 授权）=====================
// 缩略图：若 item.thumb 存在则懒加载图片，否则显示图标占位（后续可直接填 URL）
function hashStr(s){ var h=0; s=String(s||'x'); for(var i=0;i<s.length;i++){ h=(h*31+s.charCodeAt(i))>>>0; } return h; }
function mockStats(key){ var h=hashStr(key); return { views: 1200+(h%8800), downloads: 300+(h%4200) }; }

/* ---------- 开源许可证（海外开发者极度看重版权，必须显式标注）---------- */
const LICENSE_META = {
    mit:    { code:'MIT',        zh:'MIT 许可',   en:'MIT License',    url:'https://opensource.org/licenses/MIT',    cls:'license-mit' },
    apache: { code:'Apache-2.0', zh:'Apache 2.0', en:'Apache-2.0',     url:'https://www.apache.org/licenses/LICENSE-2.0', cls:'license-apache' },
    free:   { code:'Free',       zh:'免费使用',   en:'Free to use',    url:'/terms',                            cls:'license-free' },
    com:    { code:'Commercial', zh:'可商用',     en:'Commercial OK',  url:'/terms',                            cls:'license-com' }
};
// 在线工具 = 免费直接使用；模板/源码 = MIT / Apache（按 idx 稳定分配，接入真实数据后改读 item.license）
function licenseOf(item, kind){
    if(item && item.license) return item.license;
    if(kind === 'tool') return 'free';
    return (hashStr(kind + ':' + (item && item.idx)) % 3 === 0) ? 'apache' : 'mit';
}
function licenseBadgeHtml(item, kind){
    var m = LICENSE_META[licenseOf(item, kind)] || LICENSE_META.free;
    var label = isZh() ? m.zh : m.en;
    return '<span class="license-badge '+m.cls+'" title="'+m.en+'">'+label+'</span>';
}
function styleOf(item, kind){
    if(kind==='theme' && item.subCate && item.subCate.indexOf('dark')>-1) return 'dark';
    if(kind==='theme' && item.subCate && item.subCate.indexOf('light')>-1) return 'light';
    return 'static';
}
function archOf(item, kind){ return 'static'; } // 当前资源均为静态；后端类资源可标记 'backend'

// 统一语言判断：优先 LANG 运行时变量，兜底 SITE_LANG（防止切换后 LANG 未及时更新）
function isZh(){ return (LANG === 'zh') || (!LANG && SITE_LANG === 'zh'); }

/* ============================================================
   博客页：站点文章（示例内容，可替换为真实文章）+ 图文教程合集
   ============================================================ */
const BLOG_ARTICLES = [
  {idx:0, date:'2026-07-28', tag:'教程',
   title_zh:'用 Hugo + PaperMod 在 30 分钟内搭好个人博客', title_en:'Build a personal blog with Hugo + PaperMod in 30 min',
   excerpt_zh:'从安装到部署,一份面向新手的完整上手指南。', excerpt_en:'From install to deploy — a complete beginner-friendly guide.',
   body_zh:'<p>Hugo 是用 Go 编写的极速静态站点生成器,配合 PaperMod 主题,你可以在半小时内拥有一个干净、响应式的个人博客。</p><h2>为什么选 Hugo</h2><p>毫秒级构建、零运行时依赖、Markdown 写作,这让 Hugo 成为个人博客的热门选择。</p><h2>三步上手</h2><p>安装 Hugo、套用 PaperMod 主题、写入第一篇文章,最后一条命令部署到任意静态托管。</p>'},
  {idx:1, date:'2026-07-22', tag:'部署',
   title_zh:'Hexo 博客从零部署到 Vercel', title_en:'Deploy a Hexo blog to Vercel from scratch',
   excerpt_zh:'Node.js 生态的博客框架,配合 Vercel 实现全球加速。', excerpt_en:'A Node.js blog framework accelerated globally with Vercel.',
   body_zh:'<p>Hexo 基于 Node.js,主题与插件生态成熟,适合喜欢折腾的开发者。</p><h2>本地写作</h2><p>hexo new post 即可生成 Markdown 草稿,实时预览所见即所得。</p><h2>一键上线</h2><p>用 Vercel 关联 Git 仓库,每次提交自动构建并分发到全球边缘节点。</p>'},
  {idx:2, date:'2026-07-15', tag:'架构',
   title_zh:'Astro 内容站：为什么它比传统 SSG 更快', title_en:'Astro content sites: why it beats classic SSGs',
   excerpt_zh:'群岛架构让默认页面零 JS,按需注水。', excerpt_en:'Islands architecture ships zero JS by default, hydrating on demand.',
   body_zh:'<p>Astro 采用群岛架构（Islands）,默认输出零 JavaScript 的静态 HTML,交互组件按需加载。</p><h2>性能优势</h2><p>更少的 JS 意味着更快的首屏与更好的 SEO 表现。</p><h2>适合谁</h2><p>内容驱动型站点、博客与文档,几乎都是 Astro 的甜区。</p>'},
  {idx:3, date:'2026-07-08', tag:'对比',
   title_zh:'博客主题怎么选：静态生成器对比', title_en:'How to pick a blog theme: SSG comparison',
   excerpt_zh:'Hugo / Hexo / Astro 三选一,看这篇就够。', excerpt_en:'Hugo / Hexo / Astro — pick one after reading this.',
   body_zh:'<p>选主题前先选生成器。Hugo 快、Hexo 生态熟、Astro 现代。</p><h2>对比维度</h2><p>构建速度、主题数量、学习成本、部署便利,四项加权打分即可。</p><h2>结论</h2><p>追求极速选 Hugo,喜欢折腾选 Hexo,注重新体验选 Astro。</p>'},
  {idx:4, date:'2026-07-02', tag:'技巧',
   title_zh:'Markdown 写作的 10 个提效技巧', title_en:'10 Markdown tips to write faster',
   excerpt_zh:'从快捷键到片段,让写作快人一步。', excerpt_en:'From shortcuts to snippets, write one step faster.',
   body_zh:'<p>Markdown 是博客写作的事实标准,掌握技巧能显著提升效率。</p><h2>代码片段</h2><p>用编辑器片段（snippet）一键插入常用结构,如提示框、表格。</p><h2>预览即写</h2><p>开启分屏实时预览,写作与排版同步进行。</p>'},
  {idx:5, date:'2026-06-25', tag:'分发',
   title_zh:'把博客接入 RSSHub,让内容自动分发', title_en:'Wire your blog to RSSHub for auto distribution',
   excerpt_zh:'用 RSS 把文章推送到更多阅读器与平台。', excerpt_en:'Push posts to more readers and platforms via RSS.',
   body_zh:'<p>RSSHub 能把任意站点变成 RSS 源,让读者通过订阅持续获取更新。</p><h2>为什么要 RSS</h2><p>掌握分发主动权,不再被算法左右触达。</p><h2>怎么接</h2><p>部署 RSSHub 实例,为博客生成 RSS,提交到聚合平台即可。</p>'}
];

var ARTICLE_CSS = [
  '.art-nav{display:flex;align-items:center;gap:10px;padding:14px 22px;background:#fff;border-bottom:1px solid #e5e7eb}',
  '.art-nav b{font-size:17px}.art-nav nav{margin-left:auto;display:flex;gap:18px}.art-nav nav a{color:#57606a;text-decoration:none;font-size:14px}',
  '.art-main{max-width:760px;margin:0 auto;padding:28px 20px}',
  '.art-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:30px 34px;box-shadow:0 1px 3px rgba(0,0,0,.04)}',
  '.art-cat{display:inline-block;padding:3px 12px;border-radius:999px;font-size:12px;font-weight:700;color:#fff;background:#6366f1;margin-bottom:12px}',
  '.art-title{font-size:32px;line-height:1.25;margin-bottom:14px}',
  '.art-meta{display:flex;align-items:center;gap:8px;font-size:13px;color:#57606a;margin-bottom:18px;flex-wrap:wrap}',
  '.art-av{width:26px;height:26px;border-radius:50%;background:#e5e7eb;display:inline-flex}',
  '.art-cover{width:100%;height:240px;border-radius:12px;object-fit:cover;margin-bottom:20px}',
  '.art-body{font-size:17px;color:#374151;line-height:1.85}',
  '.art-body h2{font-size:22px;margin:24px 0 10px;color:#1f2328}.art-body p{margin:10px 0}',
  '.art-foot{padding:26px 20px;text-align:center;color:#8b949e;font-size:12px;border-top:1px solid #e5e7eb;margin-top:30px;background:#fff}',
  '.art-ref{display:inline-block;margin:16px 0 4px;padding:5px 12px;border-radius:8px;background:#f3f4f6;color:#374151;font-size:13px}',
  '.art-cta-wrap{margin:22px 0 6px}',
  '.art-cta{display:inline-block;padding:12px 22px;border-radius:10px;background:#6366f1;color:#fff;font-weight:700;text-decoration:none;font-size:15px}',
  '.art-cta:hover{background:#4f46e5}'
].join('');

function blogCover(a){
  var t=isZh();
  var title = t ? (a.title_zh||a.title_en) : (a.title_en||a.title_zh);
  var c1='#6366f1', c2='#a855f7';
  var safe = (''+title).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">'
    +'<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+c1+'"/><stop offset="1" stop-color="'+c2+'"/></linearGradient></defs>'
    +'<rect width="640" height="360" fill="url(#g)"/>'
    +'<text x="40" y="200" font-family="sans-serif" font-size="38" font-weight="700" fill="#fff">'+safe+'</text>'
    +'<text x="40" y="250" font-family="sans-serif" font-size="18" fill="rgba(255,255,255,.85)">72Tool · '+(t?'博客':'Blog')+'</text>'
    +'</svg>';
  return 'data:image/svg+xml,'+encodeURIComponent(svg);
}

function buildArticleHtml(a){
  var t=isZh();
  var title = t ? (a.title_zh||a.title_en) : (a.title_en||a.title_zh);
  var body = t ? (a.body_zh||'') : (a.body_en||'');
  var date = a.date||'2026-07';
  var cover = blogCover(a);
  var refHtml = a.target ? ('<div class="art-ref">'+(t?'本文针对：':'About: ')+_escXml(a.target.name)+'</div>') : '';
  var ctaHtml = a.cta ? ('<div class="art-cta-wrap"><a class="art-cta" href="'+_escXml(a.cta.url)+'" target="_blank" rel="noopener">'+(t?(a.cta.label_zh||'前往'):(a.cta.label_en||'Open'))+'</a></div>') : '';
  return '<!DOCTYPE html><html lang="'+(t?'zh':'en')+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+' — 72Tool</title><style>'+ARTICLE_CSS+'</style></head>'
   +'<body style="background:#fff;color:#1f2328">'
   +'<header class="art-nav"><span class="art-logo"></span><b>72Tool</b><nav><a>'+(t?'首页':'Home')+'</a><a>'+(t?'博客':'Blog')+'</a><a>'+(t?'关于':'About')+'</a></nav></header>'
   +'<main class="art-main"><article class="art-card">'
   +'<span class="art-cat">'+(a.tag||(t?'文章':'Article'))+'</span>'
   +'<h1 class="art-title">'+title+'</h1>'
   +'<div class="art-meta"><span class="art-av"></span><b>72Tool</b> · <span>'+date+'</span> · '+(t?'5 分钟阅读':'5 min read')+'</div>'
   +'<img class="art-cover" src="'+cover+'">'
   +'<div class="art-body">'+body+'</div>'
   + refHtml + ctaHtml
   +'</article></main>'
   +'<footer class="art-foot">© 2026 72Tool · '+(t?'内容均为示例，可在源码中替换':'Sample content, replaceable')+'</footer>'
   +'</body></html>';
}
function openArticleNewTab(a){
  // 指向真实静态文章页（gen-blog-pages.cjs 生成），可被搜索引擎抓取；
  // 弹窗被拦截时回退到 blob 渲染，保证可用性。
  var f = ('' + a.idx).replace(/\./g, '-');
  var url = 'blog/' + f;
  var w = window.open(url, '_blank', 'noopener,noreferrer');
  if(!w){
    var html = buildArticleHtml(a);
    var blob = new Blob([html], {type:'text/html'});
    var b = URL.createObjectURL(blob);
    window.open(b, '_blank', 'noopener,noreferrer');
    setTimeout(function(){ URL.revokeObjectURL(b); }, 60000);
  }
}

function makeArticleCard(a){
  var div = document.createElement('div');
  div.className = 'resource-card';
  div.setAttribute('role','button'); div.setAttribute('tabindex','0');
  div.setAttribute('aria-label', isZh()?a.title_zh:a.title_en);
  var cover = blogCover(a);
  var title = isZh() ? a.title_zh : a.title_en;
  var excerpt = isZh() ? (a.excerpt_zh||'') : (a.excerpt_en||'');
  var date = a.date||'2026-07';
  var badge = a.atype==='lead' ? (isZh()?'引流':'Lead') : (a.atype==='tut' ? (isZh()?'教程':'Tutorial') : (isZh()?'博客':'Blog'));
  var bcolor = a.atype==='lead' ? '#6366f1' : (a.atype==='tut' ? '#10b981' : '#8b5cf6');
  var targetLine = a.target ? '<div style="font-size:12px;color:#6b7280;margin:2px 0 4px">▸ '+_escXml(a.target.name)+'</div>' : '';
  div.innerHTML =
    '<div class="card-thumb"><img loading="lazy" decoding="async" width="320" height="180" src="'+cover+'" alt="'+title+'"></div>'
    +'<div class="card-row"><div class="card-info">'
    +'<span style="display:inline-block;padding:2px 9px;border-radius:999px;font-size:11px;font-weight:700;color:#fff;background:'+bcolor+';margin-bottom:6px">'+badge+'</span>'
    +'<h3 class="card-title">'+title+'</h3>'
    + targetLine
    +'<p class="card-desc">'+excerpt+'</p></div></div>'
    +'<div class="card-meta"><span>📅 '+date+'</span><span>📖 '+(isZh()?'阅读':'Read')+'</span></div>';
  div.addEventListener('click', function(){ recordRecent({kind:'article', idx:a.idx, zh:a.title_zh, en:a.title_en}, 'article'); openArticleNewTab(a); });
  div.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); recordRecent({kind:'article', idx:a.idx, zh:a.title_zh, en:a.title_en}, 'article'); openArticleNewTab(a); } });
  return div;
}

function makeTutorialCard(item){
  var div = document.createElement('div');
  div.className = 'resource-card';
  div.dataset.idx = item.idx;
  div.setAttribute('role','button'); div.setAttribute('tabindex','0');
  var grad = 'linear-gradient(135deg,var(--nebula-gold),#ffd89b)';
  var t2 = isZh() ? item.zh : item.en;
  var d2 = isZh() ? (item.desc_zh || '') : (item.desc_en || '');
  var thumb = buildPreviewThumb(item, 'source');
  var fb = item.repo ? ('https://opengraph.githubassets.com/'+item.repo) : '';
  var onerr = fb ? ("if(!this.dataset.fb){this.dataset.fb=1;this.src='"+fb+"';}else{this.onerror=null;this.src='';}") : "this.onerror=null;this.src='';";
  var thumbHtml = thumb ? '<div class="card-thumb"><img loading="lazy" decoding="async" width="320" height="180" src="'+thumb+'" alt="'+t2+'" onerror="'+onerr+'"></div>' : '';
  div.innerHTML = thumbHtml
    + '<div class="card-row"><span class="card-icon-box" style="background:'+grad+'">📖</span>'
    + '<div class="card-info"><h3 class="card-title">'+t2+'</h3><p class="card-desc">'+d2+'</p></div></div>'
    + '<div class="card-meta">📖 '+(isZh()?'图文教程':'Tutorial')+'</div>';
  div.addEventListener('click', function(){ recordRecent({kind:'tutorial', idx:item.idx, zh:item.zh, en:item.en}, 'tutorial'); openPreviewNewTab('source', item); });
  div.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); recordRecent({kind:'tutorial', idx:item.idx, zh:item.zh, en:item.en}, 'tutorial'); openPreviewNewTab('source', item); } });
  return div;
}


/* ===================== 博客文章自动生成（引流 + 教程）=====================
   运行时根据 TOOLS_DATA / THEME_DATA / SOURCE_DATA 自动生成文章，
   底层数据一改文章即同步更新（自动更新）。每个对象生成「引流」与「教程」两篇。 */
var _blogArtMap = {};
var _baCache = null, _baLang = null;
function _escXml(s){ return (''+s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function _sceneOf(subCate){
  var m = { blog:'博客', homepage:'个人主页', toolpage:'工具站', dark:'暗黑风站点', light:'清新风站点',
            blogsrc:'博客', navsrc:'导航站', toolsrc:'工具箱', newsrc:'资讯站' };
  for(var i=0;i<subCate.length;i++){ if(m[subCate[i]]) return m[subCate[i]]; }
  return '网站';
}
function _mkArt(o){ o._k='article'; return o; }
function genBlogArticles(){
  var arts = [], t = isZh();
  (window.TOOLS_DATA||[]).forEach(function(it){
    var name = t ? it.zh : it.en, cat = t ? (it.type_cn||it.type) : (it.type||it.type_cn), url = toolUrl(it.slug);
    arts.push(_mkArt({ idx:'a-tool-'+it.slug+'-lead', atype:'lead', target:{type:'tool', name:name},
      title_zh:'推荐 '+it.zh+'：免费在线 '+cat+' 工具（附直达入口）', title_en:'Try '+it.en+': Free Online '+(it.type||'')+' Tool',
      date:'2026-07', tag: t?'工具推荐':'Tool Pick',
      excerpt_zh:'一文看懂 '+it.zh+' 能做什么、适合谁、怎么用，并附上直达使用入口。',
      excerpt_en:'What '+it.en+' does, who it is for, and how to use it — with a direct link.',
      body_zh:'<h2>什么是 '+it.zh+'？</h2><p>'+it.zh+' 是一款免费的在线 '+cat+' 工具，无需下载安装，打开网页即可使用。它面向'+cat+'场景，帮你快速完成任务、省去重复操作。</p><h2>主要能力</h2><ul><li>纯网页运行，跨平台、即开即用</li><li>界面简洁，零学习成本</li><li>本地处理，保护隐私</li></ul><h2>适合谁</h2><p>无论你是'+cat+'新手，还是日常需要频繁处理此类任务的用户，'+it.zh+' 都能让你事半功倍。</p>',
      body_en:'<h2>What is '+it.en+'?</h2><p>'+it.en+' is a free online '+(it.type||'')+' tool that runs in your browser — no install needed. It handles everyday '+(it.type||'')+' tasks in seconds.</p><h2>Highlights</h2><ul><li>Runs in the browser, cross-platform</li><li>Simple UI, zero learning curve</li><li>Processed locally for privacy</li></ul><h2>Who it is for</h2><p>From beginners to power users, '+it.en+' saves you time on repetitive '+(it.type||'')+' work.</p>',
      cta:{ label_zh:'立即使用 '+it.zh, label_en:'Open '+it.en, url:url } }));
    arts.push(_mkArt({ idx:'a-tool-'+it.slug+'-tut', atype:'tut', target:{type:'tool', name:name},
      title_zh: it.zh+' 使用教程：从打开到上手（图文）', title_en: it.en+' Tutorial: From Open to Done',
      date:'2026-07', tag: t?'使用教程':'Tutorial',
      excerpt_zh:'手把手教你使用 '+it.zh+'，几步即可完成，新手也能快速上手。',
      excerpt_en:'A step-by-step guide to using '+it.en+' — beginners welcome.',
      body_zh:'<h2>使用步骤</h2><p>1. 点击文末「立即使用」打开 '+it.zh+'。2. 按页面提示上传或输入内容。3. 一键处理并下载结果。整个过程通常只需十几秒。</p><h2>小技巧</h2><p>处理前先确认输入格式符合要求；结果可多次生成对比，挑最满意的一版保存。</p>',
      body_en:'<h2>Steps</h2><p>1. Tap "Open" below to launch '+it.en+'. 2. Upload or paste your input as prompted. 3. Process with one click and download the result — usually in seconds.</p><h2>Tips</h2><p>Check the required input format first; regenerate to compare and keep the best version.</p>',
      cta:{ label_zh:'打开 '+it.zh, label_en:'Open '+it.en, url:url } }));
  });
  THEME_DATA.forEach(function(it){
    var name = t?it.zh:it.en, scene = _sceneOf(it.subCate);
    arts.push(_mkArt({ idx:'a-theme-'+it.idx+'-lead', atype:'lead', target:{type:'theme', name:name},
      title_zh:'推荐 '+it.zh+'：开源'+scene+'主题模板（附演示与下载）', title_en:'Featured '+it.en+': Open-source '+scene+' Theme',
      date:'2026-07', tag: t?'主题推荐':'Theme Pick',
      excerpt_zh: it.desc_zh+' 附在线演示与源码下载入口。',
      excerpt_en:(it.desc_en||'')+' Live demo & source included.',
      body_zh:'<h2>关于 '+it.zh+'</h2><p>'+it.desc_zh+'</p><h2>亮点</h2><ul><li>开源免费，可自由修改</li><li>响应式设计，移动端友好</li><li>社区活跃，文档齐全</li></ul><h2>适合谁</h2><p>想快速搭建'+scene+'站点的个人与团队，'+it.zh+' 都是省心的选择。</p>',
      body_en:'<h2>About '+it.en+'</h2><p>'+(it.desc_en||'')+'</p><h2>Highlights</h2><ul><li>Open source and free to modify</li><li>Responsive, mobile-friendly</li><li>Active community & good docs</li></ul><h2>Who it is for</h2><p>Anyone building a '+scene+' site — '+it.en+' gets you started fast.</p>',
      cta:{ label_zh:'查看在线演示', label_en:'Live Demo', url: (it.previewUrl && it.previewUrl!=='#') ? it.previewUrl : it.downloadUrl } }));
    arts.push(_mkArt({ idx:'a-theme-'+it.idx+'-tut', atype:'tut', target:{type:'theme', name:name},
      title_zh: it.zh+' 部署教程：从克隆到上线（图文）', title_en: it.en+' Deploy Guide: From Clone to Live',
      date:'2026-07', tag: t?'部署教程':'Deploy',
      excerpt_zh:'手把手教你把 '+it.zh+' 跑起来并部署到静态托管。',
      excerpt_en:'Step-by-step: run '+it.en+' locally and ship it to static hosting.',
      body_zh:'<h2>快速上手</h2><p>1. 点文末「获取源码」克隆或下载 '+it.zh+'。2. 按主题文档安装依赖（如 Hugo/Hexo/Astro 对应命令）。3. 本地预览并替换为自己的内容。4. 部署到 GitHub Pages / Vercel / Netlify 等静态托管。</p><h2>发布建议</h2><p>绑定自定义域名、开启 HTTPS，并配置站点的 SEO 与站点地图，让内容更容易被收录。</p>',
      body_en:'<h2>Quick start</h2><p>1. Tap "Get Source" to clone or download '+it.en+'. 2. Install deps per the theme docs (Hugo/Hexo/Astro commands). 3. Preview locally and swap in your content. 4. Deploy to GitHub Pages / Vercel / Netlify.</p><h2>Publishing tips</h2><p>Use a custom domain with HTTPS, and set up SEO and a sitemap so your content gets indexed.</p>',
      cta:{ label_zh:'获取主题源码', label_en:'Get Source', url: it.downloadUrl } }));
  });
  SOURCE_DATA.forEach(function(it){
    var name = t?it.zh:it.en, scene = _sceneOf(it.subCate);
    arts.push(_mkArt({ idx:'a-source-'+it.idx+'-lead', atype:'lead', target:{type:'source', name:name},
      title_zh:'推荐 '+it.zh+'：开源'+scene+'项目（附 GitHub 入口）', title_en:'Featured '+it.en+': Open-source '+scene+' Project',
      date:'2026-07', tag: t?'源码推荐':'Source Pick',
      excerpt_zh: it.desc_zh+' 附 GitHub 仓库直达。',
      excerpt_en:(it.desc_en||'')+' Direct GitHub link included.',
      body_zh:'<h2>关于 '+it.zh+'</h2><p>'+it.desc_zh+'</p><h2>为什么值得关注</h2><ul><li>开源协议，可自由使用与二次开发</li><li>社区维护，持续更新</li><li>文档与示例完整，便于落地</li></ul>',
      body_en:'<h2>About '+it.en+'</h2><p>'+(it.desc_en||'')+'</p><h2>Why it matters</h2><ul><li>Open license — free to use and fork</li><li>Community-maintained, actively updated</li><li>Complete docs & examples</li></ul>',
      cta:{ label_zh:'前往 GitHub', label_en:'View on GitHub', url: it.downloadUrl } }));
    arts.push(_mkArt({ idx:'a-source-'+it.idx+'-tut', atype:'tut', target:{type:'source', name:name},
      title_zh: it.zh+' 教程：从克隆仓库到本地运行（图文）', title_en: it.en+' Guide: Clone to Running Locally',
      date:'2026-07', tag: t?'运行教程':'Run Guide',
      excerpt_zh:'一步步把 '+it.zh+' 跑起来，新手也能照做。',
      excerpt_en:'Get '+it.en+' running locally, step by step.',
      body_zh:'<h2>从零跑起来</h2><p>1. 克隆仓库：<code>git clone '+(it.repo?('https://github.com/'+it.repo+'.git'):'')+'</code>。2. 进入目录安装依赖。3. 启动本地服务预览。4. 阅读文档，按需二次开发。</p><h2>进阶</h2><p>改配置、加功能、提 PR，或把它作为你下一个项目的起点。</p>',
      body_en:'<h2>From zero to running</h2><p>1. Clone: <code>git clone '+(it.repo?('https://github.com/'+it.repo+'.git'):'')+'</code>. 2. Enter the folder and install deps. 3. Start the local dev server. 4. Read the docs and customize.</p><h2>Next steps</h2><p>Edit config, add features, open a PR, or use it as the base for your next project.</p>',
      cta:{ label_zh:'克隆仓库', label_en:'Clone Repo', url: it.downloadUrl } }));
  });
  BLOG_ARTICLES.forEach(function(a){ arts.push(Object.assign({_k:'article', atype:'general'}, a)); });
  return arts;
}
function getBlogArticles(){
  if(_baCache && _baLang===LANG){ return _baCache; }
  _baCache = genBlogArticles(); _baLang = LANG;
  _blogArtMap = {}; _baCache.forEach(function(a){ _blogArtMap[a.idx]=a; });
  return _baCache;
}

function makeCard(item, kind){
    var k = item._k || kind;
    if(k === 'article') return makeArticleCard(item);
    if(k === 'tutorial') return makeTutorialCard(item);
    kind = k;
    if(kind!=='tool'){
        if(!item.thumb){ try{ item.thumb = buildPreviewThumb(item, kind); }catch(e){} }
        if(!item.thumbFallback){ try{ item.thumbFallback = buildThumbFallback(item, kind); }catch(e){} }
        if(!item.thumbGh){ try{ item.thumbGh = item.repo ? ('https://opengraph.githubassets.com/'+item.repo) : item.thumbFallback; }catch(e){} }
    }

    // 缩略图 alt 一律使用英文描述 → 打开谷歌图片搜索这个巨大免费流量池
    var altEn = ((item && (item.en || item.zh)) || 'resource') + ' — free online '+(kind==='tool'?'tool':(kind==='theme'?'website template':'open source code'))+' | 72Tool';
    var onerr;
    if(item && item.thumbGh && item.thumbGh !== item.thumbFallback){
      onerr = "if(!this.dataset.fb){this.dataset.fb=1;this.src='"+item.thumbGh+"';}else{this.onerror=null;this.src='"+item.thumbFallback+"';}";
    } else {
      onerr = "this.onerror=null;this.src='"+(item?item.thumbFallback:'')+"';";
    }
    var fb = (item && item.thumb) ? (' onerror="'+onerr+'"') : '';
    var thumbHtml = (item && item.thumb)
        ? '<div class="card-thumb"><img loading="lazy" decoding="async" width="320" height="180" src="'+item.thumb+'" alt="'+altEn.replace(/"/g,'&quot;')+'"'+fb+'></div>'
        : '';
    var st = mockStats((item.slug||item.en||item.idx||'t'));
    var viewLbl = lbl('views'), dlLbl = lbl('downloads');
    var metaHtml = '<div class="card-meta">'+
        '<span aria-label="'+formatCount(st.views)+' '+viewLbl+'">👁 '+formatCount(st.views)+'</span>'+
        '<span aria-label="'+formatCount(st.downloads)+' '+dlLbl+'">📥 '+formatCount(st.downloads)+'</span></div>';
    var licHtml = licenseBadgeHtml(item, kind);
    if(kind === 'tool'){
        var a = document.createElement('a');
        a.className = 'resource-card';
        a.href = toolUrl(item.slug);
        a.setAttribute('aria-label', (isZh()?item.zh:item.en) || 'tool');
        a.setAttribute('itemscope',''); a.setAttribute('itemtype','https://schema.org/SoftwareApplication');
        var cat = item.cat || 'default';
        var emoji = CAT_EMOJI[cat] || '🛠️';
        var grad = CAT_GRAD[cat] || DEFAULT_GRAD;
        var badgeCls = BADGE_MAP[cat] || 'badge-default';
        var typeLabel = (isZh()?TYPE_CN_MAP[cat]:item.type) || item.type || 'Tool';
        var title = isZh() ? item.zh : (item.en || item.zh);
        var desc = isZh()
            ? (lbl('freePrefix')+title+'，'+(TYPE_CN_MAP[cat]||'')+lbl('freeSuffix').replace('.',''))
            : (lbl('enFreePrefix')+title+', '+(item.type||typeLabel)+lbl('enFreeSuffix'));
        a.innerHTML =
            thumbHtml +
            '<div class="card-row">'+
                '<span class="card-icon-box" style="background:'+grad+'">'+emoji+'</span>'+
                '<div class="card-info">'+
                    '<h3 class="card-title" itemprop="name">'+title+'</h3>'+
                    '<p class="card-desc" itemprop="description">'+desc+'</p>'+
                '</div>'+
            '</div>'+
            metaHtml +
            '<span class="card-badge '+badgeCls+'">'+typeLabel+'</span>'+
            licHtml;
        a.addEventListener('click', function(){ recordRecent({slug:item.slug, zh:item.zh, en:item.en}, 'tool'); });
        return a;
    }
    // theme / source 卡片 -> 点击弹窗
    var div = document.createElement('div');
    div.className = 'resource-card';
    div.dataset.idx = item.idx;
    div.setAttribute('role','button'); div.setAttribute('tabindex','0');
    div.setAttribute('aria-label', (isZh()?item.zh:item.en) || 'item');
    var grad2 = kind==='theme'
        ? 'linear-gradient(135deg,var(--nebula-purple),#b19cd9)'
        : 'linear-gradient(135deg,var(--nebula-gold),#ffd89b)';
    var emoji2 = kind==='theme' ? '🎨' : '💻';
    var t2 = isZh() ? item.zh : item.en;
    var d2 = isZh() ? (item.desc_zh || '') : (item.desc_en || '');
    div.innerHTML =
        thumbHtml +
        '<div class="card-row">'+
            '<span class="card-icon-box" style="background:'+grad2+'">'+emoji2+'</span>'+
            '<div class="card-info">'+
                '<h3 class="card-title">'+t2+'</h3>'+
                '<p class="card-desc">'+d2+'</p>'+
            '</div>'+
        '</div>'+
        metaHtml + licHtml;
    div.addEventListener('click', function(){ recordRecent({kind:kind, idx:item.idx, zh:item.zh, en:item.en}, kind); openModal(kind, Number(this.dataset.idx)); });
    div.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); recordRecent({kind:kind, idx:item.idx, zh:item.zh, en:item.en}, kind); openModal(kind, Number(this.dataset.idx)); } });
    return div;
}

// ===================== 分批渲染（防大列表卡顿）+ 骨架屏 + 空状态 =====================
function renderList(container, list, kind, onComplete){
    container.innerHTML = '';
    list = applyFilter(list || [], kind);
    if(!list || !list.length){
        var empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.innerHTML = '<div class="empty-icon">🗂️</div><div class="empty-text">'+
            (isZh()?lbl('noResources'):lbl('noResources'))+'</div>';
        container.appendChild(empty);
        if(onComplete) onComplete();
        return;
    }
    var skeleton = null;
    if(list.length > 24){
        skeleton = document.createElement('div');
        skeleton.className = 'skeleton-grid';
        for(var s=0;s<8;s++){
            var sk = document.createElement('div');
            sk.className = 'skeleton-card';
            sk.innerHTML = '<div class="skeleton-line"></div><div class="skeleton-line short"></div>';
            skeleton.appendChild(sk);
        }
        container.appendChild(skeleton);
    }
    var i = 0, batch = 48;
    function step(){
        if(skeleton && skeleton.parentNode){ skeleton.parentNode.removeChild(skeleton); skeleton = null; }
        var frag = document.createDocumentFragment();
        var end = Math.min(i + batch, list.length);
        for(; i < end; i++){ frag.appendChild(makeCard(list[i], kind)); }
        container.appendChild(frag);
        if(i < list.length){
            var ric = window.requestIdleCallback || function(cb){ return setTimeout(cb, 16); };
            ric(step);
        } else {
            if(onComplete) onComplete();
        }
    }
    (window.requestAnimationFrame || setTimeout)(step, 24);
}

// ===================== 资源详情弹窗 =====================
var modalMask = document.getElementById('resourceModal');
var modalTitle = document.getElementById('modalTitle');
var modalTypeTag = document.getElementById('modalTypeTag');
var modalDesc = document.getElementById('modalDesc');
var currentModal = null;
var _scrollLockCount = 0;   // 引用计数，防止快速双击造成多层遮罩
function lockScroll(){ if(_scrollLockCount++ === 0){ document.body.style.overflow = 'hidden'; } }
function unlockScroll(){ if(--_scrollLockCount <= 0){ _scrollLockCount = 0; document.body.style.overflow = ''; } }
function openModal(kind, idx){
    if(modalMask.style.display === 'flex') return;   // 防抖：已打开则忽略
    var list = kind==='theme' ? THEME_DATA : SOURCE_DATA;
    var item = list.find(function(r){ return r.idx === idx; });
    if(!item) return;
    currentModal = {kind:kind, item:item};
    modalTitle.textContent = isZh() ? item.zh : item.en;
    modalDesc.textContent = isZh() ? item.desc_zh : item.desc_en;
    modalTypeTag.textContent = isZh() ? MAIN_CONFIG[kind].zh : MAIN_CONFIG[kind].en;
    modalTypeTag.style.background = kind==='theme'
        ? 'linear-gradient(135deg,#9D7CF2,#b19cd9)'
        : 'linear-gradient(135deg,#F2D479,#ffd89b)';
    renderModalFacts(kind, item);
    renderDeployCode('vercel');
    var tip = document.getElementById('shareTip'); if(tip) tip.textContent = '';
    modalMask.style.display = 'flex';
    modalMask.setAttribute('aria-hidden','false');
    lockScroll();
    // 键盘可达：打开后焦点进入弹窗（WCAG 2.1）
    setTimeout(function(){ var c=document.getElementById('modalClose'); if(c) c.focus(); }, 30);
}

/* ---------- 弹窗事实行：许可证 / 包格式 / 更新时间（本地时区）---------- */
function renderModalFacts(kind, item){
    var box = document.getElementById('modalFacts'); if(!box) return;
    var m = LICENSE_META[licenseOf(item, kind)] || LICENSE_META.free;
    var updated = formatDateLocal(new Date(Date.now() - (hashStr(kind+item.idx)%45)*86400000));
    var L = (isZh());
    box.innerHTML =
        '<span class="fact"><b>'+(L?'许可证':'License')+'</b> <a href="'+m.url+'" target="_blank" rel="noopener noreferrer nofollow">'+m.code+'</a></span>'+
        '<span class="fact"><b>'+(L?'格式':'Format')+'</b> .zip <small>('+(L?'国际通用':'universal')+')</small></span>'+
        '<span class="fact"><b>'+(L?'依赖':'Stack')+'</b> HTML / CSS / JS <small>('+(L?'无数据库':'no database')+')</small></span>'+
        '<span class="fact"><b>'+(L?'更新于':'Updated')+'</b> '+updated+'</span>';
}

/* ---------- 部署指南（海外用户主流托管平台）---------- */
const DEPLOY_CMD = {
    vercel:  '# Vercel — free static hosting, global CDN\nnpm i -g vercel\nunzip 72tool-resource.zip && cd 72tool-resource\nvercel --prod\n# 或直接把文件夹拖到 https://vercel.com/new',
    netlify: '# Netlify — drag & drop or CLI\nnpm i -g netlify-cli\nunzip 72tool-resource.zip && cd 72tool-resource\nnetlify deploy --prod --dir=.\n# 或直接拖拽到 https://app.netlify.com/drop',
    ghpages: '# GitHub Pages — free, no build needed\ngit init && git add . && git commit -m "init"\ngit branch -M main\ngit remote add origin https://github.com/<user>/<repo>.git\ngit push -u origin main\n# Settings → Pages → Branch: main / (root) → Save',
    cf:      '# Cloudflare Pages — fastest global edge network\nnpm i -g wrangler\nwrangler pages deploy . --project-name=my-site\n# 或在 dash.cloudflare.com → Pages → Upload assets'
};
function renderDeployCode(key){
    var pre = document.getElementById('deployCode'); if(!pre) return;
    pre.textContent = DEPLOY_CMD[key] || DEPLOY_CMD.vercel;
    document.querySelectorAll('.dp-tab').forEach(function(t){ t.classList.toggle('active', t.dataset.dp===key); });
}
document.querySelectorAll('.dp-tab').forEach(function(t){
    t.addEventListener('click', function(){ renderDeployCode(this.dataset.dp); });
});
(function(){
    var btn = document.getElementById('deployCopy'); if(!btn) return;
    btn.addEventListener('click', function(){
        copyText(document.getElementById('deployCode').textContent, isZh()?lbl('cmdCopied'):lbl('cmdCopiedEn'));
    });
})();

/* ---------- 通用复制 + 提示 ---------- */
function copyText(text, okMsg){
    var tip = document.getElementById('shareTip');
    function done(){ if(tip){ tip.textContent = okMsg; setTimeout(function(){ tip.textContent=''; }, 2600); } }
    if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(done).catch(fallback);
    } else { fallback(); }
    function fallback(){
        try{
            var ta=document.createElement('textarea'); ta.value=text;
            ta.style.position='fixed'; ta.style.opacity='0';
            document.body.appendChild(ta); ta.select(); document.execCommand('copy');
            document.body.removeChild(ta); done();
        }catch(e){}
    }
}

/* ---------- 海外社区分享（分享链接自动带语种参数）---------- */
function shareUrlOf(){
    var base = 'https://72tool.com' + (LANG_PATH_SELF());
    return base + '?utm_source=share&lang=' + SITE_LANG;
}
function LANG_PATH_SELF(){ return SITE_isZh() ? '/' : ('/'+ SITE_LANG +'/'); }
function shareTitleOf(){
    if(!currentModal) return '72Tool — Free Online Tools, Templates & Open Source';
    return (isZh()?currentModal.item.zh:currentModal.item.en) + ' — 72Tool';
}
(function bindShare(){
    var r=document.getElementById('shReddit'), x=document.getElementById('shX'),
        d=document.getElementById('shDiscord'), md=document.getElementById('shMarkdown');
    if(r) r.addEventListener('click', function(){
        window.open('https://www.reddit.com/submit?url='+encodeURIComponent(shareUrlOf())+'&title='+encodeURIComponent(shareTitleOf()),
                    '_blank','noopener,noreferrer');
    });
    if(x) x.addEventListener('click', function(){
        window.open('https://x.com/intent/tweet?url='+encodeURIComponent(shareUrlOf())+'&text='+encodeURIComponent(shareTitleOf()),
                    '_blank','noopener,noreferrer');
    });
    if(d) d.addEventListener('click', function(){
        copyText('**'+shareTitleOf()+'**\n'+shareUrlOf(), isZh()?lbl('discordCopy'):lbl('discordCopyEn'));
    });
    if(md) md.addEventListener('click', function(){
        copyText('['+shareTitleOf()+']('+shareUrlOf()+')', isZh()?lbl('mdCopy'):lbl('mdCopyEn'));
    });
})();
function closeModal(){
    if(modalMask.style.display !== 'flex') return;
    modalMask.style.display = 'none';
    modalMask.setAttribute('aria-hidden','true');
    unlockScroll();
}
document.getElementById('modalClose').addEventListener('click', closeModal);
modalMask.addEventListener('click', function(e){ if(e.target === modalMask) closeModal(); });
document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeModal(); });
document.getElementById('btnPreview').addEventListener('click', function(){
    if(!currentModal) return;
    var item = currentModal.item;
    if(item.previewUrl && item.previewUrl !== '#'){
        window.open(item.previewUrl, '_blank', 'noopener,noreferrer');
        return;
    }
    openPreviewNewTab(currentModal.kind, currentModal.item);
});

/* ===================== 站内生成式预览 v3：每主题独立视觉 + 完整站点骨架 + 真实感内容 ===================== */
function _pvEnc(s){ return 'data:image/svg+xml,' + encodeURIComponent(s).replace(/'/g,'%27').replace(/"/g,'%22'); }
function _pvSvg(scene, P){
  var A=P.a,B=P.b,C=P.c,D=P.d||P.b,E=P.e||P.c;
  var svg='<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">';
  svg+='<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+A+'"/><stop offset="1" stop-color="'+B+'"/></linearGradient>'
      +'<linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+A+'" stop-opacity="0"/><stop offset="1" stop-color="'+D+'" stop-opacity=".55"/></linearGradient></defs>';
  svg+='<rect width="800" height="500" fill="url(#g)"/>';
  if(scene==='landscape'){
    svg+='<circle cx="630" cy="140" r="66" fill="'+C+'" opacity=".9"/>';
    svg+='<path d="M0 380 L210 250 L380 360 L560 220 L800 400 L800 500 L0 500 Z" fill="'+D+'" opacity=".8"/>';
    svg+='<path d="M0 450 L260 340 L500 440 L720 330 L800 430 L800 500 L0 500 Z" fill="'+E+'" opacity=".9"/>';
  } else if(scene==='abstract'){
    svg+='<circle cx="220" cy="190" r="120" fill="'+C+'" opacity=".7"/>';
    svg+='<rect x="430" y="250" width="280" height="190" rx="26" fill="'+D+'" opacity=".7" transform="rotate(-10 570 345)"/>';
    svg+='<circle cx="610" cy="120" r="58" fill="'+E+'" opacity=".85"/>';
  } else if(scene==='ui'){
    svg+='<rect x="70" y="60" width="660" height="380" rx="18" fill="#ffffff"/>';
    svg+='<rect x="70" y="60" width="660" height="50" rx="18" fill="'+C+'"/>';
    svg+='<circle cx="104" cy="85" r="7" fill="#ff5f56"/><circle cx="128" cy="85" r="7" fill="#ffbd2e"/><circle cx="152" cy="85" r="7" fill="#27c93f"/>';
    svg+='<rect x="100" y="140" width="400" height="22" rx="7" fill="'+D+'"/>';
    svg+='<rect x="100" y="182" width="600" height="12" rx="6" fill="'+E+'" opacity=".7"/>';
    svg+='<rect x="100" y="206" width="560" height="12" rx="6" fill="'+E+'" opacity=".7"/>';
    svg+='<rect x="100" y="262" width="180" height="130" rx="14" fill="'+C+'" opacity=".5"/>';
    svg+='<rect x="300" y="262" width="180" height="130" rx="14" fill="'+D+'" opacity=".5"/>';
    svg+='<rect x="500" y="262" width="160" height="130" rx="14" fill="'+E+'" opacity=".5"/>';
  } else if(scene==='code'){
    svg+='<rect x="70" y="60" width="660" height="380" rx="16" fill="#0d1117"/>';
    svg+='<rect x="70" y="60" width="660" height="46" rx="16" fill="#161b22"/>';
    svg+='<circle cx="104" cy="83" r="6" fill="#ff5f56"/><circle cx="126" cy="83" r="6" fill="#ffbd2e"/><circle cx="148" cy="83" r="6" fill="#27c93f"/>';
    var cl=[[120,150,C,430],[120,182,D,320],[120,214,E,500],[120,246,C,260],[120,278,D,420],[120,310,E,360],[120,342,C,300]];
    for(var i=0;i<cl.length;i++){ svg+='<rect x="'+cl[i][0]+'" y="'+cl[i][1]+'" width="'+cl[i][2]+'" height="12" rx="4" fill="'+cl[i][3]+'" opacity=".85"/>'; }
  } else if(scene==='portrait'){
    svg+='<circle cx="400" cy="195" r="92" fill="'+C+'"/>';
    svg+='<path d="M250 500 C250 380 350 358 400 358 C450 358 550 380 550 500 Z" fill="'+D+'"/>';
    svg+='<circle cx="400" cy="185" r="70" fill="#ffffff" opacity=".95"/>';
    svg+='<path d="M345 198 a55 55 0 0 1 110 0" fill="'+E+'"/>';
  } else if(scene==='magazine'){
    svg+='<rect x="60" y="60" width="320" height="380" rx="10" fill="'+C+'" opacity=".9"/>';
    svg+='<rect x="410" y="60" width="330" height="180" rx="10" fill="'+D+'" opacity=".9"/>';
    svg+='<rect x="410" y="260" width="160" height="180" rx="10" fill="'+E+'" opacity=".9"/>';
    svg+='<rect x="590" y="260" width="150" height="180" rx="10" fill="'+C+'" opacity=".55"/>';
  } else if(scene==='chart'){
    svg+='<rect x="90" y="90" width="120" height="320" rx="10" fill="'+C+'" opacity=".85"/>';
    svg+='<rect x="250" y="160" width="120" height="250" rx="10" fill="'+D+'" opacity=".85"/>';
    svg+='<rect x="410" y="120" width="120" height="290" rx="10" fill="'+E+'" opacity=".85"/>';
    svg+='<rect x="570" y="200" width="120" height="210" rx="10" fill="'+C+'" opacity=".5"/>';
  } else if(scene==='photo'){
    svg+='<rect x="80" y="80" width="280" height="200" rx="14" fill="'+C+'"/>';
    svg+='<rect x="380" y="80" width="340" height="120" rx="14" fill="'+D+'"/>';
    svg+='<rect x="380" y="220" width="160" height="120" rx="14" fill="'+E+'"/>';
    svg+='<rect x="560" y="220" width="160" height="120" rx="14" fill="'+C+'" opacity=".6"/>';
  } else if(scene==='tutCover'){
    /* 教程封面：博客网站截图风格 */
    svg+='<rect x="0" y="0" width="800" height="500" fill="#f6f8fa"/>';
    svg+='<rect x="0" y="0" width="800" height="56" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>';
    svg+='<rect x="24" y="18" width="80" height="20" rx="4" fill="'+C+'"/>';
    svg+='<rect x="120" y="20" width="40" height="16" rx="3" fill="'+D+'" opacity=".5"/>';
    svg+='<rect x="172" y="20" width="30" height="16" rx="3" fill="'+D+'" opacity=".5"/>';
    svg+='<rect x="212" y="20" width="36" height="16" rx="3" fill="'+D+'" opacity=".5"/>';
    svg+='<rect x="260" y="20" width="44" height="16" rx="3" fill="'+D+'" opacity=".5"/>';
    svg+='<rect x="560" y="18" width="216" height="24" rx="12" fill="#f0f0f0" stroke="#d0d0d0" stroke-width="1"/>';
    /* hero area */
    svg+='<rect x="24" y="76" width="752" height="180" rx="14" fill="url(#g)"/>';
    svg+='<rect x="54" y="106" width="200" height="24" rx="6" fill="#fff" opacity=".9"/>';
    svg+='<rect x="54" y="142" width="340" height="14" rx="4" fill="#fff" opacity=".65"/>';
    svg+='<rect x="54" y="166" width="280" height="14" rx="4" fill="#fff" opacity=".45"/>';
    svg+='<rect x="54" y="198" width="100" height="30" rx="8" fill="#fff" opacity=".85"/>';
    /* article cards */
    svg+='<rect x="24" y="276" width="360" height="96" rx="10" fill="#fff" stroke="#e5e7eb" stroke-width="1"/>';
    svg+='<rect x="24" y="276" width="110" height="96" rx="10" fill="'+C+'" opacity=".35"/>';
    svg+='<rect x="148" y="292" width="210" height="14" rx="4" fill="'+D+'"/>';
    svg+='<rect x="148" y="316" width="180" height="10" rx="3" fill="'+E+'" opacity=".5"/>';
    svg+='<rect x="148" y="336" width="140" height="10" rx="3" fill="'+E+'" opacity=".35"/>';
    svg+='<rect x="400" y="276" width="376" height="96" rx="10" fill="#fff" stroke="#e5e7eb" stroke-width="1"/>';
    svg+='<rect x="400" y="276" width="110" height="96" rx="10" fill="'+D+'" opacity=".25"/>';
    svg+='<rect x="524" y="292" width="230" height="14" rx="4" fill="'+D+'"/>';
    svg+='<rect x="524" y="316" width="200" height="10" rx="3" fill="'+E+'" opacity=".5"/>';
    svg+='<rect x="524" y="336" width="160" height="10" rx="3" fill="'+E+'" opacity=".35"/>';
    /* bottom card row */
    svg+='<rect x="24" y="388" width="240" height="88" rx="10" fill="#fff" stroke="#e5e7eb" stroke-width="1"/>';
    svg+='<rect x="40" y="404" width="80" height="56" rx="6" fill="'+E+'" opacity=".3"/>';
    svg+='<rect x="132" y="404" width="116" height="12" rx="4" fill="'+D+'"/>';
    svg+='<rect x="132" y="426" width="90" height="10" rx="3" fill="'+E+'" opacity=".4"/>';
    svg+='<rect x="280" y="388" width="240" height="88" rx="10" fill="#fff" stroke="#e5e7eb" stroke-width="1"/>';
    svg+='<rect x="296" y="404" width="80" height="56" rx="6" fill="'+C+'" opacity=".25"/>';
    svg+='<rect x="388" y="404" width="116" height="12" rx="4" fill="'+D+'"/>';
    svg+='<rect x="388" y="426" width="90" height="10" rx="3" fill="'+E+'" opacity=".4"/>';
    svg+='<rect x="536" y="388" width="240" height="88" rx="10" fill="#fff" stroke="#e5e7eb" stroke-width="1"/>';
    svg+='<rect x="552" y="404" width="80" height="56" rx="6" fill="'+D+'" opacity=".2"/>';
    svg+='<rect x="644" y="404" width="116" height="12" rx="4" fill="'+D+'"/>';
    svg+='<rect x="644" y="426" width="90" height="10" rx="3" fill="'+E+'" opacity=".4"/>';
  } else if(scene==='tutTerm'){
    /* 终端窗口：git clone / npm install / dev server */
    svg+='<rect x="0" y="0" width="800" height="500" fill="#1a1b26"/>';
    svg+='<rect x="0" y="0" width="800" height="40" fill="#16161e"/>';
    svg+='<circle cx="22" cy="20" r="7" fill="#f7768e"/><circle cx="44" cy="20" r="7" fill="#e0af68"/><circle cx="66" cy="20" r="7" fill="#9ece6a"/>';
    svg+='<rect x="86" y="14" width="140" height="14" rx="4" fill="#33415e"/>';
    var tc=[
      ['user@dev','~','% git clone https://github.com/72tool/blog-template.git'],
      ['','','Cloning into \'blog-template\'...'],
      ['','remote: Enumerating objects: 284, done.'],
      ['','remote: Counting objects: 100% (284/284), done.'],
      ['','remote: Compressing objects: 100% (200/200), done.'],
      ['','Receiving objects: 100% (284/284), 2.4 MiB | 1.2 MB/s, done.'],
      ['',''],
      ['user@dev','blog-template','$ npm install'],
      ['','','added 342 packages in 8.3s'],
      ['',''],
      ['user@dev','blog-template','$ npm run dev','','  > blog-template@1.0.0 dev','  > next dev','','  ▲ Next.js 14.2.0  ready on http://localhost:3000','','  ✓ Ready in 2.1s']
    ];
    var ty=58;
    for(var li=0;li<tc.length;li++){
      var ln=tc[li];
      if(ln[0]) svg+='<text x="24" y="'+ty+'" font-family="ui-monospace,Menlo,Consolas,monospace" font-size="13" fill="#bb9af7">'+ln[0]+'</text>';
      if(ln[1]) svg+='<text x="124" y="'+ty+'" font-family="ui-monospace,Menlo,Consolas,monospace" font-size="13" fill="#7aa2f7">'+ln[1]+'</text>';
      if(ln[2]){
        var c=ln[2];
        if(c.indexOf('git clone')>-1||c.indexOf('npm')>-1) svg+='<text x="168" y="'+ty+'" font-family="ui-monospace,Menlo,Consolas,monospace" font-size="13" fill="#9ece6a">'+c+'</text>';
        else if(c.indexOf('>')>-1||c.indexOf('Next')>-1||c.indexOf('Ready')>-1) svg+='<text x="168" y="'+ty+'" font-family="ui-monospace,Menlo,Consolas,monospace" font-size="13" fill="#7dcfff">'+c+'</text>';
        else if(c.indexOf('Enumererat')>-1||c.indexOf('Compress')>-1||c.indexOf('Receiv')>-1||c.indexOf('added')>-1) svg+='<text x="168" y="'+ty+'" font-family="ui-monospace,Menlo,Consolas,monospace" font-size="13" fill="#565f89">'+c+'</text>';
        else svg+='<text x="168" y="'+ty+'" font-family="ui-monospace,Menlo,Consolas,monospace" font-size="13" fill="#a9b1d6">'+c+'</text>';
      }
      ty+=20;
    }
    svg+='<rect x="168" y="'+(ty-14)+'" width="8" height="16" fill="#7dcfff" opacity=".8"/>';
  } else if(scene==='tutEdit'){
    /* VS Code 风格代码编辑器 */
    svg+='<rect x="0" y="0" width="800" height="500" fill="#1e1e2e"/>';
    svg+='<rect x="0" y="0" width="800" height="36" fill="#181825"/><circle cx="18" cy="18" r="6" fill="#f38ba8"/><circle cx="38" cy="18" r="6" fill="#f9e2af"/><circle cx="58" cy="18" r="6" fill="#a6e3a1"/>';
    svg+='<rect x="0" y="36" width="42" height="464" fill="#11111b"/>';
    svg+='<rect x="13" y="52" width="16" height="16" rx="3" fill="#6c7086"/>';
    svg+='<rect x="13" y="78" width="16" height="16" rx="3" fill="#89b4fa"/>';
    svg+='<rect x="13" y="104" width="16" height="16" rx="3" fill="#6c7086"/>';
    svg+='<rect x="13" y="130" width="16" height="16" rx="3" fill="#6c7086"/>';
    svg+='<rect x="42" y="36" width="180" height="464" fill="#181825"/>';
    svg+='<text x="58" y="58" font-family="sans-serif" font-size="11" fill="#6c7086" font-weight="700">EXPLORER</text>';
    svg+='<text x="58" y="82" font-family="sans-serif" font-size="12" fill="#cdd6f4" font-weight="600">📁 blog-template</text>';
    var fb=[['📄','app/page.tsx'],['📄','app/layout.tsx'],['📄','app/globals.css'],['📄','components/Header.tsx'],['📄','components/Footer.tsx'],['📄','lib/posts.ts'],['📁','content/posts/'],['📄','package.json'],['📄','next.config.js']];
    for(var fi=0;fi<fb.length;fi++) svg+='<text x="72" y="'+(98+fi*22)+'" font-family="sans-serif" font-size="12" fill="#a6adc8">'+fb[fi][0]+' '+fb[fi][1]+'</text>';
    svg+='<rect x="222" y="36" width="578" height="34" fill="#1e1e2e"/>';
    svg+='<rect x="222" y="68" width="1" height="18" fill="#89b4fa"/>';
    svg+='<text x="236" y="57" font-family="sans-serif" font-size="12" fill="#cdd6f4">page.tsx</text>';
    svg+='<circle cx="304" cy="53" r="5" fill="#6c7086"/>';
    var elines=[[1,'import { Header } from "@/components/Header";','#cba6f7'],[2,'import { Footer } from "@/components/Footer";','#cba6f7'],[3,'','#6c7086'],[4,'export default function Home() {','#cba6f7'],[5,'  return (','#f38ba8'],[6,'    <main className="min-h-screen">','#a6e3a1'],[7,'      <Header />','#89b4fa'],[8,'      <section className="hero">','#a6e3a1'],[9,'        <h1>My Blog</h1>','#f9e2af'],[10,'        <p>Welcome to my blog</p>','#a6adc8'],[11,'        {/* posts grid */}','#6c7086'],[12,'        <PostsGrid posts={posts} />','#89b4fa'],[13,'      </section>','#a6e3a1'],[14,'      <Footer />','#89b4fa'],[15,'    </main>','#a6e3a1'],[16,'  );','#f38ba8'],[17,'}','#cba6f7']];
    var ey=82;
    for(var ei=0;ei<elines.length;ei++){ var ln=elines[ei]; svg+='<text x="236" y="'+ey+'" font-family="ui-monospace,Menlo,Consolas,monospace" font-size="12.5" fill="#6c7086" text-anchor="end">'+ln[0]+'</text>'; svg+='<text x="250" y="'+ey+'" font-family="ui-monospace,Menlo,Consolas,monospace" font-size="12.5" fill="'+ln[2]+'">'+ln[1]+'</text>'; ey+=19; }
    svg+='<rect x="756" y="70" width="36" height="420" fill="#181825" opacity=".6"/>';
    svg+='<rect x="762" y="78" width="24" height="120" rx="2" fill="#6c7086" opacity=".3"/>';
    svg+='<rect x="762" y="206" width="24" height="80" rx="2" fill="#89b4fa" opacity=".25"/>';
    svg+='<rect x="762" y="294" width="24" height="60" rx="2" fill="#a6e3a1" opacity=".2"/>';
  } else if(scene==='tutBrowser'){
    /* 浏览器预览窗口 */
    svg+='<rect x="0" y="0" width="800" height="500" fill="#ffffff"/>';
    svg+='<rect x="0" y="0" width="800" height="48" fill="#f1f3f4"/>';
    svg+='<circle cx="20" cy="24" r="7" fill="#ea4335"/><circle cx="42" cy="24" r="7" fill="#fbbc04"/><circle cx="64" cy="24" r="7" fill="#34a853"/>';
    svg+='<rect x="88" y="14" width="520" height="24" rx="12" fill="#fff" stroke="#dadce0" stroke-width="1"/>';
    svg+='<rect x="98" y="21" width="16" height="10" rx="2" fill="#8ab4f8" opacity=".6"/>';
    svg+='<text x="122" y="31" font-family="sans-serif" font-size="12" fill="#5f6368">localhost:3000</text>';
    svg+='<rect x="640" y="16" width="28" height="16" rx="4" fill="#e8eaed"/><rect x="678" y="16" width="28" height="16" rx="4" fill="#e8eaed"/><rect x="716" y="16" width="28" height="16" rx="4" fill="#e8eaed"/><rect x="756" y="16" width="28" height="16" rx="4" fill="#e8eaed"/>';
    svg+='<rect x="0" y="48" width="800" height="452" fill="#ffffff"/>';
    svg+='<rect x="0" y="48" width="800" height="50" fill="#fff" stroke="#e8eaed" stroke-width="1" stroke-opacity=".6"/>';
    svg+='<rect x="24" y="62" width="60" height="22" rx="4" fill="'+C+'"/>';
    svg+='<rect x="100" y="66" width="32" height="14" rx="3" fill="#5f6368"/><rect x="144" y="66" width="28" height="14" rx="3" fill="#5f6368"/><rect x="184" y="66" width="36" height="14" rx="3" fill="#5f6368"/>';
    svg+='<rect x="24" y="114" width="752" height="160" rx="12" fill="url(#g)"/>';
    svg+='<rect x="48" y="142" width="180" height="26" rx="6" fill="#fff" opacity=".92"/><rect x="48" y="180" width="320" height="14" rx="4" fill="#fff" opacity=".6"/><rect x="48" y="204" width="240" height="14" rx="4" fill="#fff" opacity=".4"/><rect x="48" y="232" width="90" height="28" rx="7" fill="#fff" opacity=".85"/>';
    svg+='<rect x="24" y="290" width="235" height="90" rx="10" fill="#f8f9fa" stroke="#e8eaed" stroke-width="1"/>';
    svg+='<rect x="36" y="302" width="80" height="60" rx="6" fill="'+C+'" opacity=".3"/><rect x="128" y="306" width="118" height="12" rx="3" fill="#202124"/><rect x="128" y="326" width="96" height="9" rx="2" fill="#5f6368" opacity=".55"/><rect x="128" y="344" width="72" height="9" rx="2" fill="#5f6368" opacity=".35"/>';
    svg+='<rect x="271" y="290" width="235" height="90" rx="10" fill="#f8f9fa" stroke="#e8eaed" stroke-width="1"/>';
    svg+='<rect x="283" y="302" width="80" height="60" rx="6" fill="'+D+'" opacity=".2"/><rect x="375" y="306" width="118" height="12" rx="3" fill="#202124"/><rect x="375" y="326" width="104" height="9" rx="2" fill="#5f6368" opacity=".55"/><rect x="375" y="344" width="80" height="9" rx="2" fill="#5f6368" opacity=".35"/>';
    svg+='<rect x="518" y="290" width="258" height="90" rx="10" fill="#f8f9fa" stroke="#e8eaed" stroke-width="1"/>';
    svg+='<rect x="530" y="302" width="80" height="60" rx="6" fill="'+E+'" opacity=".2"/><rect x="622" y="306" width="140" height="12" rx="3" fill="#202124"/><rect x="622" y="326" width="120" height="9" rx="2" fill="#5f6368" opacity=".55"/><rect x="622" y="344" width="88" height="9" rx="2" fill="#5f6368" opacity=".35"/>';
    svg+='<rect x="24" y="396" width="752" height="42" rx="8" fill="#f8f9fa" stroke="#e8eaed" stroke-width="1"/><rect x="340" y="412" width="120" height="12" rx="3" fill="#5f6368" opacity=".4"/>';
    svg+='<rect x="796" y="48" width="4" height="80" rx="2" fill="#dadce0" opacity=".5"/><rect x="796" y="48" width="4" height="30" rx="2" fill="#8ab4f8" opacity=".6"/>';
  } else if(scene==='tutFiles'){
    /* Finder 文件管理器风格 */
    svg+='<rect x="0" y="0" width="800" height="500" fill="#fafafa"/>';
    svg+='<rect x="0" y="0" width="800" height="40" fill="#f1f3f4" stroke="#e0e0e0" stroke-width="1"/>';
    svg+='<circle cx="22" cy="20" r="7" fill="#ff5f56"/><circle cx="44" cy="20" r="7" fill="#ffbd2e"/><circle cx="66" cy="20" r="7" fill="#27c93f"/>';
    svg+='<text x="90" y="25" font-family="sans-serif" font-size="13" fill="#5f6368">blog-template — Finder</text>';
    svg+='<rect x="0" y="40" width="180" height="460" fill="#f8f9fa" stroke="#e0e0e0" stroke-width="1"/>';
    svg+='<text x="16" y="66" font-family="sans-serif" font-size="11" fill="#5f6368" font-weight="700" letter-spacing=".05em">FAVORITES</text>';
    svg+='<text x="16" y="90" font-family="sans-serif" font-size="13" fill="#1a73e8">🏠 Home</text>';
    svg+='<text x="16" y="114" font-family="sans-serif" font-size="13" fill="#5f6368">🖥 Desktop</text>';
    svg+='<text x="16" y="138" font-family="sans-serif" font-size="13" fill="#5f6368">📄 Documents</text>';
    svg+='<line x1="12" y1="156" x2="168" y2="156" stroke="#e0e0e0" stroke-width="1"/>';
    svg+='<text x="16" y="178" font-family="sans-serif" font-size="11" fill="#5f6368" font-weight="700" letter-spacing=".05em">LOCATIONS</text>';
    svg+='<text x="16" y="202" font-family="sans-serif" font-size="13" fill="#1a73e8" font-weight="600">📁 blog-template</text>';
    svg+='<rect x="180" y="40" width="620" height="460" fill="#fff"/>';
    svg+='<text x="200" y="64" font-family="sans-serif" font-size="11" fill="#5f6368" font-weight="700">Name</text>';
    svg+='<text x="520" y="64" font-family="sans-serif" font-size="11" fill="#5f6368" font-weight="700">Modified</text>';
    svg+='<text x="660" y="64" font-family="sans-serif" font-size="11" fill="#5f6368" font-weight="700">Size</text>';
    svg+='<line x1="192" y1="74" x2="792" y2="74" stroke="#e0e0e0" stroke-width="1"/>';
    var fr=[['📁','app/',           'Today 10:32',   '—'     ],['📁','content/',       'Today 10:30',   '—'     ],['📁','components/',    'Today 09:15',   '—'     ],['📁','lib/',           'Yesterday 14:22','—'     ],['📄','package.json',   'Jul 28 16:00',  '4.2 KB'],['📄','next.config.mjs','Jul 28 16:00',  '0.3 KB'],['📄','tailwind.config.ts','Jul 27 11:40','1.1 KB'],['📄','tsconfig.json',  'Jul 27 11:40',  '0.8 KB'],['📄','.gitignore',     'Jul 26 09:00',  '0.2 KB'],['📄','README.md',      'Jul 26 08:30',  '2.8 KB']];
    for(var ri=0;ri<fr.length;ri++){ var r=fr[ri], ry=94+ri*37; if(ri%2===0) svg+='<rect x="192" y="'+(ry-18)+'" width="608" height="37" fill="#f8f9fa"/>'; svg+='<text x="200" y="'+ry+'" font-family="sans-serif" font-size="13" fill="#202124">'+r[0]+' '+r[1]+'</text>'; svg+='<text x="520" y="'+ry+'" font-family="sans-serif" font-size="12.5" fill="#5f6368">'+r[2]+'</text>'; svg+='<text x="660" y="'+ry+'" font-family="ui-monospace,Menlo,Consolas,monospace" font-size="12.5" fill="#5f6368">'+r[3]+'</text>'; }
  } else if(scene==='tutRel'){
    /* 相关教程缩略图 */
    svg+='<rect x="0" y="0" width="320" height="180" fill="#f6f8fa" rx="10"/>';
    svg+='<rect x="0" y="0" width="320" height="100" fill="url(#g)" rx="10"/>';
    svg+='<rect x="16" y="18" width="120" height="18" rx="5" fill="#fff" opacity=".85"/>';
    svg+='<rect x="16" y="46" width="200" height="10" rx="3" fill="#fff" opacity=".5"/>';
    svg+='<rect x="16" y="64" width="160" height="10" rx="3" fill="#fff" opacity=".35"/>';
    svg+='<rect x="16" y="112" width="180" height="13" rx="4" fill="'+D+'"/>';
    svg+='<rect x="16" y="134" width="130" height="9" rx="3" fill="'+E+'" opacity=".5"/>';
    svg+='<rect x="16" y="152" width="100" height="9" rx="3" fill="'+E+'" opacity=".3"/>';
  } else {
    svg+='<circle cx="610" cy="150" r="78" fill="'+C+'" opacity=".85"/>';
    svg+='<path d="M0 430 L250 310 L500 410 L800 290 L800 500 L0 500 Z" fill="'+D+'" opacity=".8"/>';
  }
  svg+='<rect width="800" height="500" fill="url(#g2)"/></svg>';
  return _pvEnc(svg);
}

/* ---------- 配色（每主题独立） ---------- */
var PV_PAL = {
  t0:{a:'#7c3aed',b:'#db2777',c:'#f5d0fe',d:'#4c1d95',e:'#fbcfe8'},
  t1:{a:'#111827',b:'#374151',c:'#9ca3af',d:'#e5e7eb',e:'#6b7280'},
  t2:{a:'#0f172a',b:'#1e293b',c:'#a78bfa',d:'#334155',e:'#c4b5fd'},
  t3:{a:'#0ea5e9',b:'#2563eb',c:'#7dd3fc',d:'#0369a1',e:'#bae6fd'},
  t4:{a:'#0a0a0a',b:'#1f2937',c:'#525252',d:'#404040',e:'#737373'},
  t5:{a:'#38bdf8',b:'#818cf8',c:'#a5f3fc',d:'#0ea5e9',e:'#c7d2fe'},
  t6:{a:'#b91c1c',b:'#f59e0b',c:'#fde68a',d:'#7f1d1d',e:'#fca5a5'},
  t7:{a:'#1e3a8a',b:'#312e81',c:'#c7d2fe',d:'#1e1b4b',e:'#e0e7ff'},
  t8:{a:'#0d1117',b:'#161b22',c:'#22c55e',d:'#30c46b',e:'#4ade80'},
  t9:{a:'#1c1917',b:'#292524',c:'#f59e0b',d:'#44403c',e:'#fbbf24'},
  t10:{a:'#0f766e',b:'#14b8a6',c:'#99f6e4',d:'#0d9488',e:'#5eead4'},
  t11:{a:'#4338ca',b:'#6366f1',c:'#c7d2fe',d:'#3730a3',e:'#a5b4fc'},
  t12:{a:'#ec4899',b:'#7c3aed',c:'#22d3ee',d:'#db2777',e:'#a855f7'},
  t13:{a:'#1e1b4b',b:'#312e81',c:'#818cf8',d:'#4c1d95',e:'#c4b5fd'},
  t14:{a:'#10b981',b:'#34d399',c:'#a7f3d0',d:'#059669',e:'#6ee7b7'},
  t15:{a:'#1e3a8a',b:'#2563eb',c:'#bfdbfe',d:'#1e40af',e:'#93c5fd'},
  blogsrc:{a:'#8b5cf6',b:'#6d28d9',c:'#ddd6fe',d:'#5b21b6',e:'#c4b5fd'},
  docs:{a:'#0ea5e9',b:'#0284c7',c:'#bae6fd',d:'#0369a1',e:'#7dd3fc'},
  navsrc:{a:'#0f172a',b:'#1e293b',c:'#38bdf8',d:'#334155',e:'#7dd3fc'},
  toolsrc:{a:'#14b8a6',b:'#0d9488',c:'#ccfbf1',d:'#0f766e',e:'#5eead4'},
  newsrc:{a:'#f97316',b:'#ea580c',c:'#fed7aa',d:'#c2410c',e:'#fdba74'}
};

/* ---------- 主题/源码配置（布局 + 场景 + 背景 + 文案） ---------- */
var PV_THEME = {
 0:{P:PV_PAL.t0,L:'blogGradient',scene:'landscape',bg:'#ffffff',fg:'#1f2937',mut:'#6b7280',tag:'渐变光效，让每篇文章像星河般闪耀。',etag:'Gradient-lit, every post shines like a galaxy.'},
 1:{P:PV_PAL.t1,L:'blogText',scene:'photo',bg:'#ffffff',fg:'#111827',mut:'#6b7280',tag:'极简文字优先，专注阅读本身。',etag:'Text-first minimalism, focus on reading.'},
 2:{P:PV_PAL.t2,L:'portfolio',scene:'portrait',bg:'#0f172a',fg:'#e2e8f0',mut:'#94a3b8',tag:'深色作品集，突出你的项目。',etag:'Dark portfolio that spotlights your work.'},
 3:{P:PV_PAL.t3,L:'toolkit',scene:'ui',bg:'#ffffff',fg:'#0f172a',mut:'#64748b',tag:'一体化工具站，搜索即所得。',etag:'All-in-one toolkit, search and get.'},
 4:{P:PV_PAL.t4,L:'darkMin',scene:'abstract',bg:'#0a0a0a',fg:'#e5e7eb',mut:'#9ca3af',tag:'极致暗黑，克制即高级。',etag:'Extreme dark, restraint is premium.'},
 5:{P:PV_PAL.t5,L:'blogLight',scene:'photo',bg:'#f8fafc',fg:'#0f172a',mut:'#64748b',tag:'清新浅色，明亮通透。',etag:'Fresh light, bright and airy.'},
 6:{P:PV_PAL.t6,L:'magazine',scene:'magazine',bg:'#fffaf0',fg:'#1c1917',mut:'#78716c',tag:'杂志多栏，编辑感十足。',etag:'Editorial multi-column, journalistic.'},
 7:{P:PV_PAL.t7,L:'academic',scene:'chart',bg:'#f8fafc',fg:'#1e293b',mut:'#64748b',tag:'双栏学术，引用与目录齐备。',etag:'Two-column academic with TOC.'},
 8:{P:PV_PAL.t8,L:'devHome',scene:'code',bg:'#0d1117',fg:'#e6edf3',mut:'#8b949e',tag:'开发者主页，代码即名片。',etag:'Developer homepage, code is the card.'},
 9:{P:PV_PAL.t9,L:'photoPort',scene:'photo',bg:'#1c1917',fg:'#f5f5f4',mut:'#a8a29e',tag:'摄影师作品集，图像为王。',etag:'Photographer portfolio, images first.'},
 10:{P:PV_PAL.t10,L:'toolkitMin',scene:'ui',bg:'#ffffff',fg:'#0f172a',mut:'#64748b',tag:'极简工具箱，清爽不喧哗。',etag:'Minimal toolkit, calm and quiet.'},
 11:{P:PV_PAL.t11,L:'navHub',scene:'ui',bg:'#ffffff',fg:'#0f172a',mut:'#64748b',tag:'多工具导航中心，一页直达。',etag:'Multi-tool nav hub, one page to all.'},
 12:{P:PV_PAL.t12,L:'cyber',scene:'abstract',bg:'#0b0a1a',fg:'#e9d5ff',mut:'#a78bfa',tag:'赛博朋克霓虹，未来感拉满。',etag:'Cyberpunk neon, full future vibe.'},
 13:{P:PV_PAL.t13,L:'deepSpace',scene:'landscape',bg:'#0b1020',fg:'#cbd5e1',mut:'#94a3b8',tag:'深空暗黑资源站，星辰为幕。',etag:'Deep-space dark resource hub.'},
 14:{P:PV_PAL.t14,L:'mint',scene:'photo',bg:'#f0fdf4',fg:'#064e3b',mut:'#6b7280',tag:'薄荷清新，呼吸感十足。',etag:'Mint fresh, full of breathing room.'},
 15:{P:PV_PAL.t15,L:'business',scene:'ui',bg:'#ffffff',fg:'#0f172a',mut:'#64748b',tag:'商务浅色官网，专业可信。',etag:'Business light corporate, trustworthy.'}
};
var PV_SSUB = {0:'blogsrc',1:'blogsrc',2:'docs',3:'toolsrc',4:'newsrc',5:'newsrc',6:'blogsrc',7:'blogsrc',8:'navsrc',9:'navsrc',10:'toolsrc',11:'toolsrc',12:'newsrc',13:'newsrc'};
var PV_SLMAP = {blogsrc:'srcBlog',docs:'srcDocs',navsrc:'srcNav',toolsrc:'srcTool',newsrc:'srcNews'};
var PV_SSCENE = {blogsrc:'ui',docs:'code',navsrc:'ui',toolsrc:'code',newsrc:'photo'};
var PV_SBG = {blogsrc:['#ffffff','#1f2328','#656d76'],docs:['#ffffff','#1f2328','#656d76'],navsrc:['#ffffff','#1f2328','#656d76'],toolsrc:['#ffffff','#1f2328','#656d76'],newsrc:['#ffffff','#1f2328','#656d76']};

function pvCfg(kind, item){
  if(kind==='theme'){
    var c = PV_THEME[item.idx] || PV_THEME[0];
    return {P:c.P, scene:c.scene, bg:c.bg, fg:c.fg, mut:c.mut, L:c.L, tag:c.tag, etag:c.etag};
  }
  var sub = PV_SSUB[item.idx] || 'toolsrc';
  var sp = PV_PAL[sub];
  var sb = PV_SBG[sub];
  return {P:sp, scene:PV_SSCENE[sub], bg:sb[0], fg:sb[1], mut:sb[2], L:PV_SLMAP[sub], tag:'', etag:''};
}

/* ---------- 内容样本（双语，扩充） ---------- */
var PV_POSTS=[
 ['如何用渐变提升阅读体验','Gradients that boost reading'],
 ['2026 配色趋势速览','2026 color trends'],
 ['可访问性入门：让所有人都能读','A11y basics'],
 ['把静态站点部署到边缘网络','Ship to the edge'],
 ['CSS 容器查询实战','Container queries'],
 ['前端性能优化清单','Frontend perf checklist'],
 ['暗色模式设计要点','Dark mode tips'],
 ['图标系统与一致性格调','Icon systems']
];
var PV_POSTD=[
 ['一段关于配色与排版的示例正文，展示字距、行高与对比度。','Sample body text showing spacing, line-height and contrast.'],
 ['今年值得尝试的调色思路与搭配示例。','Palette ideas and pairing examples worth trying.'],
 ['让所有人都能顺畅阅读，从语义到对比度。','Make reading smooth for everyone, from semantics to contrast.'],
 ['把静态站点到全球节点，延迟更低。','Push your static site to the globe for lower latency.'],
 ['用容器查询让组件真正自适应。','Use container queries for truly adaptive components.'],
 ['一份可落地的性能优化清单。','A practical performance checklist to apply today.'],
 ['暗色模式不只是反色，更关乎层级。','Dark mode is more than invert — it is about hierarchy.'],
 ['统一图标风格，强化品牌一致性格调。','Unify icon style to strengthen brand consistency.']
];
var PV_TOOLS=[
 ['JSON 格式化','JSON Formatter'],['图片压缩','Image Compressor'],['二维码生成','QR Generator'],
 ['Base64 编解码','Base64'],['时间戳转换','Timestamp'],['CSS 压缩','CSS Minifier'],
 ['MD5 计算','MD5 Hash'],['单位换算','Unit Converter'],['颜色拾取','Color Picker'],
 ['正则测试','RegEx Tester'],['URL 编码','URL Encode'],['字体对比','Font Compare']
];
var PV_PROJ=[
 ['品牌官网重构','Brand site rebuild'],['移动 App 设计','Mobile app design'],['数据看板','Data dashboard'],
 ['组件库开源','Component lib'],['电商详情页','Shop detail'],['插画作品集','Illustrations']
];
var PV_NEWS=[
 ['AI 加速芯片发布','New AI chip unveiled'],['前端框架年度更新','Framework update'],
 ['开源许可证简明指南','OSS license guide'],['边缘计算成新趋势','Edge computing'],
 ['设计系统落地实践','Design systems'],['数据库性能调优','DB tuning'],
 ['远程协作新范式','Remote work'],['隐私优先架构','Privacy-first']
];
var PV_REPO=[
 ['my-blog','my-blog'],['ui-kit','ui-kit'],['api-server','api-server'],
 ['cli-tool','cli-tool'],['docs-site','docs-site'],['design-tokens','design-tokens']
];
var PV_LINKS=[
 ['Google','Google'],['GitHub','GitHub'],['MDN','MDN'],['YouTube','YouTube'],
 ['Wikipedia','Wikipedia'],['Stack Overflow','Stack Overflow'],['Figma','Figma'],
 ['Vercel','Vercel'],['Unsplash','Unsplash'],['Notion','Notion'],['Codepen','Codepen'],['Dev.to','Dev.to']
];
var PV_CATS=[['设计','Design'],['开发','Dev'],['效率','Productivity'],['资源','Resources'],['灵感','Inspo']];
var PV_LANGS=[['JavaScript','JavaScript'],['TypeScript','TypeScript'],['Python','Python'],['Go','Go'],['Rust','Rust']];

function t_(t,a){ return t?a[0]:a[1]; }
function _t(item){ return isZh() ? item.zh : item.en; }
function _name(item){ return _t(item) || 'Template'; }

/* ---------- 复用片段 ---------- */
function pvBrand(name,P,t,navs){
  var n=''; (navs||['首页','文章','标签','关于']).forEach(function(x){ n+='<a>'+x+'</a>'; });
  return '<header class="pv-h"><span class="pv-logo" style="background:'+P.c+'"></span><b>'+name+'</b>'
    +'<div class="pv-search-mini"><span class="pv-s-ic" style="background:'+P.c+'"></span></div><nav>'+n+'</nav></header>';
}
function pvList(t,P,img,sc,titles,descs){
  var s='<div class="pv-list">';
  for(var i=0;i<titles.length;i++){
    s+='<div class="pv-row"><img class="pv-thumb" src="'+img(sc[i%sc.length])+'"><div><span class="pv-chip2" style="background:'+P.c+'22;color:'+P.a+'">'+(t?'文章':'Post')+'</span><h3>'+titles[i][0]+'</h3><p class="pv-muted">'+descs[i][t?0:1]+'</p></div></div>';
  }
  return s+'</div>';
}
function pvGrid(t,P,img,sc,titles){
  var s='<div class="pv-grid2">';
  for(var i=0;i<titles.length;i++){
    var z=titles[i];
    s+='<div class="pv-card2"><img class="pv-card-img" src="'+img(sc[i%sc.length])+'"><h3>'+z[0]+'</h3><p class="pv-muted">'+(t?'一句话描述示例。':'One-line description.')+'</p></div>';
  }
  return s+'</div>';
}
function pvCats(t,P){
  return '<div class="pv-cats">'+PV_CATS.map(function(c){return '<a class="pv-chip" style="border-color:'+P.c+';color:'+P.a+'">'+t_(t,c)+'</a>';}).join('')+'</div>';
}
function pvFooter(P,t){
  return '<footer class="pv-foot" style="background:'+P.d+';color:'+P.e+'">'
    +'<div class="pv-foot-c">'
    +'<div><b>'+(t?'关于本站':'About')+'</b><p class="pv-muted">'+(t?'这是一个演示模板，所有内容均为示例，可在源码中替换为真实内容。':'A demo template; all content is sample and ready to replace.')+'</p></div>'
    +'<div><b>'+(t?'导航':'Nav')+'</b><a>'+(t?'首页':'Home')+'</a><a>'+(t?'文章':'Posts')+'</a><a>'+(t?'分类':'Categories')+'</a><a>'+(t?'关于':'About')+'</a></div>'
    +'<div><b>'+(t?'关注':'Follow')+'</b><a>GitHub</a><a>Twitter</a><a>RSS</a></div>'
    +'</div>'
    +'<div class="pv-copy">© 2026 '+(t?'示例模板':'Sample Template')+' · '+(t?'由 72Tool 生成':'Generated by 72Tool')+'</div></footer>';
}
function pvSideNav(t,P){
  return '<aside class="pv-side" style="background:'+P.d+'"><span class="pv-logo" style="background:'+P.c+'"></span><b style="color:'+P.c+'">'+(t?'控制台':'Console')+'</b><nav>'
    +['仪表盘','组件','主题','文档','设置'].map(function(x){return '<a style="color:'+P.e+'">'+x+'</a>';}).join('')
    +'</nav></aside>';
}


/* ===================== 开源源码 → 博客教程风格预览 ===================== */
var GH_DATA = {
  blogsrc:{topics:['blog','static-site','markdown','ssg','seo'],
    files:[['dir','content'],['dir','layouts'],['dir','static'],['file','config.toml'],['file','package.json'],['file','README.md']],
    feat:[['静态生成零运维','Zero-config static build'],['Markdown 写作','Write in Markdown'],['主题生态丰富','Rich theme ecosystem'],['SEO 友好','SEO friendly']],
    install:'git clone https://github.com/gohugoio/hugo.git && cd hugo && npm install', usage:'hugo server -D',
    langs:[['Go',55,'#00ADD8'],['HTML',30,'#e34c26'],['CSS',15,'#563d7c']]},
  docs:{topics:['documentation','docs','sidebar','search','md'],
    files:[['dir','docs'],['dir','src'],['dir','public'],['file','config.md'],['file','package.json'],['file','README.md']],
    feat:[['侧边栏导航','Sidebar navigation'],['全文搜索','Full-text search'],['代码高亮','Syntax highlighting'],['多页文档','Multi-page docs']],
    install:'git clone https://github.com/vitepress/vitepress.git && cd vitepress && npm install', usage:'npm run docs:dev',
    langs:[['TypeScript',58,'#3178c6'],['Vue',24,'#41b883'],['CSS',18,'#563d7c']]},
  navsrc:{topics:['navigation','bookmarks','dashboard','links'],
    files:[['dir','assets'],['dir','css'],['dir','js'],['file','index.html'],['file','sites.json'],['file','README.md']],
    feat:[['分组网址导航','Grouped navigation'],['免后端静态','Backend-free static'],['移动端适配','Mobile friendly'],['一键部署','One-click deploy']],
    install:'git clone https://github.com/WebStackPage/WebStackPage.github.io.git && cd WebStackPage.github.io && npm install', usage:'npm run dev',
    langs:[['HTML',58,'#e34c26'],['CSS',30,'#563d7c'],['JavaScript',12,'#f1e05a']]},
  toolsrc:{topics:['tools','toolkit','pwa','utilities','vue'],
    files:[['dir','src'],['dir','components'],['dir','public'],['file','vite.config.ts'],['file','package.json'],['file','README.md']],
    feat:[['50+ 内置工具','50+ built-in tools'],['PWA 离线可用','PWA offline'],['暗黑模式','Dark mode'],['可自托管','Self-hostable']],
    install:'git clone https://github.com/CorentinTh/it-tools.git && cd it-tools && npm install', usage:'npm run dev',
    langs:[['TypeScript',55,'#3178c6'],['Vue',25,'#41b883'],['CSS',20,'#563d7c']]},
  newsrc:{topics:['news','rss','aggregation','api','cms'],
    files:[['dir','src'],['dir','scripts'],['dir','public'],['file','package.json'],['file','.env.example'],['file','README.md']],
    feat:[['RSS / API 聚合','RSS / API aggregation'],['实时更新','Real-time updates'],['定时抓取','Scheduled fetch'],['可自托管','Self-hosted']],
    install:'git clone https://github.com/ourongxing/newsnow.git && cd newsnow && pnpm install', usage:'pnpm dev',
    langs:[['TypeScript',60,'#3178c6'],['Go',25,'#00ADD8'],['CSS',15,'#563d7c']]}
};
function escCode(x){ return (''+x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function tutIcon(n){
  var m={
    author:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
    clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4 10-11"/></svg>',
    download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>',
    terminal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M13 15h4"/></svg>'
  };
  return m[n]||'';
}
var TUT_CAT = {
  blogsrc:{zh:'博客模板',en:'Blog Template'},
  docs:{zh:'文档系统',en:'Docs System'},
  navsrc:{zh:'导航站点',en:'Nav Site'},
  toolsrc:{zh:'工具箱',en:'Toolkit'},
  newsrc:{zh:'资讯站点',en:'News Site'}
};
var TUT_CSS = [
  '.tut-page{background:#f6f8fa;color:#1f2328;min-height:100vh;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,PingFang SC,Microsoft YaHei,sans-serif}',
  '.tut-nav{display:flex;align-items:center;gap:10px;padding:14px 22px;background:#fff;border-bottom:1px solid #e5e7eb}',
  '.tut-nav b{font-size:17px}.tut-logo{width:18px;height:18px;border-radius:5px;display:inline-block}.tut-nav nav{margin-left:auto;display:flex;gap:18px}',
  '.tut-nav nav a{color:#57606a;text-decoration:none;font-size:14px}',
  '.tut-wrap{max-width:1040px;margin:0 auto;padding:28px 20px;display:flex;gap:32px;align-items:flex-start}',
  '.tut-main{flex:1;min-width:0}',
  '.tut-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:30px 34px;box-shadow:0 1px 3px rgba(0,0,0,.04)}',
  '.tut-bread{font-size:13px;color:#57606a;margin-bottom:12px}.tut-bread a{color:#57606a;text-decoration:none}',
  '.tut-cat{display:inline-block;padding:3px 12px;border-radius:999px;font-size:12px;font-weight:700;color:#fff;background:#0969da;margin-bottom:12px}',
  '.tut-title{font-size:32px;line-height:1.25;margin-bottom:14px}',
  '.tut-meta{display:flex;align-items:center;gap:8px;font-size:13px;color:#57606a;margin-bottom:18px;flex-wrap:wrap}',
  '.tut-av{width:26px;height:26px;border-radius:50%;background:#e5e7eb;display:inline-flex;color:#57606a}.tut-av svg{width:16px;height:16px;margin:auto}',
  '.tut-author{font-weight:600;color:#1f2328}.tut-ic{width:15px;height:15px;display:inline-flex;vertical-align:-3px;color:#57606a}.tut-ic svg{width:15px;height:15px}.tut-dot{color:#cbd5e1}',
  '.tut-cover{width:100%;height:240px;border-radius:12px;object-fit:cover;margin-bottom:20px}',
  '.tut-lead{font-size:17px;color:#374151;line-height:1.8;margin-bottom:8px}',
  '.tut-sec{margin-top:30px;scroll-margin-top:20px}',
  '.tut-sec-h{display:flex;align-items:center;gap:10px;font-size:22px;margin-bottom:12px}',
  '.tut-step-n{width:28px;height:28px;border-radius:50%;background:#0969da;color:#fff;font-size:14px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto}',
  '.tut-sec p{color:#374151;line-height:1.85;margin:8px 0}',
  '.tut-ul{margin:10px 0;padding-left:0;list-style:none}',
  '.tut-ul li{display:flex;gap:10px;align-items:flex-start;padding:6px 0;line-height:1.6}',
  '.tut-li-ic{width:20px;height:20px;color:#1f883d;flex:0 0 auto;margin-top:1px}.tut-li-ic svg{width:20px;height:20px}',
  '.tut-cmd{margin:14px 0;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden}',
  '.tut-cmd-h{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#f6f8fa;border-bottom:1px solid #e5e7eb;font-size:13px;color:#57606a}',
  '.tut-cmd-h .tut-prompt{margin-left:auto;font-family:ui-monospace,Menlo,Consolas,monospace;color:#1f883d;font-weight:700}',
  '.tut-pre{background:#0d1117;color:#e6edf3;padding:14px 16px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;overflow:auto;white-space:pre}',
  '.tut-tree{background:#f6f8fa;border:1px solid #e5e7eb;border-radius:10px;padding:14px 18px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;line-height:1.9;color:#374151;margin:12px 0}',
  '.tut-tree .dir{color:#0969da;font-weight:600}',
  '.tut-langs{display:flex;height:12px;border-radius:6px;overflow:hidden;margin:12px 0;background:#f6f8fa}',
  '.tut-lseg{height:100%}',
  '.tut-lang-lg{display:flex;flex-wrap:wrap;gap:14px}',
  '.tut-lang-item{font-size:13px;color:#57606a;display:inline-flex;align-items:center;gap:6px}.tut-dotc{width:10px;height:10px;border-radius:50%;display:inline-block}',
  '.tut-shot{width:100%;height:200px;border-radius:12px;object-fit:cover;margin:14px 0;border:1px solid #e5e7eb}',
  '.tut-cta{display:inline-flex;align-items:center;gap:8px;margin-top:14px;padding:11px 22px;border-radius:10px;background:#1f883d;color:#fff;font-weight:700;text-decoration:none;font-size:15px}',
  '.tut-side{flex:0 0 240px;position:sticky;top:20px}',
  '.tut-toc{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:18px}',
  '.tut-toc b{display:block;font-size:13px;color:#57606a;text-transform:uppercase;letter-spacing:.04em;margin-bottom:10px}',
  '.tut-toc a{display:flex;align-items:center;gap:8px;padding:6px 0;color:#374151;text-decoration:none;font-size:13px}',
  '.tut-toc a:hover{color:#0969da}.tut-toc .tut-step-n{width:20px;height:20px;font-size:11px}',
  '.tut-author-card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:18px;margin-top:16px;text-align:center}',
  '.tut-author-card .tut-av{width:54px;height:54px;margin:0 auto 10px}.tut-author-card h4{font-size:15px;margin-bottom:4px}.tut-author-card p{font-size:12px;color:#57606a}',
  '.tut-rel{margin-top:30px}.tut-rel-h{font-size:18px;margin-bottom:12px}.tut-rel-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}',
  '.tut-rel-card{border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background:#fff}.tut-rel-card img{width:100%;height:90px;object-fit:cover}.tut-rel-card h4{font-size:14px;padding:10px 12px}',
  '.tut-foot{padding:26px 20px;text-align:center;color:#8b949e;font-size:12px;border-top:1px solid #e5e7eb;margin-top:30px;background:#fff}',
  '@media(max-width:860px){.tut-wrap{flex-direction:column}.tut-side{position:static;flex:none;width:auto}.tut-rel-grid{grid-template-columns:repeat(2,1fr)}}',
  '@media(max-width:560px){.tut-card{padding:20px 16px}.tut-title{font-size:26px}.tut-rel-grid{grid-template-columns:1fr}}'
].join('');

function srcTutorial(P,t,item,img,cfg){
  var sub=(item.subCate&&item.subCate[0])||'toolsrc';
  var d=GH_DATA[sub]||GH_DATA.toolsrc;
  var name=_name(item);
  var desc=(t?(item.desc_zh||''):(item.desc_en||''));
  var cat=TUT_CAT[sub]||TUT_CAT.toolsrc;
  var repo=(item.repo||'owner/name');
  var repoName=(repo.split('/')[1]||'project');
  var parts=(d.install||'').split(' && ');
  var cloneCmd='git clone https://github.com/'+repo+'.git';
  var instCmd=parts[2]||parts[1]||'npm install';
  var cdCmd='cd '+repoName+' && '+instCmd;
  function code(label,cmd){ return '<div class="tut-cmd" style="margin:14px 0;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden"><div class="tut-cmd-h" style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:#f6f8fa;border-bottom:1px solid #e5e7eb;font-size:13px;color:#57606a"><span class="tut-ic" style="width:15px;height:15px;display:inline-flex;color:#57606a">'+tutIcon('terminal')+'</span><span>'+label+'</span><span class="tut-prompt" style="margin-left:auto;font-family:ui-monospace,Menlo,Consolas,monospace;color:#1f883d;font-weight:700">$</span></div><pre class="tut-pre" style="background:#0d1117;color:#e6edf3;padding:14px 16px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;overflow:auto;white-space:pre;margin:0"><code>'+escCode(cmd)+'</code></pre></div>'; }
  var T={zh:['项目简介','功能特性','环境准备','获取源码','安装依赖','启动预览','目录结构','技术栈','小结'],en:['Overview','Features','Prerequisites','Get the source','Install deps','Run & preview','Project structure','Tech stack','Wrap-up']};
  function sec(n,z,e,inner){ return '<section class="tut-sec" id="sec'+n+'" style="margin-top:30px;scroll-margin-top:20px"><div class="tut-sec-h" style="display:flex;align-items:center;gap:10px;font-size:22px;margin-bottom:12px"><span class="tut-step-n" style="width:28px;height:28px;border-radius:50%;background:#0969da;color:#fff;font-size:14px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto">'+n+'</span><span>'+t_(t,[z,e])+'</span></div>'+inner+'</section>'; }
  var feat='<ul class="tut-ul" style="margin:10px 0;padding-left:0;list-style:none">'+d.feat.map(function(x){return '<li style="display:flex;gap:10px;align-items:flex-start;padding:6px 0;line-height:1.6"><span class="tut-li-ic" style="width:20px;height:20px;color:#1f883d;flex:0 0 auto;margin-top:1px">'+tutIcon('check')+'</span><span>'+t_(t,x)+'</span></li>';}).join('')+'</ul>';
  var pre=[['Node.js ≥ 18','Node.js ≥ 18'],['npm 或 pnpm 包管理器','npm or pnpm'],['Git 版本控制','Git']];
  var preHtml='<ul class="tut-ul" style="margin:10px 0;padding-left:0;list-style:none">'+pre.map(function(x){return '<li style="display:flex;gap:10px;align-items:flex-start;padding:6px 0;line-height:1.6"><span class="tut-li-ic" style="width:20px;height:20px;color:#1f883d;flex:0 0 auto;margin-top:1px">'+tutIcon('check')+'</span><span>'+t_(t,x)+'</span></li>';}).join('')+'</ul>';
  var tree='';
  for(var i=0;i<d.files.length;i++){ var f=d.files[i]; var last=(i===d.files.length-1); var pre2=last?'└── ':'├── '; var nm=f[1]+(f[0]==='dir'?'/':''); tree+='<div>'+(f[0]==='dir'?'<span class="dir" style="color:#0969da;font-weight:600">'+pre2+nm+'</span>':'<span>'+pre2+nm+'</span>')+'</div>'; }
  var treeHtml='<div class="tut-tree" style="background:#f6f8fa;border:1px solid #e5e7eb;border-radius:10px;padding:14px 18px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;line-height:1.9;color:#374151;margin:12px 0">'+tree+'</div>';
  var langBars='<div class="tut-langs" style="display:flex;height:12px;border-radius:6px;overflow:hidden;margin:12px 0;background:#f6f8fa">'+d.langs.map(function(l){return '<span class="tut-lseg" style="width:'+l[1]+'%;background:'+l[2]+';height:100%"></span>';}).join('')+'</div>'
    +'<div class="tut-lang-lg" style="display:flex;flex-wrap:wrap;gap:14px">'+d.langs.map(function(l){return '<span class="tut-lang-item" style="font-size:13px;color:#57606a;display:inline-flex;align-items:center;gap:6px"><span class="tut-dotc" style="width:10px;height:10px;border-radius:50%;display:inline-block;background:'+l[2]+'"></span>'+l[0]+' <b>'+l[1]+'%</b></span>';}).join('')+'</div>';
  var meta='<div class="tut-meta" style="display:flex;align-items:center;gap:8px;font-size:13px;color:#57606a;margin-bottom:18px;flex-wrap:wrap"><span class="tut-av" style="width:26px;height:26px;border-radius:50%;background:#e5e7eb;display:inline-flex;color:#57606a">'+tutIcon('author')+'</span><span class="tut-author" style="font-weight:600;color:#1f2328">72Tool</span><span class="tut-dot" style="color:#cbd5e1">·</span><span class="tut-ic" style="width:15px;height:15px;display:inline-flex;vertical-align:-3px;color:#57606a">'+tutIcon('clock')+' 8 '+(t?'分钟阅读':'min read')+'</span><span class="tut-dot" style="color:#cbd5e1">·</span><span>'+(t?'2026 年 7 月':'July 2026')+'</span></div>';
  var concl='<p style="color:#374151;line-height:1.85;margin:8px 0">'+(t?'至此你已经成功在本地跑起了这套 '+cat.zh+'。接下来可以阅读源码、修改配置，或基于它构建你自己的项目。':'You now have the '+cat.en+' running locally. Read the source, tweak the config, or build your own project on top of it.')+'</p>'
    +'<a class="tut-cta" href="'+((item.downloadUrl&&item.downloadUrl!=='#')?item.downloadUrl:('https://github.com/'+repo))+'" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:8px;margin-top:14px;padding:11px 22px;border-radius:10px;background:#1f883d;color:#fff;font-weight:700;text-decoration:none;font-size:15px">'+tutIcon('download')+(t?'下载完整源码':'Download full source')+'</a>';
  var main='<div class="tut-main" style="flex:1;min-width:0"><div class="tut-card" style="background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:30px 34px;box-shadow:0 1px 3px rgba(0,0,0,.04)">'
    +'<div class="tut-bread" style="font-size:13px;color:#57606a;margin-bottom:12px"><a style="color:#57606a;text-decoration:none">'+(t?'开源源码':'Open Source')+'</a> / '+cat[t?'zh':'en']+'</div>'
    +'<span class="tut-cat" style="display:inline-block;padding:3px 12px;border-radius:999px;font-size:12px;font-weight:700;color:#fff;background:#0969da;margin-bottom:12px">'+cat[t?'zh':'en']+(t?' 教程':' Tutorial')+'</span>'
    +'<h1 class="tut-title" style="font-size:32px;line-height:1.25;margin-bottom:14px">'+name+'</h1>'+meta
    +'<img class="tut-cover" src="'+img('tutCover')+'" style="width:100%;height:240px;border-radius:12px;object-fit:cover;margin-bottom:20px;display:block">'
    +'<p class="tut-lead" style="font-size:17px;color:#374151;line-height:1.8;margin-bottom:8px">'+desc+'</p>'
    + sec(1,T.zh[0],T.en[0], '<p style="color:#374151;line-height:1.85;margin:8px 0">'+desc+'</p><p style="color:#374151;line-height:1.85;margin:8px 0">'+(t?'本教程将带你从零跑起这套 '+cat.zh+' 源码，并完成首次本地预览。跟着步骤操作即可，无需深厚的前端基础。':'This tutorial walks you through running the '+cat.en+' source locally and seeing it in the browser — no deep frontend experience required.')+'</p>')
    + sec(2,T.zh[1],T.en[1], '<p style="color:#374151;line-height:1.85;margin:8px 0">'+(t?'开箱即用的能力：':'What you get out of the box:')+'</p>'+feat)
    + sec(3,T.zh[2],T.en[2], '<p style="color:#374151;line-height:1.85;margin:8px 0">'+(t?'开始前请确认本机已具备：':'Before you start, make sure you have:')+'</p>'+preHtml)
    + sec(4,T.zh[3],T.en[3], '<p style="color:#374151;line-height:1.85;margin:8px 0">'+(t?'在终端执行，把仓库克隆到本地：':'Clone the repository in your terminal:')+'</p>'+code(t?'终端':'Terminal', cloneCmd))
    + sec(5,T.zh[4],T.en[4], '<p style="color:#374151;line-height:1.85;margin:8px 0">'+(t?'进入目录并安装依赖：':'Enter the folder and install dependencies:')+'</p>'+code(t?'终端':'Terminal', cdCmd)+'<img class="tut-shot" src="'+img('tutTerm')+'" style="width:100%;height:auto;border-radius:12px;object-fit:cover;margin:14px 0;border:1px solid #e5e7eb;display:block">')
    + sec(6,T.zh[5],T.en[5], '<p style="color:#374151;line-height:1.85;margin:8px 0">'+(t?'启动开发服务器：':'Start the dev server:')+'</p>'+code(t?'终端':'Terminal', d.usage)+'<img class="tut-shot" src="'+img('tutBrowser')+'" style="width:100%;height:auto;border-radius:12px;object-fit:cover;margin:14px 0;border:1px solid #e5e7eb;display:block"><p style="color:#57606a;font-size:13px;margin:8px 0">'+(t?'浏览器会自动打开预览地址，修改文件即可热更新。':'Your browser opens the preview automatically; edits hot-reload.')+'</p>')
    + sec(7,T.zh[6],T.en[6], '<p style="color:#374151;line-height:1.85;margin:8px 0">'+(t?'主要目录与文件：':'Main directories and files:')+'</p>'+treeHtml+'<img class="tut-shot" src="'+img('tutEdit')+'" style="width:100%;height:auto;border-radius:12px;object-fit:cover;margin:14px 0;border:1px solid #e5e7eb;display:block"><p style="color:#57606a;font-size:13px;margin:8px 0">'+(t?'用你喜欢的编辑器打开项目，即可开始修改源码。':'Open the project in your favorite editor and start hacking.')+'</p>')
    + sec(8,T.zh[7],T.en[7], '<p style="color:#374151;line-height:1.85;margin:8px 0">'+(t?'技术栈占比：':'Language breakdown:')+'</p>'+langBars)
    + sec(9,T.zh[8],T.en[8], concl)
    +'</div><div class="tut-rel" style="margin-top:30px"><div class="tut-rel-h" style="font-size:18px;margin-bottom:12px">'+(t?'相关教程':'Related tutorials')+'</div><div class="tut-rel-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">'
    +[0,1,2].map(function(r){var z=PV_POSTS[r];return '<div class="tut-rel-card" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background:#fff"><img src="'+img('tutRel')+'" style="width:100%;height:90px;object-fit:cover;display:block"><h4 style="font-size:14px;padding:10px 12px">'+z[t?0:1]+'</h4></div>';}).join('')
    +'</div></div></div>';
  var toc='<aside class="tut-side" style="flex:0 0 240px;position:sticky;top:20px"><div class="tut-toc" style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:18px"><b style="display:block;font-size:13px;color:#57606a;text-transform:uppercase;letter-spacing:.04em;margin-bottom:10px">'+(t?'本教程':'In this tutorial')+'</b>'
    +T.zh.map(function(z,i){return '<a href="#sec'+(i+1)+'" style="display:flex;align-items:center;gap:8px;padding:6px 0;color:#374151;text-decoration:none;font-size:13px"><span class="tut-step-n" style="width:20px;height:20px;border-radius:50%;background:#0969da;color:#fff;font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto">'+(i+1)+'</span>'+t_(t,[z,T.en[i]])+'</a>';}).join('')
    +'</div><div class="tut-author-card" style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:18px;margin-top:16px;text-align:center"><span class="tut-av" style="width:54px;height:54px;border-radius:50%;background:#e5e7eb;display:inline-flex;color:#57606a;margin:0 auto 10px">'+tutIcon('author')+'</span><h4 style="font-size:15px;margin-bottom:4px">72Tool</h4><p style="font-size:12px;color:#57606a">'+(t?'开源工具箱，免费可商用':'Open toolkit, free for commercial use')+'</p></div></aside>';
  var nav='<header class="tut-nav" style="display:flex;align-items:center;gap:10px;padding:14px 22px;background:#fff;border-bottom:1px solid #e5e7eb"><span class="tut-logo" style="width:18px;height:18px;border-radius:5px;display:inline-block;background:'+P.c+'"></span><b style="font-size:17px">72Tool '+(t?'教程':'Tutorials')+'</b><nav style="margin-left:auto;display:flex;gap:18px"><a style="color:#57606a;text-decoration:none;font-size:14px">'+(t?'教程':'Tutorials')+'</a><a style="color:#57606a;text-decoration:none;font-size:14px">'+(t?'开源源码':'Open Source')+'</a><a style="color:#57606a;text-decoration:none;font-size:14px">'+(t?'博客':'Blog')+'</a><a style="color:#57606a;text-decoration:none;font-size:14px">'+(t?'关于':'About')+'</a></nav></header>';
  var foot='<footer class="tut-foot" style="padding:26px 20px;text-align:center;color:#8b949e;font-size:12px;border-top:1px solid #e5e7eb;margin-top:30px;background:#fff">© 2026 72Tool · '+(t?'教程内容均为示例，可在源码中替换为真实内容':'Tutorial content is sample and replaceable')+'</footer>';
  return '<div class="tut-page" style="background:#f6f8fa;color:#1f2328;min-height:100vh;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,PingFang SC,Microsoft YaHei,sans-serif">'+nav+'<div class="tut-wrap" style="max-width:1040px;margin:0 auto;padding:28px 20px;display:flex;gap:32px;align-items:flex-start">'+main+toc+'</div>'+foot+'</div>';
}


var LAYOUTS = {
  blogGradient:function(P,t,item,img,cfg){
    var name=_name(item); var sc=['abstract','ui','photo','code','landscape','magazine','chart','portrait'];
    return pvBrand(name,P,t)+
      '<section class="pv-hero" style="background:linear-gradient(135deg,'+P.a+','+P.b+')"><img class="pv-cover" src="'+img(cfg.scene)+'"><div class="pv-hero-t"><span class="pv-pill" style="background:'+P.c+';color:'+P.a+'">'+(t?'编辑精选':'Editor’s Pick')+'</span><h1>'+name+'</h1><p>'+(t?cfg.tag:cfg.etag)+'</p></div></section>'+
      '<main class="pv-wrap"><article class="pv-feat"><img class="pv-feat-img" src="'+img('ui')+'"><div><span class="pv-tag" style="background:'+P.c+';color:'+P.a+'">'+(t?'设计':'Design')+'</span><h2>'+(t?'如何用渐变提升阅读体验':'Gradients that boost reading')+'</h2><p class="pv-muted">'+(t?'一段关于配色与排版的示例正文，展示字距、行高与对比度。':'Sample body text showing spacing, line-height and contrast.')+'</p><a class="pv-read">'+(t?'阅读全文':'Read more')+' →</a></div></article>'+
      '<h2 class="pv-sec" style="color:'+cfg.fg+'">'+(t?'最新文章':'Latest posts')+'</h2>'+pvCats(t,P)+pvList(t,P,img,sc,PV_POSTS,PV_POSTD)+'</main>'+pvFooter(P,t);
  },
  blogText:function(P,t,item,img,cfg){
    var name=_name(item);
    return pvBrand(name,P,t,['首页','归档','标签','关于'])+
      '<section class="pv-hero pv-serif" style="background:linear-gradient(135deg,'+P.a+','+P.b+')"><div class="pv-hero-t"><span class="pv-pill" style="background:'+P.c+';color:'+P.a+'">'+(t?'随笔':'Essay')+'</span><h1>'+name+'</h1><p>'+(t?cfg.tag:cfg.etag)+'</p></div></section>'+
      '<main class="pv-wrap pv-serif"><h2 class="pv-sec" style="color:'+cfg.fg+'">'+(t?'关于文字与留白':'On words and whitespace')+'</h2>'
      +'<p class="pv-lead">'+(t?cfg.tag:cfg.etag)+'</p>'
      +'<p class="pv-muted">'+(t?'这是一篇以文字为主的示例文章。没有花哨的图片，只有清晰的排版、舒适的行距与克制的留白——让读者把注意力留给内容本身。':'A text-first sample post. No fancy images, just clean type, comfortable line-height and restrained whitespace.')+'</p>'
      +'<h3 class="pv-sub" style="color:'+cfg.fg+'">'+(t?'一、为什么从排版开始':'1. Why start with typography')+'</h3>'
      +'<p class="pv-muted">'+(t?'正文第二段继续展开论点，使用衬线字体增强长文可读性，段落之间留白充足。':'A second paragraph continues the argument, using a serif face for long-form readability with generous spacing.')+'</p>'
      +'<blockquote class="pv-quote">'+(t?'“好的阅读体验，来自看不见的设计。”':'“Good reading comes from invisible design.”')+'</blockquote>'
      +'<p class="pv-muted">'+(t?'第三段给出可执行的建议：限制每行字数、统一标题层级、用颜色而非加粗表达强调。':'A third paragraph gives actionable advice: limit line length, unify heading levels, use color not bold for emphasis.')+'</p>'
      +'<div class="pv-tags">'+['#'+t_(t,['随笔','Essay']),'#'+t_(t,['排版','Typography']),'#'+t_(t,['极简','Minimal'])].map(function(x){return '<span class="pv-chip">'+x+'</span>';}).join('')+'</div>'
      +'<h2 class="pv-sec" style="color:'+cfg.fg+'">'+(t?'相关阅读':'Related')+'</h2>'+pvList(t,P,img,['photo','ui','abstract','code'],PV_POSTS.slice(0,3),PV_POSTD)+'</main>'+pvFooter(P,t);
  },
  portfolio:function(P,t,item,img,cfg){
    var name=_name(item);
    var sc=['ui','code','photo','ui','code','photo'];
    return pvBrand(name,P,t,['作品','关于','博客','联系'])+
      '<section class="pv-hero" style="background:linear-gradient(135deg,'+P.a+','+P.b+')"><img class="pv-cover" src="'+img('portrait')+'"><div class="pv-hero-t"><div class="pv-ava" style="background:'+P.c+'"></div><h1>'+name+'</h1><p>'+(t?'全栈开发者 · 开源爱好者 · 设计驱动':'Full-stack dev · OSS lover · design-driven')+'</p><div class="pv-links"><a style="border-color:'+P.c+';color:#fff">'+(t?'项目':'Projects')+'</a><a style="border-color:'+P.c+';color:#fff">'+(t?'博客':'Blog')+'</a><a style="border-color:'+P.c+';color:#fff">'+(t?'联系':'Contact')+'</a></div></div></section>'+
      '<main class="pv-wrap"><h2 class="pv-sec" style="color:'+cfg.fg+'">'+(t?'精选项目':'Selected work')+'</h2>'+pvGrid(t,P,img,sc,PV_PROJ)
      +'<h2 class="pv-sec" style="color:'+cfg.fg+'">'+(t?'关于我':'About me')+'</h2>'
      +'<p class="pv-muted">'+(t?'我专注于把复杂问题拆解成简单、好用的界面。下面是我近期参与的一些项目与开源贡献。':'I turn complex problems into simple, usable interfaces. Below are recent projects and open-source work.')+'</p></main>'+pvFooter(P,t);
  },
  toolkit:function(P,t,item,img,cfg){
    var name=_name(item); var sc=['ui','ui','ui','ui','ui','ui','ui','ui','ui','ui','ui','ui'];
    return pvBrand(name,P,t,['工具','分类','API','收藏'])+
      '<section class="pv-hero" style="background:linear-gradient(135deg,'+P.a+','+P.b+')"><div class="pv-hero-t"><h1>'+name+'</h1><p>'+(t?cfg.tag:cfg.etag)+'</p><input class="pv-search" placeholder="'+(t?'搜索 200+ 在线工具…':'Search 200+ tools…')+'"></div></section>'+
      '<main class="pv-wrap"><h2 class="pv-sec" style="color:'+cfg.fg+'">'+(t?'热门工具':'Popular tools')+'</h2>'+pvCats(t,P)+pvGrid(t,P,img,sc,PV_TOOLS)
      +'<h2 class="pv-sec" style="color:'+cfg.fg+'">'+(t?'按分类浏览':'Browse by category')+'</h2>'+pvGrid(t,P,img,sc,PV_TOOLS.slice(4,10))+'</main>'+pvFooter(P,t);
  },
  darkMin:function(P,t,item,img,cfg){
    var name=_name(item);
    return pvBrand(name,P,t,['首页','文章','标签','关于'])+
      '<section class="pv-hero" style="background:linear-gradient(135deg,'+P.a+','+P.b+')"><img class="pv-cover" src="'+img(cfg.scene)+'"><div class="pv-hero-t"><h1>'+name+'</h1><p>'+(t?cfg.tag:cfg.etag)+'</p></div></section>'+
      '<main class="pv-wrap"><div class="pv-stats"><div class="pv-stat"><b style="color:'+P.c+'">128</b><span class="pv-muted">'+(t?'文章':'Posts')+'</span></div><div class="pv-stat"><b style="color:'+P.c+'">9.2k</b><span class="pv-muted">'+(t?'订阅':'Subs')+'</span></div><div class="pv-stat"><b style="color:'+P.c+'">42</b><span class="pv-muted">'+(t?'标签':'Tags')+'</span></div></div>'
      +'<h2 class="pv-sec" style="color:'+cfg.fg+'">'+(t?'最近更新':'Recent')+'</h2>'
      +pvList(t,P,img,['photo','ui','abstract','code','landscape','magazine'],PV_POSTS,PV_POSTD)
      +pvCats(t,P)+'</main>'+pvFooter(P,t);
  },
  blogLight:function(P,t,item,img,cfg){
    var name=_name(item); var sc=['photo','ui','abstract','code','landscape','magazine'];
    return pvBrand(name,P,t)+
      '<section class="pv-hero pv-hero-light" style="background:'+P.c+'"><img class="pv-cover" src="'+img(cfg.scene)+'"><div class="pv-hero-t"><span class="pv-pill" style="background:'+P.a+';color:#fff">'+(t?'新文':'New')+'</span><h1 style="color:'+cfg.fg+'">'+name+'</h1><p style="color:'+cfg.mut+'">'+(t?cfg.tag:cfg.etag)+'</p></div></section>'+
      '<main class="pv-wrap"><article class="pv-feat"><img class="pv-feat-img" src="'+img('photo')+'"><div><span class="pv-tag" style="background:'+P.a+';color:#fff">'+(t?'生活':'Life')+'</span><h2 style="color:'+cfg.fg+'">'+(t?'清晨的第一杯咖啡':'The first coffee of morning')+'</h2><p class="pv-muted">'+(t?'一段明亮通透的示例正文，留白充足，读起来很轻松。':'A bright, airy sample body with plenty of whitespace.')+'</p><a class="pv-read" style="color:'+P.a+'">'+(t?'阅读全文':'Read more')+' →</a></div></article>'
      +'<h2 class="pv-sec" style="color:'+cfg.fg+'">'+(t?'最近文章':'Recent')+'</h2>'+pvList(t,P,img,sc,PV_POSTS,PV_POSTD)+'</main>'+pvFooter(P,t);
  },
  magazine:function(P,t,item,img,cfg){
    var name=_name(item);
    return pvBrand(name,P,t,['头条','文化','科技','财经'])+
      '<main class="pv-wrap"><h1 class="pv-big" style="color:'+cfg.fg+'">'+name+'</h1>'+pvCats(t,P)+
      '<div class="pv-mag">'+[0,1,2,3,4,5,6,7].map(function(i){var z=PV_POSTS[i%PV_POSTS.length];return '<div class="pv-magcard"><img class="pv-card-img" src="'+img('magazine')+'"><span class="pv-chip" style="background:'+P.a+';color:#fff">'+(t?'专题':'Feature')+'</span><h3 style="color:'+cfg.fg+'">'+z[0]+'</h3><p class="pv-muted">'+PV_POSTD[i%PV_POSTD.length][t?0:1]+'</p></div>';}).join('')+'</div></main>'+pvFooter(P,t);
  },
  academic:function(P,t,item,img,cfg){
    var name=_name(item);
    return pvBrand(name,P,t,['论文','课程','数据','关于'])+
      '<main class="pv-acad"><aside class="pv-toc"><b style="color:'+P.a+'">'+(t?'目录':'Contents')+'</b>'+['1. '+(t?'引言':'Intro'),'2. '+(t?'方法':'Method'),'3. '+(t?'结果':'Results'),'4. '+(t?'讨论':'Discussion'),'5. '+(t?'参考文献':'References')].map(function(x){return '<a>'+x+'</a>';}).join('')+'</aside>'+
      '<article class="pv-article"><h1>'+name+'</h1><p class="pv-muted">'+(t?cfg.tag:cfg.etag)+'</p><img class="pv-wide" src="'+img('chart')+'">'
      +'<h3 style="color:'+cfg.fg+'">'+(t?'实验方法':'Method')+'</h3><p class="pv-muted">'+(t?'正文使用双栏排版，左侧目录、右侧内容，适合长文与引用。':'Two-column layout with TOC sidebar, ideal for long-form citations.')+'</p>'
      +'<img class="pv-wide" src="'+img('code')+'">'
      +'<h3 style="color:'+cfg.fg+'">'+(t?'参考文献':'References')+'</h3><div class="pv-list"><div class="pv-row"><div><h3 style="color:'+cfg.fg+'">Smith et al. (2025)</h3><p class="pv-muted">'+(t?'关于边缘渲染的实证研究。':'Empirical study on edge rendering.')+'</p></div></div><div class="pv-row"><div><h3 style="color:'+cfg.fg+'">Lee (2026)</h3><p class="pv-muted">'+(t?'可访问性度量框架。':'An accessibility metrics framework.')+'</p></div></div></div>'
      +'</article></main>'+pvFooter(P,t);
  },
  devHome:function(P,t,item,img,cfg){
    var name=_name(item);
    return pvBrand(name,P,t,['项目','博客','简历','联系'])+
      '<section class="pv-hero" style="background:linear-gradient(135deg,'+P.a+','+P.b+')"><img class="pv-cover" src="'+img('code')+'"><div class="pv-hero-t"><h1>'+name+'</h1><p>'+(t?cfg.tag:cfg.etag)+'</p><div class="pv-links"><a style="border-color:'+P.c+';color:#fff">GitHub</a><a style="border-color:'+P.c+';color:#fff">'+(t?'博客':'Blog')+'</a></div></div></section>'+
      '<main class="pv-wrap"><h2 class="pv-sec" style="color:'+cfg.fg+'">'+(t?'开源项目':'Repositories')+'</h2><div class="pv-repos">'+PV_REPO.map(function(z){return '<div class="pv-repo"><span class="pv-dot" style="background:'+P.c+'"></span><b style="color:'+cfg.fg+'">'+z[0]+'</b><span class="pv-muted">★ 1.2k</span><span class="pv-chip2" style="background:'+P.c+'22;color:'+P.a+'">'+(t?'MIT':'MIT')+'</span></div>';}).join('')+'</div>'
      +'<h2 class="pv-sec" style="color:'+cfg.fg+'">'+(t?'技术栈':'Stack')+'</h2>'+PV_LANGS.map(function(z){return '<span class="pv-chip" style="border-color:'+P.c+';color:'+P.a+'">'+t_(t,z)+'</span>';}).join('')
      +'<h2 class="pv-sec" style="color:'+cfg.fg+'">'+(t?'最近文章':'Recent posts')+'</h2>'+pvList(t,P,img,['code','ui','photo','code'],PV_POSTS.slice(0,4),PV_POSTD)+'</main>'+pvFooter(P,t);
  },
  photoPort:function(P,t,item,img,cfg){
    var name=_name(item);
    return pvBrand(name,P,t,['作品','系列','约拍','关于'])+
      '<section class="pv-hero" style="background:linear-gradient(135deg,'+P.a+','+P.b+')"><div class="pv-hero-t"><h1>'+name+'</h1><p>'+(t?cfg.tag:cfg.etag)+'</p><a class="pv-cta" style="background:'+P.c+';color:'+P.a+'">'+(t?'预约拍摄':'Book a shoot')+'</a></div></section>'
      +'<main class="pv-wrap"><h2 class="pv-sec" style="color:'+cfg.fg+'">'+(t?'作品集':'Gallery')+'</h2>'
      +'<div class="pv-masonry">'+[0,1,2,3,4,5,6,7].map(function(i){return '<img class="pv-photo" src="'+img(i%2? 'photo':'landscape')+'">';}).join('')+'</div></main>'+pvFooter(P,t);
  },
  toolkitMin:function(P,t,item,img,cfg){
    var name=_name(item); var sc=['ui','ui','ui','ui','ui','ui','ui','ui'];
    return pvBrand(name,P,t,['工具','关于','API'])+
      '<section class="pv-hero pv-hero-light" style="background:'+P.c+'"><div class="pv-hero-t"><h1 style="color:'+cfg.fg+'">'+name+'</h1><p style="color:'+cfg.mut+'">'+(t?cfg.tag:cfg.etag)+'</p><input class="pv-search pv-search-dark" placeholder="'+(t?'搜索工具…':'Search tools…')+'"></div></section>'+
      '<main class="pv-wrap"><h2 class="pv-sec" style="color:'+cfg.fg+'">'+(t?'全部工具':'All tools')+'</h2>'+pvGrid(t,P,img,sc,PV_TOOLS)+'</main>'+pvFooter(P,t);
  },
  navHub:function(P,t,item,img,cfg){
    var name=_name(item);
    return pvBrand(name,P,t,['导航','分类','提交','关于'])+
      '<section class="pv-hero" style="background:linear-gradient(135deg,'+P.a+','+P.b+')"><div class="pv-hero-t"><h1>'+name+'</h1><p>'+(t?cfg.tag:cfg.etag)+'</p></div></section>'+
      '<main class="pv-wrap"><div class="pv-linkgrid">'+PV_LINKS.map(function(z){return '<a class="pv-link" style="border-color:'+P.c+'"><img class="pv-link-img" src="'+img('ui')+'"><span style="color:'+cfg.fg+'">'+z[0]+'</span></a>';}).join('')+'</div>'
      +'<h2 class="pv-sec" style="color:'+cfg.fg+'">'+(t?'分类':'Categories')+'</h2>'+pvCats(t,P)+'</main>'+pvFooter(P,t);
  },
  cyber:function(P,t,item,img,cfg){
    var name=_name(item);
    return pvSideNav(t,P)+
      '<main class="pv-main2" style="background:'+cfg.bg+'"><section class="pv-hero" style="background:linear-gradient(135deg,'+P.a+','+P.b+')"><div class="pv-hero-t"><span class="pv-pill" style="background:'+P.c+';color:'+P.a+'">v2.0</span><h1 style="color:'+P.c+'">'+name+'</h1><p style="color:'+cfg.fg+'">'+(t?cfg.tag:cfg.etag)+'</p></div></section>'
      +'<div class="pv-stats"><div class="pv-stat" style="border-color:'+P.c+'"><b style="color:'+P.c+'">9.8k</b><span class="pv-muted">'+(t?'访问':'Visits')+'</span></div><div class="pv-stat" style="border-color:'+P.c+'"><b style="color:'+P.c+'">320</b><span class="pv-muted">'+(t?'在线':'Online')+'</span></div><div class="pv-stat" style="border-color:'+P.c+'"><b style="color:'+P.c+'">48</b><span class="pv-muted">'+(t?'模块':'Modules')+'</span></div></div>'
      +'<h2 class="pv-sec" style="color:'+cfg.fg+'">'+(t?'功能模块':'Modules')+'</h2>'
      +'<div class="pv-grid2">'+PV_TOOLS.slice(0,8).map(function(z){return '<div class="pv-card2" style="border-color:'+P.c+';box-shadow:0 0 10px '+P.c+'55"><img class="pv-card-img" src="'+img('abstract')+'"><h3 style="color:'+cfg.fg+'">'+z[0]+'</h3></div>';}).join('')+'</div></main>'+pvFooter(P,t);
  },
  deepSpace:function(P,t,item,img,cfg){
    var name=_name(item); var sc=['ui','code','photo','ui','code','photo','landscape','abstract'];
    return pvBrand(name,P,t,['资源','文章','星图','关于'])+
      '<section class="pv-hero" style="background:linear-gradient(135deg,'+P.a+','+P.b+')"><img class="pv-cover" src="'+img('landscape')+'"><div class="pv-hero-t"><h1>'+name+'</h1><p>'+(t?cfg.tag:cfg.etag)+'</p></div></section>'+
      '<main class="pv-wrap"><h2 class="pv-sec" style="color:'+cfg.fg+'">'+(t?'精选资源':'Featured resources')+'</h2>'+pvGrid(t,P,img,sc,PV_PROJ)
      +'<h2 class="pv-sec" style="color:'+cfg.fg+'">'+(t?'最新文章':'Latest')+'</h2>'+pvList(t,P,img,sc,PV_POSTS,PV_POSTD)+'</main>'+pvFooter(P,t);
  },
  mint:function(P,t,item,img,cfg){
    var name=_name(item); var sc=['photo','ui','abstract','code','landscape','magazine'];
    return pvBrand(name,P,t)+
      '<section class="pv-hero pv-hero-light" style="background:'+P.c+'"><img class="pv-cover" src="'+img('photo')+'"><div class="pv-hero-t"><span class="pv-pill" style="background:'+P.a+';color:#fff">'+(t?'推荐':'Pick')+'</span><h1 style="color:'+cfg.fg+'">'+name+'</h1><p style="color:'+cfg.mut+'">'+(t?cfg.tag:cfg.etag)+'</p></div></section>'+
      '<main class="pv-wrap"><article class="pv-feat"><img class="pv-feat-img" src="'+img('photo')+'"><div><span class="pv-tag" style="background:'+P.a+';color:#fff">'+(t?'灵感':'Inspo')+'</span><h2 style="color:'+cfg.fg+'">'+(t?'把留白当作设计元素':'Whitespace as a design element')+'</h2><p class="pv-muted">'+(t?'薄荷绿配大面积留白，呼吸感十足的示例正文。':'Mint green with generous whitespace, a breathing sample.')+'</p><a class="pv-read" style="color:'+P.a+'">'+(t?'阅读全文':'Read more')+' →</a></div></article>'
      +'<h2 class="pv-sec" style="color:'+cfg.fg+'">'+(t?'更多文章':'More')+'</h2>'+pvList(t,P,img,sc,PV_POSTS,PV_POSTD)+'</main>'+pvFooter(P,t);
  },
  business:function(P,t,item,img,cfg){
    var name=_name(item); var sc=['ui','ui','ui','ui','ui','ui'];
    return pvBrand(name,P,t,['产品','方案','客户','文档'])+
      '<section class="pv-hero" style="background:linear-gradient(135deg,'+P.a+','+P.b+')"><img class="pv-cover" src="'+img('ui')+'"><div class="pv-hero-t"><h1>'+name+'</h1><p>'+(t?cfg.tag:cfg.etag)+'</p><a class="pv-cta" style="background:#fff;color:'+P.a+'">'+(t?'免费试用':'Get started')+'</a></div></section>'+
      '<main class="pv-wrap"><h2 class="pv-sec" style="color:'+cfg.fg+'">'+(t?'核心能力':'Capabilities')+'</h2>'+pvGrid(t,P,img,sc,PV_TOOLS.slice(0,6))
      +'<h2 class="pv-sec" style="color:'+cfg.fg+'">'+(t?'客户评价':'Testimonials')+'</h2>'
      +'<div class="pv-grid2">'+[0,1].map(function(i){return '<div class="pv-card2" style="border-color:'+P.c+'"><p class="pv-muted">'+(t?'“上线后团队效率提升明显，协作更顺畅。”':'“Efficiency improved noticeably after launch.”')+'</p><b style="color:'+cfg.fg+'">'+(t?'— 某科技公司':'— A tech company')+'</b></div>';}).join('')+'</div>'
      +'<div class="pv-stats" style="margin-top:18px"><div class="pv-stat" style="border-color:'+P.c+'"><b style="color:'+P.a+'">99.9%</b><span class="pv-muted">'+(t?'可用':'Uptime')+'</span></div><div class="pv-stat" style="border-color:'+P.c+'"><b style="color:'+P.a+'">12k+</b><span class="pv-muted">'+(t?'企业':'Enterprises')+'</span></div></div></main>'+pvFooter(P,t);
  },
  /* ---------- 源码类：做成博客教程风格 ---------- */
  srcBlog:function(P,t,item,img,cfg){ return srcTutorial(P,t,item,img,cfg); },
  srcDocs:function(P,t,item,img,cfg){ return srcTutorial(P,t,item,img,cfg); },
  srcNav:function(P,t,item,img,cfg){ return srcTutorial(P,t,item,img,cfg); },
  srcTool:function(P,t,item,img,cfg){ return srcTutorial(P,t,item,img,cfg); },
  srcNews:function(P,t,item,img,cfg){ return srcTutorial(P,t,item,img,cfg); }
};


/* ---------- 缩略图（用于网格卡片，像工具卡片那样有图） ---------- */
// 有真实仓库的项目 → 用 GitHub 官方仓库预览图（opengraph.githubassets.com），清晰且每个项目不同；
// 其余 → 退回抽象 SVG 占位。
function buildPreviewThumb(item, kind){
  try{
    return '/thumbs/' + kind + '_' + item.idx + '.png';
  }catch(e){ return ''; }
}
// 缩略图加载失败时的兜底（仍是抽象 SVG，避免出现破图）
function buildThumbFallback(item, kind){
  try{ var cfg = pvCfg(kind, item); return _pvSvg(cfg.scene, cfg.P); }catch(e){ return ''; }
}

function buildPreviewHtml(kind, item){
  item = item || {}; item.__kind = kind;
  var cfg = pvCfg(kind, item);
  var body = LAYOUTS[cfg.L](cfg.P, isZh(), item, function(s){ return _pvSvg(s, cfg.P); }, cfg);
  return '<!DOCTYPE html><html lang="'+(isZh()?'zh':'en')+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+(_t(item)||'preview')+' — 72Tool</title><style>'+_pvCssV2(cfg.bg,cfg.fg,cfg.mut)+'</style></head><body style="background:'+cfg.bg+';color:'+cfg.fg+'">'+body+'</body></html>';
}
function openPreviewNewTab(kind, item){
  var html = buildPreviewHtml(kind, item);
  var blob = new Blob([html], {type:'text/html'});
  var url = URL.createObjectURL(blob);
  var w = window.open(url, '_blank', 'noopener,noreferrer');
  if(!w){ // 弹窗被拦截时退回弹窗内预览
    openItemPreview();
  }
  setTimeout(function(){ URL.revokeObjectURL(url); }, 60000);
}
function openItemPreview(){
  if(!currentModal) return;
  var frame = document.getElementById('previewFrame');
  if(!frame) return;
  frame.srcdoc = buildPreviewHtml(currentModal.kind, currentModal.item);
  var pv = document.getElementById('modalPreview');
  if(pv){ pv.style.display = 'block'; pv.scrollIntoView({behavior:'smooth', block:'nearest'}); }
}
(function bindPreviewOpen(){
  var b = document.getElementById('mpOpen');
  if(!b) return;
  b.addEventListener('click', function(){
    if(!currentModal) return;
    openPreviewNewTab(currentModal.kind, currentModal.item);
  });
})();

/* ---------- 预览 CSS ---------- */
function _pvCssV2(bg, fg, mut){
  return '*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,PingFang SC,Microsoft YaHei,sans-serif;line-height:1.6}'
    + 'img{display:block;width:100%;height:auto}'
    + '.pv-h{display:flex;align-items:center;gap:10px;padding:14px 22px;background:'+mut+';color:'+fg+'}'
    + '.pv-h b{font-size:18px}.pv-logo{width:18px;height:18px;border-radius:5px;display:inline-block}.pv-h nav{margin-left:auto}.pv-h nav a{color:'+fg+';opacity:.8;margin-left:16px;font-size:14px;text-decoration:none}'
    + '.pv-hero{position:relative;padding:0 0 28px;color:#fff;overflow:hidden}.pv-hero-light{color:'+fg+'}'
    + '.pv-cover{width:100%;height:200px;object-fit:cover}'
    + '.pv-hero-t{position:relative;padding:18px 22px 0}.pv-hero-t h1{font-size:28px;margin-top:8px}.pv-hero-t p{margin-top:8px;opacity:.92;max-width:680px}'
    + '.pv-pill{display:inline-block;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700}'
    + '.pv-cta{display:inline-block;margin-top:14px;padding:9px 18px;border-radius:10px;font-size:14px;text-decoration:none;font-weight:700}'
    + '.pv-wrap{max-width:880px;margin:0 auto;padding:24px 20px}'
    + '.pv-big{font-size:34px;margin-bottom:10px}'
    + '.pv-lead{font-size:18px;color:'+mut+';margin-bottom:14px}'
    + '.pv-serif{font-family:Georgia,"Times New Roman",Songti SC,serif}.pv-quote{border-left:4px solid '+mut+';padding:8px 16px;margin:16px 0;color:'+mut+';font-style:italic}'
    + '.pv-tags{margin-top:16px}.pv-chip{display:inline-block;padding:3px 10px;border-radius:999px;background:rgba(127,127,127,.15);color:inherit;font-size:12px;margin:0 6px 6px 0}'
    + '.pv-feat{display:flex;gap:16px;margin-top:18px}.pv-feat-img{width:220px;height:150px;border-radius:14px;flex:0 0 auto;object-fit:cover}.pv-feat h2{font-size:22px}.pv-feat p{margin-top:8px}'
    + '.pv-tag{display:inline-block;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700}'
    + '.pv-muted{color:'+mut+'}'
    + '.pv-list{margin-top:24px}.pv-row{display:flex;gap:14px;padding:14px 0;border-bottom:1px solid rgba(127,127,127,.18)}'
    + '.pv-thumb{width:96px;height:64px;border-radius:10px;flex:0 0 auto;object-fit:cover}'
    + '.pv-row h3{font-size:16px}.pv-row p{font-size:13px;margin-top:4px}'
    + '.pv-grid2{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px;margin-top:16px}'
    + '.pv-card2{border:1px solid rgba(127,127,127,.2);border-radius:14px;padding:12px}.pv-card-img{width:100%;height:90px;border-radius:10px;object-fit:cover;margin-bottom:10px}.pv-card2 h3{font-size:15px}'
    + '.pv-ava{width:84px;height:84px;border-radius:50%;margin:0 auto 12px}.pv-links{display:flex;gap:12px;margin-top:16px;flex-wrap:wrap}.pv-links a{padding:8px 16px;border:1px solid;border-radius:10px;text-decoration:none;font-size:14px}'
    + '.pv-stats{display:flex;gap:14px;flex-wrap:wrap;margin-top:16px}.pv-stat{width:120px;padding:14px;border:1px solid rgba(127,127,127,.25);border-radius:12px;text-align:center}.pv-stat b{display:block;font-size:22px}.pv-stat span{font-size:12px}'
    + '.pv-search{margin-top:12px;padding:9px 14px;border-radius:10px;border:1px solid rgba(255,255,255,.5);background:rgba(255,255,255,.18);color:#fff;width:260px;font-size:14px}.pv-search-dark{border-color:rgba(0,0,0,.2);background:#fff;color:#111}'
    + '.pv-mag{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:18px}.pv-magcard{position:relative}.pv-magcard .pv-card-img{height:120px}.pv-magcard h3{font-size:16px;margin-top:6px}'
    + '.pv-acad{display:flex;gap:24px;max-width:980px;margin:0 auto;padding:24px 20px}.pv-toc{flex:0 0 200px}.pv-toc a{display:block;padding:8px 0;color:'+mut+';text-decoration:none;font-size:14px}.pv-article{flex:1}.pv-article h1{font-size:28px}.pv-article h3{margin:16px 0 6px}.pv-wide{width:100%;height:180px;border-radius:12px;object-fit:cover;margin:12px 0}'
    + '.pv-repos{margin-top:12px}.pv-repo{display:flex;align-items:center;gap:10px;padding:12px 0;border-bottom:1px solid rgba(127,127,127,.18)}.pv-dot{width:10px;height:10px;border-radius:50%}.pv-repo b{font-size:15px}'
    + '.pv-masonry{column-count:3;column-gap:12px;margin-top:18px}.pv-photo{width:100%;border-radius:12px;margin-bottom:12px;break-inside:avoid}'
    + '.pv-linkgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px;margin-top:18px}.pv-link{display:flex;align-items:center;gap:10px;padding:12px;border:1px solid;border-radius:12px;text-decoration:none;font-size:14px}.pv-link-img{width:36px;height:36px;border-radius:8px;object-fit:cover;flex:0 0 auto}'
    + '.pv-side{position:fixed;left:0;top:0;bottom:0;width:200px;padding:22px 16px}.pv-side nav a{display:block;padding:10px 0;text-decoration:none;font-size:14px}.pv-main2{margin-left:200px;padding:24px}.pv-main2 .pv-grid2{margin-top:16px}'
    + '@media(max-width:640px){.pv-mag{grid-template-columns:repeat(2,1fr)}.pv-masonry{column-count:2}.pv-acad{flex-direction:column}.pv-toc{flex:none}.pv-side{position:static;width:auto}.pv-main2{margin-left:0}.pv-feat{flex-direction:column}.pv-feat-img{width:100%;height:160px}}';+ '.pv-sec{font-size:22px;margin:26px 0 4px;color:'+fg+'}'+ '.pv-sub{font-size:18px;margin:18px 0 6px;color:'+fg+'}'+ '.pv-read{display:inline-block;margin-top:8px;font-weight:700;text-decoration:none}'+ '.pv-cats{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 4px}'+ '.pv-chip2{display:inline-block;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700}'+ '.pv-search-mini{margin-left:14px}.pv-s-ic{display:inline-block;width:14px;height:14px;border-radius:4px}'+ '.pv-foot{margin-top:30px;padding:26px 22px;color:'+mut+'}.pv-foot b{color:'+fg+'}'+ '.pv-foot-c{display:grid;grid-template-columns:2fr 1fr 1fr;gap:22px;max-width:880px;margin:0 auto}'+ '.pv-foot-c p{font-size:13px;margin-top:6px}.pv-foot-c a{display:block;color:'+mut+';text-decoration:none;font-size:13px;margin-top:6px}'+ '.pv-copy{max-width:880px;margin:18px auto 0;padding-top:14px;border-top:1px solid rgba(127,127,127,.2);font-size:12px}'+ '.pv-filetree{border:1px solid rgba(127,127,127,.2);border-radius:12px;padding:12px 14px;margin-top:14px}.pv-filetree b{font-size:14px}.pv-file{padding:5px 0;font-size:13px;color:'+mut+';border-bottom:1px dashed rgba(127,127,127,.18)}'+ '.pv-code{background:rgba(127,127,127,.1);border-radius:10px;padding:12px 14px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;margin:10px 0;overflow:auto}'+ '.pv-tags .pv-chip{background:rgba(127,127,127,.15)}'+'@media(max-width:640px){.pv-foot-c{grid-template-columns:1fr}}'+TUT_CSS
}


document.getElementById('btnDownload').addEventListener('click', function(){
    if(!currentModal) return;
    var btn = this;
    if(btn.disabled) return;
    var t = isZh() ? currentModal.item.zh : currentModal.item.en;
    var original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="btn-spinner"></span>' + (isZh()?lbl('dlText'):lbl('dlTextEn'));
    // 同步打开下载链接（必须在用户事件栈内，否则被弹窗拦截器屏蔽）
    if(currentModal.item.downloadUrl && currentModal.item.downloadUrl !== '#'){
        window.open(currentModal.item.downloadUrl, '_blank', 'noopener,noreferrer');
    } else {
        alert(isZh() ? ('开始下载：'+t) : ('Starting download: '+t));
    }
    // 仅恢复按钮状态
    setTimeout(function(){
        btn.disabled = false;
        btn.innerHTML = original;
    }, 900);
});

// ===================== 搜索（跨 工具/模板/源码）=====================
var searchInput = document.getElementById('searchInput');
var searchPopup = document.getElementById('searchPopup');
if(!isZh()){ searchInput.placeholder = searchInput.dataset.phEn; }

function buildSearchIndex(){
    var idx = [];
    (window.TOOLS_DATA||[]).forEach(function(t){ idx.push({kind:'tool', zh:t.zh, en:t.en, slug:t.slug}); });
    THEME_DATA.forEach(function(t){ idx.push({kind:'theme', zh:t.zh, en:t.en, idx:t.idx}); });
    SOURCE_DATA.forEach(function(t){ idx.push({kind:'source', zh:t.zh, en:t.en, idx:t.idx}); });
    getBlogArticles().forEach(function(a){ idx.push({kind:'article', zh:a.title_zh, en:a.title_en, idx:a.idx}); });
    return idx;
}
function activateSearchResult(item){
    if(!item) return;
    pushSearchHist(searchInput.value);
    if(item.kind==='tool'){ location.href = toolUrl(item.slug); }
    else if(item.kind==='article'){ var _a=_blogArtMap[item.idx]; if(_a) openArticleNewTab(_a); }
    else { openModal(item.kind, Number(item.idx)); }
    searchPopup.style.display='none';
    searchInput.value='';
    renderHotSearch();
}
searchInput.addEventListener('input', function(){
    var kw = this.value.trim().toLowerCase();
    if(!kw){ searchPopup.style.display='none'; return; }
    var results = buildSearchIndex().filter(function(r){
        return (r.zh&&r.zh.toLowerCase().indexOf(kw)>-1) ||
               (r.en&&r.en.toLowerCase().indexOf(kw)>-1);
    }).slice(0,10);
    if(results.length===0){
        searchPopup.innerHTML = '<div class="search-empty">'+(isZh()?lbl('noMatch'):lbl('noMatch'))+'</div>';
    } else {
        var html = '';
        results.forEach(function(item){
            var name = isZh()?item.zh:item.en;
            var kindTag = item.kind==='article'?'📝':(item.kind==='tool'?'🛠️':(item.kind==='theme'?'🎨':'💻'));
            html += '<div class="search-result-item" data-kind="'+item.kind+'" data-ref="'+JSON.stringify(item).replace(/"/g,'&quot;')+'">'+kindTag+' '+name+'</div>';
        });
        searchPopup.innerHTML = html;
        searchPopup.querySelectorAll('.search-result-item').forEach(function(el){
            el.addEventListener('click', function(){
                activateSearchResult(JSON.parse(this.dataset.ref.replace(/&quot;/g,'"')));
            });
        });
    }
    searchPopup.style.display='block';
});
// 回车快速检索：直接跳转/打开第一个结果
searchInput.addEventListener('keydown', function(e){
    if(e.key !== 'Enter') return;
    var kw = this.value.trim().toLowerCase();
    if(!kw) return;
    var results = buildSearchIndex().filter(function(r){
        return (r.zh&&r.zh.toLowerCase().indexOf(kw)>-1) ||
               (r.en&&r.en.toLowerCase().indexOf(kw)>-1);
    }).slice(0,1);
    if(results.length){ activateSearchResult(results[0]); }
});
document.addEventListener('click',function(e){
    if(!searchInput.contains(e.target)&&!searchPopup.contains(e.target)){
        searchPopup.style.display='none';
    }
});

// ===================== 语言切换 =====================
var langBtn = document.getElementById('langBtn'), langMenu = document.getElementById('langMenu');
langBtn.addEventListener('click',function(e){ e.stopPropagation(); var open = langMenu.classList.toggle('open'); langBtn.setAttribute('aria-expanded', open?'true':'false'); });
document.addEventListener('click',function(){ langMenu.classList.remove('open'); langBtn.setAttribute('aria-expanded','false'); });
// 独立语种页面路由（每个语种独立 URL，谷歌可独立收录，权重不再互相稀释）
var LANG_PATH = { zh:'/zh/', en:'/', jp:'/jp/', es:'/es/', de:'/de/', ar:'/ar/' };
langMenu.querySelectorAll('.lang-option').forEach(function(opt){
    if(opt.dataset.lang === SITE_LANG) opt.classList.add('active');
    opt.addEventListener('click',function(e){
        var lang = this.dataset.lang;
        if(lang === SITE_LANG){ e.preventDefault(); langMenu.classList.remove('open'); return; }
        // 切换前先淡出，避免视觉跳变（完整页面跳转体验更平滑）
        safeStorage.set('siteLang', lang);
        try { document.body.classList.add('lang-fading'); } catch(_){}
        // 浏览器已知道我们要导航（href），直接放行默认行为
    });
});
// 首次访问按浏览器语言引导到对应语种站（仅提示，不强制跳转，避免谷歌判定 cloaking）
(function suggestLang(){
    try{
        if(safeStorage.get('langSuggested')) return;
        var nav = (navigator.language || 'en').toLowerCase();
        var target = nav.indexOf('zh')===0 ? 'zh' : 'en';
        if(target === SITE_LANG) return;
        safeStorage.set('langSuggested','1');
        var bar = document.createElement('div');
        bar.className = 'lang-suggest';
        bar.innerHTML = '<span>🌐 This site is also available in your language.</span>'+
            '<a href="'+LANG_PATH[target]+'">Switch</a><span class="ls-close">✕</span>';
        document.body.appendChild(bar);
        bar.querySelector('.ls-close').addEventListener('click',function(){ bar.remove(); });
        setTimeout(function(){ if(bar.parentNode) bar.remove(); }, 12000);
    }catch(e){}
})();

// ===================== 主题切换 =====================
var themeSwitch = document.getElementById('themeSwitch');
(function applySavedTheme(){
    var t = safeStorage.get('nex-theme') || safeStorage.get('theme');
    if(t==='dark'){ htmlDom.dataset.theme='dark'; }
    else if(t==='light'){ htmlDom.dataset.theme='light'; }
    else {
        try{
            var s = safeStorage.get('theme')||'system';
            if(s==='system'){ htmlDom.dataset.theme = window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'; }
            else { htmlDom.dataset.theme = s; }
        }catch(e){}
    }
})();
themeSwitch.addEventListener('click',function(){
    var cur = htmlDom.dataset.theme;
    var next = cur==='light'?'dark':'light';
    htmlDom.dataset.theme = next;
    safeStorage.set('nex-theme', next);
    safeStorage.set('theme', next);
    if(typeof initParticle === 'function') initParticle();
});

// ===================== 收藏（字段预留：favCount / viewCount 后续可接入统计）=====================
var FAV_KEY='favTools';
function getFav(){ return safeStorage.getJSON(FAV_KEY) || []; }
function setFav(a){ safeStorage.setJSON(FAV_KEY, a); }
function updateFavBadge(){
    var n=getFav().length,b=document.getElementById('favBadge');
    if(n>0){b.style.display='inline-block';b.textContent=n;}else{b.style.display='none';}
}
function renderFavPanel(){
    var list=document.getElementById('favList'), fav=getFav();
    if(!fav.length){list.innerHTML='<div class="fav-empty">'+(isZh()?lbl('noFav'):lbl('noFav'))+'</div>';return;}
    list.innerHTML='';
    fav.forEach(function(slug){
        var DATA=window.TOOLS_DATA||[];
        var t=DATA.find(function(x){return x.slug===slug;}); if(!t)return;
        var a=document.createElement('a'); a.href=slug;
        a.innerHTML='<span>🔧</span><span>'+(LANG==='en'?t.en:t.zh)+'</span>';
        list.appendChild(a);
    });
}
document.getElementById('favBtn').addEventListener('click',function(e){
    e.stopPropagation(); var p=document.getElementById('favPanel'); p.classList.toggle('open'); renderFavPanel();
});
document.addEventListener('click',function(e){
    var p=document.getElementById('favPanel');
    if(p.classList.contains('open')&&!p.contains(e.target)&&e.target.id!=='favBtn') p.classList.remove('open');
});

// ===================== 粒子背景 =====================
var canvas = document.getElementById('nebula-particles');
var ctx = null;
try{ ctx = canvas.getContext('2d'); }catch(e){ ctx = null; }
var w,h,particles=[];

/* ---------- 设备能力分级：海外大量低配安卓 / 弱网，粒子必须自动降级 ---------- */
var DEVICE_TIER = (function(){
    try{
        if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 0; // 关闭动画
        var conn = navigator.connection || {};
        if(conn.saveData) return 0;                                   // 用户开了省流量
        if(conn.effectiveType && /2g/.test(conn.effectiveType)) return 0;
        var mem = navigator.deviceMemory || 4;
        var cpu = navigator.hardwareConcurrency || 4;
        if(mem <= 2 || cpu <= 2) return 1;                            // 低配：极少粒子
        if(mem <= 4 || cpu <= 4) return 2;                            // 中配
        return 3;                                                     // 高配
    }catch(e){ return 2; }
})();
function calcParticleNum(){
    if(DEVICE_TIER === 0) return 0;
    var base = window.innerWidth < 768 ? 26 : 70;
    if(DEVICE_TIER === 1) return Math.round(base * 0.25);
    if(DEVICE_TIER === 2) return Math.round(base * 0.6);
    return base;
}
var particleNum = calcParticleNum();
var particleRunning = true;
function resizeCanvas(){
    // 低配设备用 0.75 倍分辨率渲染，像素量降 44%，肉眼几乎无差别
    var dpr = DEVICE_TIER >= 3 ? 1 : 0.75;
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    if(ctx) ctx.setTransform(dpr,0,0,dpr,0,0);
}
if(ctx){
    resizeCanvas();
    var _rsTimer=null;
    window.addEventListener('resize',function(){
        clearTimeout(_rsTimer);
        _rsTimer=setTimeout(function(){ resizeCanvas(); particleNum=calcParticleNum(); initParticle(); }, 200);
    });
}

class Particle {
    constructor(){
        this.x=Math.random()*w; this.y=Math.random()*h;
        this.r=Math.random()*2+0.6;
        this.speedX=Math.random()*0.4-0.2; this.speedY=Math.random()*0.4-0.2;
        // 暗色模式降低亮度，避免夜间刺眼
        this.color = htmlDom.dataset.theme==='light'
            ? 'rgba(22,199,178,0.45)' : 'rgba(157,124,242,0.28)';
    }
    update(){ this.x+=this.speedX; this.y+=this.speedY; if(this.x<0||this.x>w)this.speedX*=-1; if(this.y<0||this.y>h)this.speedY*=-1; }
    draw(){ ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fillStyle=this.color; ctx.fill(); }
}
function initParticle(){
    if(!ctx) return;
    particles=[]; for(var i=0;i<particleNum;i++) particles.push(new Particle());
}
function animate(){
    if(!particleRunning || !ctx || !particles.length) return;
    ctx.clearRect(0,0,w,h);
    particles.forEach(function(p){ p.update(); p.draw(); });
    requestAnimationFrame(animate);
}
/* 粒子画布低优先级启动：先让文字资源渲染完，再画背景（保护 LCP / FCP）*/
if(ctx && DEVICE_TIER > 0){
    var startParticles = function(){ initParticle(); animate(); };
    if(window.requestIdleCallback) requestIdleCallback(startParticles, { timeout: 2000 });
    else setTimeout(startParticles, 800);
} else if(canvas){
    canvas.style.display = 'none';   // 低端设备 / 省流量 / 减少动效：直接不渲染
}
// 页面切后台时暂停渲染，省电省 CPU
document.addEventListener('visibilitychange', function(){
    if(document.hidden){ particleRunning = false; }
    else if(!particleRunning){ particleRunning = true; animate(); }
});

// ===================== 回到顶部（滚动监听节流）=====================
var backTopBtn=document.getElementById('backTop');
var _scrollTicking=false;
window.addEventListener('scroll',function(){
    if(_scrollTicking) return;
    _scrollTicking=true;
    window.requestAnimationFrame(function(){
        backTopBtn.style.opacity = window.scrollY>300 ? '1' : '0';
        _scrollTicking=false;
    });
}, {passive:true});
backTopBtn.addEventListener('click',function(){ window.scrollTo({top:0,behavior:'smooth'}); });

// ===================== Cookie 同意（GDPR / ePrivacy 多语言）=====================
const COOKIE_I18N = {
    zh:{t:'🍪 Cookie 使用提示', b:'我们使用 Cookie 记住您的偏好（如语言与主题）。仅在您明确同意后，才会启用广告类 Cookie。您的工具数据始终只保存在本地浏览器，不会上传服务器。', a:'同意', r:'仅必要 Cookie', p:'隐私政策'},
    en:{t:'🍪 Cookie Notice', b:'We use cookies to remember your preferences (language & theme). Advertising cookies are enabled only with your explicit consent. All data you process with our tools stays in your browser and is never uploaded.', a:'Accept all', r:'Essential only', p:'Privacy Policy'},
};
(function(){
    var box=document.getElementById('cookieBox'); if(!box) return;
    var T = COOKIE_I18N[SITE_LANG] || COOKIE_I18N.en;
    document.getElementById('ckTitle').textContent = T.t;
    document.getElementById('ckBody').innerHTML = T.b + ' <a href="/privacy" style="color:var(--nebula-cyan);">'+T.p+'</a>';
    document.getElementById('cookieAccept').textContent = T.a;
    document.getElementById('cookieReject').textContent = T.r;
    if(!safeStorage.get('cookieConsent')) box.style.display='block';
    function decide(v){
        safeStorage.set('cookieConsent', v);
        box.style.display='none';
        // Google Consent Mode v2：拒绝时明确关闭广告与分析信号（欧盟强制）
        try{
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            gtag('consent','update',{
                ad_storage: v==='accept'?'granted':'denied',
                ad_user_data: v==='accept'?'granted':'denied',
                ad_personalization: v==='accept'?'granted':'denied',
                analytics_storage: v==='accept'?'granted':'denied'
            });
        }catch(e){}
    }
    document.getElementById('cookieAccept').onclick=function(){ decide('accept'); };
    document.getElementById('cookieReject').onclick=function(){ decide('reject'); };
})();

// ===================== RTL 右向布局（阿拉伯 / 波斯 / 希伯来 / 乌尔都）=====================
(function(){
    if(!IS_RTL) return;
    htmlDom.setAttribute('dir','rtl');
    htmlDom.classList.add('rtl');
    // 逻辑属性无法覆盖的少量内联样式在此翻转
    document.addEventListener('DOMContentLoaded', function(){
        document.querySelectorAll('.card-badge, .license-badge').forEach(function(el){
            el.style.right = 'auto'; el.style.left = '12px';
        });
    });
})();

// ===================== 全局筛选（免费/商用、明暗、静态/后端）=====================
var filterState = { license:'all', style:'all', arch:'all' };
function applyFilter(list, kind){
    if(kind!=='tool' && kind!=='theme' && kind!=='source') return (list||[]).slice();
    return (list||[]).filter(function(it){
        var lic = licenseOf(it, kind), stl = styleOf(it, kind), ar = archOf(it, kind);
        if(filterState.license!=='all' && lic!==filterState.license) return false;
        if(filterState.style!=='all' && stl!==filterState.style) return false;
        if(filterState.arch!=='all' && ar!==filterState.arch) return false;
        return true;
    });
}

// ===================== 最近浏览（本地存储）=====================
var RECENT_KEY='recentBrowse';
function getRecent(){ return safeStorage.getJSON(RECENT_KEY) || []; }
function recordRecent(item, kind){
    var list = getRecent();
    var key = kind==='tool' ? item.slug : (kind+':'+item.idx);
    list = list.filter(function(r){ return r.key!==key; });
    list.unshift({ key:key, kind:kind, zh:item.zh, en:item.en, slug:item.slug });
    if(list.length>12) list = list.slice(0,12);
    safeStorage.setJSON(RECENT_KEY, list);
}
function renderRecent(){
    var box=document.getElementById('recentList'), list=getRecent();
    if(!list.length){ box.innerHTML='<div class="recent-empty">'+(isZh()?lbl('noHistory'):lbl('noHistory'))+'</div>'; return; }
    box.innerHTML='';
    list.forEach(function(r){
        var a=document.createElement('a');
        if(r.kind==='tool' && r.slug) a.href=toolUrl(r.slug);
        var ricon = r.kind==='article' ? '📝' : (r.kind==='tutorial' ? '📖' : '🔧');
        a.innerHTML='<span>'+ricon+'</span><span>'+(LANG==='en'?r.en:r.zh)+'</span>';
        if(!(r.kind==='tool'&&r.slug)){
            a.addEventListener('click',function(e){
                e.preventDefault();
                if(r.kind==='article'){ var art=_blogArtMap[r.key.slice('article:'.length)] || BLOG_ARTICLES[Number(r.key.split(':')[1])]; if(art) openArticleNewTab(art); }
                else if(r.kind==='tutorial'){ var it=SOURCE_DATA[Number(r.key.split(':')[1])]; if(it) openPreviewNewTab('source', it); }
                else if(r.kind!=='tool'){ openModal(r.kind, Number(r.key.split(':')[1])); }
            });
        }
        box.appendChild(a);
    });
}

// ===================== 热门搜索 + 搜索历史 =====================
// 热门搜索词按语种切换：英文使用海外用户真实搜索长尾词（低竞争、高转化）
var HOT_WORDS_MAP = {
    zh: ['JSON格式化','图片压缩','PDF转换','年龄计算器','代码美化','二维码生成','时间戳转换','MD5','视频转GIF','单位换算'],
    en: ['json formatter','image compressor','pdf converter','qr code generator','base64 decode',
         'timestamp converter','video to gif','md5 hash','unit converter','css minifier'],
};
function getHotWords(){
    return HOT_WORDS_MAP[SITE_LANG] || HOT_WORDS_MAP.en;
}

// ── UI 标签多语言词典（用于动态渲染的界面文字）──
var UI_LABELS = {
    zh: { hot: '热门', history: '历史', clear: '清空', allTools: '全部工具', onlineTools: '在线工具',
          others: '其他工具', views: '浏览量', downloads: '下载量',
          freePrefix: '免费在线', freeSuffix: '，即开即用', enFreePrefix: 'Free online ', enFreeSuffix: '. Instant use in browser.',
          noResources: '该分类暂无资源', noMatch: '未找到相关资源', noFav: '还没有收藏工具',
          noHistory: '暂无浏览记录', noRelated: '暂无相关资源', toolsList: '在线工具列表',
          validEmail: '请输入有效邮箱', subOk: '✅ 订阅成功，更新将发送至 ', subOkEn: '✅ Subscribed! Updates will go to ',
          shareCopied: '🔗 分享链接已复制', shareCopiedEn: '🔗 Share link copied',
          dlText: '下载中...', dlTextEn: 'Downloading...', cmdCopied: '✅ 命令已复制', cmdCopiedEn: '✅ Commands copied',
          discordCopy: '✅ 已复制，可直接粘贴到 Discord', discordCopyEn: '✅ Copied — paste into Discord',
          mdCopy: '✅ Markdown 链接已复制', mdCopyEn: '✅ Markdown link copied' },
    en: { hot: 'Hot', history: 'History', clear: 'Clear', allTools: 'All Tools', onlineTools: 'Online Tools',
          others: 'Others', views: 'views', downloads: 'downloads',
          freePrefix: 'Free online ', freeSuffix: '. Instant use in browser.', enFreePrefix: 'Free online ', enFreeSuffix: '. Instant use in browser.',
          noResources: 'No resources in this category', noMatch: 'No matching resources', noFav: 'No favorites yet',
          noHistory: 'No history', noRelated: 'No related', toolsList: 'Online Tools',
          validEmail: 'Enter a valid email', subOk: '✅ Subscribed! Updates will go to ', subOkEn: '✅ Subscribed! Updates will go to ',
          shareCopied: '🔗 Share link copied', shareCopiedEn: '🔗 Share link copied',
          dlText: 'Downloading...', dlTextEn: 'Downloading...', cmdCopied: '✅ Commands copied', cmdCopiedEn: '✅ Commands copied',
          discordCopy: '✅ Copied — paste into Discord', discordCopyEn: '✅ Copied — paste into Discord',
          mdCopy: '✅ Markdown link copied', mdCopyEn: '✅ Markdown link copied' },
};
function lbl(key){ return (UI_LABELS[SITE_LANG] || UI_LABELS.en)[key] || UI_LABELS.en[key] || key; }

var SEARCH_HIST_KEY='searchHistory';
function getSearchHist(){ return safeStorage.getJSON(SEARCH_HIST_KEY) || []; }
function pushSearchHist(kw){ kw=(kw||'').trim(); if(!kw) return; var h=getSearchHist().filter(function(x){return x!==kw;}); h.unshift(kw); if(h.length>8) h=h.slice(0,8); safeStorage.setJSON(SEARCH_HIST_KEY,h); }
function renderHotSearch(){
    var box=document.getElementById('hotSearch'); if(!box) return;
    var hist=getSearchHist();
    var html='<span class="hs-label">🔥 '+lbl('hot')+':</span>';
    getHotWords().slice(0,6).forEach(function(w){ html+='<span class="hs-chip" data-kw="'+w+'">'+w+'</span>'; });
    if(hist.length){
        html+='<span class="hs-label" style="margin-left:8px;">🕘 '+lbl('history')+':</span>';
        hist.slice(0,5).forEach(function(w){ html+='<span class="hs-chip history" data-kw="'+w+'">'+w+'</span>'; });
        html+='<span class="hs-clear" id="hsClear">'+lbl('clear')+'</span>';
    }
    box.innerHTML=html;
    box.querySelectorAll('.hs-chip').forEach(function(c){ c.addEventListener('click',function(){ searchInput.value=this.dataset.kw; searchInput.dispatchEvent(new Event('input')); searchInput.focus(); pushSearchHist(this.dataset.kw); }); });
    var clr=document.getElementById('hsClear'); if(clr) clr.addEventListener('click',function(e){ e.stopPropagation(); safeStorage.setJSON(SEARCH_HIST_KEY,[]); renderHotSearch(); });
}

// ===================== 顶部更新公告 =====================
// 更新公告：日期使用 ISO，展示时按访客本地时区 + 本地化格式（不出现「北京时间」）
var ANNOUNCE=[
    {date:'2026-07-31', zh:'🆕 新增 12 款图片与音频处理工具', en:'🆕 12 new image & audio tools released'},
    {date:'2026-07-24', zh:'🎨 上线「星云渐变」系列网站主题模板', en:'🎨 New "Nebula Gradient" website template series'},
    {date:'2026-07-17', zh:'💻 开源「无数据库静态博客」源码，免费下载', en:'💻 Open-sourced: database-free static blog (MIT)'},
    {date:'2026-07-10', zh:'⚡ 全站提速：粒子动画后台自动暂停', en:'⚡ Faster site: particle canvas auto-pauses in background'}
];
function renderAnnouncements(){
    var track=document.getElementById('announceTrack'); if(!track) return;
    var html='';
    ANNOUNCE.forEach(function(a){
        var label = isZh() ? a.zh : a.en;
        html+='<span><span class="dot">●</span> <time datetime="'+a.date+'">'+formatDateLocal(a.date)+'</time> '+label+'</span>';
    });
    track.innerHTML = html + html; // 复制一份实现无缝滚动
}

// ===================== 分类跳转（SEO 锚点 / 标签聚合）=====================
function goCategory(main, sub){
    if(!MAIN_CONFIG[main]) return;
    activeMain=main; activeSub=sub||'all'; saveNavState();
    renderMainNav(); renderSubTags(); renderAll();
}
/* 标签聚合：指向真实静态聚合页（每个二级分类一个独立可收录 URL → 捕获精准长尾搜索）
   工具类沿用既有 <cat>-tools.html（站内已有大量内链与收录，各语种镜像均存在，
   不另建 /c/tool-* 以免重复内容分散权重）；模板 / 源码类为新增聚合页，走 /c/。*/
const CAT_PAGE_LANGS = ['zh','en'];   // 已生成 theme / source 聚合页的语种
function catPageUrl(main, tag){
    if(main === 'tool'){
        return LANG_PREFIX + tag + '-tools';
    }
    if(CAT_PAGE_LANGS.indexOf(SITE_LANG) === -1) return null;
    var prefix = SITE_LANG === 'en' ? '/c/' : '/zh/c/';
    return prefix + main + '-' + tag;
}
function renderTagAgg(){
    var box=document.getElementById('tagAggList'); if(!box) return; var html='';
    MAIN_KEYS.forEach(function(mk){
        MAIN_CONFIG[mk].tags.forEach(function(t){
            if(t.key==='all') return;
            var label=isZh()?t.zh:t.en;
            var url = catPageUrl(mk, t.key);
            html += url
                ? '<a href="'+url+'" title="'+label+'">'+label+'</a>'
                : '<a href="#cat-'+mk+'" data-jump="'+mk+'" data-sub="'+t.key+'">'+label+'</a>';
        });
    });
    box.innerHTML=html;
}

// ===================== 相关资源推荐 =====================
function renderRelated(){
    var box=document.getElementById('relatedGrid'); if(!box) return;
    var list = applyFilter(getActiveList(), activeMain).slice(0,6);
    box.innerHTML='';
    if(!list.length){ box.innerHTML='<div class="empty-state" style="padding:20px;">'+(isZh()?lbl('noRelated'):lbl('noRelated'))+'</div>'; return; }
    list.forEach(function(it){ box.appendChild(makeCard(it, activeMain)); });
}

// ===================== 动态结构化数据（当前栏目工具列表）=====================
function injectToolJsonLd(){
    try{
        var list = activeMain==='tool'
            ? (activeSub==='all' ? (window.TOOLS_DATA||[]) : (window.TOOLS_DATA||[]).filter(function(t){ return t.cat===activeSub; }))
            : [];
        if(!list.length) return;
        var items = list.slice(0,20).map(function(t,i){
            return { '@type':'ListItem','position':i+1,'item':{
                '@type':'SoftwareApplication','name':(isZh()?t.zh:(t.en||t.zh)),
                'applicationCategory':'UtilitiesApplication','operatingSystem':'Web',
                'url':'https://72tool.com/'+(t.slug||'')
            }};
        });
        var data={ '@context':'https://schema.org','@type':'ItemList','name':lbl('toolsList'),'itemListElement':items };
        var s=document.getElementById('dyn-jsonld'); if(s) s.remove();
        s=document.createElement('script'); s.type='application/ld+json'; s.id='dyn-jsonld'; s.textContent=JSON.stringify(data);
        document.head.appendChild(s);
    }catch(e){}
}

// ===================== sitemap 生成已迁移至构建期 =====================
// 原浏览器端 window.buildSitemapXML 已移除：它输出的 /c/tool-*.html 已下线
// （工具品类以 *-tools.html 为权威页），且无法覆盖 en/jp/es 镜像的 1480 个工具页。
// 现由 Node 脚本 _build/build-sitemap.cjs 统一生成：
//   sitemap.xml(索引) + sitemap-pages / -categories / -tools / -resources.xml

// ===================== 点击「数据-jump」锚点：切换分类并滚动 =====================
document.addEventListener('click',function(e){
    var j = e.target.closest ? e.target.closest('[data-jump]') : null;
    if(j){ e.preventDefault(); goCategory(j.dataset.jump, j.dataset.sub); var m=document.getElementById('main'); if(m) window.scrollTo({top:m.offsetTop-90, behavior:'smooth'}); }
});

// ===================== 汉堡菜单（移动端）=====================
var navHam=document.getElementById('navHamburger');
if(navHam){
    navHam.addEventListener('click',function(e){ e.stopPropagation(); var n=document.getElementById('mainNav'); var open=n.classList.toggle('open'); this.setAttribute('aria-expanded',open?'true':'false'); });
    document.addEventListener('click',function(e){ var n=document.getElementById('mainNav'); if(n.classList.contains('open')&&!n.contains(e.target)&&e.target.id!=='navHamburger') n.classList.remove('open'); });
}

// ===================== 最近浏览面板 =====================
var recentBtn=document.getElementById('recentBtn');
if(recentBtn){
    recentBtn.addEventListener('click',function(e){ e.stopPropagation(); var p=document.getElementById('recentPanel'); p.classList.toggle('open'); renderRecent(); });
    document.addEventListener('click',function(e){ var p=document.getElementById('recentPanel'); if(p.classList.contains('open')&&!p.contains(e.target)&&e.target.id!=='recentBtn') p.classList.remove('open'); });
    document.getElementById('recentClear').addEventListener('click',function(e){ e.stopPropagation(); safeStorage.setJSON(RECENT_KEY,[]); renderRecent(); });
}

// ===================== 全局筛选面板 =====================
var filterFab=document.getElementById('filterFab');
if(filterFab){
    filterFab.addEventListener('click',function(e){ e.stopPropagation(); document.getElementById('filterPanel').classList.toggle('open'); });
    document.addEventListener('click',function(e){ var p=document.getElementById('filterPanel'); if(p.classList.contains('open')&&!p.contains(e.target)&&e.target.id!=='filterFab') p.classList.remove('open'); });
    document.querySelectorAll('.filter-opt').forEach(function(o){
        o.addEventListener('click',function(){
            var key=this.dataset.fkey; filterState[key]=this.dataset.fval;
            document.querySelectorAll('.filter-opt[data-fkey="'+key+'"]').forEach(function(x){ x.classList.remove('active'); });
            this.classList.add('active'); renderAll();
        });
    });
    document.getElementById('filterReset').addEventListener('click',function(){
        filterState={license:'all',style:'all',arch:'all'};
        document.querySelectorAll('.filter-opt').forEach(function(x){ x.classList.toggle('active', x.dataset.fval==='all'); });
        renderAll();
    });
}

// ===================== 订阅 + 分享复制 =====================
var subBtn=document.getElementById('subBtn');
if(subBtn){
    subBtn.addEventListener('click',function(){
        var email=document.getElementById('subEmail').value.trim();
        var msg=document.getElementById('subMsg');
        if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ msg.textContent = lbl('validEmail'); return; }
        safeStorage.set('subEmail', email);
        msg.textContent = (isZh()?lbl('subOk'):lbl('subOkEn'))+email;
        document.getElementById('subEmail').value='';
    });
    document.getElementById('shareCopy').addEventListener('click',function(){
        var url=location.origin+location.pathname+'?lang='+(isZh()?'zh':LANG);
        var msg=document.getElementById('subMsg');
        if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(url).then(function(){ msg.textContent=isZh()?'🔗 分享链接已复制':'🔗 Share link copied'; }); }
        else { location.href=url; }
    });
}

// ===================== 深链定位（供 /c/ 聚合页回跳）=====================
/* 支持 /?main=tool&sub=img 与 /#tool-img 两种写法：
   聚合页 → 工具箱首页时自动切到对应主分类 + 子标签，避免用户落地后还要手点。*/
function applyDeepLink(){
    var main='', sub='';
    try{
        var qs = location.search || '';
        var mMain = qs.match(/[?&]main=([a-z]+)/i);
        var mSub  = qs.match(/[?&]sub=([a-z0-9_-]+)/i);
        if(mMain) main = mMain[1].toLowerCase();
        if(mSub)  sub  = mSub[1].toLowerCase();
        if(!main){
            var h = (location.hash||'').replace(/^#/,'');
            var parts = h.split('-');
            if(parts.length>=2 && MAIN_KEYS.indexOf(parts[0])>-1){ main=parts[0]; sub=parts.slice(1).join('-'); }
            else if(MAIN_KEYS.indexOf(h)>-1){ main=h; }
        }
    }catch(e){ return; }
    if(MAIN_KEYS.indexOf(main)===-1) return;
    activeMain = main;
    var ok = false;
    MAIN_CONFIG[main].tags.forEach(function(t){ if(t.key===sub) ok=true; });
    activeSub = ok ? sub : 'all';
}
applyDeepLink();

// ===================== 初始化 =====================
renderAnnouncements();
renderHotSearch();
renderTagAgg();
renderRecent();
renderMainNav();
renderSubTags();
renderAll();
updateFavBadge();

// 监听语言切换：i18n-runtime.js 派发 i18n:langchange 时重新渲染动态内容
//（静态 span 已由 i18n-runtime.js 切换，但侧栏/标签/卡片/热门搜索/公告是 JS 动态生成，需重新渲染）
document.addEventListener('i18n:langchange', function(e){
    var newLang = (e.detail && e.detail.lang) || 'zh';
    var targetLang = (newLang === 'zh') ? 'zh' : 'en';
    if(targetLang !== LANG){
        LANG = targetLang;
        renderMainNav();
        renderAnnouncements();
        renderHotSearch();
        renderTagAgg();
        renderRecent();
        renderSubTags();
        renderAll();
        updateFavBadge();
    }
});

// IndexNow
})();
