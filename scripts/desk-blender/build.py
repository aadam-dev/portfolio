"""The hero desk, built and rendered in Blender (Cycles), entirely from code.

    .cache/bpy-venv/bin/python scripts/desk-blender/build.py --view desktop --phase day

Writes the plate to .cache/desk-blender/out/{view}-{phase}.png and the
projected screen corners and hotspots to public/desk/plates/screens.json,
so the live screens can be laid exactly over the rendered ones.

Units are metres. X runs left to right across the desk, Y away from the
camera, Z up. The desk top sits at Z = 0.75.
"""

import argparse
import json
import math
import os
import sys
import time

import bpy  # noqa: I001  (bpy must load before bmesh)
import bmesh
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Euler, Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
CACHE = os.path.join(ROOT, ".cache", "desk-blender")
ASSETS = os.path.join(ROOT, ".cache", "desk")
sys.path.insert(0, HERE)
import textures  # noqa: E402

TOP = 0.75
CHAIR_AT = (-0.36, -0.78, 0.0)
BALL_AT = (0.52, 0.27, 0.12)
CHAIR_TURN = -28  # degrees; negative turns the seat toward the desk centre
BOOK_DIMS = {"laws": (0.24, 0.162, 0.05), "mastery": (0.235, 0.156, 0.036), "quiet": (0.212, 0.142, 0.027)}

ap = argparse.ArgumentParser()
ap.add_argument("--view", default="desktop", choices=["desktop", "phone"])
ap.add_argument("--phase", default="day", choices=["day", "night"])
ap.add_argument("--scale", type=float, default=1.0, help="resolution scale for previews")
ap.add_argument("--samples", type=int, default=384)
ap.add_argument("--out", default=None)
ap.add_argument("--screens", default=os.path.join(CACHE, "screens"), help="folder with left/center/right.png")
ap.add_argument("--blend", default=None, help="also save the .blend here")
ap.add_argument("--no-render", action="store_true", help="build the scene and stop (bake.py uses this)")
args = ap.parse_args(sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:])

NIGHT = args.phase == "night"
scene = bpy.context.scene
for ob in list(bpy.data.objects):
    bpy.data.objects.remove(ob, do_unlink=True)


# ---------------------------------------------------------------- helpers


def lin(hexstr):
    """sRGB hex to linear RGBA."""
    h = hexstr.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(h[i : i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (*out, 1.0)


def setin(node, name, val):
    if name in node.inputs:
        node.inputs[name].default_value = val


def new_mat(name):
    m = bpy.data.materials.new(name)
    try:
        m.use_nodes = True
    except Exception:
        pass
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    return m, nt, out


def principled(name, color="#cccccc", rough=0.5, metal=0.0, **kw):
    m, nt, out = new_mat(name)
    b = nt.nodes.new("ShaderNodeBsdfPrincipled")
    setin(b, "Base Color", lin(color) if isinstance(color, str) else color)
    setin(b, "Roughness", rough)
    setin(b, "Metallic", metal)
    for k, v in kw.items():
        setin(b, k.replace("_", " "), v)
    nt.links.new(b.outputs[0], out.inputs["Surface"])
    m["bsdf"] = b.name
    return m


def bsdf_of(m):
    return m.node_tree.nodes[m["bsdf"]]


def image(path, non_color=False):
    im = bpy.data.images.load(path, check_existing=True)
    if non_color:
        im.colorspace_settings.name = "Non-Color"
    return im


def textured(name, path, rough=0.5, **kw):
    m = principled(name, rough=rough, **kw)
    nt = m.node_tree
    t = nt.nodes.new("ShaderNodeTexImage")
    t.image = image(path)
    t.interpolation = "Cubic"
    nt.links.new(t.outputs["Color"], bsdf_of(m).inputs["Base Color"])
    return m


def link(ob, parent=None):
    scene.collection.objects.link(ob)
    if parent is not None:
        ob.parent = parent
    return ob


def empty(name, loc=(0, 0, 0), rot=(0, 0, 0), parent=None):
    e = bpy.data.objects.new(name, None)
    e.location = loc
    e.rotation_euler = rot
    return link(e, parent)


def from_bm(name, bm, mats=(), smooth=False, loc=(0, 0, 0), rot=(0, 0, 0), parent=None):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for m in mats:
        me.materials.append(m)
    if smooth:
        for p in me.polygons:
            p.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    ob.location = loc
    ob.rotation_euler = rot
    return link(ob, parent)


def bevel(ob, width, segs=3, angle=None):
    md = ob.modifiers.new("bevel", "BEVEL")
    md.width = width
    md.segments = segs
    md.limit_method = "ANGLE"
    md.angle_limit = math.radians(angle or 40)
    md.harden_normals = False
    for p in ob.data.polygons:
        p.use_smooth = True
    try:
        ob.data.set_sharp_from_angle(angle=math.radians(35))
    except Exception:
        pass
    return ob


def subsurf(ob, levels=2):
    md = ob.modifiers.new("sub", "SUBSURF")
    md.levels = levels
    md.render_levels = levels
    return ob


def box_bm(sx, sy, sz, center=(0, 0, 0)):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector((v.co.x * sx + center[0], v.co.y * sy + center[1], v.co.z * sz + center[2]))
    return bm


def box_uv(bm, mat_for_normal=None):
    """Planar UVs per face, 0..1 across each face, readable from outside."""
    uv = bm.loops.layers.uv.verify()
    bm.normal_update()
    for f in bm.faces:
        n = f.normal
        ax = max(range(3), key=lambda i: abs(n[i]))
        if ax == 2:
            u_i, v_i = 0, 1
        elif ax == 1:
            u_i, v_i = 0, 2
        else:
            u_i, v_i = 1, 2
        us = [l.vert.co[u_i] for l in f.loops]
        vs = [l.vert.co[v_i] for l in f.loops]
        u0, u1, v0, v1 = min(us), max(us), min(vs), max(vs)
        flip_u = (ax == 1 and n[1] > 0) or (ax == 0 and n[0] < 0) or (ax == 2 and n[2] < 0)
        for l in f.loops:
            u = (l.vert.co[u_i] - u0) / max(1e-9, u1 - u0)
            v = (l.vert.co[v_i] - v0) / max(1e-9, v1 - v0)
            l[uv].uv = (1 - u if flip_u else u, v)
        if mat_for_normal:
            key = ("+" if n[ax] > 0 else "-") + "xyz"[ax]
            f.material_index = mat_for_normal.get(key, 0)
    return bm


def box(name, size, loc=(0, 0, 0), rot=(0, 0, 0), mat=None, bev=0.0, segs=3, parent=None, mats=None, face_mats=None):
    bm = box_bm(*size)
    box_uv(bm, face_mats)
    ob = from_bm(name, bm, mats or ([mat] if mat else []), loc=loc, rot=rot, parent=parent)
    if bev:
        bevel(ob, bev, segs)
    return ob


def cyl(name, r, h, loc=(0, 0, 0), rot=(0, 0, 0), mat=None, segs=64, r2=None, caps=True, parent=None, base=False, smooth=True):
    bm = bmesh.new()
    m = Matrix.Translation((0, 0, h / 2)) if base else Matrix.Identity(4)
    bmesh.ops.create_cone(bm, cap_ends=caps, cap_tris=False, segments=segs, radius1=r, radius2=r if r2 is None else r2, depth=h, matrix=m, calc_uvs=True)
    ob = from_bm(name, bm, [mat] if mat else [], loc=loc, rot=rot, parent=parent)
    if smooth:
        for p in ob.data.polygons:
            p.use_smooth = True
        try:
            ob.data.set_sharp_from_angle(angle=math.radians(40))
        except Exception:
            pass
    return ob


def sphere(name, r, loc=(0, 0, 0), scale=(1, 1, 1), mat=None, parent=None):
    bm = bmesh.new()
    bm.loops.layers.uv.verify()
    bmesh.ops.create_uvsphere(bm, u_segments=48, v_segments=24, radius=r, calc_uvs=True)
    ob = from_bm(name, bm, [mat] if mat else [], smooth=True, loc=loc, parent=parent)
    ob.scale = scale
    return ob


def quad(name, corners, mat, parent=None):
    """A plane from four corners TL, TR, BR, BL with UVs matching an upright image."""
    bm = bmesh.new()
    vs = [bm.verts.new(c) for c in corners]  # vertex order stays TL, TR, BR, BL (the site reads screen corners from it)
    # wound BL, BR, TR, TL so the face looks back at the viewer: three.js culls back faces
    # and a light bake shoots its rays along the normal
    f = bm.faces.new(vs[::-1])
    uv = bm.loops.layers.uv.verify()
    at = dict(zip(vs, [(0, 1), (1, 1), (1, 0), (0, 0)]))
    for l in f.loops:
        l[uv].uv = at[l.vert]
    ob = from_bm(name, bm, [mat], parent=parent)
    return ob


def tube(name, pts, r, mat, parent=None):
    cu = bpy.data.curves.new(name, "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = r
    cu.bevel_resolution = 4
    sp = cu.splines.new("BEZIER")
    sp.bezier_points.add(len(pts) - 1)
    for bp, p in zip(sp.bezier_points, pts):
        bp.co = p
        bp.handle_left_type = bp.handle_right_type = "AUTO"
    cu.materials.append(mat)
    ob = bpy.data.objects.new(name, cu)
    return link(ob, parent)


def look_at(ob, target, track="-Z", up="Y"):
    d = Vector(target) - ob.matrix_world.translation
    ob.rotation_euler = d.to_track_quat(track, up).to_euler()


# ---------------------------------------------------------------- materials


def oak():
    m, nt, out = new_mat("oak")
    N = nt.nodes
    tc = N.new("ShaderNodeTexCoord")
    mp = N.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (1.2, 26.0, 26.0)
    nz = N.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 2.2
    nz.inputs["Detail"].default_value = 10
    nz.inputs["Roughness"].default_value = 0.62
    setin(nz, "Distortion", 0.35)
    ramp = N.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.38
    ramp.color_ramp.elements[0].color = lin("#b88a5c")
    ramp.color_ramp.elements[1].position = 0.66
    ramp.color_ramp.elements[1].color = lin("#d7b48a")
    # fine pores for the bump
    mp2 = N.new("ShaderNodeMapping")
    mp2.inputs["Scale"].default_value = (6, 300, 300)
    nz2 = N.new("ShaderNodeTexNoise")
    nz2.inputs["Scale"].default_value = 3
    nz2.inputs["Detail"].default_value = 4
    bump = N.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.08
    bump.inputs["Distance"].default_value = 0.0004
    b = N.new("ShaderNodeBsdfPrincipled")
    setin(b, "Roughness", 0.38)
    setin(b, "Coat Weight", 0.22)
    setin(b, "Coat Roughness", 0.18)
    L = nt.links
    L.new(tc.outputs["Object"], mp.inputs["Vector"])
    L.new(mp.outputs["Vector"], nz.inputs["Vector"])
    L.new(nz.outputs["Fac"], ramp.inputs["Fac"])
    L.new(ramp.outputs["Color"], b.inputs["Base Color"])
    L.new(tc.outputs["Object"], mp2.inputs["Vector"])
    L.new(mp2.outputs["Vector"], nz2.inputs["Vector"])
    L.new(nz2.outputs["Fac"], bump.inputs["Height"])
    L.new(bump.outputs["Normal"], b.inputs["Normal"])
    L.new(b.outputs[0], out.inputs["Surface"])
    return m


def bumpy(name, color, rough, scale=40, strength=0.06, **kw):
    m = principled(name, color, rough, **kw)
    nt = m.node_tree
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = scale
    nz.inputs["Detail"].default_value = 8
    bp = nt.nodes.new("ShaderNodeBump")
    bp.inputs["Strength"].default_value = strength
    bp.inputs["Distance"].default_value = 0.001
    nt.links.new(nz.outputs["Fac"], bp.inputs["Height"])
    nt.links.new(bp.outputs["Normal"], bsdf_of(m).inputs["Normal"])
    return m


def pages():
    m = principled("pages", "#e9e0cb", 0.75)
    nt = m.node_tree
    tc = nt.nodes.new("ShaderNodeTexCoord")
    wv = nt.nodes.new("ShaderNodeTexWave")
    wv.wave_type = "BANDS"
    wv.bands_direction = "Z"
    wv.inputs["Scale"].default_value = 900
    setin(wv, "Distortion", 0.4)
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.inputs["Factor"].default_value = 0.12
    mix.inputs[6].default_value = lin("#ece4d0")
    mix.inputs[7].default_value = lin("#a89c86")
    nt.links.new(tc.outputs["Object"], wv.inputs["Vector"])
    nt.links.new(wv.outputs["Fac"], mix.inputs["Factor"])
    nt.links.new(mix.outputs[2], bsdf_of(m).inputs["Base Color"])
    return m


def screen_mat(name, path, strength):
    m = principled(name, "#000000", 0.08)
    b = bsdf_of(m)
    setin(b, "Coat Weight", 0.6)
    setin(b, "Coat Roughness", 0.06)
    if os.path.exists(path):
        t = m.node_tree.nodes.new("ShaderNodeTexImage")
        t.image = image(path)
        t.interpolation = "Cubic"
        m.node_tree.links.new(t.outputs["Color"], b.inputs["Emission Color"])
    else:
        setin(b, "Emission Color", lin("#f2f1ec"))
    setin(b, "Emission Strength", strength)
    return m


def steam_mat():
    m, nt, out = new_mat("steam")
    N, L = nt.nodes, nt.links
    tc = N.new("ShaderNodeTexCoord")
    sep = N.new("ShaderNodeSeparateXYZ")
    L.new(tc.outputs["Object"], sep.inputs[0])
    # twist the wisps a little as they rise
    mp = N.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (26, 26, 9)
    mp.inputs["Rotation"].default_value = (0, 0, 0.6)
    nz = N.new("ShaderNodeTexNoise")
    nz.noise_dimensions = "4D"
    nz.inputs["Scale"].default_value = 1.0
    nz.inputs["Detail"].default_value = 3
    setin(nz, "Distortion", 2.2)
    setin(nz, "W", 1.7)
    L.new(tc.outputs["Object"], mp.inputs["Vector"])
    L.new(mp.outputs["Vector"], nz.inputs["Vector"])
    # wisps: keep only the high end of the noise
    ramp = N.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.52
    ramp.color_ramp.elements[0].color = (0, 0, 0, 1)
    ramp.color_ramp.elements[1].position = 0.72
    ramp.color_ramp.elements[1].color = (1, 1, 1, 1)
    L.new(nz.outputs["Fac"], ramp.inputs["Fac"])
    # fade with height (0..H) and with distance from the axis
    H = 0.2
    up = N.new("ShaderNodeMapRange")
    up.inputs["From Min"].default_value = 0.0
    up.inputs["From Max"].default_value = H
    up.inputs["To Min"].default_value = 1.0
    up.inputs["To Max"].default_value = 0.0
    L.new(sep.outputs["Z"], up.inputs["Value"])
    vlen = N.new("ShaderNodeVectorMath")
    vlen.operation = "LENGTH"
    comb = N.new("ShaderNodeCombineXYZ")
    L.new(sep.outputs["X"], comb.inputs["X"])
    L.new(sep.outputs["Y"], comb.inputs["Y"])
    L.new(comb.outputs[0], vlen.inputs[0])
    rad = N.new("ShaderNodeMapRange")
    rad.inputs["From Min"].default_value = 0.0
    rad.inputs["From Max"].default_value = 0.04
    rad.inputs["To Min"].default_value = 1.0
    rad.inputs["To Max"].default_value = 0.0
    L.new(vlen.outputs["Value"], rad.inputs["Value"])
    m1 = N.new("ShaderNodeMath")
    m1.operation = "MULTIPLY"
    L.new(up.outputs[0], m1.inputs[0])
    L.new(rad.outputs[0], m1.inputs[1])
    m2 = N.new("ShaderNodeMath")
    m2.operation = "MULTIPLY"
    L.new(m1.outputs[0], m2.inputs[0])
    L.new(ramp.outputs["Color"], m2.inputs[1])
    m3 = N.new("ShaderNodeMath")
    m3.operation = "MULTIPLY"
    m3.inputs[1].default_value = 14.0 if not NIGHT else 16.0
    L.new(m2.outputs[0], m3.inputs[0])
    vol = N.new("ShaderNodeVolumePrincipled")
    setin(vol, "Color", (0.95, 0.95, 0.95, 1))
    setin(vol, "Anisotropy", 0.45)
    L.new(m3.outputs[0], vol.inputs["Density"])
    L.new(vol.outputs[0], out.inputs["Volume"])
    return m


# ---------------------------------------------------------------- the room

M = {}
M["wall"] = bumpy("wall", "#e6dfd3", 0.92, scale=60, strength=0.05)
M["floor"] = principled("floor", "#6f5a46", 0.55)
if os.path.exists(os.path.join(ASSETS, "hardwood2_diffuse.jpg")):
    M["floor"] = textured("floor", os.path.join(ASSETS, "hardwood2_diffuse.jpg"), rough=0.5)
    _nt = M["floor"].node_tree
    _tc = _nt.nodes.new("ShaderNodeTexCoord")
    _mp = _nt.nodes.new("ShaderNodeMapping")
    _mp.inputs["Scale"].default_value = (0.55, 0.55, 0.55)
    _nt.links.new(_tc.outputs["Object"], _mp.inputs["Vector"])
    _img = [n for n in _nt.nodes if n.type == "TEX_IMAGE"][0]
    _nt.links.new(_mp.outputs["Vector"], _img.inputs["Vector"])
    _hs = _nt.nodes.new("ShaderNodeHueSaturation")
    _hs.inputs["Saturation"].default_value = 0.7
    _hs.inputs["Value"].default_value = 0.8
    _nt.links.new(_img.outputs["Color"], _hs.inputs["Color"])
    _nt.links.new(_hs.outputs["Color"], bsdf_of(M["floor"]).inputs["Base Color"])
M["oak"] = oak()
M["steel"] = principled("steel", "#1b1b1c", 0.45, metal=0.9)
M["felt"] = bumpy("felt", "#2b2c2f", 1.0, scale=300, strength=0.15, Sheen_Weight=0.6)
M["alu"] = principled("alu", "#c9cacd", 0.32, metal=1.0, Anisotropic=0.4)
M["alu_dark"] = principled("alu_dark", "#5c5f64", 0.34, metal=1.0, Anisotropic=0.3)
M["black_gloss"] = principled("black_gloss", "#060607", 0.12, Coat_Weight=0.8, Coat_Roughness=0.05)
M["plastic_black"] = principled("plastic_black", "#121214", 0.55)
M["key"] = principled("key", "#1e1f22", 0.6)
M["keylight"] = principled("keylight", "#e9e7e2", 0.55)
M["ceramic"] = principled("ceramic", "#ebe5da", 0.22, Coat_Weight=0.5, Coat_Roughness=0.08)
M["coffee"] = principled("coffee", "#2a160b", 0.06)
M["crema"] = principled("crema", "#7a4a26", 0.2)
M["cork"] = bumpy("cork", "#a57a4f", 0.85, scale=500, strength=0.3)
M["stone"] = bumpy("stone", "#3d3a36", 0.7, scale=220, strength=0.12)
M["pencil"] = principled("pencil", "#d9a441", 0.45)
M["frame"] = principled("frame", "#2a221b", 0.5)
M["mat_board"] = principled("mat_board", "#f1ede4", 0.9)
M["leather"] = bumpy("leather", "#171617", 0.6, scale=400, strength=0.12)
M["elastic"] = principled("elastic", "#0c0c0d", 0.7)
M["pages"] = pages()
M["lamp"] = principled("lamp", "#141414", 0.42, metal=0.6)
M["lamp_in"] = principled("lamp_in", "#efe9dc", 0.5)
M["brass"] = principled("brass", "#b48a4a", 0.3, metal=1.0)
M["bulb"] = principled("bulb", "#ffffff", 0.2, Emission_Color=lin("#ffd9a8"), Emission_Strength=(30.0 if NIGHT else 0.0))
M["cable"] = principled("cable", "#141415", 0.55)
M["phone_frame"] = principled("phone_frame", "#3a3b3f", 0.3, metal=1.0)

# walls: the back wall is the only one the camera sees; the rest bounce light
WX = -2.6
wall = box("wall", (WX * -1 + 2.2 + 0.2, 0.1, 3.2), loc=((WX + 2.2) / 2, 0.66, 1.6), mat=M["wall"])
floor = box("floor", (6, 5, 0.02), loc=(0, 0, -0.01), mat=M["floor"])
room = []
# left wall with a window opening: the sun throws the frame across the desk and wall
win_c, win_w, win_h = (-0.98, 2.2), 1.4, 1.4
for nm, sz, lc in [
    ("wl_a", (0.1, 2.5, 3.2), (WX, win_c[0] - win_w / 2 - 1.25, 1.6)),
    ("wl_b", (0.1, 2.5, 3.2), (WX, win_c[0] + win_w / 2 + 1.25, 1.6)),
    ("wl_c", (0.1, win_w, win_c[1] - win_h / 2), (WX, win_c[0], (win_c[1] - win_h / 2) / 2)),
    ("wl_d", (0.1, win_w, 3.2 - (win_c[1] + win_h / 2)), (WX, win_c[0], (3.2 + win_c[1] + win_h / 2) / 2)),
    ("mull_v", (0.06, 0.05, win_h), (WX, win_c[0], win_c[1])),
    ("mull_h", (0.06, win_w, 0.05), (WX, win_c[0], win_c[1] + 0.12)),
    ("ceiling", (6, 5, 0.1), (0, 0, 3.05)),
    ("wr", (0.1, 5, 3.2), (2.3, 0, 1.6)),
]:
    room.append(box(nm, sz, loc=lc, mat=M["wall"]))
for ob in room:
    ob.visible_camera = False

# ---------------------------------------------------------------- desk

desk = box("desk_top", (1.62, 0.78, 0.034), loc=(0, 0, TOP - 0.017), mat=M["oak"], bev=0.004)
for sx in (-1, 1):
    for sy in (-1, 1):
        box(f"leg{sx}{sy}", (0.04, 0.04, TOP - 0.034), loc=(sx * 0.75, sy * 0.32, (TOP - 0.034) / 2), mat=M["steel"], bev=0.003)
    box(f"rail{sx}", (0.04, 0.66, 0.04), loc=(sx * 0.75, 0, TOP - 0.06), mat=M["steel"], bev=0.003)
box("rail_back", (1.46, 0.03, 0.06), loc=(0, 0.33, TOP - 0.065), mat=M["steel"], bev=0.002)

box("mat", (0.86, 0.4, 0.003), loc=(0.04, -0.15, TOP + 0.0015), mat=M["felt"], bev=0.0012, segs=2)

HS = {}  # hotspots: name -> world point

# ---------------------------------------------------------------- monitor (centre: the register)

mon = empty("monitor", loc=(0.03, 0.2, TOP))
box("mon_base", (0.25, 0.18, 0.008), loc=(0, 0.04, 0.004), mat=M["alu"], bev=0.003, parent=mon)
box("mon_neck", (0.06, 0.016, 0.33), loc=(0, 0.1, 0.17), rot=(math.radians(-8), 0, 0), mat=M["alu"], bev=0.004, parent=mon)
panel = empty("mon_panel", loc=(0, 0.0, 0.34), rot=(math.radians(-5), 0, 0), parent=mon)
PW, PH = 0.60, 0.375
box("mon_bezel", (PW + 0.014, 0.012, PH + 0.016), loc=(0, 0, 0), mat=M["black_gloss"], bev=0.002, parent=panel)
box("mon_back", (PW + 0.012, 0.012, PH + 0.014), loc=(0, 0.011, 0), mat=M["alu"], bev=0.004, parent=panel)
box("mon_hump", (0.36, 0.03, 0.24), loc=(0, 0.03, -0.02), mat=M["alu"], bev=0.01, parent=panel)
box("mon_chin", (PW + 0.014, 0.008, 0.006), loc=(0, -0.002, -PH / 2 - 0.006), mat=M["alu"], bev=0.002, parent=panel)

# ---------------------------------------------------------------- laptop on a stand (left: Odoo)

lap = empty("laptop", loc=(-0.4, 0.02, TOP), rot=(0, 0, math.radians(16)))
# stand: a tilted aluminium tray on two feet
tray = empty("lap_tray", loc=(0, 0, 0.06), rot=(math.radians(12), 0, 0), parent=lap)
box("tray", (0.27, 0.24, 0.006), loc=(0, 0, 0), mat=M["alu_dark"], bev=0.002, parent=tray)
box("foot_b", (0.24, 0.02, 0.1), loc=(0, 0.1, 0.0), mat=M["alu_dark"], bev=0.003, parent=lap)
box("foot_f", (0.24, 0.02, 0.035), loc=(0, -0.11, 0.0), mat=M["alu_dark"], bev=0.003, parent=lap)
base = empty("lap_base", loc=(0, 0, 0.003), parent=tray)
LW, LD, LT = 0.304, 0.212, 0.0145
box("lap_body", (LW, LD, LT), loc=(0, 0, LT / 2), mat=M["alu"], bev=0.005, segs=4, parent=base)
box("lap_well", (0.276, 0.112, 0.0008), loc=(0, 0.035, LT + 0.0002), mat=M["plastic_black"], parent=base)
box("lap_pad", (0.13, 0.08, 0.0006), loc=(0, -0.058, LT + 0.0001), mat=M["alu_dark"], bev=0.0005, parent=base)
kk = bpy.data.meshes.new("lapkey")
bmk = box_bm(0.0155, 0.0155, 0.0012)
bmk.to_mesh(kk)
bmk.free()
kk.materials.append(M["key"])
for r in range(6):
    n = 14 if r else 14
    for c in range(n):
        x = -0.128 + c * 0.0197
        y = 0.083 - r * 0.0185
        k = bpy.data.objects.new(f"lk{r}_{c}", kk)
        k.location = (x, y, LT + 0.0008)
        if r == 0:
            k.scale = (1, 0.55, 1)
        link(k, base)
hinge = empty("lap_hinge", loc=(0, LD / 2 - 0.004, LT), rot=(math.radians(-108), 0, 0), parent=base)
box("lap_lid", (LW, LD, 0.005), loc=(0, -LD / 2, 0.0025), mat=M["alu"], bev=0.002, parent=hinge)
box("lap_glass", (LW - 0.004, LD - 0.004, 0.0004), loc=(0, -LD / 2, -0.0003), mat=M["black_gloss"], parent=hinge)
SW, SH = 0.286, 0.179
z = -0.0009
lap_corners = [(-SW / 2, -0.2, z), (SW / 2, -0.2, z), (SW / 2, -0.2 + SH, z), (-SW / 2, -0.2 + SH, z)]

# ---------------------------------------------------------------- tablet on a stand (right: the deal screen)

tab = empty("tablet", loc=(0.41, 0.14, TOP), rot=(0, 0, math.radians(-14)))
box("tab_stand_base", (0.12, 0.1, 0.008), loc=(0, 0.02, 0.004), mat=M["alu_dark"], bev=0.003, parent=tab)
box("tab_stand_arm", (0.04, 0.008, 0.13), loc=(0, 0.045, 0.065), rot=(math.radians(-22), 0, 0), mat=M["alu_dark"], bev=0.002, parent=tab)
tbody = empty("tab_body", loc=(0, 0.0, 0.1), rot=(math.radians(-18), 0, 0), parent=tab)
TW, TH = 0.252, 0.165
box("tab_shell", (TW, 0.007, TH), loc=(0, 0, 0), mat=M["alu_dark"], bev=0.006, segs=4, parent=tbody)
box("tab_glass", (TW - 0.003, 0.0006, TH - 0.003), loc=(0, -0.0036, 0), mat=M["black_gloss"], parent=tbody)
box("tab_lip", (0.08, 0.025, 0.012), loc=(0, -0.006, -TH / 2 - 0.004), mat=M["alu_dark"], bev=0.002, parent=tbody)
TSW, TSH = 0.236, 0.1475

# ---------------------------------------------------------------- keyboard and mouse

kb = empty("keyboard", loc=(0.03, -0.17, TOP + 0.003), rot=(math.radians(2.5), 0, 0))
box("kb_case", (0.36, 0.122, 0.011), loc=(0, 0, 0.0055), mat=M["alu"], bev=0.004, segs=4, parent=kb)
km = bpy.data.meshes.new("kbkey")
bmk = box_bm(0.0168, 0.0168, 0.004)
bmk.to_mesh(km)
bmk.free()
km.materials.append(M["key"])
rows = [(15, 0.58), (14, 1), (14, 1), (13, 1), (12, 1)]
for r, (n, sy) in enumerate(rows):
    w = 0.344 / n
    for c in range(n):
        k = bpy.data.objects.new(f"kk{r}_{c}", km)
        k.location = (-0.172 + w * (c + 0.5), 0.046 - r * 0.0195 - (0.004 if r == 0 else 0), 0.0125)
        k.scale = ((w - 0.0024) / 0.0168, sy, 1)
        link(k, kb)
for c, (wk, xk) in enumerate([(0.03, -0.152), (0.03, -0.12), (0.03, -0.088), (0.15, 0.0), (0.03, 0.092), (0.03, 0.124), (0.03, 0.156)]):
    k = bpy.data.objects.new(f"kb_bottom{c}", km)
    k.location = (xk, 0.046 - 5 * 0.0195, 0.0125)
    k.scale = (wk / 0.0168, 1, 1)
    link(k, kb)
for ob in kb.children:
    if ob.name.startswith(("kk", "kb_bottom")):
        bevel(ob, 0.0016, 2)
mouse = sphere("mouse", 1.0, loc=(0.29, -0.16, TOP + 0.003), scale=(0.031, 0.056, 0.019), mat=M["keylight"])
mouse.rotation_euler = (0, 0, math.radians(-8))

# ---------------------------------------------------------------- books (right, back)

stack = empty("books", loc=(0.63, 0.19, TOP), rot=(0, 0, math.radians(-12)))
tex_dir = os.path.join(CACHE, "tex")
textures.make_all(tex_dir, BOOK_DIMS)
zc = 0.0
for key, rz, dx in [("laws", 0, 0), ("mastery", 4, 0.006), ("quiet", -5, -0.004)]:
    L_, W_, T_ = BOOK_DIMS[key]
    bk = empty(f"book_{key}", loc=(dx, 0, zc), rot=(0, 0, math.radians(rz)), parent=stack)
    board = principled(f"board_{key}", tuple(c / 255 for c in textures.BOOKS[key][2]) + (1,), 0.7)
    # boards use the cloth colour converted to linear
    bsdf_of(board).inputs["Base Color"].default_value = lin("#%02x%02x%02x" % textures.BOOKS[key][2])
    spine_m = textured(f"spine_{key}", os.path.join(tex_dir, f"spine-{key}.png"), rough=0.6)
    cover_m = textured(f"cover_{key}", os.path.join(tex_dir, f"cover-{key}.png"), rough=0.6)
    bt = 0.0028
    # page block, slightly inset from the boards
    box(f"pages_{key}", (L_ - 0.008, W_ - 0.006, T_ - 2 * bt), loc=(0, 0.001, T_ / 2), mat=M["pages"], parent=bk)
    box(f"bot_{key}", (L_, W_, bt), loc=(0, 0, bt / 2), mat=board, bev=0.0008, segs=2, parent=bk)
    box(f"top_{key}", (L_, W_, bt), loc=(0, 0, T_ - bt / 2), mats=[board, cover_m], face_mats={"+z": 1}, bev=0.0008, segs=2, parent=bk)
    box(f"spine_{key}", (L_, bt, T_), loc=(0, -W_ / 2 + bt / 2, T_ / 2), mats=[board, spine_m], face_mats={"-y": 1}, bev=0.001, segs=2, parent=bk)
    zc += T_
HS["books"] = (stack, Vector((0, 0, zc)))

# ---------------------------------------------------------------- coffee

mug = empty("mug", loc=(0.46, -0.17, TOP))
box("coaster", (0.1, 0.1, 0.004), loc=(0, 0, 0.002), mat=M["cork"], bev=0.002, parent=mug)
cup = cyl("mug_body", 0.041, 0.094, loc=(0, 0, 0.004), mat=M["ceramic"], base=True, caps=False, parent=mug)
bm = bmesh.new()
bm.from_mesh(cup.data)
bottom = [v for v in bm.verts if v.co.z < 0.001]
bm.faces.new(sorted(bottom, key=lambda v: math.atan2(v.co.y, v.co.x)))
bm.to_mesh(cup.data)
bm.free()
sol = cup.modifiers.new("solid", "SOLIDIFY")
sol.thickness = 0.0045
sol.offset = -1
bevel(cup, 0.0018, 3, angle=60)
cyl("coffee", 0.0365, 0.002, loc=(0, 0, 0.083), mat=M["coffee"], parent=mug)
cyl("crema", 0.037, 0.0006, loc=(0, 0, 0.0838), mat=M["crema"], r2=0.0345, parent=mug, caps=False)
bpy.ops.mesh.primitive_torus_add(major_radius=0.026, minor_radius=0.0062, major_segments=48, minor_segments=16)
handle = bpy.context.active_object
handle.name = "mug_handle"
for c in handle.users_collection:
    c.objects.unlink(handle)
scene.collection.objects.link(handle)
handle.data.materials.append(M["ceramic"])
for p in handle.data.polygons:
    p.use_smooth = True
handle.parent = mug
handle.location = (0.041, 0, 0.054)
handle.rotation_euler = (math.radians(90), 0, 0)
handle.scale = (0.85, 1.15, 1)
steam = cyl("steam", 0.045, 0.2, loc=(0, 0, 0.09), mat=steam_mat(), base=True, parent=mug, smooth=False, segs=24)
HS["coffee"] = (mug, Vector((0, 0, 0.1)))

# ---------------------------------------------------------------- pen cup

pc = empty("pencup", loc=(-0.6, -0.12, TOP))
cupb = cyl("pencup_body", 0.032, 0.095, mat=M["stone"], base=True, caps=False, parent=pc, segs=48)
bm = bmesh.new()
bm.from_mesh(cupb.data)
bottom = [v for v in bm.verts if v.co.z < 0.001]
bm.faces.new(sorted(bottom, key=lambda v: math.atan2(v.co.y, v.co.x)))
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
bm.to_mesh(cupb.data)
bm.free()
sol = cupb.modifiers.new("solid", "SOLIDIFY")
sol.thickness = 0.004
sol.offset = -1
bevel(cupb, 0.0015, 2, angle=60)
for i, (dx, dy, tx, ty, mname, r_) in enumerate([(0.008, 0.004, 10, 6, "pencil", 0.0038), (-0.01, 0.006, -8, 9, "plastic_black", 0.0045), (0.0, -0.011, 4, -11, "brass", 0.0042)]):
    p = empty(f"pc_pen{i}", loc=(dx, dy, 0.012), rot=(math.radians(ty), math.radians(tx), 0), parent=pc)
    cyl(f"pc_pen{i}_body", r_, 0.15, mat=M[mname], base=True, parent=p, segs=12 if mname == "pencil" else 24)

# ---------------------------------------------------------------- notebook and pen

nb = empty("notebook", loc=(-0.3, -0.25, TOP), rot=(0, 0, math.radians(-7)))
box("nb_pages", (0.142, 0.204, 0.011), loc=(0.002, 0, 0.0065), mat=M["pages"], parent=nb)
box("nb_bot", (0.148, 0.21, 0.0016), loc=(0, 0, 0.0008), mat=M["leather"], bev=0.0007, parent=nb)
box("nb_top", (0.148, 0.21, 0.0016), loc=(0, 0, 0.0128), mat=M["leather"], bev=0.0007, parent=nb)
box("nb_band", (0.005, 0.212, 0.0144), loc=(0.058, 0, 0.0068), mat=M["elastic"], bev=0.0006, parent=nb)
pen = empty("pen", loc=(0.012, -0.004, 0.0158), rot=(0, math.radians(90), math.radians(64)), parent=nb)
cyl("pen_body", 0.0046, 0.128, mat=M["plastic_black"], parent=pen)
cyl("pen_tip", 0.0046, 0.018, loc=(0, 0, 0.073), r2=0.0008, mat=M["brass"], parent=pen)
box("pen_clip", (0.0016, 0.002, 0.045), loc=(0, 0.005, -0.035), mat=M["brass"], parent=pen)
HS["notebook"] = (nb, Vector((0, 0, 0.014)))

# ---------------------------------------------------------------- phone

ph = empty("phone", loc=(0.62, -0.2, TOP), rot=(0, 0, math.radians(12)))
box("phone_body", (0.0716, 0.147, 0.0078), loc=(0, 0, 0.0039), mat=M["phone_frame"], bev=0.0035, segs=5, parent=ph)
box("phone_glass", (0.069, 0.1445, 0.0004), loc=(0, 0, 0.0078), mat=M["black_gloss"], bev=0.0002, parent=ph)
lock = screen_mat("lock", os.path.join(tex_dir, "lockscreen.png"), 0.9 if NIGHT else 0.55)
quad("phone_screen", [(-0.0322, 0.069, 0.0081), (0.0322, 0.069, 0.0081), (0.0322, -0.069, 0.0081), (-0.0322, -0.069, 0.0081)], lock, parent=ph)
HS["phone"] = (ph, Vector((0, 0, 0.008)))

# ---------------------------------------------------------------- lamp (back left)

lamp = empty("lamp", loc=(-0.5, 0.29, TOP), rot=(0, 0, math.radians(30)))
cyl("lamp_base", 0.07, 0.016, mat=M["lamp"], base=True, parent=lamp)
cyl("lamp_knuckle", 0.012, 0.03, loc=(0, 0, 0.016), mat=M["brass"], base=True, parent=lamp)
j1 = Vector((0, 0, 0.03))
j2 = Vector((0, 0.07, 0.43))
j3 = Vector((0, -0.24, 0.47))


def rod(name, a, b, r=0.0055):
    d = b - a
    ob = cyl(name, r, d.length, loc=(a + b) / 2, mat=M["lamp"], parent=lamp, segs=24)
    ob.rotation_euler = d.to_track_quat("Z", "Y").to_euler()


rod("arm1", j1, j2)
rod("arm2", j2, j3)
sphere("elbow", 0.011, loc=j2, mat=M["brass"], parent=lamp)
shade = empty("shade", loc=j3, rot=(math.radians(-62), 0, 0), parent=lamp)
sh = cyl("shade_cone", 0.026, 0.12, loc=(0, 0, -0.06), r2=0.074, mat=M["lamp"], caps=False, parent=shade)
# Blender's cone runs radius1 at -z: flip so it opens downward
sh.rotation_euler = (math.pi, 0, 0)
sol = sh.modifiers.new("solid", "SOLIDIFY")
sol.thickness = 0.0016
sh.data.materials.append(M["lamp_in"])
sol.material_offset = 1
cyl("shade_cap", 0.027, 0.012, loc=(0, 0, 0.0), mat=M["lamp"], parent=shade)
sphere("bulb", 0.022, loc=(0, 0, -0.045), mat=M["bulb"], parent=shade)
HS["lamp"] = (shade, Vector((0, 0, -0.05)))

# ---------------------------------------------------------------- plant (back left corner)

plant = empty("plant", loc=(-0.7, 0.29, TOP))
try:
    try:
        bpy.ops.preferences.addon_enable(module="io_scene_gltf2")
    except Exception:
        pass
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(ASSETS, "DiffuseTransmissionPlant.glb"))
    new = [o for o in bpy.data.objects if o not in before]
    roots = [o for o in new if o.parent is None]
    # measure and fit to ~0.42 m tall
    bpy.context.view_layer.update()
    pts = [o.matrix_world @ Vector(c) for o in new if o.type == "MESH" for c in o.bound_box]
    lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    # glTF is Y-up; the importer converts, so height is along Z here
    k = 0.42 / max(1e-6, hi.z - lo.z)
    pivot = empty("plant_fit", parent=plant)
    pivot.scale = (k, k, k)
    pivot.location = (-(lo.x + hi.x) / 2 * k, -(lo.y + hi.y) / 2 * k, -lo.z * k)
    for o in roots:
        o.parent = pivot
    for o in new:
        if "firefly" in o.name:
            bpy.data.objects.remove(o, do_unlink=True)
    print("plant", len(new), "objects, scale", round(k, 3))
except Exception as e:  # keep rendering without it
    print("plant import failed:", e)

# ---------------------------------------------------------------- framed print (wall, top right)

textures.art_print(os.path.join(tex_dir, "print.png"))
fr = empty("print", loc=(0.46, 0.6, 1.38))
box("frame", (0.42, 0.024, 0.54), mat=M["frame"], bev=0.003, parent=fr)
box("frame_mat", (0.38, 0.002, 0.5), loc=(0, -0.0125, 0), mat=M["mat_board"], parent=fr)
art = textured("art", os.path.join(tex_dir, "print.png"), rough=0.85)
quad("art", [(-0.13, -0.0142, 0.18), (0.13, -0.0142, 0.18), (0.13, -0.0142, -0.18), (-0.13, -0.0142, -0.18)], art, parent=fr)

# ---------------------------------------------------------------- ergonomic chair (in front, turned toward the desk)

M["knit"] = bumpy("knit", "#26272a", 0.92, scale=900, strength=0.25, Sheen_Weight=0.4)
M["mesh_back"] = bumpy("mesh_back", "#1c1d20", 0.85, scale=1400, strength=0.4)
M["chrome"] = principled("chrome", "#d8d9dc", 0.18, metal=1.0)
chair = empty("chair", loc=CHAIR_AT, rot=(0, 0, math.radians(CHAIR_TURN)))
# five-star base with casters
for i in range(5):
    a = math.radians(90 + i * 72)
    leg = empty(f"chair_leg{i}", loc=(0, 0, 0.085), rot=(0, 0, a), parent=chair)
    box(f"chair_spoke{i}", (0.31, 0.045, 0.028), loc=(0.165, 0, 0), rot=(0, math.radians(6), 0), mat=M["chrome"], bev=0.01, segs=3, parent=leg)
    cyl(f"chair_caster{i}", 0.026, 0.03, loc=(0.31, 0, -0.058), rot=(math.pi / 2, 0, 0), mat=M["plastic_black"], parent=leg, segs=24)
    cyl(f"chair_fork{i}", 0.01, 0.03, loc=(0.31, 0, -0.025), mat=M["plastic_black"], parent=leg, segs=12)
cyl("chair_hub", 0.045, 0.06, loc=(0, 0, 0.065), mat=M["chrome"], base=True, parent=chair)
cyl("chair_lift", 0.022, 0.3, loc=(0, 0, 0.12), mat=M["chrome"], base=True, parent=chair)
cyl("chair_sleeve", 0.03, 0.12, loc=(0, 0, 0.12), mat=M["plastic_black"], base=True, parent=chair)
box("chair_mech", (0.2, 0.22, 0.045), loc=(0, 0.01, 0.43), mat=M["plastic_black"], bev=0.008, parent=chair)
seat = box("chair_seat", (0.5, 0.48, 0.075), loc=(0, 0.02, 0.49), mat=M["knit"], bev=0.03, segs=5, parent=chair)
box("chair_seat_shell", (0.48, 0.46, 0.02), loc=(0, 0.02, 0.45), mat=M["plastic_black"], bev=0.008, parent=chair)
# spine and a curved mesh back, leaning back a touch
box("chair_spine", (0.06, 0.03, 0.34), loc=(0, -0.24, 0.6), rot=(math.radians(-8), 0, 0), mat=M["plastic_black"], bev=0.008, parent=chair)
back = empty("chair_back", loc=(0, -0.27, 0.88), rot=(math.radians(-12), 0, 0), parent=chair)
bm = bmesh.new()
bmesh.ops.create_grid(bm, x_segments=16, y_segments=12, size=0.5)
for v in bm.verts:
    x, z = v.co.x * 0.46, v.co.y * 0.58  # grid is in XY: map to width and height
    curve = 0.06 * (x / 0.23) ** 2 - 0.025 * math.exp(-((z + 0.1) / 0.12) ** 2)  # wraps round, lumbar bulge
    w = 1 - 0.12 * max(0.0, z / 0.29)  # narrows to the shoulders
    v.co = Vector((x * w, -curve, z))
box_uv(bm)
mesh_panel = from_bm("chair_mesh", bm, [M["mesh_back"]], smooth=True, parent=back)
sol = mesh_panel.modifiers.new("solid", "SOLIDIFY")
sol.thickness = 0.012
tube("chair_frame", [(-0.215, -0.055, -0.29), (-0.23, -0.06, 0.0), (-0.2, -0.05, 0.29), (0.0, -0.0, 0.31), (0.2, -0.05, 0.29), (0.23, -0.06, 0.0), (0.215, -0.055, -0.29), (0.0, 0.0, -0.31), (-0.215, -0.055, -0.29)], 0.012, M["plastic_black"], parent=back)
box("chair_lumbar", (0.3, 0.03, 0.07), loc=(0, 0.01, -0.1), mat=M["plastic_black"], bev=0.012, parent=back)
box("chair_head", (0.3, 0.06, 0.13), loc=(0, -0.02, 0.42), rot=(math.radians(-6), 0, 0), mat=M["knit"], bev=0.025, segs=4, parent=back)
box("chair_head_post", (0.04, 0.02, 0.12), loc=(0, 0.02, 0.33), mat=M["plastic_black"], parent=back)
for sx in (-1, 1):
    box(f"chair_arm_post{sx}", (0.035, 0.07, 0.2), loc=(sx * 0.265, -0.02, 0.58), mat=M["plastic_black"], bev=0.008, parent=chair)
    box(f"chair_arm_pad{sx}", (0.08, 0.27, 0.032), loc=(sx * 0.265, 0.0, 0.69), mat=M["knit"], bev=0.014, segs=4, parent=chair)
HS["chair"] = (chair, Vector((0, 0, 0.75)))

# ---------------------------------------------------------------- basketball (on the floor, under the desk front)

textures.basketball(os.path.join(tex_dir, "basketball.png"))
M["ball"] = textured("ball", os.path.join(tex_dir, "basketball.png"), rough=0.62)
_bnt = M["ball"].node_tree
_bnz = _bnt.nodes.new("ShaderNodeTexNoise")
_bnz.inputs["Scale"].default_value = 900
_bnz.inputs["Detail"].default_value = 2
_bbp = _bnt.nodes.new("ShaderNodeBump")
_bbp.inputs["Strength"].default_value = 0.35
_bbp.inputs["Distance"].default_value = 0.0006
_bnt.links.new(_bnz.outputs["Fac"], _bbp.inputs["Height"])
_bnt.links.new(_bbp.outputs["Normal"], bsdf_of(M["ball"]).inputs["Normal"])
BALL_R = 0.12
ball = sphere("ball", BALL_R, loc=BALL_AT, mat=M["ball"])
ball.rotation_euler = (math.radians(18), math.radians(-10), math.radians(35))
HS["ball"] = (ball, Vector((0, 0, 0)))

# ---------------------------------------------------------------- cables

tube("cable_mon", [(0.03, 0.29, TOP + 0.3), (0.05, 0.36, TOP + 0.05), (0.15, 0.39, TOP + 0.002), (0.4, 0.4, TOP - 0.2)], 0.0026, M["cable"])
tube("cable_lap", [(-0.53, 0.09, TOP + 0.07), (-0.58, 0.2, TOP + 0.003), (-0.44, 0.35, TOP + 0.003), (-0.4, 0.4, TOP - 0.25)], 0.0022, M["cable"])

# ---------------------------------------------------------------- screens

scr_dir = args.screens
strength = 1.6 if NIGHT else 0.95
SCREENS = {}
mon_z = -0.0065
SCREENS["center"] = quad(
    "SCR_center",
    [(-PW / 2, mon_z, PH / 2), (PW / 2, mon_z, PH / 2), (PW / 2, mon_z, -PH / 2), (-PW / 2, mon_z, -PH / 2)],
    screen_mat("scr_center", os.path.join(scr_dir, "center.png"), strength),
    parent=panel,
)
SCREENS["left"] = quad("SCR_left", lap_corners, screen_mat("scr_left", os.path.join(scr_dir, "left.png"), strength), parent=hinge)
ty = -0.0042
SCREENS["right"] = quad(
    "SCR_right",
    [(-TSW / 2, ty, TSH / 2), (TSW / 2, ty, TSH / 2), (TSW / 2, ty, -TSH / 2), (-TSW / 2, ty, -TSH / 2)],
    screen_mat("scr_right", os.path.join(scr_dir, "right.png"), strength),
    parent=tbody,
)

# ---------------------------------------------------------------- light

world = bpy.data.worlds.new("world")
scene.world = world
try:
    world.use_nodes = True
except Exception:
    pass
wn = world.node_tree
wn.nodes.clear()
wo = wn.nodes.new("ShaderNodeOutputWorld")
bg = wn.nodes.new("ShaderNodeBackground")
env = wn.nodes.new("ShaderNodeTexEnvironment")
hdri = os.path.join(ASSETS, "hdri", "night.exr" if NIGHT else "apartment.exr")
env.image = bpy.data.images.load(hdri)
wmap = wn.nodes.new("ShaderNodeMapping")
wtc = wn.nodes.new("ShaderNodeTexCoord")
wmap.inputs["Rotation"].default_value = (0, 0, math.radians(110))
wn.links.new(wtc.outputs["Generated"], wmap.inputs["Vector"])
wn.links.new(wmap.outputs["Vector"], env.inputs["Vector"])
wn.links.new(env.outputs["Color"], bg.inputs["Color"])
bg.inputs["Strength"].default_value = 0.05 if NIGHT else 0.55
wn.links.new(bg.outputs[0], wo.inputs["Surface"])

sun_d = Vector((0.82, 0.34, -0.46)).normalized()
sun = bpy.data.objects.new("sun", bpy.data.lights.new("sun", "SUN"))
link(sun)
sun.data.energy = 0.25 if NIGHT else 4.2
sun.data.angle = math.radians(1.2)
sun.data.color = (0.62, 0.72, 1.0) if NIGHT else (1.0, 0.9, 0.78)
sun.rotation_euler = sun_d.to_track_quat("-Z", "Y").to_euler()

fill = bpy.data.objects.new("fill", bpy.data.lights.new("fill", "AREA"))
link(fill)
fill.data.shape = "RECTANGLE"
fill.data.size, fill.data.size_y = 2.4, 1.4
fill.data.energy = 18 if NIGHT else 110
fill.data.color = (1.0, 0.78, 0.6) if NIGHT else (1.0, 0.97, 0.93)
fill.location = (0.6, -2.4, 2.1)
look_at(fill, (0, 0.1, TOP))

if NIGHT:
    spot = bpy.data.objects.new("lamp_spot", bpy.data.lights.new("lamp_spot", "SPOT"))
    link(spot)
    spot.data.energy = 26
    spot.data.color = (1.0, 0.76, 0.5)
    spot.data.spot_size = math.radians(95)
    spot.data.spot_blend = 0.55
    spot.data.shadow_soft_size = 0.02
    spot.parent = shade
    spot.location = (0, 0, -0.04)
    spot.rotation_euler = (0, 0, 0)
    glow = bpy.data.objects.new("bounce", bpy.data.lights.new("bounce", "POINT"))
    link(glow)
    glow.data.energy = 6
    glow.data.color = (1.0, 0.7, 0.45)
    glow.data.shadow_soft_size = 0.3
    glow.location = (1.4, -0.4, 1.6)

# ---------------------------------------------------------------- camera

cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
link(cam)
scene.camera = cam
cd = cam.data
cd.sensor_fit = "HORIZONTAL"
cd.sensor_width = 36
if args.view == "desktop":
    W, H = 2560, 1440
    cam.location = (0.2, -2.25, 1.5)
    target = (0.06, 0.12, 0.9)
    cd.lens = 34
    cd.shift_x = -0.225
    cd.shift_y = 0.02
else:
    W, H = 1200, 1400
    cam.location = (0.03, -1.5, 1.62)
    target = (0.03, 0.12, 0.95)
    cd.lens = 30
    cd.shift_y = 0.05
bpy.context.view_layer.update()
look_at(cam, target)
cd.dof.use_dof = True
cd.dof.focus_distance = (Vector(target) - cam.location).length
cd.dof.aperture_fstop = 5.6

# ---------------------------------------------------------------- render settings

r = scene.render
r.engine = "CYCLES"
r.resolution_x = int(W * args.scale)
r.resolution_y = int(H * args.scale)
r.resolution_percentage = 100
r.film_transparent = False
r.image_settings.file_format = "PNG"
r.image_settings.color_depth = "8"
c = scene.cycles
c.device = "CPU"
c.samples = args.samples
c.use_adaptive_sampling = True
c.adaptive_threshold = 0.012
c.use_denoising = True
try:
    c.denoiser = "OPENIMAGEDENOISE"
    c.denoising_input_passes = "RGB_ALBEDO_NORMAL"
except Exception:
    pass
c.max_bounces = 10
c.diffuse_bounces = 4
c.glossy_bounces = 4
c.transmission_bounces = 10
c.volume_bounces = 1
c.caustics_reflective = False
c.caustics_refractive = False
c.blur_glossy = 1.0
c.sample_clamp_indirect = 8
c.volume_step_rate = 1.0
vs = scene.view_settings
vs.view_transform = "AgX"
for look in ("AgX - Medium High Contrast", "Medium High Contrast"):
    try:
        vs.look = look
        break
    except Exception:
        pass
vs.exposure = 0.35 if NIGHT else 0.0

if args.no_render:
    bpy.context.view_layer.update()
    raise SystemExit(0)

# ---------------------------------------------------------------- projections

bpy.context.view_layer.update()


def px(co):
    v = world_to_camera_view(scene, cam, co)
    return [round(v.x * W, 2), round((1 - v.y) * H, 2)]


plate = {"w": W, "h": H, "screens": {}, "hotspots": {}}
for sid, ob in SCREENS.items():
    mw = ob.matrix_world
    plate["screens"][sid] = [px(mw @ v.co) for v in ob.data.vertices]
for k, (ob, local) in HS.items():
    plate["hotspots"][k] = px(ob.matrix_world @ local)

os.makedirs(os.path.join(CACHE, "out"), exist_ok=True)
jpath = os.path.join(ROOT, "public", "desk", "plates", "screens.json")
os.makedirs(os.path.dirname(jpath), exist_ok=True)
allp = {}
if os.path.exists(jpath):
    with open(jpath) as f:
        allp = json.load(f)
allp[args.view] = plate
with open(jpath, "w") as f:
    json.dump(allp, f, indent=1)

if args.blend:
    bpy.ops.wm.save_as_mainfile(filepath=args.blend)

out = args.out or os.path.join(CACHE, "out", f"{args.view}-{args.phase}.png")
r.filepath = out
t0 = time.time()
bpy.ops.render.render(write_still=True)
print(f"rendered {out} {r.resolution_x}x{r.resolution_y} in {time.time() - t0:.0f}s")
