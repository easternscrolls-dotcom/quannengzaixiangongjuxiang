/* ux-kit.js — 全站体验增强（无侵入，运行时 DOM 扫描）
 * 功能：
 *   1) 美化操作反馈：拦截 window.alert -> 顶部 toast；提供 window.showToast / window.copyText / window.downloadText
 *   2) 一键复制/下载：自动给结果区（readonly textarea 等）加「复制」「下载」按钮
 *   3) 文件上传增强：自动加 multiple（支持批量选择）、拖拽上传高亮、单次大小限制提示
 *   4) 记住偏好：按 页面 + 元素 自动把输入内容存入 localStorage，下次进入自动回填
 * 设计原则：不改动任何页面原有逻辑；所有增强失败均静默兜底，绝不影响工具本身使用。
 */
(function () {
  'use strict';
  var doc = document;

  /* ---------- i18n 辅助 ---------- */
  function getLang() {
    if (window.i18nLang === 'en' || window.i18nLang === 'zh') return window.i18nLang;
    var hl = (doc.documentElement.lang || '').toLowerCase();
    if (hl.indexOf('en') === 0) return 'en';
    return 'zh';
  }
  var T = {
    zh: {
      copy: '复制结果',
      download: '下载为文件',
      copied: '已复制到剪贴板',
      copyFail: '复制失败，请手动选择',
      downloadStart: '已开始下载',
      downloadFail: '下载失败',
      dropHintPrefix: '支持拖拽上传、可多选；单个文件建议 ≤ ',
      dropHintSuffix: 'MB，超出可能卡顿。',
      filesOverPrefix: '有 ',
      filesOverMid: ' 个文件超过 ',
      filesOverSuffix: 'MB，处理可能较慢或失败'
    },
    en: {
      copy: 'Copy result',
      download: 'Download as file',
      copied: 'Copied to clipboard',
      copyFail: 'Copy failed, please select manually',
      downloadStart: 'Download started',
      downloadFail: 'Download failed',
      dropHintPrefix: 'Drag & drop supported, multiple files allowed; single file recommended ≤ ',
      dropHintSuffix: ' MB, larger files may be slow or fail.',
      filesOverPrefix: '',
      filesOverMid: ' file(s) exceed ',
      filesOverSuffix: ' MB and may be slow or fail'
    }
  };
  function t(key) {
    var lang = getLang();
    var table = T[lang] || T.zh;
    return table[key] !== undefined ? table[key] : (T.zh[key] || key);
  }

  /* ---------- 1. 注入样式 ---------- */
  var css =
    '.ux-toast{position:fixed;left:50%;top:22px;transform:translateX(-50%);z-index:99999;' +
    'display:flex;flex-direction:column;gap:8px;align-items:center;pointer-events:none;}' +
    '.ux-toast>div{padding:10px 18px;border-radius:8px;font-size:14px;color:#fff;' +
    'background:#111827;box-shadow:0 6px 20px rgba(0,0,0,.22);opacity:0;transition:opacity .25s,transform .25s;' +
    'transform:translateY(-6px);max-width:88vw;}' +
    '.ux-toast>div.show{opacity:1;transform:translateY(0);}' +
    '.ux-toast>div.err{background:#ef4444;}' +
    '.ux-toast>div.ok{background:#16a34a;}' +
    '.ux-out-bar{display:flex;gap:8px;margin:8px 0 4px;flex-wrap:wrap;}' +
    '.ux-out-bar button{padding:6px 14px;border:none;border-radius:6px;font-size:13px;cursor:pointer;' +
    'background:#2478f5;color:#fff;}' +
    '.ux-out-bar button.ux-dl{background:#e5e7eb;color:#111;}' +
    '.ux-dropzone{transition:background .15s,border-color .15s;}' +
    '.ux-dropzone.ux-drag{background:#eff6ff!important;border:2px dashed #2478f5!important;border-radius:8px;}' +
    '.ux-size-hint{font-size:12px;color:#9ca3af;margin:4px 0 0;}';
  var styleEl = doc.createElement('style');
  styleEl.textContent = css;
  (doc.head || doc.documentElement).appendChild(styleEl);

  /* ---------- 2. Toast ---------- */
  function showToast(msg, type) {
    var box = doc.getElementById('ux-toast');
    if (!box) {
      box = doc.createElement('div');
      box.id = 'ux-toast';
      box.className = 'ux-toast';
      doc.body.appendChild(box);
    }
    var el = doc.createElement('div');
    el.textContent = String(msg);
    if (type) el.className = type;
    box.appendChild(el);
    requestAnimationFrame(function () {
      el.classList.add('show');
    });
    setTimeout(function () {
      el.classList.remove('show');
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 300);
    }, 2200);
  }
  window.showToast = showToast;

  // 拦截原生 alert -> toast（错误样式）
  if (window.alert) {
    var _alert = window.alert;
    window.alert = function (m) {
      try { showToast(String(m), 'err'); } catch (e) { _alert(m); }
    };
  }

  /* ---------- 3. 复制 / 下载 ---------- */
  function copyText(text) {
    text = String(text == null ? '' : text);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () {
        return fallbackCopy(text);
      });
    }
    return Promise.resolve(fallbackCopy(text));
  }
  function fallbackCopy(text) {
    try {
      var ta = doc.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      doc.body.appendChild(ta);
      ta.select();
      var ok = doc.execCommand('copy');
      ta.remove();
      return ok;
    } catch (e) { return false; }
  }
  window.copyText = copyText;

  function downloadText(text, filename) {
    try {
      var blob = new Blob([String(text)], { type: 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = doc.createElement('a');
      a.href = url;
      a.download = filename || 'result.txt';
      doc.body.appendChild(a);
      a.click();
      doc.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      return true;
    } catch (e) { return false; }
  }
  window.downloadText = downloadText;

  /* ---------- 4. 结果区一键复制 / 下载 ---------- */
  function enhanceOutputs() {
    var outs = doc.querySelectorAll('textarea[readonly]:not([data-ux])');
    Array.prototype.forEach.call(outs, function (ta) {
      ta.setAttribute('data-ux', '1');
      // 已存在邻近复制按钮则跳过
      if (ta.previousElementSibling && ta.previousElementSibling.classList &&
          ta.previousElementSibling.classList.contains('ux-out-bar')) return;
      var bar = doc.createElement('div');
      bar.className = 'ux-out-bar';
      var copyBtn = doc.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'ux-copy';
      copyBtn.textContent = t('copy');
      copyBtn.addEventListener('click', function () {
        copyText(ta.value).then(function (ok) {
          showToast(ok ? t('copied') : t('copyFail'), ok ? 'ok' : 'err');
        });
      });
      var dlBtn = doc.createElement('button');
      dlBtn.type = 'button';
      dlBtn.className = 'ux-dl';
      dlBtn.textContent = t('download');
      dlBtn.addEventListener('click', function () {
        var name = (doc.title || 'result').split('|')[0].trim() + '.txt';
        var ok = downloadText(ta.value, name);
        showToast(ok ? t('downloadStart') : t('downloadFail'), ok ? 'ok' : 'err');
      });
      bar.appendChild(copyBtn);
      bar.appendChild(dlBtn);
      if (ta.parentNode) ta.parentNode.insertBefore(bar, ta);
    });
  }

  function updateOutputButtonsLang() {
    var bars = doc.querySelectorAll('.ux-out-bar');
    Array.prototype.forEach.call(bars, function (bar) {
      var copyBtn = bar.querySelector('.ux-copy');
      var dlBtn = bar.querySelector('.ux-dl');
      if (copyBtn) copyBtn.textContent = t('copy');
      if (dlBtn) dlBtn.textContent = t('download');
    });
  }

  /* ---------- 5. 文件上传增强（multiple / 拖拽 / 大小限制 / 批量重放）---------- */
  // 各类文件建议上限（字节）
  var SIZE_LIMIT = {
    image: 30 * 1024 * 1024,
    audio: 200 * 1024 * 1024,
    video: 300 * 1024 * 1024,
    pdf: 50 * 1024 * 1024,
    default: 50 * 1024 * 1024
  };
  function limitFor(input) {
    var acc = (input.getAttribute('accept') || '').toLowerCase();
    if (acc.indexOf('image') >= 0) return SIZE_LIMIT.image;
    if (acc.indexOf('audio') >= 0) return SIZE_LIMIT.audio;
    if (acc.indexOf('video') >= 0) return SIZE_LIMIT.video;
    if (acc.indexOf('pdf') >= 0) return SIZE_LIMIT.pdf;
    return SIZE_LIMIT.default;
  }
  function setInputFiles(input, fileList) {
    try {
      var dt = new DataTransfer();
      Array.prototype.forEach.call(fileList, function (f) { dt.items.add(f); });
      input.files = dt.files;
    } catch (e) { /* 部分浏览器不可赋值，忽略 */ }
  }
  function enhanceFileInputs() {
    var inputs = doc.querySelectorAll('input[type=file]:not([data-ux])');
    Array.prototype.forEach.call(inputs, function (inp) {
      inp.setAttribute('data-ux', '1');
      var hadMultiple = inp.hasAttribute('multiple');
      if (!hadMultiple) inp.setAttribute('multiple', 'multiple'); // 支持批量选择

      // 拖拽：把 input 所在容器变拖拽区
      var zone = inp.parentNode;
      while (zone && zone !== doc.body && !zone.querySelector) zone = zone.parentNode;
      if (zone && zone.classList) {
        zone.classList.add('ux-dropzone');
        zone.addEventListener('dragover', function (e) {
          e.preventDefault(); zone.classList.add('ux-drag');
        });
        zone.addEventListener('dragleave', function (e) {
          zone.classList.remove('ux-drag');
        });
        zone.addEventListener('drop', function (e) {
          e.preventDefault();
          zone.classList.remove('ux-drag');
          if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
            setInputFiles(inp, e.dataTransfer.files);
            inp.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      }

      // 大小限制提示
      var hint = doc.createElement('div');
      hint.className = 'ux-size-hint';
      var mb = Math.round(limitFor(inp) / 1048576);
      hint.textContent = t('dropHintPrefix') + mb + t('dropHintSuffix');
      if (inp.parentNode) inp.parentNode.insertBefore(hint, inp.nextSibling);

      inp.addEventListener('change', function () {
        var limit = limitFor(inp);
        var files = inp.files;
        if (!files) return;
        var big = 0;
        for (var i = 0; i < files.length; i++) {
          if (files[i].size > limit) big++;
        }
        if (big > 0) {
          var msg;
          if (getLang() === 'en') {
            msg = big + t('filesOverMid') + mb + t('filesOverSuffix');
          } else {
            msg = t('filesOverPrefix') + big + t('filesOverMid') + mb + t('filesOverSuffix');
          }
          showToast(msg, 'err');
        }
      });

      // 批量重放：仅对「原本不支持多文件」的 input，把多文件逐个喂给原处理逻辑（尽力而为）
      if (!hadMultiple) {
        var handler = inp.onchange || (inp.getAttribute('onchange') ?
          new Function('event', 'with(this){' + inp.getAttribute('onchange') + '}') : null);
        if (handler) {
          inp.addEventListener('change', function (e) {
            if (inp.dataset.uxBatch === '1') return;
            var files = Array.prototype.slice.call(inp.files || []);
            if (files.length <= 1) return;
            e.stopImmediatePropagation();
            inp.dataset.uxBatch = '1';
            files.forEach(function (f) {
              var dt = new DataTransfer();
              dt.items.add(f);
              try { inp.files = dt.files; } catch (err) {}
              try { handler.call(inp, { target: inp }); } catch (err2) {}
            });
            inp.dataset.uxBatch = '';
          }, true);
        }
      }
    });
  }

  /* ---------- 6. 记住输入偏好（localStorage）---------- */
  var MEM_PREFIX = 'ux-mem::';
  function memKey(el) {
    var id = el.id || el.name || el.getAttribute('placeholder') || el.className || '';
    return MEM_PREFIX + location.pathname + '|' + id;
  }
  function isInputEligible(el) {
    if (el.type === 'file' || el.type === 'password' || el.type === 'search' ||
        el.type === 'hidden' || el.type === 'submit' || el.type === 'button') return false;
    if (el.readOnly || el.disabled) return false;
    if (/search|q\b/i.test(el.id || '')) return false; // 排除搜索框
    return true;
  }
  var memTimer = null;
  function saveMem() {
    var els = doc.querySelectorAll('input,textarea,select');
    Array.prototype.forEach.call(els, function (el) {
      if (el.tagName === 'TEXTAREA' && el.readOnly) return;
      if (!isInputEligible(el)) return;
      try {
        var val;
        if (el.tagName === 'SELECT') val = el.value;
        else if (el.type === 'checkbox' || el.type === 'radio') val = el.checked;
        else val = el.value;
        if (val === '' || val == null) return;
        localStorage.setItem(memKey(el), JSON.stringify(val));
      } catch (e) {}
    });
  }
  function loadMem() {
    var els = doc.querySelectorAll('input,textarea,select');
    Array.prototype.forEach.call(els, function (el) {
      if (el.tagName === 'TEXTAREA' && el.readOnly) return;
      if (!isInputEligible(el)) return;
      try {
        var raw = localStorage.getItem(memKey(el));
        if (raw == null) return;
        var val = JSON.parse(raw);
        if (el.tagName === 'SELECT') {
          el.value = val;
        } else if (el.type === 'checkbox' || el.type === 'radio') {
          el.checked = !!val;
        } else {
          el.value = val;
        }
        // 触发一次 input/change，让页面逻辑感知回填
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      } catch (e) {}
    });
  }

  /* ---------- 启动 ---------- */
  function init() {
    try { enhanceOutputs(); } catch (e) {}
    try { enhanceFileInputs(); } catch (e) {}
    try { loadMem(); } catch (e) {}
    if (memTimer) clearInterval(memTimer);
    memTimer = setInterval(saveMem, 1500);
    doc.addEventListener('visibilitychange', function () {
      if (doc.hidden) saveMem();
    });
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 语言切换后更新 ux-kit 生成的按钮文案
  doc.addEventListener('i18n:langchange', function () {
    try { updateOutputButtonsLang(); } catch (e) {}
  });
})();
