"""Check the solved camera: render outlines of the fitted mat, keyboard, laptop screen and wall
from scripts/desk-photo/camera.json and lay them over the photo.
    .cache/bpy-venv/bin/python scripts/desk-photo/overlay.py
"""

import json
import math
import os

import bpy

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = os.path.join(ROOT, ".cache", "desk-photo")
os.makedirs(OUT, exist_ok=True)
C = json.load(open(os.path.join(HERE, "camera.json")))
DESK = 0.75  # desk-top height; the solve works relative to it


def camera(scene, w, h):
    cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
    scene.collection.objects.link(cam)
    cam.data.sensor_fit = "HORIZONTAL"
    cam.data.sensor_width = 36
    cam.data.lens = C["f"] * 36 / C["image"][0]
    cam.location = (C["camx"], C["camy"], DESK + C["h"])
    cam.rotation_euler = (math.pi / 2 - C["pitch"], 0, C["yaw"])
    scene.camera = cam
    scene.render.resolution_x, scene.render.resolution_y = w, h
    return cam


def box(name, size, loc, color):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.active_object
    o.name = name
    o.scale = size
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    em = nt.nodes.new("ShaderNodeEmission")
    em.inputs["Color"].default_value = (*color, 1)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    nt.links.new(em.outputs[0], out.inputs[0])
    o.data.materials.append(m)
    return o


if __name__ == "__main__":
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    camera(scene, *C["image"])
    box("mat", (C["matW"], C["matD"], 0.004), (0, 0, DESK + 0.002), (0.0, 0.8, 1.0))
    box("kb", (0.33, 0.115, 0.03), (C["kx"], C["ky"], DESK + 0.017), (1.0, 0.2, 0.2))
    t = C["tilt"]
    scr = box("screen", (0.30, 0.004, 0.195), (C["sx"], C["sy"], 0), (1.0, 1.0, 0.0))
    scr.rotation_euler = (-t, 0, 0)
    scr.location = (C["sx"], C["sy"] + math.sin(t) * 0.0975, DESK + C["sz"] + math.cos(t) * 0.0975)
    box("wall", (3, 0.01, 2), (0, C["ywall"] + 0.005, DESK + 1), (0.6, 0.3, 1.0))
    box("desk", (3, C["ywall"] + 1.5, 0.04), (0, (C["ywall"] - 1.5) / 2, DESK - 0.02), (0.3, 0.3, 0.3))
    # flat colours from Cycles at one sample (no GPU or OpenGL needed)
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 1
    scene.cycles.device = "CPU"
    scene.view_settings.view_transform = "Standard"
    scene.render.film_transparent = True
    scene.render.filepath = os.path.join(OUT, "overlay.png")
    bpy.ops.render.render(write_still=True)
    print("rendered", scene.render.filepath)
