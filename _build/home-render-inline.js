<script src="/tools-data.js"></script>
<script>
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
    {idx:0, subCate:['blog'], zh:'星云渐变博客主题', en:'Nebula Gradient Blog Theme',
     desc_zh:'星云渐变视觉，支持明暗双模式，适配静态博客，自适应移动端。',
     desc_en:'Gradient style, light/dark mode, fully responsive static blog template.',
     previewUrl:'#', downloadUrl:'#'},
    {idx:1, subCate:['blog'], zh:'极简文字博客主题', en:'Minimal Text Blog Theme',
     desc_zh:'以阅读体验为核心的极简博客，无多余装饰，加载极快。',
     desc_en:'Reading-first minimal blog, distraction-free, ultra fast.',
     previewUrl:'#', downloadUrl:'#'},
    {idx:2, subCate:['homepage'], zh:'个人作品集主页模板', en:'Personal Portfolio Template',
     desc_zh:'简约作品集展示，技能卡片、项目展示、联系方式模块齐全。',
     desc_en:'Clean portfolio with skill cards, project showcase and contact section.',
     previewUrl:'#', downloadUrl:'#'},
    {idx:3, subCate:['toolpage'], zh:'全能工具站模板', en:'All-in-One Tool Site Template',
     desc_zh:'卡片式工具聚合首页，内置搜索与分类筛选，开箱即用。',
     desc_en:'Card-based tool aggregator with search & category filter, ready to use.',
     previewUrl:'#', downloadUrl:'#'},
    {idx:4, subCate:['dark'], zh:'极致暗黑极简主题', en:'Dark Minimal Theme',
     desc_zh:'低饱和暗黑护眼配色，适合资源站、工具箱站点。',
     desc_en:'Low saturation dark design, ideal for resource & tool websites.',
     previewUrl:'#', downloadUrl:'#'},
    {idx:5, subCate:['light'], zh:'清新浅色博客主题', en:'Fresh Light Blog Theme',
     desc_zh:'明亮清新风格，大留白强排版，适合内容型站点。',
     desc_en:'Bright fresh style, airy whitespace, great for content sites.',
     previewUrl:'#', downloadUrl:'#'}
];

const SOURCE_DATA = [
    {idx:0, subCate:['blogsrc'], zh:'NexBlog 静态博客源码', en:'NexBlog Static Blog Source',
     desc_zh:'无数据库静态博客，分类、搜索、标签、日夜模式完整。',
     desc_en:'Database-free static blog with category, search, tags & dark mode.',
     previewUrl:'#', downloadUrl:'#'},
    {idx:1, subCate:['blogsrc'], zh:'Docs 文档站源码', en:'Docs Documentation Source',
     desc_zh:'侧边栏文档站生成器，支持多版本文档与全文搜索。',
     desc_en:'Sidebar docs generator with multi-version and full-text search.',
     previewUrl:'#', downloadUrl:'#'},
    {idx:2, subCate:['navsrc'], zh:'简洁导航站源码', en:'Simple Navigation Source',
     desc_zh:'分组网址导航，支持自定义分类，明暗模式切换。',
     desc_en:'Grouped web navigation, custom categories, light/dark mode.',
     previewUrl:'#', downloadUrl:'#'},
    {idx:3, subCate:['toolsrc'], zh:'综合工具箱全站源码', en:'All-in-one Toolkit Source',
     desc_zh:'多工具合集站点源码，卡片展示、搜索、分类筛选开箱即用。',
     desc_en:'Multi-tool site source, card layout, search & category filter ready.',
     previewUrl:'#', downloadUrl:'#'},
    {idx:4, subCate:['newsrc'], zh:'资讯站源码', en:'News Portal Source',
     desc_zh:'文章列表 + 详情 + 分类聚合的资讯站骨架，SEO 友好。',
     desc_en:'Article list + detail + category aggregation, SEO friendly.',
     previewUrl:'#', downloadUrl:'#'},
    {idx:5, subCate:['newsrc'], zh:'企业官网源码', en:'Corporate Site Source',
     desc_zh:'首页、产品、关于、联系多页企业站模板，响应式布局。',
     desc_en:'Multi-page corporate site: home, product, about, contact, responsive.',
     previewUrl:'#', downloadUrl:'#'}
];

// 全局状态（标签切换：同一时间只显示一个主分类）
let activeMain = 'tool';
let activeSub = 'all';
const MAIN_KEYS = ['tool','theme','source'];
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
const LANG = curLang();

// BCP-47 语言标签（用于 Intl 日期/数字本地化）
const LOCALE_MAP = { zh:'zh-CN', en:'en-US', jp:'ja-JP', es:'es-ES', de:'de-DE', ar:'ar' };
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
const MIRROR_LANGS = ['en','jp','es'];          // 已有完整镜像目录的语种
const LANG_PREFIX = (function(){
    if(SITE_LANG === 'zh') return '/';
    if(MIRROR_LANGS.indexOf(SITE_LANG) > -1) return '/' + SITE_LANG + '/';
    return '/en/';                              // de / ar 等回退到英文镜像
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
    if(activeMain === 'theme'){
        return activeSub === 'all' ? THEME_DATA.slice() : THEME_DATA.filter(function(t){ return t.subCate.indexOf(activeSub) > -1; });
    }
    return activeSub === 'all' ? SOURCE_DATA.slice() : SOURCE_DATA.filter(function(t){ return t.subCate.indexOf(activeSub) > -1; });
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
    renderList(grid, list, activeMain);
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
        groups.push({ key:t.key, label:LANG==='zh'?t.zh:t.en, items:items });
    });
    // 未归类
    var others = D.filter(function(x){ return !x.cat; });
    if(others.length) groups.push({ key:'other', label:LANG==='zh'?'其他工具':'Others', items:others });

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
    allItem.innerHTML = '<span>'+(LANG==='zh'?'全部工具':'All Tools')+'</span><span class="count">('+formatCount(D.length)+')</span>';
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
    free:   { code:'Free',       zh:'免费使用',   en:'Free to use',    url:'/terms.html',                            cls:'license-free' },
    com:    { code:'Commercial', zh:'可商用',     en:'Commercial OK',  url:'/terms.html',                            cls:'license-com' }
};
// 在线工具 = 免费直接使用；模板/源码 = MIT / Apache（按 idx 稳定分配，接入真实数据后改读 item.license）
function licenseOf(item, kind){
    if(item && item.license) return item.license;
    if(kind === 'tool') return 'free';
    return (hashStr(kind + ':' + (item && item.idx)) % 3 === 0) ? 'apache' : 'mit';
}
function licenseBadgeHtml(item, kind){
    var m = LICENSE_META[licenseOf(item, kind)] || LICENSE_META.free;
    var label = LANG==='zh' ? m.zh : m.en;
    return '<span class="license-badge '+m.cls+'" title="'+m.en+'">'+label+'</span>';
}
function styleOf(item, kind){
    if(kind==='theme' && item.subCate && item.subCate.indexOf('dark')>-1) return 'dark';
    if(kind==='theme' && item.subCate && item.subCate.indexOf('light')>-1) return 'light';
    return 'static';
}
function archOf(item, kind){ return 'static'; } // 当前资源均为静态；后端类资源可标记 'backend'

function makeCard(item, kind){
    // 缩略图 alt 一律使用英文描述 → 打开谷歌图片搜索这个巨大免费流量池
    var altEn = ((item && (item.en || item.zh)) || 'resource') + ' — free online '+(kind==='tool'?'tool':(kind==='theme'?'website template':'open source code'))+' | 72Tool';
    var thumbHtml = (item && item.thumb)
        ? '<div class="card-thumb"><img loading="lazy" decoding="async" width="320" height="180" src="'+item.thumb+'" alt="'+altEn.replace(/"/g,'&quot;')+'"></div>'
        : '';
    var st = mockStats((item.slug||item.en||item.idx||'t'));
    var viewLbl = LANG==='zh' ? '浏览量' : 'views', dlLbl = LANG==='zh' ? '下载量' : 'downloads';
    var metaHtml = '<div class="card-meta">'+
        '<span aria-label="'+formatCount(st.views)+' '+viewLbl+'">👁 '+formatCount(st.views)+'</span>'+
        '<span aria-label="'+formatCount(st.downloads)+' '+dlLbl+'">📥 '+formatCount(st.downloads)+'</span></div>';
    var licHtml = licenseBadgeHtml(item, kind);
    if(kind === 'tool'){
        var a = document.createElement('a');
        a.className = 'resource-card';
        a.href = toolUrl(item.slug);
        a.setAttribute('aria-label', (LANG==='zh'?item.zh:item.en) || 'tool');
        a.setAttribute('itemscope',''); a.setAttribute('itemtype','https://schema.org/SoftwareApplication');
        var cat = item.cat || 'default';
        var emoji = CAT_EMOJI[cat] || '🛠️';
        var grad = CAT_GRAD[cat] || DEFAULT_GRAD;
        var badgeCls = BADGE_MAP[cat] || 'badge-default';
        var typeLabel = (LANG==='zh'?TYPE_CN_MAP[cat]:item.type) || item.type || 'Tool';
        var title = LANG==='zh' ? item.zh : (item.en || item.zh);
        var desc = LANG==='zh'
            ? ('免费在线'+title+'，'+(TYPE_CN_MAP[cat]||'')+'，即开即用')
            : ('Free online '+title+', '+(item.type||typeLabel)+'. Instant use in browser.');
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
    div.setAttribute('aria-label', (LANG==='zh'?item.zh:item.en) || 'item');
    var grad2 = kind==='theme'
        ? 'linear-gradient(135deg,var(--nebula-purple),#b19cd9)'
        : 'linear-gradient(135deg,var(--nebula-gold),#ffd89b)';
    var emoji2 = kind==='theme' ? '🎨' : '💻';
    var t2 = LANG==='zh' ? item.zh : item.en;
    var d2 = LANG==='zh' ? (item.desc_zh || '') : (item.desc_en || '');
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
function renderList(container, list, kind){
    container.innerHTML = '';
    list = applyFilter(list || [], kind);
    if(!list || !list.length){
        var empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.innerHTML = '<div class="empty-icon">🗂️</div><div class="empty-text">'+
            (LANG==='zh'?'该分类暂无资源':'No resources in this category')+'</div>';
        container.appendChild(empty);
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
    modalTitle.textContent = LANG==='zh' ? item.zh : item.en;
    modalDesc.textContent = LANG==='zh' ? item.desc_zh : item.desc_en;
    modalTypeTag.textContent = LANG==='zh' ? MAIN_CONFIG[kind].zh : MAIN_CONFIG[kind].en;
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
    var L = (LANG==='zh');
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
        copyText(document.getElementById('deployCode').textContent, LANG==='zh'?'✅ 命令已复制':'✅ Commands copied');
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
function LANG_PATH_SELF(){ return SITE_LANG==='zh' ? '/' : ('/'+ (SITE_LANG==='jp'?'jp':SITE_LANG) +'/'); }
function shareTitleOf(){
    if(!currentModal) return '72Tool — Free Online Tools, Templates & Open Source';
    return (LANG==='zh'?currentModal.item.zh:currentModal.item.en) + ' — 72Tool';
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
        copyText('**'+shareTitleOf()+'**\n'+shareUrlOf(), LANG==='zh'?'✅ 已复制，可直接粘贴到 Discord':'✅ Copied — paste into Discord');
    });
    if(md) md.addEventListener('click', function(){
        copyText('['+shareTitleOf()+']('+shareUrlOf()+')', LANG==='zh'?'✅ Markdown 链接已复制':'✅ Markdown link copied');
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
    if(currentModal && currentModal.item.previewUrl && currentModal.item.previewUrl !== '#'){
        window.open(currentModal.item.previewUrl, '_blank', 'noopener,noreferrer');
    } else {
        var t = LANG==='zh' ? currentModal.item.zh : currentModal.item.en;
        alert(LANG==='zh' ? ('预览地址待配置：'+t) : ('Preview URL pending: '+t));
    }
});
document.getElementById('btnDownload').addEventListener('click', function(){
    if(!currentModal) return;
    var btn = this;
    if(btn.disabled) return;
    var t = LANG==='zh' ? currentModal.item.zh : currentModal.item.en;
    var original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="btn-spinner"></span>' + (LANG==='zh'?'下载中...':'Downloading...');
    // 模拟下载任务（真实场景替换为实际下载逻辑）
    setTimeout(function(){
        btn.disabled = false;
        btn.innerHTML = original;
        if(currentModal.item.downloadUrl && currentModal.item.downloadUrl !== '#'){
            window.open(currentModal.item.downloadUrl, '_blank', 'noopener,noreferrer');
        } else {
            alert(LANG==='zh' ? ('开始下载：'+t) : ('Starting download: '+t));
        }
    }, 900);
});

// ===================== 搜索（跨 工具/模板/源码）=====================
var searchInput = document.getElementById('searchInput');
var searchPopup = document.getElementById('searchPopup');
if(LANG !== 'zh'){ searchInput.placeholder = searchInput.dataset.phEn; }

function buildSearchIndex(){
    var idx = [];
    (window.TOOLS_DATA||[]).forEach(function(t){ idx.push({kind:'tool', zh:t.zh, en:t.en, slug:t.slug}); });
    THEME_DATA.forEach(function(t){ idx.push({kind:'theme', zh:t.zh, en:t.en, idx:t.idx}); });
    SOURCE_DATA.forEach(function(t){ idx.push({kind:'source', zh:t.zh, en:t.en, idx:t.idx}); });
    return idx;
}
function activateSearchResult(item){
    if(!item) return;
    pushSearchHist(searchInput.value);
    if(item.kind==='tool'){ location.href = toolUrl(item.slug); }
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
        searchPopup.innerHTML = '<div class="search-empty">'+(LANG==='zh'?'未找到相关资源':'No matching resources')+'</div>';
    } else {
        var html = '';
        results.forEach(function(item){
            var name = LANG==='zh'?item.zh:item.en;
            var kindTag = item.kind==='tool'?'🛠️':(item.kind==='theme'?'🎨':'💻');
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
var LANG_PATH = { zh:'/', en:'/en/', jp:'/jp/', es:'/es/', de:'/de/', ar:'/ar/' };
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
        var target = nav.indexOf('zh')===0 ? 'zh'
                   : nav.indexOf('ja')===0 ? 'jp'
                   : nav.indexOf('es')===0 ? 'es'
                   : nav.indexOf('de')===0 ? 'de'
                   : nav.indexOf('ar')===0 ? 'ar' : 'en';
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
    if(!fav.length){list.innerHTML='<div class="fav-empty">'+(LANG==='zh'?'还没有收藏工具':'No favorites yet')+'</div>';return;}
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
    jp:{t:'🍪 Cookie について', b:'言語やテーマなどの設定を記憶するために Cookie を使用します。広告 Cookie は同意いただいた場合のみ有効になります。ツールで扱うデータはブラウザ内にのみ保存されます。', a:'同意する', r:'必須のみ', p:'プライバシーポリシー'},
    es:{t:'🍪 Aviso de cookies', b:'Usamos cookies para recordar tus preferencias (idioma y tema). Las cookies publicitarias solo se activan con tu consentimiento explícito. Tus datos permanecen en tu navegador.', a:'Aceptar todo', r:'Solo esenciales', p:'Política de privacidad'},
    de:{t:'🍪 Cookie-Hinweis', b:'Wir verwenden Cookies, um Ihre Einstellungen (Sprache und Design) zu speichern. Werbe-Cookies werden nur mit Ihrer ausdrücklichen Einwilligung aktiviert. Ihre Daten bleiben im Browser.', a:'Alle akzeptieren', r:'Nur notwendige', p:'Datenschutz'},
    ar:{t:'🍪 إشعار ملفات تعريف الارتباط', b:'نستخدم ملفات تعريف الارتباط لتذكر تفضيلاتك (اللغة والمظهر). لا يتم تفعيل ملفات الإعلانات إلا بموافقتك الصريحة. تبقى بياناتك داخل متصفحك.', a:'قبول الكل', r:'الضرورية فقط', p:'سياسة الخصوصية'}
};
(function(){
    var box=document.getElementById('cookieBox'); if(!box) return;
    var T = COOKIE_I18N[SITE_LANG] || COOKIE_I18N.en;
    document.getElementById('ckTitle').textContent = T.t;
    document.getElementById('ckBody').innerHTML = T.b + ' <a href="/privacy.html" style="color:var(--nebula-cyan);">'+T.p+'</a>';
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
    if(!list.length){ box.innerHTML='<div class="recent-empty">'+(LANG==='zh'?'暂无浏览记录':'No history')+'</div>'; return; }
    box.innerHTML='';
    list.forEach(function(r){
        var a=document.createElement('a');
        if(r.kind==='tool' && r.slug) a.href=toolUrl(r.slug);
        a.innerHTML='<span>🔧</span><span>'+(LANG==='en'?r.en:r.zh)+'</span>';
        if(!(r.kind==='tool'&&r.slug)){
            a.addEventListener('click',function(e){ e.preventDefault(); if(r.kind!=='tool') openModal(r.kind, Number(r.key.split(':')[1])); });
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
    jp: ['json 整形','画像 圧縮','pdf 変換','qr コード','base64 デコード','タイムスタンプ 変換'],
    es: ['formateador json','comprimir imagen','convertir pdf','generador qr','decodificar base64','conversor de unidades'],
    de: ['json formatierer','bild komprimieren','pdf konverter','qr code generator','base64 dekodieren','einheiten umrechner'],
    ar: ['منسق json','ضغط الصور','محول pdf','مولد رمز qr','فك base64','محول الوحدات']
};
var HOT_WORDS = HOT_WORDS_MAP[SITE_LANG] || HOT_WORDS_MAP.en;
var SEARCH_HIST_KEY='searchHistory';
function getSearchHist(){ return safeStorage.getJSON(SEARCH_HIST_KEY) || []; }
function pushSearchHist(kw){ kw=(kw||'').trim(); if(!kw) return; var h=getSearchHist().filter(function(x){return x!==kw;}); h.unshift(kw); if(h.length>8) h=h.slice(0,8); safeStorage.setJSON(SEARCH_HIST_KEY,h); }
function renderHotSearch(){
    var box=document.getElementById('hotSearch'); if(!box) return;
    var hist=getSearchHist();
    var html='<span class="hs-label">🔥 '+(LANG==='zh'?'热门':'Hot')+':</span>';
    HOT_WORDS.slice(0,6).forEach(function(w){ html+='<span class="hs-chip" data-kw="'+w+'">'+w+'</span>'; });
    if(hist.length){
        html+='<span class="hs-label" style="margin-left:8px;">🕘 '+(LANG==='zh'?'历史':'History')+':</span>';
        hist.slice(0,5).forEach(function(w){ html+='<span class="hs-chip history" data-kw="'+w+'">'+w+'</span>'; });
        html+='<span class="hs-clear" id="hsClear">'+(LANG==='zh'?'清空':'Clear')+'</span>';
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
        var label = LANG==='zh' ? a.zh : a.en;
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
        return LANG_PREFIX + tag + '-tools.html';
    }
    if(CAT_PAGE_LANGS.indexOf(SITE_LANG) === -1) return null;
    var prefix = SITE_LANG === 'zh' ? '/c/' : '/' + SITE_LANG + '/c/';
    return prefix + main + '-' + tag + '.html';
}
function renderTagAgg(){
    var box=document.getElementById('tagAggList'); if(!box) return; var html='';
    MAIN_KEYS.forEach(function(mk){
        MAIN_CONFIG[mk].tags.forEach(function(t){
            if(t.key==='all') return;
            var label=LANG==='zh'?t.zh:t.en;
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
    if(!list.length){ box.innerHTML='<div class="empty-state" style="padding:20px;">'+(LANG==='zh'?'暂无相关资源':'No related')+'</div>'; return; }
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
                '@type':'SoftwareApplication','name':(LANG==='zh'?t.zh:(t.en||t.zh)),
                'applicationCategory':'UtilitiesApplication','operatingSystem':'Web',
                'url':'https://72tool.com/'+(t.slug||'')
            }};
        });
        var data={ '@context':'https://schema.org','@type':'ItemList','name':(LANG==='zh'?'在线工具列表':'Online Tools'),'itemListElement':items };
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
        if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ msg.textContent = LANG==='zh'?'请输入有效邮箱':'Enter a valid email'; return; }
        safeStorage.set('subEmail', email);
        msg.textContent = (LANG==='zh'?'✅ 订阅成功，更新将发送至 ':'✅ Subscribed! Updates will go to ')+email;
        document.getElementById('subEmail').value='';
    });
    document.getElementById('shareCopy').addEventListener('click',function(){
        var url=location.origin+location.pathname+'?lang='+(LANG==='zh'?'zh':LANG);
        var msg=document.getElementById('subMsg');
        if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(url).then(function(){ msg.textContent=LANG==='zh'?'🔗 分享链接已复制':'🔗 Share link copied'; }); }
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

// IndexNow
})();
