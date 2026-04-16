#!/usr/bin/env python3
"""Generate Command Center PWA icons.

Design: the Arch — a Roman triumphal arch silhouette in amber on civic dark.
Font-independent, maskable-safe (content inside central 80%).

Sizes: 192, 512 (manifest requirement).
Palette: matches theme_color (#1A1410) + accent (#C89A5A) from styles.css.
"""
from PIL import Image, ImageDraw
import os

# Palette — matches split/styles.css [data-theme="dark"]
BG_OUTER = (26, 20, 16)      # #1A1410 — civic dark
BG_INNER = (36, 28, 22)      # #241C16 — very slight lift
AMBER = (200, 154, 90)       # #C89A5A — accent
AMBER_DIM = (110, 85, 56)    # #6E5538 — accent-dim

def draw_icon(size, maskable=True):
    """Draw the Arch icon at `size` x `size`.
    
    Safe zone for maskable is center 80% — content must fit within it.
    """
    img = Image.new('RGB', (size, size), BG_OUTER)
    d = ImageDraw.Draw(img)
    
    # Subtle inner vignette — paint an inner rounded square slightly lighter
    # to add depth without going overboard
    inset = int(size * 0.04)
    d.rounded_rectangle(
        [inset, inset, size - inset, size - inset],
        radius=int(size * 0.12),
        fill=BG_INNER,
    )
    
    # Arch geometry — keep everything inside the central 80% safe zone
    safe_pad = int(size * 0.15)
    safe_left = safe_pad
    safe_right = size - safe_pad
    safe_top = safe_pad
    safe_bottom = size - safe_pad
    safe_w = safe_right - safe_left
    safe_h = safe_bottom - safe_top
    
    # Stroke width scales with size
    stroke = max(2, int(size * 0.035))
    
    # Arch proportions — classic 1:1.5 height:width-ish, not too squat
    arch_width = int(safe_w * 0.62)
    arch_height = int(safe_h * 0.72)
    arch_left = safe_left + (safe_w - arch_width) // 2
    arch_right = arch_left + arch_width
    
    # Foundation line — sits at the bottom of the arch, just above safe bottom
    foundation_y = safe_bottom - int(safe_h * 0.05)
    foundation_extend = int(safe_w * 0.08)  # extends slightly past arch
    d.line(
        [(arch_left - foundation_extend, foundation_y),
         (arch_right + foundation_extend, foundation_y)],
        fill=AMBER,
        width=stroke,
    )
    
    # Arch: two vertical legs + semicircular top
    arch_top = foundation_y - arch_height
    arch_leg_height = int(arch_height * 0.55)  # legs are 55% of total height
    arch_shoulder_y = foundation_y - arch_leg_height
    arch_radius = (arch_right - arch_left) // 2
    
    # Left leg
    d.line(
        [(arch_left, foundation_y - int(stroke / 2)),
         (arch_left, arch_shoulder_y)],
        fill=AMBER,
        width=stroke,
    )
    # Right leg
    d.line(
        [(arch_right, foundation_y - int(stroke / 2)),
         (arch_right, arch_shoulder_y)],
        fill=AMBER,
        width=stroke,
    )
    
    # Semicircular top — PIL arc takes bounding box + start/end angles
    # Arc bounding box spans the full arch width
    arc_bbox = [
        arch_left,
        arch_shoulder_y - arch_radius,
        arch_right,
        arch_shoulder_y + arch_radius,
    ]
    d.arc(
        arc_bbox,
        start=180,
        end=360,
        fill=AMBER,
        width=stroke,
    )
    
    # Keystone — small indicator at the top of the arch, ceremonial detail
    keystone_w = int(arch_width * 0.08)
    keystone_h = int(stroke * 1.4)
    keystone_cx = (arch_left + arch_right) // 2
    keystone_top_y = arch_shoulder_y - arch_radius
    d.rectangle(
        [keystone_cx - keystone_w // 2,
         keystone_top_y - int(keystone_h * 0.3),
         keystone_cx + keystone_w // 2,
         keystone_top_y + int(keystone_h * 0.7)],
        fill=AMBER,
    )
    
    # "CC" mark — tiny ceremonial stamp below the arch center on the foundation
    # Use dots so we're font-independent — two small filled circles
    mark_y = foundation_y + int(safe_h * 0.04)
    mark_r = max(2, int(size * 0.012))
    mark_spacing = int(size * 0.04)
    mark_cx = (arch_left + arch_right) // 2
    if mark_y + mark_r < safe_bottom:
        d.ellipse(
            [mark_cx - mark_spacing - mark_r, mark_y - mark_r,
             mark_cx - mark_spacing + mark_r, mark_y + mark_r],
            fill=AMBER_DIM,
        )
        d.ellipse(
            [mark_cx + mark_spacing - mark_r, mark_y - mark_r,
             mark_cx + mark_spacing + mark_r, mark_y + mark_r],
            fill=AMBER_DIM,
        )
    
    return img


OUT_DIR = '/home/claude/Command-Center'
for size in [192, 512]:
    img = draw_icon(size)
    path = os.path.join(OUT_DIR, f'icon-{size}.png')
    img.save(path, 'PNG', optimize=True)
    sz = os.path.getsize(path)
    print(f'  icon-{size}.png: {sz:,} bytes')

# Also save into split/ so the build picks them up if the builder chooses
split_dir = os.path.join(OUT_DIR, 'split')
# Not copying to split — icons live at repo root where manifest.json references them
print('Done.')
