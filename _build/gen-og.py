# -*- coding: utf-8 -*-
"""
gen-og.py —— 生成社交分享封面图（Open Graph / Twitter Card）与站点图标。

背景：站内 22 个页面引用 https://72tool.com/og-cover.png，但仓库中不存在任何图片资源，
分享到 Facebook / X / LinkedIn / WhatsApp 时会破图，严重影响海外社交传播的点击率。

产出（1200×630，符合 OG 推荐比例 1.91:1）：
    og-cover.png        默认（英文，对应 x-default）
    og-cover-zh|en|jp|es|de|ar.png   各语言版本
    favicon-32.png / favicon-180.png / favicon.svg

视觉：沿用站点 nebula 主题深色底 + 青/紫/粉三色柔光，保证在浅色与深色社交流中都醒目。
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1200, 630

# 品牌配色（取自 index.html CSS 变量）
BG        = (11, 16, 28)
CARD      = (23, 32, 51)
CYAN      = (22, 199, 178)
PURPLE    = (157, 124, 242)
PINK      = (248, 152, 242)
GOLD      = (242, 212, 121)
TEXT_MAIN = (241, 245, 249)
TEXT_SUB  = (148, 163, 184)

FONTS = "C:/Windows/Fonts/"
F_LAT_B = FONTS + "segoeuib.ttf"
F_LAT_R = FONTS + "segoeui.ttf"
F_CJK_B = FONTS + "msyhbd.ttc"
F_CJK_R = FONTS + "msyh.ttc"
F_JP_B  = FONTS + "yugothb.ttc"
F_AR_B  = FONTS + "tahomabd.ttf"

# 各语言文案：标语 + 副标题 + 特性标签
LANGS = {
    "en": dict(font_b=F_LAT_B, font_r=F_LAT_R, rtl=False,
               tag="370+ Free Online Tools",
               sub="Image · PDF · Video · Audio · Text · Developer",
               chips=["No Sign-up", "Runs in Browser", "Files Never Uploaded"]),
    "zh": dict(font_b=F_CJK_B, font_r=F_CJK_R, rtl=False,
               tag="370+ 款免费在线工具",
               sub="图片 · PDF · 视频 · 音频 · 文本 · 开发",
               chips=["无需注册", "浏览器本地运行", "文件不上传"]),
    "jp": dict(font_b=F_JP_B, font_r=F_JP_B, rtl=False,
               tag="370以上の無料オンラインツール",
               sub="画像 · PDF · 動画 · 音声 · テキスト · 開発",
               chips=["登録不要", "ブラウザで動作", "アップロード不要"]),
    "es": dict(font_b=F_LAT_B, font_r=F_LAT_R, rtl=False,
               tag="Más de 370 herramientas gratis",
               sub="Imagen · PDF · Vídeo · Audio · Texto · Desarrollo",
               chips=["Sin registro", "Funciona en el navegador", "Sin subir archivos"]),
    "de": dict(font_b=F_LAT_B, font_r=F_LAT_R, rtl=False,
               tag="Über 370 kostenlose Online-Tools",
               sub="Bild · PDF · Video · Audio · Text · Entwicklung",
               chips=["Ohne Anmeldung", "Läuft im Browser", "Kein Upload"]),
    "ar": dict(font_b=F_AR_B, font_r=F_AR_B, rtl=True,
               tag="أكثر من 370 أداة مجانية على الإنترنت",
               sub="صور · PDF · فيديو · صوت · نص · برمجة",
               chips=["بدون تسجيل", "يعمل في المتصفح", "بدون رفع الملفات"]),
}


def shape(text, rtl):
    """阿拉伯文需要字形整形 + BiDi 重排，否则字母断开且顺序颠倒。"""
    if not rtl:
        return text
    import arabic_reshaper
    from bidi.algorithm import get_display
    return get_display(arabic_reshaper.reshape(text))


def font(path, size):
    return ImageFont.truetype(path, size)


def text_w(draw, s, f):
    return draw.textbbox((0, 0), s, font=f)[2]


def glow(size, color, radius):
    """生成一团柔光（用于星云背景）"""
    d = radius * 2
    layer = Image.new("RGBA", (d, d), (0, 0, 0, 0))
    dr = ImageDraw.Draw(layer)
    dr.ellipse([0, 0, d, d], fill=color + (255,))
    return layer.filter(ImageFilter.GaussianBlur(radius * 0.55))


def background():
    img = Image.new("RGB", (W, H), BG)
    base = img.convert("RGBA")
    # 三团星云柔光
    for cx, cy, col, r, op in [
        (150, 120, CYAN,   300, 78),
        (1080, 190, PURPLE, 330, 70),
        (900, 620, PINK,   280, 52),
    ]:
        g = glow(0, col, r)
        a = g.split()[3].point(lambda v: int(v * op / 255))
        g.putalpha(a)
        base.alpha_composite(g, (cx - r, cy - r))
    img = base.convert("RGB")

    d = ImageDraw.Draw(img, "RGBA")
    # 顶部品牌渐变条
    for x in range(W):
        t = x / W
        if t < 0.5:
            k = t / 0.5
            c = tuple(int(CYAN[i] + (PURPLE[i] - CYAN[i]) * k) for i in range(3))
        else:
            k = (t - 0.5) / 0.5
            c = tuple(int(PURPLE[i] + (PINK[i] - PURPLE[i]) * k) for i in range(3))
        d.line([(x, 0), (x, 7)], fill=c)
    return img


def rounded(d, box, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)


def build(lang, cfg, out):
    img = background()
    d = ImageDraw.Draw(img, "RGBA")
    rtl = cfg["rtl"]

    # ---- 品牌标识 ----
    fb = font(F_LAT_B, 62)
    logo_box = [72, 66, 72 + 74, 66 + 74]
    rounded(d, logo_box, 20, fill=CYAN)
    fl = font(F_LAT_B, 40)
    lw = text_w(d, "72", fl)
    d.text((72 + 37 - lw / 2, 66 + 37 - 26), "72", font=fl, fill=(6, 24, 30))

    d.text((170, 74), "72Tool", font=fb, fill=TEXT_MAIN)
    fdom = font(F_LAT_R, 25)
    d.text((176 + text_w(d, "72Tool", fb), 100), "72tool.com", font=fdom, fill=TEXT_SUB)

    # ---- 主标语（自动缩放以适应画布宽度）----
    tag = shape(cfg["tag"], rtl)
    size = 78
    while size > 40:
        ftag = font(cfg["font_b"], size)
        if text_w(d, tag, ftag) <= W - 144:
            break
        size -= 3
    ftag = font(cfg["font_b"], size)
    tw = text_w(d, tag, ftag)
    tx = (W - 144 - tw + 144) if rtl else 72
    d.text((tx, 224), tag, font=ftag, fill=TEXT_MAIN)

    # ---- 副标题 ----
    sub = shape(cfg["sub"], rtl)
    ssz = 32
    while ssz > 20:
        fsub = font(cfg["font_r"], ssz)
        if text_w(d, sub, fsub) <= W - 144:
            break
        ssz -= 2
    fsub = font(cfg["font_r"], ssz)
    sw = text_w(d, sub, fsub)
    sx = (W - 72 - sw) if rtl else 72
    d.text((sx, 224 + size + 26), sub, font=fsub, fill=TEXT_SUB)

    # ---- 特性标签 ----
    fchip = font(cfg["font_r"], 24)
    chips = [shape(c, rtl) for c in cfg["chips"]]
    widths = [text_w(d, c, fchip) + 44 for c in chips]
    y = 468
    if rtl:
        x = W - 72
        for c, cw in zip(chips, widths):
            rounded(d, [x - cw, y, x, y + 52], 26, fill=(255, 255, 255, 15),
                    outline=(255, 255, 255, 46), width=1)
            d.text((x - cw + 22, y + 12), c, font=fchip, fill=(203, 213, 225))
            x -= cw + 16
    else:
        x = 72
        for c, cw in zip(chips, widths):
            rounded(d, [x, y, x + cw, y + 52], 26, fill=(255, 255, 255, 15),
                    outline=(255, 255, 255, 46), width=1)
            d.text((x + 22, y + 12), c, font=fchip, fill=(203, 213, 225))
            x += cw + 16

    # ---- 底部品牌渐变条 ----
    for x in range(W):
        t = x / W
        c = tuple(int(CYAN[i] + (GOLD[i] - CYAN[i]) * t) for i in range(3))
        d.line([(x, H - 6), (x, H)], fill=c)

    img.save(out, "PNG", optimize=True)
    return out


def favicons():
    """站点图标：站内此前完全没有 favicon。"""
    out = []
    for size, name in [(32, "favicon-32.png"), (180, "favicon-180.png"), (192, "favicon-192.png")]:
        img = Image.new("RGBA", (size * 4, size * 4), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        s = size * 4
        d.rounded_rectangle([0, 0, s, s], radius=int(s * 0.22), fill=CYAN)
        f = ImageFont.truetype(F_LAT_B, int(s * 0.5))
        bb = d.textbbox((0, 0), "72", font=f)
        d.text(((s - bb[2]) / 2, (s - bb[3]) / 2 - bb[1]), "72", font=f, fill=(6, 24, 30))
        img = img.resize((size, size), Image.LANCZOS)
        p = os.path.join(ROOT, name)
        img.save(p, "PNG", optimize=True)
        out.append(name)

    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
           '<rect width="64" height="64" rx="14" fill="#16C7B2"/>'
           '<text x="32" y="44" font-family="Segoe UI,Arial,sans-serif" font-size="30" '
           'font-weight="700" text-anchor="middle" fill="#06181E">72</text></svg>')
    with open(os.path.join(ROOT, "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(svg)
    out.append("favicon.svg")
    return out


def main():
    made = []
    for lang, cfg in LANGS.items():
        p = os.path.join(ROOT, "og-cover-%s.png" % lang)
        build(lang, cfg, p)
        made.append(os.path.basename(p))
    # 默认封面 = 英文版（x-default 指向 /en/）
    default = os.path.join(ROOT, "og-cover.png")
    build("en", LANGS["en"], default)
    made.append("og-cover.png")
    made += favicons()

    print("gen-og: %d 个资源已生成" % len(made))
    for m in made:
        sz = os.path.getsize(os.path.join(ROOT, m)) / 1024
        print("  %-22s %7.1f KB" % (m, sz))


if __name__ == "__main__":
    main()
