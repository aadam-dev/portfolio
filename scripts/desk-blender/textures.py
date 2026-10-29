"""Book jackets and the phone lock screen, drawn with PIL.

Titles and authors only, in plain type: no publisher cover art.
Run by build.py; writes PNGs into the given folder.
"""

import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FONTS = "/usr/share/fonts"


def font(name, size):
    paths = {
        "serif": ["truetype/crosextra/Caladea-Regular.ttf", "truetype/dejavu/DejaVuSerif.ttf"],
        "serif-b": ["truetype/crosextra/Caladea-Bold.ttf", "truetype/dejavu/DejaVuSerif-Bold.ttf"],
        "charter": ["type1/gsfonts/c059013l.pfb", "X11/Type1/c0648bt_.pfb", "truetype/crosextra/Caladea-Regular.ttf"],
        "sans": ["opentype/inter/Inter-Medium.otf"],
        "sans-b": ["opentype/inter/Inter-Bold.otf"],
        "sans-l": ["opentype/inter/Inter-Light.otf"],
        "display": ["opentype/inter/InterDisplay-SemiBold.otf"],
    }[name]
    for p in paths:
        full = os.path.join(FONTS, p)
        if os.path.exists(full):
            return ImageFont.truetype(full, size)
    raise FileNotFoundError(name)


def find_font(fragment):
    for root, _, files in os.walk(FONTS):
        for f in files:
            if fragment.lower() in f.lower():
                return os.path.join(root, f)
    return None


def cloth(img, tone, amount=6):
    """A faint woven grain so the boards do not read as flat plastic."""
    import random

    rnd = random.Random(7)
    px = img.load()
    w, h = img.size
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            d = rnd.randint(-amount, amount)
            r, g, b = px[x, y][:3]
            c = (max(0, min(255, r + d)), max(0, min(255, g + d)), max(0, min(255, b + d)))
            px[x, y] = c
            if x + 1 < w:
                px[x + 1, y] = c
    return img.filter(ImageFilter.GaussianBlur(0.6))


def centered(d, box, text, f, fill, spacing=0):
    x0, y0, x1, y1 = box
    if spacing:
        widths = [d.textlength(ch, font=f) for ch in text]
        total = sum(widths) + spacing * (len(text) - 1)
        x = x0 + (x1 - x0 - total) / 2
        bb = d.textbbox((0, 0), text, font=f)
        y = y0 + (y1 - y0 - (bb[3] - bb[1])) / 2 - bb[1]
        for ch, cw in zip(text, widths):
            d.text((x, y), ch, font=f, fill=fill)
            x += cw + spacing
        return
    bb = d.textbbox((0, 0), text, font=f)
    w, h = bb[2] - bb[0], bb[3] - bb[1]
    d.text((x0 + (x1 - x0 - w) / 2 - bb[0], y0 + (y1 - y0 - h) / 2 - bb[1]), text, font=f, fill=fill)


BOOKS = {
    # key: (title lines for the spine, author, board colour, ink colour, accent)
    "laws": ("THE LAWS OF HUMAN NATURE", "ROBERT GREENE", (24, 24, 26), (214, 178, 104), (214, 178, 104)),
    "mastery": ("MASTERY", "ROBERT GREENE", (232, 226, 212), (28, 26, 24), (150, 32, 28)),
    "quiet": ("QUIET", "SUSAN CAIN", (38, 70, 86), (244, 240, 230), (226, 188, 92)),
}


def fit(d, text, kind, max_w, max_h, track):
    """Largest size (with letter spacing as a share of size) that fits the box."""
    size = int(max_h)
    while size > 8:
        f = font(kind, size)
        sp = int(size * track)
        if d.textlength(text, font=f) + sp * (len(text) - 1) <= max_w:
            return f, sp
        size -= 2
    return font(kind, 8), 0


def spine(key, length_m, thick_m, out):
    """Spine laid flat: text runs along the book's height, left to right."""
    title, author, board, ink, accent = BOOKS[key]
    ppm = 2400  # pixels per metre
    w, h = int(length_m * ppm), max(64, int(thick_m * ppm))
    img = cloth(Image.new("RGB", (w, h), board), board)
    d = ImageDraw.Draw(img)
    pad = int(h * 0.2)
    # two thin rules near the head and tail, like a stamped hardcover
    for x in (int(w * 0.03), int(w * 0.97)):
        d.line([(x, pad), (x, h - pad)], fill=accent, width=max(2, h // 40))
    tf, sp = fit(d, title, "serif-b", w * 0.6, h * 0.5, 0.12)
    tw = d.textlength(title, font=tf) + sp * (len(title) - 1)
    x0 = int(w * 0.07)
    centered(d, (x0, 0, x0 + tw, h), title, tf, ink, spacing=sp)
    af, asp = fit(d, author, "sans", w * 0.24, h * 0.24, 0.16)
    aw = d.textlength(author, font=af) + asp * (len(author) - 1)
    x1 = int(w * 0.93) - aw
    centered(d, (x1, 0, x1 + aw, h), author, af, accent if key != "mastery" else ink, spacing=asp)
    img.save(out)


def cover(key, length_m, width_m, out):
    """Front board seen from above: u runs along the book's height, v across it."""
    title, author, board, ink, accent = BOOKS[key]
    ppm = 2400
    w, h = int(length_m * ppm), int(width_m * ppm)
    img = cloth(Image.new("RGB", (w, h), board), board)
    d = ImageDraw.Draw(img)
    if key == "quiet":
        centered(d, (0, int(h * 0.18), w, int(h * 0.48)), "QUIET", font("serif-b", int(h * 0.2)), ink, spacing=int(h * 0.03))
        sub = ["THE POWER OF INTROVERTS IN A WORLD", "THAT CAN'T STOP TALKING"]
        sf = font("sans", int(h * 0.034))
        for i, line in enumerate(sub):
            centered(d, (0, int(h * (0.52 + i * 0.055)), w, int(h * (0.57 + i * 0.055))), line, sf, (210, 214, 210), spacing=int(h * 0.004))
        d.line([(w * 0.44, h * 0.7), (w * 0.56, h * 0.7)], fill=accent, width=max(2, h // 160))
        centered(d, (0, int(h * 0.74), w, int(h * 0.84)), "SUSAN CAIN", font("sans-b", int(h * 0.05)), ink, spacing=int(h * 0.012))
    else:
        centered(d, (0, int(h * 0.3), w, int(h * 0.55)), title, font("serif", int(h * 0.1)), ink)
        centered(d, (0, int(h * 0.7), w, int(h * 0.8)), author, font("sans", int(h * 0.045)), accent, spacing=int(h * 0.01))
    # the cover is seen from above with the spine toward the camera: rotate so v=0 sits at the spine
    img.save(out)


def lockscreen(out):
    w, h = 720, 1500
    img = Image.new("RGB", (w, h), (18, 20, 24))
    # soft gradient wallpaper
    px = img.load()
    for y in range(h):
        t = y / h
        for x in range(0, w):
            u = x / w
            r = int(30 + 40 * (1 - t) + 20 * u)
            g = int(34 + 26 * (1 - t))
            b = int(52 + 50 * (1 - t) - 10 * u)
            px[x, y] = (r, g, b)
    d = ImageDraw.Draw(img)
    centered(d, (0, 150, w, 220), "Thursday 29 October", font("sans", 34), (230, 232, 238))
    centered(d, (0, 220, w, 420), "9:41", font("display", 190), (245, 246, 250))
    # two notifications
    for i, (app, msg) in enumerate([("Site", "New brief: retail POS, 6 weeks"), ("GitHub", "CI passed on main")]):
        y = 960 + i * 170
        d.rounded_rectangle([40, y, w - 40, y + 140], radius=34, fill=(60, 64, 76))
        d.rounded_rectangle([66, y + 30, 146, y + 110], radius=20, fill=(196, 110, 56) if i == 0 else (40, 40, 44))
        d.text((170, y + 30), app, font=font("sans-b", 30), fill=(236, 238, 242))
        d.text((170, y + 74), msg, font=font("sans", 28), fill=(200, 204, 212))
    img.save(out)


def screen_placeholder(label, out, size=(1280, 800)):
    img = Image.new("RGB", size, (246, 245, 242))
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, size[0], 70], fill=(30, 32, 36))
    centered(d, (0, 0, size[0], size[1]), label, font("sans", 60), (60, 60, 60))
    img.save(out)


def make_all(folder, dims):
    os.makedirs(folder, exist_ok=True)
    for key, (L, W, T) in dims.items():
        spine(key, L, T, os.path.join(folder, f"spine-{key}.png"))
        cover(key, L, W, os.path.join(folder, f"cover-{key}.png"))
    lockscreen(os.path.join(folder, "lockscreen.png"))


def art_print(out):
    """An abstract print: sun over the Gulf of Guinea, in the site's terracotta and ink."""
    w, h = 1040, 1440
    img = Image.new("RGB", (w, h), (236, 229, 214))
    d = ImageDraw.Draw(img)
    d.ellipse([w * 0.18, h * 0.16, w * 0.82, h * 0.16 + w * 0.64], fill=(201, 92, 46))
    for i in range(7):
        y = h * 0.52 + i * h * 0.055
        d.rectangle([w * 0.1, y, w * 0.9, y + h * 0.022], fill=(34, 52, 70) if i % 2 == 0 else (64, 94, 112))
    d.rectangle([w * 0.1, h * 0.9, w * 0.9, h * 0.905], fill=(34, 34, 34))
    d.text((w * 0.1, h * 0.92), "ACCRA, 5.6037\u00b0 N", font=font("sans", 26), fill=(60, 56, 50))
    img = cloth(img, None, amount=4)
    img.save(out)
