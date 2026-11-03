"""Recover the camera of public/workspace/wide.webp (1536x864) from features with known sizes.

Fits focal length, position, pitch and yaw so that a felt mat, a 75% keyboard (33 x 11.5 cm top
face), the laptop screen (30 x 19.5 cm, tilted back) and the desk/wall line land where they are
in the photo. Writes scripts/desk-photo/camera.json. Run with any Python that has numpy:
    .cache/bpy-venv/bin/python scripts/desk-photo/solve_camera.py
"""

import json
import math
import os

import numpy as np

W_IMG, H_IMG = 1536, 864
CX, CY = W_IMG / 2, H_IMG / 2

# measured in the 1536 px photo (TL, TR, BR, BL in image terms; "back" is the far edge)
OBS = {
    "mat": [(433, 633), (1166, 633), (1220, 767), (362, 766)],
    "kb": [(532, 635), (957, 635), (967, 712), (522, 712)],
    "screen": [(605, 230), (928, 230), (930, 425), (601, 425)],
}
WALL_V = 505  # the desk's back edge meets the wall here, across the frame
KB_W, KB_D, KB_H = 0.33, 0.115, 0.032
SCR_W, SCR_H = 0.30, 0.195

NAMES = ["f", "camx", "camy", "h", "pitch", "yaw", "matW", "matD", "kx", "ky", "sx", "sy", "sz", "tilt", "ywall"]
X0 = np.array([2600, 0.0, -2.2, 0.9, 0.25, 0.0, 0.62, 0.28, 0.0, 0.0, 0.0, 0.32, 0.27, 0.15, 0.55])


def project(p, P):
    f, camx, camy, h, pitch, yaw = p[:6]
    d = np.asarray(P, float) - np.array([camx, camy, h])
    # yaw about z, then pitch down about the camera's x axis; camera looks along +y
    cy_, sy_ = math.cos(yaw), math.sin(yaw)
    x1 = cy_ * d[0] + sy_ * d[1]
    y1 = -sy_ * d[0] + cy_ * d[1]
    z1 = d[2]
    cp, sp = math.cos(pitch), math.sin(pitch)
    fwd = cp * y1 - sp * z1
    up = sp * y1 + cp * z1
    return np.array([CX + f * x1 / fwd, CY - f * up / fwd])


def rect(cx, cy, w, d, z):
    # TL, TR, BR, BL as seen from the camera: back-left, back-right, front-right, front-left
    return [(cx - w / 2, cy + d / 2, z), (cx + w / 2, cy + d / 2, z), (cx + w / 2, cy - d / 2, z), (cx - w / 2, cy - d / 2, z)]


def screen_pts(p):
    sx, sy, sz, tilt = p[10:14]
    # a vertical rectangle leaning back by `tilt` about its bottom edge
    up = np.array([0, math.sin(tilt), math.cos(tilt)])
    bl = np.array([sx - SCR_W / 2, sy, sz])
    br = np.array([sx + SCR_W / 2, sy, sz])
    return [bl + up * SCR_H, br + up * SCR_H, br, bl]


def residuals(p):
    r = []
    for P, o in zip(rect(0, 0, p[6], p[7], 0.003), OBS["mat"]):
        r += list(project(p, P) - o)
    for P, o in zip(rect(p[8], p[9], KB_W, KB_D, KB_H), OBS["kb"]):
        r += list(project(p, P) - o)
    for P, o in zip(screen_pts(p), OBS["screen"]):
        r += list(project(p, P) - o)
    for x in (-0.9, 0.9):
        r.append(project(p, (x, p[14], 0.0))[1] - WALL_V)
    return np.array(r)


def solve(p):
    lam = 1e-3
    for _ in range(400):
        r = residuals(p)
        J = np.zeros((len(r), len(p)))
        for i in range(len(p)):
            dp = np.zeros_like(p)
            dp[i] = 1e-6 * max(1.0, abs(p[i]))
            J[:, i] = (residuals(p + dp) - r) / dp[i]
        A = J.T @ J
        g = J.T @ r
        step = np.linalg.solve(A + lam * np.diag(np.diag(A) + 1e-9), -g)
        if np.sum(residuals(p + step) ** 2) < np.sum(r**2):
            p = p + step
            lam *= 0.5
        else:
            lam *= 4
        if np.linalg.norm(step) < 1e-10:
            break
    return p


if __name__ == "__main__":
    p = solve(X0.copy())
    r = residuals(p)
    sol = dict(zip(NAMES, map(float, p)))
    hfov = math.degrees(2 * math.atan(W_IMG / 2 / sol["f"]))
    sol.update(rms_px=float(np.sqrt(np.mean(r**2))), max_px=float(np.abs(r).max()), hfov_deg=hfov,
               lens_mm_36=float(36 / 2 / math.tan(math.radians(hfov / 2))), image=[W_IMG, H_IMG])
    for k, v in sol.items():
        print(f"{k:8s} {v}")
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "camera.json")
    with open(out, "w") as fh:
        json.dump(sol, fh, indent=1)
    print("wrote", out)
