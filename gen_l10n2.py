# -*- coding: utf-8 -*-
"""从当前 index.html（多级分类架构，已修复）重新生成本地化首页 en/ja/es。
按中文文本匹配双语块（忽略英文侧，规避 &amp; / 一词多译问题）。"""
import re, os

SRC = 'index.html'
src = open(SRC, encoding='utf-8').read()

# zh 文本 -> {en, ja, es}
TR = {
 '72Tool · 一站式资源平台':
    {'en':'72Tool · All-in-One Resource Platform','ja':'72Tool · ワンストップ資源プラットフォーム','es':'72Tool · Plataforma Todo en Uno'},
 '在线工具、网站主题模板与开源源码，一站直达。数百款免费工具即开即用，精美模板与源码一键预览下载。':
    {'en':'Online tools, website templates and open-source code in one place. Hundreds of free tools, beautiful templates and source ready to preview &amp; download.',
     'ja':'オンラインツール、サイトテーマ、オープンソースを一站で。数百の無料ツール、美しいテーマとソースをすぐにプレビュー・ダウンロード。',
     'es':'Herramientas online, plantillas web y código abierto en un solo lugar. Cientos de herramientas gratis, temas y código listos para previsualizar y descargar.'},
 '在线预览':{'en':'Preview','ja':'オンライン预览','es':'Previsualizar'},
 '下载资源':{'en':'Download','ja':'ダウンロード','es':'Descargar'},
 '加载更多':{'en':'Load More','ja':'もっと読み込む','es':'Cargar más'},
 '🍪 Cookie 使用提示':{'en':'🍪 Cookie Notice','ja':'🍪 Cookie について','es':'🍪 Aviso de Cookie'},
 '我们使用 Cookie 记住您的偏好（如语言设置），并在您同意后用于投放 Google 广告。点击「同意」即表示接受广告类 Cookie；点击「拒绝」则仅使用必要 Cookie。':
    {'en':'We use cookies to remember your preferences (such as language) and, with your consent, to serve Google ads. Click "Accept" or "Decline".',
     'ja':'Cookie を使用して設定（言語など）を記憶し、同意後に Google 広告を配信します。「同意」で広告 Cookie を、「拒绝」で必須のみを使用します。',
     'es':'Usamos cookies para recordar tus preferencias (como el idioma) y, con tu consentimiento, para mostrar anuncios de Google. Elige «Aceptar» o «Rechazar».'},
 '隐私政策':{'en':'Privacy','ja':'プライバシーポリシー','es':'Política de Privacidad'},
 '同意':{'en':'Accept','ja':'同意','es':'Aceptar'},
 '拒绝':{'en':'Decline','ja':'拒绝','es':'Rechazar'},
 '关于我们':{'en':'About','ja':'会社概要','es':'Acerca de'},
 '使用条款':{'en':'Terms','ja':'利用規約','es':'Términos'},
 '站点地图':{'en':'Sitemap','ja':'サイトマップ','es':'Mapa del Sitio'},
 '联系我们':{'en':'Contact','ja':'お問い合わせ','es':'Contacto'},
 '72Tool 全球资源平台 · 中文 / English / 日本語 / Español':
    {'en':'72Tool Global Platform · 中文 / English / 日本語 / Español',
     'ja':'72Tool グローバル資源プラットフォーム · 中文 / English / 日本語 / Español',
     'es':'72Tool Plataforma Global · 中文 / English / 日本語 / Español'},
}

META = {
 'en':{'title':'72Tool | Free Online Tools, Website Templates &amp; Open-Source Code',
   'desc':'72Tool is a one-stop platform: hundreds of free online tools, beautiful website templates and open-source code. No registration, no installation.',
   'lang':'en','copy':'© 2026 72tool.com. All rights reserved.','fav':'⭐ My Favorites','canon':'https://72tool.com/en/'},
 'ja':{'title':'72Tool | 無料オンラインツール・サイトテーマ・オープンソース',
   'desc':'72Toolは無料オンラインツール、サイトテーマ、オープンソースを一站式提供。登録不要、インストール不要。',
   'lang':'ja','copy':'© 2026 72Tool 72tool.com 無断転載禁止','fav':'⭐ お気に入り','canon':'https://72tool.com/jp/'},
 'es':{'title':'72Tool | Herramientas online, plantillas web y código abierto gratis',
   'desc':'72Tool es una plataforma todo en uno: cientos de herramientas gratuitas, plantillas web y código abierto. Sin registro, sin instalación.',
   'lang':'es','copy':'© 2026 72tool.com. Todos los derechos reservados.','fav':'⭐ Favoritos','canon':'https://72tool.com/es/'},
}

def localize(html, lang):
    m = META[lang]
    for zh, tr in TR.items():
        pat = (r'<span class="i18n-zh">'+re.escape(zh)+r'</span>'
               r'\s*<span class="i18n-en[^"]*">.*?</span>')
        repl = '<span>'+tr[lang]+'</span>'
        html = re.sub(pat, repl, html, flags=re.DOTALL)
    html = html.replace('<h4>⭐ 我的收藏</h4>', '<h4>'+m['fav']+'</h4>')
    html = html.replace('© 2026 72Tool 72tool.com 保留所有权利', m['copy'])
    html = re.sub(r'<html lang="[^"]*"', '<html lang="'+m['lang']+'" data-site-lang="'+lang+'"', html, count=1)
    html = re.sub(r'(?s)(<title>).*?(</title>)', r'\g<1>'+m['title']+r'\g<2>', html, count=1)
    html = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="'+m['desc']+'">', html, count=1)
    html = re.sub(r'<meta property="og:title" content="[^"]*">', '<meta property="og:title" content="'+m['title']+'">', html, count=1)
    html = re.sub(r'<meta property="og:description" content="[^"]*">', '<meta property="og:description" content="'+m['desc']+'">', html, count=1)
    html = re.sub(r'<meta name="twitter:title" content="[^"]*">', '<meta name="twitter:title" content="'+m['title']+'">', html, count=1)
    html = re.sub(r'<meta name="twitter:description" content="[^"]*">', '<meta name="twitter:description" content="'+m['desc']+'">', html, count=1)
    html = re.sub(r'<link rel="canonical" href="[^"]*">', '<link rel="canonical" href="'+m['canon']+'">', html, count=1)
    html = re.sub(r'<meta property="og:url" content="[^"]*">', '<meta property="og:url" content="'+m['canon']+'">', html, count=1)
    return html

os.makedirs('en', exist_ok=True); os.makedirs('jp', exist_ok=True); os.makedirs('es', exist_ok=True)
for lang in ['en','ja','es']:
    out = localize(src, lang)
    # 注意：日文目录是 jp/（不是 ja/），与站点 URL /jp/ 一致
    fn = {'en':'en/index.html','ja':'jp/index.html','es':'es/index.html'}[lang]
    open(fn,'w',encoding='utf-8').write(out)
    left = len(re.findall(r'<span class="i18n-zh">', out))
    print('wrote', fn, 'len=', len(out), '| leftover i18n-zh:', left, '| MAIN_CONFIG:', out.count('MAIN_CONFIG'), '| data-site-lang:', out.count('data-site-lang'))
