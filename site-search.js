(function(){
  if (document.getElementById('searchInput')) return;   // 首页已有搜索，跳过
  if (!window.TOOL_INDEX || !window.TOOL_INDEX.length) return;
  var bar = document.createElement('div');
  bar.id = 'siteSearch';
  bar.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999;background:#fff;border-bottom:1px solid #e5e7eb;padding:7px 12px;display:flex;gap:8px;align-items:center;box-shadow:0 1px 5px rgba(0,0,0,.06)';
  bar.innerHTML = '<input id="ssInput" placeholder="搜索工具，如 PDF合并、图片压缩、贷款计算" data-ph-zh="搜索工具，如 PDF合并、图片压缩、贷款计算" data-ph-en="Search tools, e.g. PDF merge, image compression, loan calculator" style="flex:1;padding:9px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;outline:none;">';
  document.body.appendChild(bar);
  document.body.style.paddingTop = '46px';
  var dd = document.createElement('div');
  dd.id = 'ssDropdown';
  dd.style.cssText = 'position:fixed;top:46px;left:0;right:0;z-index:999;background:#fff;max-height:62vh;overflow:auto;box-shadow:0 6px 16px rgba(0,0,0,.12);display:none';
  document.body.appendChild(dd);
  var inp = document.getElementById('ssInput');
  function render(q){
    q = (q||'').trim().toLowerCase();
    dd.innerHTML = '';
    if (!q){ dd.style.display='none'; return; }
    var hit = window.TOOL_INDEX.filter(function(t){ return t.n.toLowerCase().indexOf(q) >= 0; }).slice(0, 10);
    if (!hit.length){ dd.style.display='none'; return; }
    hit.forEach(function(t){
      var a = document.createElement('a');
      a.href = t.p;
      a.style.cssText = 'display:block;padding:11px 16px;border-bottom:1px solid #f1f1f1;color:#111;text-decoration:none;font-size:14px';
      a.textContent = t.n + '  ·  ' + t.c;
      dd.appendChild(a);
    });
    dd.style.display = 'block';
  }
  inp.addEventListener('input', function(){ render(inp.value); });
  document.addEventListener('click', function(e){ if (e.target !== inp) dd.style.display='none'; });
})();