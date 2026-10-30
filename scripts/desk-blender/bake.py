"""Bake the Blender desk for the real-time hero.

    .cache/bpy-venv/bin/python scripts/desk-blender/bake.py [--samples 192] [--quick]

1. Builds the scene with build.py (day lighting, no render).
2. Joins objects into a few groups and gives each one lightmap UVs.
3. Bakes per group: albedo (colour only), daytime light, then evening
   light (lamp on, screens glowing), into textures.
4. Exports public/desk/desk.glb (geometry plus UVs, one material per group)
   and public/desk/desk3d.json (screen corners, hotspots, mouse mat,
   chair pivot, camera poses, in glTF coordinates).

The site multiplies albedo by a blend of the two lightmaps, so the lamp
can switch the room's light live. The chair and mouse are baked in place
but don't shadow the rest, because they move.
"""

import json
import math
import os
import sys
import time

import bpy  # noqa: I001
import numpy as np
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
CACHE = os.path.join(ROOT, ".cache", "desk-blender", "bake")
PUB = os.path.join(ROOT, "public", "desk")
os.makedirs(CACHE, exist_ok=True)

argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:]
SAMPLES = int(argv[argv.index("--samples") + 1]) if "--samples" in argv else 192
QUICK = "--quick" in argv  # small textures and few samples, for checking the pipeline

# ---------------------------------------------------------------- build the scene (day)
g = {"__name__": "__desk_build__", "__file__": os.path.join(HERE, "build.py")}
sys.argv = ["build.py", "--view", "desktop", "--phase", "day", "--no-render"]
try:
    exec(compile(open(os.path.join(HERE, "build.py")).read(), g["__file__"], "exec"), g)
except SystemExit:
    pass
scene = bpy.context.scene
vl = bpy.context.view_layer
M = g["M"]
TOP = g["TOP"]

# ---------------------------------------------------------------- groups

GROUPS = {
    "room": ["wall", "floor"],
    "desk": ["desk_top", "leg-1-1", "leg-11", "leg1-1", "leg11", "rail-1", "rail1", "rail_back", "mat", "cable_mon", "cable_lap"],
    "tech": ["monitor", "laptop", "tablet", "keyboard", "phone"],
    "decor": ["books", "mug", "pencup", "notebook", "print", "lamp", "plant"],
    "chair": ["chair"],
    "mouse": ["mouse"],
    "ball": ["ball"],
}
# exported on their own: screens get live apps, the bulb glows, the steam is particles on the site
SEPARATE = {"SCR_center", "SCR_left", "SCR_right", "phone_screen", "bulb"}
DROP = {"steam"}
MOVING = {"chair", "mouse", "ball"}
ALBEDO = {"room": 2048, "desk": 2048, "tech": 2048, "decor": 2048, "chair": 1024, "mouse": 256, "ball": 512}
LIGHT = {"room": 1024, "desk": 1024, "tech": 1024, "decor": 1024, "chair": 512, "mouse": 128, "ball": 256}
if QUICK:
    ALBEDO = {k: max(128, v // 4) for k, v in ALBEDO.items()}
    LIGHT = {k: max(64, v // 4) for k, v in LIGHT.items()}
    SAMPLES = 16


def subtree(name):
    ob = bpy.data.objects.get(name)
    if not ob:
        return []
    out, todo = [], [ob]
    while todo:
        o = todo.pop()
        out.append(o)
        todo.extend(o.children)
    return out


def select_only(obs, active=None):
    for o in list(vl.objects):
        if o is not None:
            o.select_set(False)
    for o in obs:
        o.hide_set(False)
        o.select_set(True)
    vl.objects.active = active or obs[0]


# capture the metadata before objects are joined away
def to_gl(v):
    return [round(v.x, 5), round(v.z, 5), round(-v.y, 5)]


vl.update()
meta = {"screens": {}, "hotspots": {}, "units": "metres, glTF axes (y up)"}
for sid, name in [("center", "SCR_center"), ("left", "SCR_left"), ("right", "SCR_right"), ("phone", "phone_screen")]:
    ob = bpy.data.objects[name]
    meta["screens"][sid] = [to_gl(ob.matrix_world @ v.co) for v in ob.data.vertices]
for k, (ob, local) in g["HS"].items():
    meta["hotspots"][k] = to_gl(ob.matrix_world @ local)
mat_ob = bpy.data.objects["mat"]
meta["mousepad"] = {"center": to_gl(mat_ob.matrix_world.translation), "size": [0.86, 0.4]}
meta["mouse"] = {"at": to_gl(bpy.data.objects["mouse"].matrix_world.translation), "turn": math.degrees(bpy.data.objects["mouse"].rotation_euler.z)}
meta["chair"] = {"at": to_gl(bpy.data.objects["chair"].matrix_world.translation), "turn": g["CHAIR_TURN"]}
meta["lamp"] = {"shade": to_gl(bpy.data.objects["shade"].matrix_world.translation)}
meta["ball"] = {"at": to_gl(bpy.data.objects["ball"].matrix_world.translation), "radius": g["BALL_R"]}
meta["steam"] = to_gl(bpy.data.objects["mug"].matrix_world @ Vector((0, 0, 0.09)))
meta["desk_top"] = TOP

# the steam volume and its domain are not exported
for name in DROP:
    for o in subtree(name):
        bpy.data.objects.remove(o, do_unlink=True)

# pull the separately exported objects out of their parents (keeping their place)
for name in SEPARATE:
    o = bpy.data.objects[name]
    mw = o.matrix_world.copy()
    o.parent = None
    o.matrix_world = mw

joined = {}
for gname, roots in GROUPS.items():
    obs = [o for r in roots for o in subtree(r) if o.name not in SEPARATE]
    empties = [o.name for o in obs if o.type == "EMPTY"]
    meshes = [o for o in obs if o.type in {"MESH", "CURVE"}]
    if not meshes:
        continue
    select_only(meshes)
    bpy.ops.object.make_single_user(type="SELECTED_OBJECTS", object=True, obdata=True)
    bpy.ops.object.convert(target="MESH")  # applies bevels, solidify, curves
    meshes = [o for o in vl.objects if o.select_get()]
    # unparent, keeping transforms, so the join keeps world positions
    for o in meshes:
        mw = o.matrix_world.copy()
        o.parent = None
        o.matrix_world = mw
    select_only(meshes, meshes[0])
    bpy.ops.object.join()
    ob = vl.objects.active
    # drop the now-empty helper empties of this group first, so the joined mesh can take
    # the group's name (an empty called "chair" would otherwise turn it into "chair.001")
    for n in empties:
        if n in bpy.data.objects and bpy.data.objects[n] is not ob:
            bpy.data.objects.remove(bpy.data.objects[n], do_unlink=True)
    ob.name = gname
    # lightmap UVs: a new layer, active for baking; the original stays for the textures
    me = ob.data
    if not me.uv_layers:
        me.uv_layers.new(name="UVMap")
    src = me.uv_layers[0]
    src.active_render = True
    bake_uv = me.uv_layers.new(name="bake")
    me.uv_layers.active = bake_uv
    select_only([ob])
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.004, area_weight=0.0, scale_to_bounds=False)
    bpy.ops.object.mode_set(mode="OBJECT")
    joined[gname] = ob
    print("group", gname, len(me.polygons), "faces,", len(me.materials), "materials")

# ---------------------------------------------------------------- bake


def target(ob, img):
    """Point every material of the object at one bake image."""
    for slot in ob.material_slots:
        m = slot.material
        if not m:
            continue
        nt = m.node_tree
        n = nt.nodes.get("__bake__") or nt.nodes.new("ShaderNodeTexImage")
        n.name = "__bake__"
        n.image = img
        nt.nodes.active = n


# materials are shared between groups: give each group its own copies, so the active bake node is per group.
# A diffuse bake sees metal as black, so the copies bake metals as their base colour (brushed, not mirror).
for gname, ob in joined.items():
    for slot in ob.material_slots:
        if slot.material:
            slot.material = slot.material.copy()
            nt = slot.material.node_tree
            for n in nt.nodes if nt else []:
                if n.type == "BSDF_PRINCIPLED" and n.inputs["Metallic"].default_value > 0.3:
                    n.inputs["Metallic"].default_value = 0.0
                    n.inputs["Roughness"].default_value = max(0.4, n.inputs["Roughness"].default_value)

c = scene.cycles
c.device = "CPU"
c.use_denoising = False
scene.render.bake.margin = 8
scene.render.bake.use_clear = True
scene.render.bake.target = "IMAGE_TEXTURES"


def hide_moving(gname):
    """While baking the static room, the chair and mouse cast nothing (they move on the site)."""
    for name in MOVING:
        o = joined.get(name)
        if o:
            o.hide_render = gname not in MOVING or name != gname


def bake(gname, kind, size, samples, passes):
    ob = joined[gname]
    img = bpy.data.images.new(f"{gname}-{kind}", size, size, alpha=False, float_buffer=(kind != "albedo"))
    if kind != "albedo":
        img.colorspace_settings.name = "Non-Color"
    target(ob, img)
    hide_moving(gname)
    select_only([ob])
    c.samples = samples
    t0 = time.time()
    bpy.ops.object.bake(type="DIFFUSE", pass_filter=passes, margin=8, use_clear=True)
    print(f"baked {gname} {kind} {size}px in {time.time() - t0:.0f}s", flush=True)
    return img


def save_albedo(img, path):
    img.filepath_raw = path
    img.file_format = "PNG"
    img.save()


LM_SCALE = 4.0  # light values are stored as light / 4, sRGB-encoded, so 0..4 fits 8 bits


def save_light(img, path):
    w, h = img.size
    px = np.empty(w * h * 4, dtype=np.float32)
    img.pixels.foreach_get(px)
    px = px.reshape(h, w, 4)[::-1, :, :3]  # Blender stores bottom-up
    v = np.clip(px / LM_SCALE, 0, 1)
    v = np.where(v <= 0.0031308, v * 12.92, 1.055 * np.power(v, 1 / 2.4) - 0.055)
    from PIL import Image, ImageFilter

    im = Image.fromarray((v * 255 + 0.5).astype(np.uint8), "RGB")
    im = im.filter(ImageFilter.GaussianBlur(0.8 if w <= 512 else 1.2))  # bakes have no denoiser: soften the grain
    im.save(path)


def set_evening():
    """The night set from build.py: night sky, lamp on, warm bounce, screens glowing."""
    wn = scene.world.node_tree
    env = next(n for n in wn.nodes if n.type == "TEX_ENVIRONMENT")
    env.image = bpy.data.images.load(os.path.join(ROOT, ".cache", "desk", "hdri", "night.exr"))
    next(n for n in wn.nodes if n.type == "BACKGROUND").inputs["Strength"].default_value = 0.05
    sun = bpy.data.objects["sun"]
    sun.data.energy, sun.data.color = 0.25, (0.62, 0.72, 1.0)
    fill = bpy.data.objects["fill"]
    fill.data.energy, fill.data.color = 18, (1.0, 0.78, 0.6)
    spot = bpy.data.objects.new("lamp_spot", bpy.data.lights.new("lamp_spot", "SPOT"))
    scene.collection.objects.link(spot)
    spot.data.energy, spot.data.color = 26, (1.0, 0.76, 0.5)
    spot.data.spot_size, spot.data.spot_blend, spot.data.shadow_soft_size = math.radians(95), 0.55, 0.02
    bulb = bpy.data.objects["bulb"]
    spot.location = bulb.matrix_world.translation + Vector((0, 0, 0.005))
    spot.rotation_euler = bpy.data.objects["bulb"].matrix_world.to_euler()
    # aim the spot the way the shade points (down its local -z)
    down = (bulb.matrix_world.to_3x3() @ Vector((0, 0, -1))).normalized()
    spot.rotation_euler = down.to_track_quat("-Z", "Y").to_euler()
    bounce = bpy.data.objects.new("bounce", bpy.data.lights.new("bounce", "POINT"))
    scene.collection.objects.link(bounce)
    bounce.data.energy, bounce.data.color, bounce.data.shadow_soft_size = 6, (1.0, 0.7, 0.45), 0.3
    bounce.location = (1.4, -0.4, 1.6)
    for m in bpy.data.materials:
        b = m.node_tree.nodes.get(m.get("bsdf", "")) if m.node_tree else None
        if not b:
            continue
        if m.name.startswith("bulb"):
            b.inputs["Emission Strength"].default_value = 30.0
        elif m.name.startswith("scr_"):
            b.inputs["Emission Strength"].default_value = 1.6
        elif m.name.startswith("lock"):
            b.inputs["Emission Strength"].default_value = 0.9


out = {}
for gname in joined:
    a = bake(gname, "albedo", ALBEDO[gname], 4, {"COLOR"})
    save_albedo(a, os.path.join(CACHE, f"{gname}-albedo.png"))
    lt = bake(gname, "day", LIGHT[gname], SAMPLES, {"DIRECT", "INDIRECT"})
    save_light(lt, os.path.join(CACHE, f"{gname}-day.png"))
set_evening()
for gname in joined:
    lt = bake(gname, "evening", LIGHT[gname], SAMPLES, {"DIRECT", "INDIRECT"})
    save_light(lt, os.path.join(CACHE, f"{gname}-evening.png"))

# ---------------------------------------------------------------- export

for o in joined.values():
    o.hide_render = False
    me = o.data
    # one material per group, so each group is one draw call on the site
    me.materials.clear()
    me.materials.append(bpy.data.materials.new(f"M_{o.name}"))
    for p in me.polygons:
        p.material_index = 0
    for uv in [u for u in me.uv_layers if u.name != "bake"]:
        me.uv_layers.remove(uv)
for name in SEPARATE:
    o = bpy.data.objects[name]
    o.name = name
export = list(joined.values()) + [bpy.data.objects[n] for n in SEPARATE]
select_only(export)
os.makedirs(PUB, exist_ok=True)
raw = os.path.join(CACHE, "desk-raw.glb")
bpy.ops.export_scene.gltf(
    filepath=raw,
    export_format="GLB",
    use_selection=True,
    export_apply=True,
    export_normals=False,
    export_texcoords=True,
    export_materials="PLACEHOLDER",
    export_yup=True,
)
meta["groups"] = list(joined.keys())
meta["lightScale"] = LM_SCALE
cam = bpy.data.objects["cam"]
meta["cameras"] = {"render": {"position": to_gl(cam.location), "lens": cam.data.lens, "sensor": cam.data.sensor_width}}
with open(os.path.join(CACHE, "desk3d.json"), "w") as f:
    json.dump(meta, f, indent=1)
print("exported", raw)
