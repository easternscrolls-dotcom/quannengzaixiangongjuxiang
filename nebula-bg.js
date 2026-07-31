/* ═══════════════════════════════════════════
   72Tool · Nebula Cloud 粒子背景（工具页/分类页）
   稀疏轻柔粒子，青(亮)/紫(暗)
   通过 apply_nebula.py 注入到所有非首页页面的 </body> 前
   ═══════════════════════════════════════════ */
(function(){
    var canvas = document.createElement('canvas');
    canvas.id = 'nebula-particles';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
    document.body.insertBefore(canvas, document.body.firstChild);

    var ctx = canvas.getContext('2d');
    var w, h, particles = [];
    var particleNum = window.innerWidth < 768 ? 25 : 50;
    var isDark = false;

    function resizeCanvas(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    resizeCanvas();
    window.addEventListener('resize', function(){ resizeCanvas(); particleNum = window.innerWidth < 768 ? 25 : 50; initParticle(); });

    // 检测主题
    function checkTheme(){ isDark = (document.documentElement.dataset.theme || '') === 'dark'; }

    class Particle {
        constructor(){
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.r = Math.random() * 1.8 + 0.4;
            this.speedX = Math.random() * 0.3 - 0.15;
            this.speedY = Math.random() * 0.3 - 0.15;
            this.color = isDark ? 'rgba(157,124,242,0.35)' : 'rgba(22,199,178,0.35)';
        }
        update(){
            this.x += this.speedX; this.y += this.speedY;
            if(this.x < 0 || this.x > w) this.speedX *= -1;
            if(this.y < 0 || this.y > h) this.speedY *= -1;
        }
        draw(){
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function initParticle(){
        checkTheme();
        particles = [];
        for(var i = 0; i < particleNum; i++) particles.push(new Particle());
    }

    function animate(){
        ctx.clearRect(0, 0, w, h);
        particles.forEach(function(p){ p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }

    // 尊重 prefers-reduced-motion
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
        initParticle();
        animate();

        // 主题切换时重新着色
        if(typeof MutationObserver !== 'undefined'){
            new MutationObserver(function(){
                var wasDark = isDark;
                checkTheme();
                if(wasDark !== isDark) initParticle();
            }).observe(document.documentElement, {attributes:true, attributeFilter:['data-theme']});
        }
    }
})();
