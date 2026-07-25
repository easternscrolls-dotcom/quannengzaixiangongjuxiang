/* autopush.js —— 72tool.com 前端自动推送（访客打开页面时上报给搜索引擎）
 * 以 defer 方式加载，不阻塞渲染，保护 Core Web Vitals。
 * 仅放入「可靠 per-visit 推送」的引擎；其余引擎（360/头条/神马）走服务端 push_all.py，避免页面挂过多外链拖慢速度。
 */
(function () {
  function inject(src) {
    var s = document.createElement("script");
    s.src = src;
    s.async = true;
    var first = document.getElementsByTagName("script")[0];
    if (first && first.parentNode) first.parentNode.insertBefore(s, first);
  }

  // 1) 百度自动推送（官方 push.js，稳定可用）
  inject("https://zz.bdstatic.com/linksubmit/push.js");

  // 2) Bing 自动提交（在 Bing Webmaster Tools → API → Auto Submit 获取你的站点片段后取消注释并填入）
  // inject("https://www.bing.com/webmaster/api/...");  // ← 替换为你的 Bing 自动提交脚本地址

  // 3) 360 / 头条 / 神马：不在此放前端 JS，统一由服务端 push_all.py 通过站长平台 sitemap 提交覆盖，
  //    如需前端自动推送，可把各平台提供的代码片段按上面的 inject("...") 形式补在下方（建议保留 async）。
})();
