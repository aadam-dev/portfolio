"""The photographed desk (public/workspace/wide.webp), rebuilt in Blender from code.

    .cache/bpy-venv/bin/python scripts/desk-photo/build.py [--samples 160] [--scale 1] [--out path]

Everything is placed through the camera solved from the photo (camera.json, place.py), so a render
lines up with the photo pixel for pixel. Used for the realism gate: the render goes next to the
photo, and only if it holds up does the site switch to this scene.

Units are metres; x right, y away from the camera, z up. The desk top is at z = TOP.
"""

import argparse
import math
import os
import random
import sys

import bpy  # noqa: I001
import bmesh
from mathutils import Euler, Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
ASSETS = os.path.join(ROOT, ".cache", "desk")
OUT = os.path.join(ROOT, ".cache", "desk-photo")
TEX = os.path.join(OUT, "tex")
os.makedirs(TEX, exist_ok=True)
sys.path.insert(0, HERE)
import place  # noqa: E402

C = place.C
TOP = 0.75
NIGHT = False

ap = argparse.ArgumentParser()
ap.add_argument("--samples", type=int, default=160)
ap.add_argument("--scale", type=float, default=1.0, help="1 = the photo's 1536 px; 2560/1536 for the full render")
ap.add_argument("--out", default=os.path.join(OUT, "render.png"))
ap.add_argument("--no-render", action="store_true")
args = ap.parse_args(sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:])

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# the helper and material section of the first desk build (helpers end where its room begins)
_src = open(os.path.join(ROOT, "scripts", "desk-blender", "build.py")).read()
_a = _src.index("# ---------------------------------------------------------------- helpers")
_b = _src.index("# ---------------------------------------------------------------- the room")
exec(compile(_src[_a:_b], "desk-blender/build.py (helpers)", "exec"))  # noqa: S102

random.seed(7)


def W(x, y, z=0.0):
    """Desk-top frame (z above the desk top) to world."""
    return Vector((x, y, TOP + z))


def G(u, v, z=0.0):
    """World point where photo pixel (u, v) meets the plane z above the desk top."""
    return W(*place.ground(u, v, z))


def emit(name, color, strength):
    m, nt, out = new_mat(name)
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = lin(color)
    e.inputs["Strength"].default_value = strength
    nt.links.new(e.outputs[0], out.inputs["Surface"])
    return m


def tinted_image(name, path, scale, hue=0.5, sat=1.0, val=1.0, rough=0.4, coat=0.0, bump=0.0, rot=0.0):
    """An image texture in object space, tinted, with optional bump from its own luminance."""
    m = principled(name, rough=rough)
    nt, b = m.node_tree, bsdf_of(m)
    N, L = nt.nodes, nt.links
    tc = N.new("ShaderNodeTexCoord")
    mp = N.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = scale
    mp.inputs["Rotation"].default_value = (0, 0, rot)
    t = N.new("ShaderNodeTexImage")
    t.image = image(path)
    t.projection = "BOX"
    t.projection_blend = 0.2
    hsv = N.new("ShaderNodeHueSaturation")
    hsv.inputs["Hue"].default_value = hue
    hsv.inputs["Saturation"].default_value = sat
    hsv.inputs["Value"].default_value = val
    L.new(tc.outputs["Object"], mp.inputs["Vector"])
    L.new(mp.outputs["Vector"], t.inputs["Vector"])
    L.new(t.outputs["Color"], hsv.inputs["Color"])
    L.new(hsv.outputs["Color"], b.inputs["Base Color"])
    setin(b, "Coat Weight", coat)
    setin(b, "Coat Roughness", 0.2)
    if bump:
        bp = N.new("ShaderNodeBump")
        bp.inputs["Strength"].default_value = bump
        bp.inputs["Distance"].default_value = 0.0005
        L.new(t.outputs["Color"], bp.inputs["Height"])
        L.new(bp.outputs["Normal"], b.inputs["Normal"])
    return m


def rounded_slab(name, w, d, h, r, mat, loc, rot=0.0, segs=8):
    """A flat slab with rounded corners in plan (mats, phones, coasters)."""
    bm = bmesh.new()
    pts = []
    for cx, cy, a0 in ((w / 2 - r, d / 2 - r, 0), (-w / 2 + r, d / 2 - r, 90), (-w / 2 + r, -d / 2 + r, 180), (w / 2 - r, -d / 2 + r, 270)):
        for i in range(segs + 1):
            a = math.radians(a0 + 90 * i / segs)
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    bot = [bm.verts.new((x, y, 0)) for x, y in pts]
    top = [bm.verts.new((x, y, h)) for x, y in pts]
    bm.faces.new(bot[::-1])
    bm.faces.new(top)
    n = len(pts)
    for i in range(n):
        bm.faces.new((bot[i], bot[(i + 1) % n], top[(i + 1) % n], top[i]))
    uv = bm.loops.layers.uv.verify()
    for f in bm.faces:
        for lp in f.loops:
            lp[uv].uv = (lp.vert.co.x / w + 0.5, lp.vert.co.y / d + 0.5)
    ob = from_bm(name, bm, [mat], loc=loc, rot=(0, 0, rot))
    bevel(ob, min(h * 0.45, 0.002), 2, angle=30)
    return ob


def shadow_only(ob):
    """Casts shadows but is never seen by the camera (gobos, off-frame casters)."""
    ob.visible_camera = False
    ob.visible_glossy = False
    return ob


# ---------------------------------------------------------------- textures (drawn once)


def make_textures():
    from PIL import Image, ImageDraw, ImageFilter

    # notebook spread: cream paper, faint dot grid, pencil wireframes like the photo
    w, h = 2048, 1400
    im = Image.new("RGB", (w, h), (236, 228, 210))
    d = ImageDraw.Draw(im)
    for x in range(40, w, 44):
        for y in range(40, h, 44):
            d.point((x, y), fill=(205, 196, 178))
    pencil = (110, 104, 96)
    rnd = random.Random(3)
    for page in (0, 1):
        ox = 90 + page * (w // 2)
        for _ in range(4):
            x0 = ox + rnd.randint(0, 420)
            y0 = rnd.randint(80, 900)
            bw, bh = rnd.randint(200, 420), rnd.randint(140, 330)
            d.rectangle((x0, y0, x0 + bw, y0 + bh), outline=pencil, width=3)
            for k in range(rnd.randint(2, 5)):
                yy = y0 + 20 + k * (bh // 6)
                d.line((x0 + 16, yy, x0 + bw * rnd.uniform(0.4, 0.9), yy), fill=pencil, width=2)
            if rnd.random() < 0.5:
                d.line((x0, y0, x0 + bw, y0 + bh), fill=pencil, width=2)
                d.line((x0 + bw, y0, x0, y0 + bh), fill=pencil, width=2)
    d.line((w // 2, 0, w // 2, h), fill=(170, 160, 142), width=6)  # the gutter
    im.filter(ImageFilter.GaussianBlur(0.8)).save(os.path.join(TEX, "notebook.png"))

    # leaf gobo: soft-edged leaf shapes (white = leaf, casts shadow)
    g = Image.new("L", (2048, 2048), 0)
    d = ImageDraw.Draw(g)
    rnd = random.Random(11)
    for _ in range(420):
        cx, cy = rnd.randint(0, 2048), rnd.randint(0, 2048)
        a = rnd.uniform(0, math.pi)
        L_, Wd = rnd.randint(40, 120), rnd.randint(16, 46)
        pts = []
        for i in range(24):
            t = i / 23 * 2 * math.pi
            px_, py_ = L_ * math.cos(t), Wd * math.sin(t) * (0.6 + 0.4 * math.cos(t))
            pts.append((cx + px_ * math.cos(a) - py_ * math.sin(a), cy + px_ * math.sin(a) + py_ * math.cos(a)))
        d.polygon(pts, fill=255)
        d.line((cx, cy, cx + rnd.randint(-160, 160), cy + rnd.randint(60, 220)), fill=255, width=rnd.randint(3, 7))
    # leave gaps: keep it dappled, not solid
    g = g.filter(ImageFilter.GaussianBlur(3))
    g.save(os.path.join(TEX, "leaves.png"))

    # kraft paper
    k = Image.effect_noise((512, 512), 26).convert("RGB")
    base = Image.new("RGB", (512, 512), (178, 136, 92))
    Image.blend(base, k, 0.12).filter(ImageFilter.GaussianBlur(0.6)).save(os.path.join(TEX, "kraft.png"))

    # milk tea marbling for the cup
    t = Image.new("RGB", (512, 1024), (150, 98, 58))
    d = ImageDraw.Draw(t)
    rnd = random.Random(5)
    for _ in range(70):
        x = rnd.randint(0, 512)
        y = rnd.randint(0, 1024)
        d.line([(x + rnd.randint(-40, 40) * i / 6, y + i * 30) for i in range(7)], fill=(222, 196, 160), width=rnd.randint(8, 30))
    t.filter(ImageFilter.GaussianBlur(14)).save(os.path.join(TEX, "milktea.png"))


make_textures()

# ---------------------------------------------------------------- materials

M = {}
hw = os.path.join(ASSETS, "hardwood2_diffuse.jpg")
# walnut: the hardwood scan, warmer and darker, grain running across the desk
M["walnut"] = tinted_image("walnut", hw, (0.8, 0.8, 0.8), hue=0.485, sat=1.05, val=0.42, rough=0.36, coat=0.3, bump=0.03)
M["walnut_edge"] = tinted_image("walnut_edge", hw, (6, 6, 6), hue=0.48, sat=1.3, val=0.5, rough=0.4)
M["plaster"] = bumpy("plaster", "#dcc7a8", 0.92, scale=60, strength=0.12)
M["felt"] = bumpy("felt", "#33302d", 0.97, scale=900, strength=0.35, Sheen_Weight=0.35)
M["alu"] = bumpy("alu", "#b9b8b4", 0.34, scale=1800, strength=0.02, metal=1.0)
M["alu_dark"] = principled("alu_dark", "#5d5f62", 0.36, metal=1.0)
M["black_glass"] = principled("black_glass", "#040405", 0.3, Coat_Weight=0.25, Coat_Roughness=0.12)
M["bezel"] = principled("bezel", "#141416", 0.4)
M["kb_frame"] = principled("kb_frame", "#3c3e41", 0.42, metal=0.6)
M["cap_cream"] = bumpy("cap_cream", "#e9e1cf", 0.55, scale=600, strength=0.02)
M["cap_grey"] = bumpy("cap_grey", "#8f9396", 0.55, scale=600, strength=0.02)
M["laptop_keys"] = principled("laptop_keys", "#16171a", 0.6)
M["mouse"] = principled("mouse", "#d9d0c3", 0.32, Coat_Weight=0.4)
M["lamp_black"] = principled("lamp_black", "#151515", 0.45, metal=0.3)
M["lamp_inner"] = principled("lamp_inner", "#f3efe6", 0.6)
M["paper"] = textured("paper", os.path.join(TEX, "notebook.png"), rough=0.8)
M["page_edge"] = pages()
M["leather"] = bumpy("leather", "#2a2622", 0.6, scale=300, strength=0.08)
M["pen"] = principled("pen", "#121212", 0.25, metal=0.5)
M["cork"] = bumpy("cork", "#b48759", 0.85, scale=260, strength=0.4)
M["glass"] = principled("glass", "#ffffff", 0.03, Transmission_Weight=1.0, IOR=1.45)
M["tea"] = principled("tea", rough=0.2, Subsurface_Weight=0.35, Subsurface_Radius=(0.01, 0.006, 0.003))
_t = M["tea"].node_tree.nodes.new("ShaderNodeTexImage")
_t.image = image(os.path.join(TEX, "milktea.png"))
M["tea"].node_tree.links.new(_t.outputs["Color"], bsdf_of(M["tea"]).inputs["Base Color"])
M["pearl"] = principled("pearl", "#1b100b", 0.12, Coat_Weight=1.0, Subsurface_Weight=0.3)
M["straw"] = principled("straw", "#c4452f", 0.35, Coat_Weight=0.5)
M["kraft"] = textured("kraft", os.path.join(TEX, "kraft.png"), rough=0.7)
M["window_film"] = principled("window_film", "#ffffff", 0.2, Transmission_Weight=1.0, IOR=1.0)
M["nut"] = bumpy("nut", "#9a6a3c", 0.5, scale=120, strength=0.3)
M["phone"] = principled("phone", "#0b0b0c", 0.08, Coat_Weight=1.0, Coat_Roughness=0.02)
M["phone_rim"] = principled("phone_rim", "#3a3b3d", 0.3, metal=1.0)
M["book_green"] = bumpy("book_green", "#2f4a3a", 0.7, scale=400, strength=0.1)
M["book_cream"] = bumpy("book_cream", "#d8c7a3", 0.75, scale=400, strength=0.1)
M["book_red"] = bumpy("book_red", "#7f3424", 0.7, scale=400, strength=0.1)
M["book_slate"] = bumpy("book_slate", "#2d3337", 0.7, scale=400, strength=0.1)
M["orange"] = principled("orange", "#ff6a1a", 0.35)
M["frame_white"] = principled("frame_white", "#efe7da", 0.6)
M["shelf"] = tinted_image("shelf", hw, (3, 3, 3), hue=0.47, sat=1.2, val=0.32, rough=0.5)
M["sheer"] = principled("sheer", "#e8d6ba", 0.85, Emission_Color=lin("#ffe2bd"), Emission_Strength=0.35)
M["leaf"] = principled("leaf", "#2f5a2a", 0.45, Subsurface_Weight=0.2)
M["pot"] = bumpy("pot", "#c9b9a2", 0.8, scale=200, strength=0.1)
M["gobo"] = None  # built below

# ---------------------------------------------------------------- room

desk_front = G(768, 845)[1]
wall_y = C["ywall"]
box("desk", (2.6, wall_y - desk_front + 0.02, 0.035), loc=W(0, (wall_y + desk_front) / 2 - 0.01, -0.0175), mat=M["walnut"], bev=0.004)
box("desk_edge", (2.6, 0.006, 0.035), loc=W(0, desk_front - 0.003 - 0.01, -0.0175), mat=M["walnut_edge"])
box("floor", (6, 6, 0.01), loc=(0, 0, 0), mat=M["walnut_edge"])

# back wall with a window on the left: wall pieces around the opening
win_x0, win_x1 = -1.6, place.at_depth(357, 150, wall_y)[0]
win_z0 = place.at_depth(357, 282, wall_y)[2] + TOP
win_z1 = TOP + 1.4
box("wall_right", (3.0, 0.08, 2.4), loc=(win_x1 + 1.5, wall_y + 0.04, TOP + 0.4), mat=M["plaster"])
box("wall_below_window", (win_x1 - win_x0, 0.08, win_z0 - TOP + 0.8), loc=((win_x0 + win_x1) / 2, wall_y + 0.04, (win_z0 + TOP - 0.8) / 2), mat=M["plaster"])
box("wall_above_window", (win_x1 - win_x0, 0.08, 0.6), loc=((win_x0 + win_x1) / 2, wall_y + 0.04, win_z1 + 0.3), mat=M["plaster"])
box("window_frame_v", (0.035, 0.1, win_z1 - win_z0), loc=(win_x1 - 0.0175, wall_y + 0.02, (win_z0 + win_z1) / 2), mat=M["frame_white"], bev=0.003)
box("window_sill", (win_x1 - win_x0, 0.12, 0.03), loc=((win_x0 + win_x1) / 2, wall_y + 0.03, win_z0 - 0.015), mat=M["frame_white"], bev=0.003)
box("window_sheer", (win_x1 - win_x0, 0.01, win_z1 - win_z0), loc=((win_x0 + win_x1) / 2, wall_y + 0.07, (win_z0 + win_z1) / 2), mat=M["sheer"])

# dark shelf at the far right edge
sx_ = place.at_depth(1478, 300, wall_y - 0.05)[0]
box("shelf_side", (0.03, 0.3, 1.6), loc=(sx_ + 0.015, wall_y - 0.15, TOP + 0.3), mat=M["shelf"])
for zz in (0.38, 0.7):
    box(f"shelf_board_{zz}", (0.4, 0.3, 0.025), loc=(sx_ + 0.2, wall_y - 0.15, TOP + zz), mat=M["shelf"])

# ---------------------------------------------------------------- mat, keyboard, mouse

rounded_slab("mat", C["matW"], C["matD"], 0.003, 0.012, M["felt"], W(0, 0, 0))

kb = empty("keyboard", loc=W(C["kx"], C["ky"], 0))
box("kb_case", (0.33, 0.115, 0.02), loc=(0, 0, 0.01), mat=M["kb_frame"], bev=0.004, parent=kb)
# a 75% layout: function row, number row and four rows, arrows at the bottom right
rows = [
    [1] + [1] * 12 + [1, 1],
    [1] * 13 + [2, 1],
    [1.5] + [1] * 12 + [1.5, 1],
    [1.75] + [1] * 11 + [2.25, 1],
    [2.25] + [1] * 10 + [1.75, 1, 1],
    [1.25, 1.25, 1.25, 6.25, 1, 1, 1, 1, 1, 1],
]
U = 0.0195
grey_keys = {(0, 0), (1, 13), (2, 0), (3, 0), (3, 12), (4, 0), (4, 11)}
for ri, row in enumerate(rows):
    x = -0.155
    y = 0.045 - ri * U
    for ci, wd in enumerate(row):
        grey = (ri, ci) in grey_keys or ri == 5 or ci == len(row) - 1 or (ri == 0 and ci in (1, 2, 3, 4, 9, 10, 11, 12))
        if ri == 5 and ci == 3:
            grey = False
        cap = box(f"cap_{ri}_{ci}", (wd * U - 0.0028, U - 0.0028, 0.0085), loc=(x + wd * U / 2, y, 0.0225), mat=M["cap_grey" if grey else "cap_cream"], bev=0.0018, segs=2, parent=kb)
        cap.scale = (1, 1, 1)
        x += wd * U

mo = G(1070, 700)
mouse = sphere("mouse", 0.03, loc=(mo.x, mo.y, TOP + 0.003), scale=(1.0, 1.75, 0.55), mat=M["mouse"])
mouse.rotation_euler = (0, 0, math.radians(-4))

# ---------------------------------------------------------------- laptop on a stand, two side screens

sx, sy, sz, tilt = C["sx"], C["sy"], C["sz"], C["tilt"]
stand_foot = G(770, 600)
st = empty("stand", loc=(sx, stand_foot.y, TOP))
box("stand_base", (0.2, 0.12, 0.008), loc=(0, 0.0, 0.004), mat=M["alu"], bev=0.003, parent=st)
for side in (-1, 1):
    leg = box(f"stand_leg{side}", (0.012, 0.03, 0.12), loc=(side * 0.08, 0.03, 0.06), mat=M["alu"], bev=0.003, parent=st)
    leg.rotation_euler = (math.radians(-28), 0, 0)
# the laptop deck rises from the front (towards the camera) to the hinge under the screen
hinge = W(sx, sy, sz - 0.006)
# walk along the ray through the deck's front edge in the photo until it is 22 cm from the hinge
_best = None
for _i in range(400):
    _z = 0.02 + _i * 0.0004
    _p = W(*place.ground(765, 538, _z))
    _d = abs((_p - hinge).length - 0.22)
    if _best is None or _d < _best[0]:
        _best = (_d, _p)
front = _best[1]
deck_len = (hinge - front).length
deck_ang = math.atan2(hinge.z - front.z, hinge.y - front.y)
deck = box("laptop_deck", (0.305, deck_len, 0.012), loc=(front + hinge) / 2, rot=(deck_ang, 0, 0), mat=M["alu_dark"], bev=0.004)
kbd = box("laptop_keys", (0.27, deck_len * 0.5, 0.001), loc=(0, deck_len * 0.15, 0.0062), mat=M["laptop_keys"], parent=deck)
box("trackpad", (0.11, deck_len * 0.28, 0.0008), loc=(0, -deck_len * 0.28, 0.0062), mat=M["alu"], parent=deck)

up = Vector((0, math.sin(tilt), math.cos(tilt)))


def panel(name, x0, x1, y_off=0.0, height=0.195, bottom=sz):
    """A screen panel: dark bezel slab with a glossy black screen face toward the camera."""
    w = x1 - x0
    c = W((x0 + x1) / 2, sy + y_off, bottom) + up * (height / 2)
    ob = box(name, (w + 0.012, 0.006, height + 0.012), loc=c + Vector((0, 0.004, 0)), rot=(-tilt, 0, 0), mat=M["bezel"], bev=0.003)
    face = box(name + "_glass", (w, 0.001, height), loc=c - Vector((0, 0.0005, 0)), rot=(-tilt, 0, 0), mat=M["black_glass"])
    return ob, face


panel("laptop_lid", sx - 0.15, sx + 0.15)
# side screens from the photo's quads, in the same plane as the laptop screen
lx0 = place.at_depth(296, 335, sy)[0]
lx1 = place.at_depth(579, 335, sy)[0]
rx0 = place.at_depth(951, 335, sy)[0]
rx1 = place.at_depth(1240, 335, sy)[0]
side_h = place.at_depth(296, 231, sy)[2] - place.at_depth(296, 437, sy)[2]
side_bottom = place.at_depth(296, 437, sy)[2]
panel("screen_left", lx0, lx1, 0.004, side_h, side_bottom)
panel("screen_right", rx0, rx1, 0.004, side_h, side_bottom)
for x in (lx1 + 0.006, rx0 - 0.006):
    box(f"hinge_{x:.2f}", (0.008, 0.012, side_h * 0.9), loc=W(x, sy + 0.006, side_bottom + side_h / 2), mat=M["alu_dark"], bev=0.002)

# ---------------------------------------------------------------- left: lamp, books, device, notebook

lb = G(58, 548)
lamp = empty("lamp", loc=lb)
cyl("lamp_base", 0.075, 0.018, loc=(0, 0, 0), mat=M["lamp_black"], base=True, parent=lamp)
head = Vector(place.at_depth(240, 200, wall_y - 0.08))
head_w = W(head.x, head.y, head.z)
elbow = W(lb.x - TOP * 0 - lb.x + place.at_depth(28, 300, lb.y)[0], lb.y, place.at_depth(28, 300, lb.y)[2])
tube("lamp_pole", [lb + Vector((0, 0, 0.01)), elbow], 0.007, M["lamp_black"])
tube("lamp_arm", [elbow, head_w + Vector((-0.06, 0, 0.0))], 0.006, M["lamp_black"])
sphere("lamp_joint", 0.012, loc=elbow, mat=M["lamp_black"])
shade = cyl("lamp_shade", 0.03, 0.08, loc=head_w, mat=M["lamp_black"], r2=0.027)
shade.rotation_euler = (math.radians(-10), math.radians(-28), 0)
inner = cyl("lamp_inner", 0.039, 0.004, loc=head_w, mat=M["lamp_inner"])
inner.rotation_euler = shade.rotation_euler
inner.location = head_w + Vector((0.03, 0, -0.05))

# five books stacked flat at the back left (bottom to top: slate, cream, red, cream, green)
bf = G(272, 540)
y_books = bf.y + 0.11
z = 0.0
for i, (mat, th) in enumerate([("book_slate", 0.034), ("book_cream", 0.03), ("book_red", 0.034), ("book_cream", 0.028), ("book_green", 0.026)]):
    wdt = 0.27 - i * 0.008
    b = box(f"book{i}", (wdt, 0.2, th), loc=W(bf.x - wdt / 2 + 0.005 * (i % 2), y_books, z + th / 2), mat=M[mat], bev=0.003, segs=2)
    b.data.materials.append(M["page_edge"])
    z += th

dev = G(372, 590)
box("device", (0.12, 0.07, 0.03), loc=W(dev.x - TOP * 0, dev.y, 0.015) - Vector((0, 0, 0)), mat=M["alu"], bev=0.006)
cyl("device_knob", 0.022, 0.026, loc=W(dev.x - 0.015, dev.y + 0.005, 0.03), mat=M["alu"], base=True)
box("device_button", (0.018, 0.012, 0.004), loc=W(dev.x + 0.035, dev.y - 0.02, 0.031), mat=M["orange"], bev=0.002)

nb = G(175, 700, 0.01)
note = empty("notebook", loc=nb, rot=(0, 0, math.radians(-14)))
box("notebook_cover", (0.42, 0.28, 0.004), loc=(0, 0, 0.002), mat=M["leather"], bev=0.002, parent=note)
pg = box("notebook_pages", (0.405, 0.265, 0.008), loc=(0, 0, 0.008), mat=M["paper"], parent=note)
pen = cyl("pen", 0.0045, 0.14, loc=(-0.02, 0.02, 0.016), mat=M["pen"], parent=note)
pen.rotation_euler = (math.radians(90), 0, math.radians(68))

# ---------------------------------------------------------------- right: cup, pouch, phone, ball, plant

co = G(1283, 615, 0.004)
rounded_slab("coaster", 0.1, 0.1, 0.006, 0.05, M["cork"], co - Vector((0, 0, 0.004)))
cup = empty("cup", loc=co + Vector((0, 0, 0.006)))
cup_h = place.at_depth(1283, 445, co.y)[2] - (co.z - TOP)
cyl("cup_glass", 0.03, cup_h, mat=M["glass"], r2=0.045, base=True, caps=False, parent=cup)
cyl("cup_tea", 0.0285, cup_h * 0.86, mat=M["tea"], r2=0.042, base=True, parent=cup)
for i in range(26):
    a = random.uniform(0, 2 * math.pi)
    r_ = random.uniform(0, 0.022)
    sphere(f"pearl{i}", 0.0055, loc=(r_ * math.cos(a), r_ * math.sin(a), 0.007 + random.uniform(0, 0.022)), mat=M["pearl"], parent=cup)
straw = cyl("straw", 0.0045, cup_h * 1.25, loc=(0.012, 0.0, 0.01), mat=M["straw"], base=True, parent=cup)
straw.rotation_euler = (0, math.radians(-6), 0)

po = G(1405, 645)
pouch = empty("pouch", loc=po, rot=(0, 0, math.radians(-8)))
pb = box("pouch_body", (0.095, 0.035, 0.13), loc=(0, 0, 0.065), mat=M["kraft"], bev=0.01, segs=3, parent=pouch)
subsurf(pb, 1)
box("pouch_window", (0.06, 0.002, 0.06), loc=(0, -0.019, 0.055), mat=M["window_film"], parent=pouch)
for i in range(18):
    sphere(f"nut{i}", 0.006, loc=(random.uniform(-0.025, 0.025), -0.012, random.uniform(0.03, 0.08)), scale=(1.3, 0.9, 1.0), mat=M["nut"], parent=pouch)

ph = G(1318, 705, 0.0)
phone = rounded_slab("phone", 0.075, 0.155, 0.008, 0.01, M["phone_rim"], ph, rot=math.radians(28))
rounded_slab("phone_glass", 0.071, 0.151, 0.0006, 0.009, M["phone"], ph + Vector((0, 0, 0.008)), rot=math.radians(28))

bs = G(1495, 548)
ball_c = W(bs.x + 0.02, bs.y + 0.02, 0.13)
cyl("ball_stand", 0.055, 0.014, loc=W(bs.x + 0.02, bs.y + 0.02, 0), mat=M["walnut_edge"], base=True)
bt = os.path.join(ROOT, ".cache", "desk-blender", "tex", "basketball.png")
ball_mat = textured("ball", bt, rough=0.55) if os.path.exists(bt) else principled("ball", "#c25a28", 0.55)
sphere("ball", 0.12, loc=ball_c, mat=ball_mat)

# plant: the pothos model, hanging from a pot on the shelf top right
plant = empty("plant", loc=W(place.at_depth(1290, 120, wall_y - 0.12)[0], wall_y - 0.12, 0.3))
cyl("pot", 0.08, 0.12, loc=(0, 0, 0), mat=M["pot"], r2=0.09, base=True, parent=plant)
try:
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(ASSETS, "DiffuseTransmissionPlant.glb"))
    new = [o for o in bpy.data.objects if o not in before]
    bpy.context.view_layer.update()
    pts = [o.matrix_world @ Vector(c_) for o in new if o.type == "MESH" for c_ in o.bound_box]
    lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    k = 0.55 / max(1e-6, hi.z - lo.z)
    fit = empty("plant_fit", parent=plant)
    fit.scale = (k, k, k)
    fit.location = (-(lo.x + hi.x) / 2 * k, -(lo.y + hi.y) / 2 * k, -lo.z * k + 0.1)
    for o in new:
        if o.parent is None:
            o.parent = fit
        if "firefly" in o.name:
            bpy.data.objects.remove(o, do_unlink=True)
except Exception as e:  # keep going without it
    print("plant import failed:", e)

# ---------------------------------------------------------------- light: golden hour from the left

world = bpy.data.worlds.new("world")
scene.world = world
world.use_nodes = True
wn = world.node_tree
wn.nodes.clear()
wo = wn.nodes.new("ShaderNodeOutputWorld")
bg = wn.nodes.new("ShaderNodeBackground")
env = wn.nodes.new("ShaderNodeTexEnvironment")
env.image = bpy.data.images.load(os.path.join(ASSETS, "hdri", "apartment.exr"))
wn.links.new(env.outputs["Color"], bg.inputs["Color"])
bg.inputs["Strength"].default_value = 0.35
wn.links.new(bg.outputs[0], wo.inputs["Surface"])

sun = bpy.data.objects.new("sun", bpy.data.lights.new("sun", "SUN"))
link(sun)
sun.data.energy = 5.5
sun.data.angle = math.radians(0.8)
sun.data.color = (1.0, 0.74, 0.48)
sun_dir = Vector((0.78, 0.55, -0.3)).normalized()
sun.rotation_euler = sun_dir.to_track_quat("-Z", "Y").to_euler()

# leaf gobo between the sun and the wall: dappled shadows like the photo
gobo = bpy.data.materials.new("gobo")
gobo.use_nodes = True
gn = gobo.node_tree
gn.nodes.clear()
go = gn.nodes.new("ShaderNodeOutputMaterial")
tr = gn.nodes.new("ShaderNodeBsdfTransparent")
df = gn.nodes.new("ShaderNodeBsdfDiffuse")
df.inputs["Color"].default_value = (0, 0, 0, 1)
mix = gn.nodes.new("ShaderNodeMixShader")
gt = gn.nodes.new("ShaderNodeTexImage")
gt.image = image(os.path.join(TEX, "leaves.png"), non_color=True)
gn.links.new(gt.outputs["Color"], mix.inputs["Fac"])
gn.links.new(tr.outputs[0], mix.inputs[1])
gn.links.new(df.outputs[0], mix.inputs[2])
gn.links.new(mix.outputs[0], go.inputs["Surface"])
gb = quad("gobo", [(-1.9, -0.6, 2.4), (-0.4, 0.2, 2.6), (-0.4, 0.2, 1.0), (-1.9, -0.6, 0.8)], gobo)
shadow_only(gb)

fill = bpy.data.objects.new("fill", bpy.data.lights.new("fill", "AREA"))
link(fill)
fill.data.size, fill.data.size_y = 2.0, 1.2
fill.data.shape = "RECTANGLE"
fill.data.energy = 60
fill.data.color = (1.0, 0.86, 0.72)
fill.location = (0.4, -2.0, 1.9)
look_at(fill, W(0, 0.1, 0))

# ---------------------------------------------------------------- camera (the solved one)

cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
link(cam)
scene.camera = cam
cam.data.sensor_fit = "HORIZONTAL"
cam.data.sensor_width = 36
cam.data.lens = C["f"] * 36 / C["image"][0]
cam.location = (C["camx"], C["camy"], TOP + C["h"])
cam.rotation_euler = (math.pi / 2 - C["pitch"], 0, C["yaw"])
cam.data.dof.use_dof = True
cam.data.dof.focus_distance = (W(0, 0.1, 0.05) - cam.location).length
cam.data.dof.aperture_fstop = 4.0

r = scene.render
r.engine = "CYCLES"
r.resolution_x = int(1536 * args.scale)
r.resolution_y = int(864 * args.scale)
r.image_settings.file_format = "PNG"
c = scene.cycles
c.device = "CPU"
c.samples = args.samples
c.use_adaptive_sampling = True
c.adaptive_threshold = 0.015
c.use_denoising = True
try:
    c.denoiser = "OPENIMAGEDENOISE"
except Exception:
    pass
c.max_bounces = 8
c.transmission_bounces = 8
c.caustics_reflective = False
c.caustics_refractive = False
c.sample_clamp_indirect = 6
vs = scene.view_settings
vs.view_transform = "AgX"
for look in ("AgX - Medium High Contrast", "Medium High Contrast"):
    try:
        vs.look = look
        break
    except Exception:
        pass

if args.no_render:
    raise SystemExit(0)
r.filepath = args.out
bpy.ops.render.render(write_still=True)
print("rendered", args.out)
