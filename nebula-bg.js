/* ===========================================================
   72Tool · 星云粒子背景 v2（匹配 preview.html 截图效果）
   稀疏、小、轻柔的青/紫粒子点缀，不抢内容风头。
   向 <body> 注入固定全屏 canvas，pointer-events:none。
   尊重 prefers-reduced-motion。
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
    /* 根据主题选色：亮色=青，暗色=紫 */
    function colors() {
      var isDark = (document.documentElement.getAttribute('data-theme') || '') === 'dark';
      return isDark
        ? ['rgba(157,124,242,.30)','rgba(157,124,242,.22)','rgba(248,152,242,.18)']
        : ['rgba(22,199,178,.35)','rgba(22,199,178,.25)','rgba(157,124,242,.20)'];
    }
    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    function Particle() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.r = Math.random() * 1.8 + 0.6;        /* 0.6~2.4px（更小更细） */
      this.sx = Math.random() * 0.3 - 0.15;       /* 更慢 */
      this.sy = Math.random() * 0.3 - 0.15;
      this.c = colors()[(Math.random() * colors().length) | 0];
    }
    Particle.prototype.update = function () {
      this.x += this.sx;
      this.y += this.sy;
      if (this.x < 0 || this.x > w) this.sx *= -1;
      if (this.y < 0 || this.y > h) this.sy *= -1;
    };
    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.c;
      ctx.fill();
    };
    /* 粒子数量：移动端 25，桌面 50（稀疏） */
    var num = window.innerWidth < 768 ? 25 : 50;
    for (var i = 0; i < num; i++) particles.push(new Particle());
    if (reduce) { particles.forEach(function (p) { p.draw(); }); return; }
    (function anim() {
      ctx.clearRect(0, 0, w, h);
      for (var j = 0; j < particles.length; j++) {
        particles[j].update();
        particles[j].draw();
      }
      requestAnimationFrame(anim);
    })();
    /* 主题切换时重绘颜色 */
    var observer = new MutationObserver(function () {
      var clrs = colors();
      particles.forEach(function (p) { p.c = clrs[(Math.random() * clrs.length) | 0]; });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  } catch (e) { /* 静默失败 */ }
})();
