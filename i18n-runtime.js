/* i18n-runtime.js — 全能工具箱 中英切换（无侵入，零依赖）
 * 双语内容块：.i18n-zh / .i18n-en（运行时按语言显隐，支持嵌套 span）
 * 界面短文案：元素加 data-i18n="key"（textContent 替换）
 * 输入框占位符：元素加 data-ph-zh / data-ph-en（placeholder 属性替换）
 * 页面标题：<meta name="i18n-title-en" content="EN">（document.title 替换）
 * 语言优先级：URL ?lang=en|zh  >  localStorage  >  <html lang>  >  默认 zh-CN
 * 事件：切换后派发 document.dispatchEvent(new CustomEvent('i18n:langchange',{detail:{lang}}))
 */
(function () {
  'use strict';
  var I18N = {
    zh: {
      nav_home: '首页',
      about: '关于我们',
      privacy: '隐私政策',
      contact: '联系我们',
      view_all: '查看全部工具 ›',
      copyright: '© 2026 72在线工具箱 72tool.com 保留所有权利',
      cookie_title: '🍪 Cookie 使用提示',
      cookie_body: '我们使用 Cookie 记住您的偏好（如语言设置），并在您同意后用于投放 Google 广告。点击「同意」即表示接受广告类 Cookie；点击「拒绝」则仅使用必要 Cookie，不投放广告。查看我们的',
      cookie_suffix: '。',
      accept: '同意',
      decline: '拒绝'
    },
    en: {
      nav_home: 'Home',
      about: 'About',
      privacy: 'Privacy',
      contact: 'Contact',
      view_all: 'All Tools ›',
      copyright: '© 2026 72tool.com. All rights reserved.',
      cookie_title: '🍪 Cookie Notice',
      cookie_body: 'We use cookies to remember your preferences (such as language) and, with your consent, to serve Google ads. Click “Accept” to allow advertising cookies, or “Decline” to continue with only essential cookies (no ads). See our ',
      cookie_suffix: '.',
      accept: 'Accept',
      decline: 'Decline'
    }
  };
  /* ── 海外版（EN 模式）隐藏的中文特化工具 ──
   * 这些工具功能仅对中文用户有意义（中文书写/中文姓名地址/中国电商或社交平台内容），
   * 在 EN 模式下从首页网格、分类页、搜索结果、相关工具链接中隐藏。
   * 注意：工具页本身仍可直接访问，仅不再出现在英文版列表里。
   */
  window.I18N_LOCAL_ONLY = [
    'zhconvert.html',            // 简繁转换
    'numbercn.html',             // 数字中文读法
    'money.html',                // 数字转中文金额（财务大写）
    'fontcn.html',               // 中文艺术字
    'random-chinese-sentence.html', // 随机中文短句
    'randomname.html',           // 随机中文姓名地址
    'randomphone.html',          // 测试手机号（中国）
    'randomtable.html',          // 随机测试数据（姓名/手机号 CSV）
    'regtemplate.html',          // 常用正则模板（手机/邮箱/身份证）
    'unicode-cn-convert.html',   // Unicode 中文互转
    'keyword-segment.html',      // 关键词中文分词
    'titlelength.html',          // 淘宝标题检测
    'titlenum.html',             // 小红书标题检测
    'symbol.html',               // 特殊符号大全（小红书装饰）
    'textlineclean.html',        // 文案换行清理（朋友圈）
    'script-duration-calc.html', // 口播时长预估
    'product-title-seg.html',    // 商品标题分词
    '9-grid-image-cut.html',     // 九宫格切图（小红书）
    'imgsizegoods.html',         // 商品尺寸计算（淘宝主图）
    'shop-image-size-guide.html' // 电商主图尺寸（淘宝）
  ];

  var TITLE_ORIG = document.title;

  /* ── 工具 UI 词典翻译器（EN 模式把页面写死的中文 UI 换成英文，切回 zh 还原） ── */
  var CJK_RE = /[\u4e00-\u9fff]/;
  var touched = [];        // [{node, orig}] 已翻译的文本节点，用于还原
  var touchedVals = [];    // [{el, orig}] 已翻译的 input value
  var uiObserver = null;
  var translating = false;

  function loadUiDict(cb) {
    if (window.I18N_UI_EN) { cb(); return; }
    if (loadUiDict._loading) { loadUiDict._cbs.push(cb); return; }
    loadUiDict._loading = true; loadUiDict._cbs = [cb];
    var s = document.createElement('script');
    s.src = 'i18n-ui-en.js';
    s.onload = s.onerror = function () {
      var cbs = loadUiDict._cbs; loadUiDict._cbs = [];
      for (var i = 0; i < cbs.length; i++) cbs[i]();
    };
    document.head.appendChild(s);
  }
  function lookupEn(t) {
    var d = window.I18N_UI_EN;
    if (!d || !t) return null;
    var s = t.replace(/^\s+|\s+$/g, '');
    if (!s || !CJK_RE.test(s)) return null;
    if (d[s] != null) return d[s];
    var i = s.indexOf('：'); // “总和：123” → 前缀匹配
    if (i > -1) {
      var pre = s.slice(0, i + 1);
      if (d[pre] != null) return d[pre] + s.slice(i + 1);
    }
    return null;
  }
  function uiSkip(el) { // 跳过：脚本/样式、.i18n-zh(EN 下隐藏)、data-i18n、语言按钮
    // 注意：.i18n-en 不跳过——历史注入曾把中文原文复制进英文槽位（假英文），需要词典兜底翻译
    var cur = el;
    while (cur && cur.nodeType === 1) {
      var tn = cur.tagName;
      if (tn === 'SCRIPT' || tn === 'STYLE' || tn === 'NOSCRIPT' || tn === 'OPTION' || tn === 'TITLE') return true;
      if (cur.classList && cur.classList.contains('i18n-zh')) return true;
      if (cur.hasAttribute && (cur.hasAttribute('data-i18n') || cur.hasAttribute('data-lang'))) return true;
      cur = cur.parentNode;
    }
    return false;
  }
  function translateTree(root) {
    if (!window.I18N_UI_EN || !root) return;
    translating = true;
    try {
      // 0) root 本身是文本节点（characterData 变更）
      if (root.nodeType === 3) {
        var v0 = root.nodeValue;
        if (v0 && CJK_RE.test(v0) && !uiSkip(root.parentNode)) {
          var en0 = lookupEn(v0);
          if (en0 != null) {
            touched.push({ node: root, orig: v0 });
            root.nodeValue = v0.replace(v0.replace(/^\s+|\s+$/g, ''), en0);
          }
        }
        translating = false; return;
      }
      // 1) 文本节点
      var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, null);
      var n;
      while ((n = tw.nextNode())) {
        var v = n.nodeValue;
        if (!v || !CJK_RE.test(v) || uiSkip(n.parentNode)) continue;
        var en = lookupEn(v);
        if (en != null) {
          touched.push({ node: n, orig: v });
          n.nodeValue = v.replace(v.replace(/^\s+|\s+$/g, ''), en);
        }
      }
      if (root.nodeType !== 1 && root.nodeType !== 9) { translating = false; return; }
      // 2) placeholder：无 data-ph-en 的补上；data-ph-en 本身是中文（假英文）的修正
      var phs = root.querySelectorAll ? root.querySelectorAll('[placeholder]') : [];
      for (var p = 0; p < phs.length; p++) {
        var elp = phs[p];
        var phen = elp.getAttribute('data-ph-en');
        if (phen != null && CJK_RE.test(phen)) { // 假英文槽位
          var fixed = lookupEn(phen);
          if (fixed != null) elp.setAttribute('data-ph-en', fixed);
          else continue;
          elp.setAttribute('placeholder', elp.getAttribute('data-ph-en'));
        } else if (phen == null) {
          var ph = elp.getAttribute('placeholder');
          var pe = lookupEn(ph);
          if (pe != null) {
            elp.setAttribute('data-ph-zh', ph);
            elp.setAttribute('data-ph-en', pe);
            elp.setAttribute('placeholder', pe);
          }
        }
      }
      // 3) option：无 data-text-en 的补上；data-text-en 是中文的修正
      var opts = root.querySelectorAll ? root.querySelectorAll('option') : [];
      for (var o = 0; o < opts.length; o++) {
        var op = opts[o];
        var oen = op.getAttribute('data-text-en');
        if (oen != null && CJK_RE.test(oen)) {
          var ofix = lookupEn(oen);
          if (ofix != null) { op.setAttribute('data-text-en', ofix); op.textContent = ofix; }
        } else if (oen == null) {
          var ot = op.textContent;
          var oe = lookupEn(ot);
          if (oe != null) {
            op.setAttribute('data-text-zh', ot.replace(/^\s+|\s+$/g, ''));
            op.setAttribute('data-text-en', oe);
            op.textContent = oe;
          }
        }
      }
      // 4) input button value
      var ins = root.querySelectorAll ? root.querySelectorAll('input[type=button],input[type=submit],input[type=reset]') : [];
      for (var q = 0; q < ins.length; q++) {
        var iv = ins[q].value;
        var ie = lookupEn(iv);
        if (ie != null) { touchedVals.push({ el: ins[q], orig: iv }); ins[q].value = ie; }
      }
    } catch (e) {}
    translating = false;
  }
  function restoreZhUi() {
    translating = true;
    for (var i = 0; i < touched.length; i++) {
      try { touched[i].node.nodeValue = touched[i].orig; } catch (e) {}
    }
    touched = [];
    for (var j = 0; j < touchedVals.length; j++) {
      try { touchedVals[j].el.value = touchedVals[j].orig; } catch (e) {}
    }
    touchedVals = [];
    translating = false;
  }
  function startUiObserver() {
    if (uiObserver || !window.MutationObserver) return;
    uiObserver = new MutationObserver(function (muts) {
      if (translating || window.i18nLang !== 'en') return;
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === 'characterData') translateTree(m.target);
        else for (var j = 0; j < m.addedNodes.length; j++) {
          translateTree(m.addedNodes[j]);
          applyLocalOnly(m.addedNodes[j]); // 动态渲染的卡片也按 EN 模式隐藏中文特化工具
        }
      }
    });
    uiObserver.observe(document.body || document.documentElement, { childList: true, subtree: true, characterData: true });
  }
  function stopUiObserver() {
    if (uiObserver) { uiObserver.disconnect(); uiObserver = null; }
  }
  /* ── 词典翻译器结束 ── */

  function param(name) {
    var m = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
    return m ? decodeURIComponent(m[1]) : null;
  }
  function detect() {
    var p = param('lang');
    if (p === 'en' || p === 'zh') return p;
    try { var s = localStorage.getItem('siteLang'); if (s === 'en' || s === 'zh') return s; } catch (e) {}
    var hl = (document.documentElement.lang || '').toLowerCase();
    if (hl.indexOf('en') === 0) return 'en';
    return 'zh';
  }
  function syncLinks(lang) {
    var links = document.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var href = a.getAttribute('href') || '';
      if (!href || href.indexOf('://') !== -1) continue;
      var m = href.match(/\.html([?#].*)?$/);
      if (!m) continue;
      if (!a.hasAttribute('data-href-orig')) a.setAttribute('data-href-orig', href);
      var orig = a.getAttribute('data-href-orig');
      var suffix = m[1] || '';
      if (lang === 'en') {
        if (suffix.indexOf('lang=en') === -1) {
          a.setAttribute('href', orig + (suffix.indexOf('?') === -1 ? '?' : '&') + 'lang=en');
        }
      } else {
        a.setAttribute('href', orig);
      }
    }
  }

  /* 海外版（EN 模式）隐藏中文特化工具：按 <a href="page.html"> 命中 LOCAL_ONLY 列表 */
  function applyLocalOnly(root) {
    var list = window.I18N_LOCAL_ONLY;
    if (!root || !list || !list.length) return;
    var links = root.querySelectorAll ? root.querySelectorAll('a[href]') : [];
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var href = a.getAttribute('href') || '';
      var clean = href.split('#')[0].split('?')[0];
      var seg = clean.split('/').pop();
      if (seg && seg.slice(-5) === '.html' && list.indexOf(seg) !== -1) {
        if (window.i18nLang === 'en') { a.hidden = true; a.style.display = 'none'; }
        else { a.hidden = false; a.style.display = ''; }
      }
    }
  }

  function apply(lang, silent) {
    document.documentElement.lang = (lang === 'en') ? 'en' : 'zh-CN';

    var zh = document.querySelectorAll('.i18n-zh');
    var en = document.querySelectorAll('.i18n-en');
    for (var i = 0; i < zh.length; i++) {
      var z = zh[i];
      var isZh = (lang === 'zh');
      z.hidden = !isZh;
      z.style.display = isZh ? '' : 'none';
    }
    for (var j = 0; j < en.length; j++) {
      var e = en[j];
      var isEn = (lang === 'en');
      e.hidden = !isEn;
      e.style.display = isEn ? '' : 'none';
    }

    var dict = I18N[lang] || I18N.zh;
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var k = 0; k < nodes.length; k++) {
      var key = nodes[k].getAttribute('data-i18n');
      if (dict[key] != null) nodes[k].textContent = dict[key];
    }

    var phs = document.querySelectorAll('[data-ph-en]');
    for (var p = 0; p < phs.length; p++) {
      var el = phs[p];
      var zh0 = el.getAttribute('data-ph-zh') || el.getAttribute('placeholder');
      el.setAttribute('placeholder', lang === 'en' ? (el.getAttribute('data-ph-en') || zh0) : zh0);
    }

    // <option> cannot contain HTML, so bilingual options use data-text-zh / data-text-en
    var opts = document.querySelectorAll('option[data-text-en]');
    for (var o = 0; o < opts.length; o++) {
      var opt = opts[o];
      opt.textContent = lang === 'en' ? (opt.getAttribute('data-text-en') || opt.textContent) : (opt.getAttribute('data-text-zh') || opt.textContent);
    }

    var tmeta = document.querySelector('meta[name="i18n-title-en"]');
    if (lang === 'en' && tmeta && tmeta.getAttribute('content')) document.title = tmeta.getAttribute('content');
    else document.title = TITLE_ORIG;

    var btns = document.querySelectorAll('[data-lang]');
    for (var b = 0; b < btns.length; b++) {
      if (btns[b].getAttribute('data-lang') === lang) {
        btns[b].style.background = '#2478f5'; btns[b].style.color = '#fff';
      } else {
        btns[b].style.background = 'transparent'; btns[b].style.color = '#374151';
      }
    }
    syncLinks(lang);

    try { localStorage.setItem('siteLang', lang); } catch (e) {}
    window.i18nLang = lang;
    applyLocalOnly(document); // 海外版隐藏中文特化工具（EN 隐藏 / ZH 显示）

    // 工具 UI 词典翻译：EN 翻译写死的中文 UI；ZH 还原
    if (lang === 'en') {
      loadUiDict(function () {
        if (window.i18nLang !== 'en') return;
        translateTree(document.body);
        // 词典补挂的 data-ph-en / data-text-en 立即生效
        var phs2 = document.querySelectorAll('[data-ph-en]');
        for (var p2 = 0; p2 < phs2.length; p2++) phs2[p2].setAttribute('placeholder', phs2[p2].getAttribute('data-ph-en'));
        startUiObserver();
      });
    } else {
      stopUiObserver();
      restoreZhUi();
    }
    if (!silent) {
      try {
        document.dispatchEvent(new CustomEvent('i18n:langchange', { detail: { lang: lang } }));
      } catch (e) {}
    }
  }
  function toggle(lang) {
    var zh = document.querySelectorAll('.i18n-zh');
    var en = document.querySelectorAll('.i18n-en');
    for (var i = 0; i < zh.length; i++) {
      var z = zh[i];
      var isZh = (lang === 'zh');
      z.hidden = !isZh;
      z.style.display = isZh ? '' : 'none';
    }
    for (var j = 0; j < en.length; j++) {
      var e = en[j];
      var isEn = (lang === 'en');
      e.hidden = !isEn;
      e.style.display = isEn ? '' : 'none';
    }
  }
  function ensureStyle() {
    var id = 'i18n-hide-style';
    if (document.getElementById(id)) return;
    var st = document.createElement('style');
    st.id = id;
    // 行内切换（h1/p/导航里的 <span class="i18n-zh/en">）保持 inline；
    // 但长尾块容器 <div class="i18n-zh/en"> 与 <section class="i18n-en"> 必须是 block，
    // 否则 margin:40px 被忽略、卡片重叠错位，EN 模式下会渲染成"残留白框"。
    st.textContent = '[hidden]{display:none !important}' +
      '.i18n-zh,.i18n-en{display:inline}' +
      'div.i18n-zh,div.i18n-en,section.i18n-zh,section.i18n-en{display:block}';
    document.head.appendChild(st);
  }
  function bind() {
    var btns = document.querySelectorAll('[data-lang]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () { apply(this.getAttribute('data-lang')); });
    }
  }
  // Cookie 同意（opt-in）：仅在用户点击「同意」时派发 cookie:accept，ads.js 据此加载广告
  function bindCookie() {
    var box = document.getElementById('cookieBox');
    if (!box) return;
    try { if (!localStorage.getItem('cookieConsent')) box.style.display = 'block'; } catch (e) {}
    var acc = document.getElementById('cookieAccept');
    var rej = document.getElementById('cookieReject');
    if (acc) acc.addEventListener('click', function () {
      try { localStorage.setItem('cookieConsent', 'accept'); } catch (e) {}
      box.style.display = 'none';
      try { document.dispatchEvent(new CustomEvent('cookie:accept', { detail: { choice: 'accept' } })); } catch (e) {}
    });
    if (rej) rej.addEventListener('click', function () {
      try { localStorage.setItem('cookieConsent', 'reject'); } catch (e) {}
      box.style.display = 'none';
      try { document.dispatchEvent(new CustomEvent('cookie:reject', { detail: { choice: 'reject' } })); } catch (e) {}
    });
  }
  function init() { ensureStyle(); apply(detect()); bind(); bindCookie(); }
  window.i18nApply = function (lang) { apply(lang, true); }; // full apply, NO dispatch (safe inside langchange listeners / dynamic render)
  window.i18nToggle = toggle; // visibility only, NO dispatch
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
