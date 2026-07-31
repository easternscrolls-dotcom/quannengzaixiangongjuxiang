/* ===========================================================
   72Tool · 星云粒子背景（来自 preview.html 的 #nebula-particles）
   向 <body> 注入一个固定全屏 canvas，渲染缓慢浮动的青/紫/粉/金粒子。
   不拦截事件（pointer-events:none），不影响工具交互；尊重 prefers-reduced-motion。
   =========================================================== */
(function () {
  try {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var canvas = document.createElement('canvas');
    canvas.id = 'nebula-particles';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var w, h, particles = [];
    var colors = [
      'rgba(22,199,178,0.35)',   /* cyan  */
      'rgba(157,124,242,0.32)',  /* purple*/
      'rgba(248,152,242,0.28)',  /* pink  */
      'rgba(242,212,121,0.25)'   /* gold  */
    ];
    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    function Particle() {
      this.x = Math.random() * w; this.y = Math.random() * h;
      this.r = Math.random() * 2 + 1;
      this.sx = Math.random() * 0.4 - 0.2; this.sy = Math.random() * 0.4 - 0.2;
      this.c = colors[(Math.random() * colors.length) | 0];
    }
    Particle.prototype.update = function () {
      this.x += this.sx; this.y += this.sy;
      if (this.x < 0 || this.x > w) this.sx *= -1;
      if (this.y < 0 || this.y > h) this.sy *= -1;
    };
    Particle.prototype.draw = function () {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.c; ctx.fill();
    };
    var num = window.innerWidth < 768 ? 40 : 80;
    for (var i = 0; i < num; i++) particles.push(new Particle());
    if (reduce) { particles.forEach(function (p) { p.draw(); }); return; }
    (function anim() {
      ctx.clearRect(0, 0, w, h);
      for (var j = 0; j < particles.length; j++) { particles[j].update(); particles[j].draw(); }
      requestAnimationFrame(anim);
    })();
  } catch (e) { /* 静默失败，不影响页面 */ }
})();
