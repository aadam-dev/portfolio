"""Photo-matched 3D desk: the scene the site draws, generated from the solved camera.

    .cache/bpy-venv/bin/python scripts/desk-photo/proxies.py

Writes public/workspace/scene.json (camera, proxy shapes, screen corners, chapter targets, all in
three.js coordinates: x right, y up, z toward the camera, desk top at y = 0) and
.cache/desk-photo/wide-clean.png (the photo with the mouse and the basketball painted out, so
they can move). The site projects the photo onto these shapes from the photo's own camera.
"""

import json
import math
import os

import cv2
import numpy as np

import place

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
C = place.C
G, D = place.ground, place.at_depth
WALL = C["ywall"]


def t(p):
    """Desk frame (x right, y away, z up) to three.js (x right, y up, z toward the camera)."""
    return [round(p[0], 4), round(p[2], 4), round(-p[1], 4)]


def card(id_, box, depth, **kw):
    """A flat card standing at `depth`, covering the photo box (u0, v0, u1, v1)."""
    u0, v0, u1, v1 = box
    return dict(id=id_, kind="quad", corners=[t(D(u0, v0, depth)), t(D(u1, v0, depth)), t(D(u1, v1, depth)), t(D(u0, v1, depth))], **kw)


def box(id_, cx, cy, z0, w, d, h, rot=0.0, **kw):
    return dict(id=id_, kind="box", center=t((cx, cy, z0 + h / 2)), size=[w, h, d], rotY=round(-rot, 4), **kw)


scene = {"photo": {"w": 1536, "h": 864}, "proxies": [], "screens": {}, "hotspots": {}, "stops": {}}

# camera: position, a point it looks at, vertical field of view
cam = (C["camx"], C["camy"], C["h"])
fwd = place.ray(768, 432)
scene["camera"] = {
    "position": t(cam),
    "target": t((cam[0] + fwd[0], cam[1] + fwd[1], cam[2] + fwd[2])),
    "fov": round(math.degrees(2 * math.atan(432 / C["f"])), 4),
    "aspect": 1536 / 864,
}

P = scene["proxies"]
front = G(768, 845)[1]
# the room: desk top, its front edge, the wall, and the floor seen under the desk
P.append(dict(id="desk", kind="quad", corners=[t((-1.4, WALL, 0)), t((1.4, WALL, 0)), t((1.4, front, 0)), t((-1.4, front, 0))]))
P.append(dict(id="desk_edge", kind="quad", corners=[t((-1.4, front, 0)), t((1.4, front, 0)), t((1.4, front, -0.06)), t((-1.4, front, -0.06))]))
P.append(dict(id="wall", kind="quad", corners=[t((-1.6, WALL, 1.4)), t((1.8, WALL, 1.4)), t((1.8, WALL, 0)), t((-1.6, WALL, 0))]))

# things on the desk, front to back
P.append(box("mat", 0, 0, 0, C["matW"], C["matD"], 0.003))
P.append(box("keyboard", C["kx"], C["ky"], 0, 0.33, 0.115, 0.03))
mo = G(1070, 696, 0.0)
P.append(dict(id="mouse", kind="ellipsoid", center=t((mo[0], mo[1], 0.009)), radii=[0.032, 0.017, 0.056], moving=True, hotspot="mouse"))
ph = G(1318, 705)
P.append(box("phone", ph[0], ph[1], 0, 0.075, 0.155, 0.009, rot=math.radians(28), hotspot="phone"))
nb = G(175, 700)
P.append(box("notebook", nb[0], nb[1], 0, 0.42, 0.28, 0.012, rot=math.radians(-14), hotspot="notebook"))
dv = G(372, 590)
P.append(box("device", dv[0], dv[1], 0, 0.12, 0.07, 0.045, hotspot="device"))

# laptop on its stand: the deck rises from its front edge to the hinge under the screen
sx, sy, sz, tilt = C["sx"], C["sy"], C["sz"], C["tilt"]
hinge = np.array([sx, sy, sz])
best = None
for i in range(400):
    p = np.array(G(765, 538, 0.02 + i * 0.0004))
    d_ = abs(np.linalg.norm(p - hinge) - 0.22)
    if best is None or d_ < best[0]:
        best = (d_, p)
fr = best[1]
P.append(dict(id="deck", kind="quad", corners=[t((sx - 0.155, sy, sz)), t((sx + 0.155, sy, sz)), t((sx + 0.155, fr[1], fr[2])), t((sx - 0.155, fr[1], fr[2]))], hotspot="screens"))
stand_y = G(770, 600)[1]
P.append(card("stand", (630, 520, 915, 615), stand_y + 0.02))

# the three screens (live apps go on these), in the plane the camera solve found
up = np.array([0, math.sin(tilt), math.cos(tilt)])


def screen(x0, x1, bottom, height):
    bl, br = np.array([x0, sy, bottom]), np.array([x1, sy, bottom])
    return [t(bl + up * height), t(br + up * height), t(br), t(bl)]


scene["screens"]["center"] = screen(sx - 0.15, sx + 0.15, sz, 0.195)
side_bottom = D(296, 437, sy)[2]
side_h = D(296, 231, sy)[2] - side_bottom
scene["screens"]["left"] = screen(D(296, 335, sy)[0], D(579, 335, sy)[0], side_bottom, side_h)
scene["screens"]["right"] = screen(D(951, 335, sy)[0], D(1240, 335, sy)[0], side_bottom, side_h)
# the screens' bezels and the hinges between them, as one card just behind the glass
P.append(card("screen_frames", (288, 222, 1250, 446), sy + 0.004))

# back left: lamp, books; back right: cup, pouch, ball, plant, shelf
lb = G(58, 548)
P.append(dict(id="lamp_base", kind="cyl", center=t((lb[0], lb[1], 0.009)), r=0.075, h=0.018))
P.append(card("lamp", (0, 128, 300, 548), lb[1], hotspot="lamp"))
bk0, bk1 = G(10, 545), G(272, 545)
book_top = D(272, 393, bk1[1] + 0.1)[2]
P.append(box("books", (bk0[0] + bk1[0]) / 2, bk1[1] + 0.1, 0, bk1[0] - bk0[0], 0.2, book_top, hotspot="books"))
co = G(1283, 615)
cup_h = D(1283, 445, co[1])[2]
P.append(dict(id="coaster", kind="cyl", center=t((co[0], co[1], 0.003)), r=0.05, h=0.006))
P.append(dict(id="cup", kind="cyl", center=t((co[0], co[1], 0.006 + cup_h / 2)), r=0.045, r2=0.032, h=cup_h, hotspot="brand"))
P.append(card("straw", (1262, 365, 1290, 450), co[1] + 0.01))
po = G(1405, 645)
P.append(box("pouch", po[0], po[1], 0, 0.1, 0.04, D(1405, 520, po[1] - 0.02)[2], rot=math.radians(-8), hotspot="brand"))
bs = G(1495, 548)
ball_r = 0.11
ball = (bs[0] + 0.02, bs[1] + 0.03, 0.012 + ball_r)
P.append(dict(id="ball_stand", kind="cyl", center=t((ball[0], ball[1], 0.007)), r=0.06, h=0.014))
P.append(dict(id="ball", kind="sphere", center=t(ball), radius=ball_r, moving=True, hotspot="ball"))
P.append(card("plant", (1120, 0, 1430, 520), WALL - 0.06))
P.append(card("shelf", (1462, 0, 1536, 600), WALL - 0.12))

# chapter targets: where the camera looks for each stop, and how far back it stands
def target(u, v, z=0.0):
    return t(G(u, v, z))


scene["stops"] = {
    "desk": {"look": scene["camera"]["target"], "dist": None},
    "lamp": {"look": t(D(200, 320, lb[1])), "dist": 0.75},
    "notebook": {"look": target(175, 700), "dist": 0.65},
    "books": {"look": t(D(140, 470, bk1[1])), "dist": 0.7},
    "device": {"look": target(372, 590, 0.02), "dist": 0.5},
    "phone": {"look": target(1318, 705), "dist": 0.55},
    "brand": {"look": t((co[0] + 0.04, co[1], 0.08)), "dist": 0.65},
    "ball": {"look": t(ball), "dist": 0.75},
    "screens": {"look": t((sx, sy, sz + 0.0975)), "dist": None},
}
scene["lamp"] = {"bulb": t(D(250, 240, WALL - 0.12))}

out = os.path.join(ROOT, "public", "workspace", "scene.json")
with open(out, "w") as fh:
    json.dump(scene, fh, indent=1)
print("wrote", out, len(P), "proxies")

# ---------------------------------------------------------------- clean plate

src = os.path.join(ROOT, ".cache", "desk-photo", "wide-1536.png")
img = cv2.imread(src)
mask = np.zeros(img.shape[:2], np.uint8)
cv2.ellipse(mask, (1070, 697), (60, 44), 0, 0, 360, 255, -1)  # the mouse and its contact shadow
cv2.circle(mask, (1480, 462), 88, 255, -1)  # the basketball
clean = cv2.inpaint(img, mask, 9, cv2.INPAINT_TELEA)
# felt and wood need texture, not smears: add matched grain back inside the mask
noise = cv2.GaussianBlur(np.random.default_rng(1).normal(0, 7, img.shape).astype(np.float32), (0, 0), 0.8)
clean = np.where(mask[..., None] > 0, np.clip(clean.astype(np.float32) + noise, 0, 255), clean).astype(np.uint8)
cv2.imwrite(os.path.join(ROOT, ".cache", "desk-photo", "wide-clean.png"), clean)
print("clean plate written")
