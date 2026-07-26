/* ============================================================
 * ads.js — 全能工具箱 全局广告布局（收益与体验平衡）
 * ------------------------------------------------------------
 * 规则（用户硬性要求）：
 *   ❌ 禁止：弹窗广告 / 页面悬浮全屏广告 / 工具按钮被广告遮挡
 *   ✅ 仅：桌面右栏广告 + 工具模块上方嵌入 + 工具模块下方嵌入(+完成后轻度)
 *   核心原则：用户完成操作前，广告不干扰使用
 *
 * 使用（开箱即用）：
 *   1) 把 ADS_CLIENT 改成你的 ca-pub-XXXXXXXXXXXXXXXX
 *   2) 可选：在 AdSense 后台建 3 个「展示广告」单元，把 slot 填进 MANUAL_SLOTS
 *      （不填也能跑，只是位置由自动广告补充，不保证恰好落在这 3 处）
 *   3) 部署后务必在 AdSense 后台「自动广告 → 格式」里关闭
 *      「锚点广告(Anchor)」和「全屏插页(Vignette)」——代码层也已强制关闭。
 *
 * 实现说明：
 *   - 纯运行时 DOM 操作，零侵入、不改任何页面原有逻辑
 *   - client 为占位符时不调用 AdSense，仅渲染「广告位」占位框，方便本地预览布局
 * ============================================================ */
(function () {
  'use strict';

  // ===== 配置区（你只改这里）=====
  var ADS_CLIENT   = 'ca-pub-1495097009978965'; // ← 你的发布商 ID
  var ENABLED      = true;                      // 总开关
  var USE_AUTO_ADS = true;                      // 自动广告（补充页内位；后台需关 overlay）
  // 手动广告位（可选，填了 slot 即精确落位；不填则纯自动广告）
  var MANUAL_SLOTS = { above: null, below: null, rail: null };
  // ===============================

  if (!ENABLED) return;

  // 仅当 client 形如真实 ca-pub- 时才真正调用 AdSense，避免假 ID 触发策略风险
  var isReal = /^ca-pub-\d{16}$/.test(ADS_CLIENT);

  // ---------- 样式（运行时注入，不改动页面 CSS）----------
  var css =
    '.ad-slot{margin:18px 0;min-height:90px;display:flex;align-items:center;justify-content:center;' +
    'background:#fafbfc;border:1px dashed #d8dde3;border-radius:10px;color:#aab2bd;font-size:12px;' +
    'text-align:center;overflow:hidden;box-sizing:border-box;padding:8px;}' +
    '.ad-slot .ad-ph{letter-spacing:2px;}' +
    // 桌面右栏广告：固定右缘，仅在 ≥1280px 出现，绝对不压到居中 900px 内容
    '.ad-rail{position:fixed;top:96px;right:16px;width:140px;z-index:30;max-height:calc(100vh - 120px);}' +
    '@media (max-width:1279px){.ad-rail{display:none;}}' +
    '.ad-rail .ad-slot{margin:0;min-height:260px;}' +
    'ins.adsbygoogle{display:block;}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ---------- 生成单个广告单元 ----------
  function makeSlot(pos) {
    var box = document.createElement('div');
    box.className = 'ad-slot';
    box.id = 'ad-' + pos;
    if (isReal && MANUAL_SLOTS[pos]) {
      var ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.setAttribute('data-ad-client', ADS_CLIENT);
      ins.setAttribute('data-ad-slot', String(MANUAL_SLOTS[pos]));
      ins.setAttribute('data-ad-format', 'auto');
      ins.setAttribute('data-full-width-responsive', 'true');
      box.appendChild(ins);
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } else {
      var sp = document.createElement('span');
      sp.className = 'ad-ph';
      sp.textContent = (pos === 'rail')
        ? '广告位 · 侧栏'
        : '广告位 · ' + (pos === 'above' ? '工具上方' : '工具下方');
      box.appendChild(sp);
    }
    return box;
  }

  // ---------- 桌面右栏 ----------
  function mountRail() {
    var r = document.createElement('div');
    r.className = 'ad-rail';
    r.id = 'ad-rail';
    r.appendChild(makeSlot('rail'));
    document.body.appendChild(r);
  }

  // ---------- 定位插入点 ----------
  function mountEmbedded() {
    // 上方：工具模块(#app)之前；找不到则退到 main/content 顶部
    var above = makeSlot('above');
    var app = document.getElementById('app');
    if (app && app.parentNode) {
      app.parentNode.insertBefore(above, app);
    } else {
      var main = document.querySelector('main, .content') || document.body;
      main.insertBefore(above, main.firstChild);
    }

    // 下方：使用教程区块之前（天然在工具下方，用户用完工具下滑才看到 = 完成后轻度广告）
    var below = makeSlot('below');
    var tut = null;
    var secs = document.querySelectorAll('section');
    for (var i = 0; i < secs.length; i++) {
      if (secs[i].textContent.indexOf('使用教程') >= 0) { tut = secs[i]; break; }
    }
    if (tut && tut.parentNode) {
      tut.parentNode.insertBefore(below, tut);
    } else {
      var foot = document.querySelector('footer');
      if (foot && foot.parentNode) foot.parentNode.insertBefore(below, foot);
      else document.body.appendChild(below);
    }
  }

  // ---------- AdSense 引导（自动广告，强制关闭 overlay）----------
  function bootAdsense() {
    if (!isReal) return;
    // 库脚本已在各页 <head> 引入（adsbygoogle.js），此处不再重复注入，避免重复加载报错；
    // 仅推送一次页面级配置，代码层强制关闭「锚点广告(底部悬浮)」与「全屏插页」——对应你的禁止项
    (window.adsbygoogle = window.adsbygoogle || []).push({
      google_ad_client: ADS_CLIENT,
      enable_page_level_ads: USE_AUTO_ADS,
      overlays: { anchor: false, vignette: false }
    });
  }

  function run() {
    bootAdsense();   // 推送自动广告配置
    // 纯自动广告模式（真实 client 且未配置手动 slot）：不渲染灰色占位框，交给自动广告自动落位；
    // 仅在「本地预览(占位符 client)」或「已配置手动 slot」时才渲染这些广告位
    var anySlot = MANUAL_SLOTS.above || MANUAL_SLOTS.below || MANUAL_SLOTS.rail;
    if (!isReal || anySlot) {
      mountEmbedded(); // 工具上/下方嵌入位
      mountRail();     // 桌面右栏
    }
  }

  if (document.readyState !== 'loading') run();
  else document.addEventListener('DOMContentLoaded', run);
})();
