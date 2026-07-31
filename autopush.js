/* autopush.js —— 72tool.com 前端自动推送（访客打开页面时上报给搜索引擎）
 * 以 defer 方式加载，不阻塞渲染，保护 Core Web Vitals。
 *
 * ★ 海外优化（关键）：
 *   百度 push.js 位于国内 CDN（zz.bdstatic.com），海外访问经常超时数秒，
 *   会严重拖慢 LCP 并直接影响 Google 排名。因此仅在「中文站 + 非海外访客」时注入；
 *   英/日/西/德/阿语站点一律不加载任何国内脚本。
 */
(function () {
  var html = document.documentElement;
  var siteLang = (html.getAttribute('data-site-lang') || 'zh').toLowerCase();

  function inject(src) {
    var s = document.createElement("script");
    s.src = src;
    s.async = true;
    var first = document.getElementsByTagName("script")[0];
    if (first && first.parentNode) first.parentNode.insertBefore(s, first);
  }

  /* ---------- 访客是否位于中国大陆（用时区判断，零请求、零依赖） ---------- */
  function isMainlandVisitor() {
    try {
      var tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '');
      if (tz === 'Asia/Shanghai' || tz === 'Asia/Chongqing' || tz === 'Asia/Urumqi' || tz === 'PRC') return true;
      // 时区不可用时回退：浏览器语言为 zh-CN 且 UTC+8
      if (!tz) return (navigator.language || '').toLowerCase() === 'zh-cn' && new Date().getTimezoneOffset() === -480;
      return false;
    } catch (e) { return false; }
  }

  /* ---------- 1) 百度自动推送：仅中文站 + 国内访客 ---------- */
  if (siteLang === 'zh' && isMainlandVisitor()) {
    inject("https://zz.bdstatic.com/linksubmit/push.js");
  }

  /* ---------- 2) IndexNow（Bing / Yandex / Seznam / Naver 通用，海外主力） ----------
   * IndexNow 需要在站点根目录放置 <key>.txt。当前已有：87061d122d8241490fb835d6e4594.txt
   * 前端仅在页面首次访问时轻量上报一次（使用 sendBeacon，不阻塞渲染）。
   */
  (function indexNowPing() {
    try {
      var KEY = '87061d122d8241490fb835d6e4594';
      var loc = location.origin + location.pathname;
      var flag = 'inow:' + loc;
      if (sessionStorage.getItem(flag)) return;
      sessionStorage.setItem(flag, '1');
      var api = 'https://api.indexnow.org/indexnow?url=' + encodeURIComponent(loc) +
                '&key=' + KEY;
      if (navigator.sendBeacon) { navigator.sendBeacon(api); }
      else { fetch(api, { mode: 'no-cors', keepalive: true }).catch(function () {}); }
    } catch (e) { /* 静默失败，绝不影响页面 */ }
  })();

  /* ---------- 3) Google / 其它引擎：走 sitemap.xml + Search Console，不放前端脚本 ---------- */
})();
