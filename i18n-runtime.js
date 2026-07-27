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
      cookie_body: '本站使用 Cookie 优化访问体验，并投放 Google 联盟广告。继续使用网站即代表您同意我们的 Cookie 政策，您可查看',
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
      cookie_body: 'We use cookies to improve your experience and serve Google ads. By continuing, you agree to our Cookie Policy. View our ',
      cookie_suffix: '.',
      accept: 'Accept',
      decline: 'Decline'
    }
  };
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
        else for (var j = 0; j < m.addedNodes.length; j++) translateTree(m.addedNodes[j]);
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
  function init() { ensureStyle(); apply(detect()); bind(); }
  window.i18nApply = function (lang) { apply(lang, true); }; // full apply, NO dispatch (safe inside langchange listeners / dynamic render)
  window.i18nToggle = toggle; // visibility only, NO dispatch
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
