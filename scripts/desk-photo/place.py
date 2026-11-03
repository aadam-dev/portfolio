"""Back-project photo pixels through the solved camera: where does an image point land on a plane
of given height (relative to the desk top)? Shared by build.py; run alone to print the layout."""

import json
import math
import os

HERE = os.path.dirname(os.path.abspath(__file__))
C = json.load(open(os.path.join(HERE, "camera.json")))
SCALE = C["image"][0] / 1536  # pixel coordinates below are measured on the 1536 px photo


def ray(u, v):
    """World-space direction (x right, y away, z up) through photo pixel (u, v)."""
    f = C["f"] / SCALE
    cx, cy = 768, 432
    x, up, fwd = (u - cx) / f, -(v - cy) / f, 1.0
    p = C["pitch"]
    # undo the pitch (camera looks along +y, tilted down by p)
    y1 = math.cos(p) * fwd + math.sin(p) * up
    z1 = -math.sin(p) * fwd + math.cos(p) * up
    a = C["yaw"]
    return (math.cos(a) * x - math.sin(a) * y1, math.sin(a) * x + math.cos(a) * y1, z1)


def ground(u, v, z=0.0):
    """Where pixel (u, v) meets the horizontal plane z metres above the desk top (desk-top frame)."""
    d = ray(u, v)
    o = (C["camx"], C["camy"], C["h"])
    t = (z - o[2]) / d[2]
    return (o[0] + t * d[0], o[1] + t * d[1], z)


def at_depth(u, v, y):
    """Where pixel (u, v) meets the vertical plane at depth y (desk-top frame)."""
    d = ray(u, v)
    o = (C["camx"], C["camy"], C["h"])
    t = (y - o[1]) / d[1]
    return (o[0] + t * d[0], y, o[2] + t * d[2])


if __name__ == "__main__":
    pts = {
        "desk front edge (centre)": (768, 845, 0),
        "stand foot centre": (770, 600, 0),
        "device box centre": (372, 590, 0),
        "mouse centre": (1070, 700, 0.015),
        "phone centre": (1318, 705, 0.008),
        "coaster centre": (1283, 615, 0.004),
        "pouch base centre": (1405, 645, 0),
        "ball stand": (1495, 548, 0),
        "lamp base": (58, 548, 0),
        "books front-right bottom": (272, 540, 0),
        "notebook centre": (175, 700, 0.01),
    }
    for k, (u, v, z) in pts.items():
        print(f"{k:28s}", tuple(round(c, 3) for c in ground(u, v, z)))
    print("wall y", round(C["ywall"], 3))
    for k, (u, v) in {"lamp head": (240, 200), "left screen TL": (296, 231), "right screen TR": (1240, 231), "plant top": (1300, 30), "ball centre": (1490, 465), "window frame": (357, 150)}.items():
        print(f"{k:28s} at wall", tuple(round(c, 3) for c in at_depth(u, v, C["ywall"])), " at screens", tuple(round(c, 3) for c in at_depth(u, v, C["sy"])))
