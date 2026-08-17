#!/usr/bin/env python3
"""Export the Vikings War master icon into iOS and Android launcher sizes."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "branding" / "app-icon-1024.png"
PLAY_STORE = ROOT / "assets" / "branding" / "play-store-icon-512.png"
IOS_ICONSET = ROOT / "ios" / "VikingsWar" / "Images.xcassets" / "AppIcon.appiconset"
ANDROID_RES = ROOT / "android" / "app" / "src" / "main" / "res"

# Pixel size -> filename. Shared sizes reuse one PNG.
IOS_FILES: dict[int, str] = {
    20: "Icon-20.png",
    29: "Icon-29.png",
    40: "Icon-40.png",
    58: "Icon-58.png",
    60: "Icon-60.png",
    76: "Icon-76.png",
    80: "Icon-80.png",
    87: "Icon-87.png",
    120: "Icon-120.png",
    152: "Icon-152.png",
    167: "Icon-167.png",
    180: "Icon-180.png",
    1024: "Icon-1024.png",
}

IOS_SLOTS: list[dict[str, str]] = [
    {"idiom": "iphone", "scale": "2x", "size": "20x20", "filename": IOS_FILES[40]},
    {"idiom": "iphone", "scale": "3x", "size": "20x20", "filename": IOS_FILES[60]},
    {"idiom": "iphone", "scale": "2x", "size": "29x29", "filename": IOS_FILES[58]},
    {"idiom": "iphone", "scale": "3x", "size": "29x29", "filename": IOS_FILES[87]},
    {"idiom": "iphone", "scale": "2x", "size": "40x40", "filename": IOS_FILES[80]},
    {"idiom": "iphone", "scale": "3x", "size": "40x40", "filename": IOS_FILES[120]},
    {"idiom": "iphone", "scale": "2x", "size": "60x60", "filename": IOS_FILES[120]},
    {"idiom": "iphone", "scale": "3x", "size": "60x60", "filename": IOS_FILES[180]},
    {"idiom": "ipad", "scale": "1x", "size": "20x20", "filename": IOS_FILES[20]},
    {"idiom": "ipad", "scale": "2x", "size": "20x20", "filename": IOS_FILES[40]},
    {"idiom": "ipad", "scale": "1x", "size": "29x29", "filename": IOS_FILES[29]},
    {"idiom": "ipad", "scale": "2x", "size": "29x29", "filename": IOS_FILES[58]},
    {"idiom": "ipad", "scale": "1x", "size": "40x40", "filename": IOS_FILES[40]},
    {"idiom": "ipad", "scale": "2x", "size": "40x40", "filename": IOS_FILES[80]},
    {"idiom": "ipad", "scale": "1x", "size": "76x76", "filename": IOS_FILES[76]},
    {"idiom": "ipad", "scale": "2x", "size": "76x76", "filename": IOS_FILES[152]},
    {"idiom": "ipad", "scale": "2x", "size": "83.5x83.5", "filename": IOS_FILES[167]},
    {
        "idiom": "ios-marketing",
        "scale": "1x",
        "size": "1024x1024",
        "filename": IOS_FILES[1024],
    },
]

ANDROID_LAUNCHERS: dict[str, int] = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

# Adaptive foreground is 108dp; content stays in the inner 72dp safe zone.
ANDROID_FOREGROUNDS: dict[str, int] = {
    "mipmap-mdpi": 108,
    "mipmap-hdpi": 162,
    "mipmap-xhdpi": 216,
    "mipmap-xxhdpi": 324,
    "mipmap-xxxhdpi": 432,
}

ADAPTIVE_XML = """<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background" />
    <foreground android:drawable="@mipmap/ic_launcher_foreground" />
</adaptive-icon>
"""


def flatten_rgb(image: Image.Image, fill: tuple[int, int, int]) -> Image.Image:
    if image.mode == "RGB":
        return image
    rgba = image.convert("RGBA")
    background = Image.new("RGB", rgba.size, fill)
    background.paste(rgba, mask=rgba.split()[-1])
    return background


def sample_edge_color(image: Image.Image) -> tuple[int, int, int]:
    width, height = image.size
    samples = [
        image.getpixel((0, 0)),
        image.getpixel((width - 1, 0)),
        image.getpixel((0, height - 1)),
        image.getpixel((width - 1, height - 1)),
        image.getpixel((width // 2, 0)),
        image.getpixel((width // 2, height - 1)),
    ]
    red = sum(int(pixel[0]) for pixel in samples) // len(samples)
    green = sum(int(pixel[1]) for pixel in samples) // len(samples)
    blue = sum(int(pixel[2]) for pixel in samples) // len(samples)
    return (red, green, blue)


def resize_square(image: Image.Image, size: int) -> Image.Image:
    return image.resize((size, size), Image.Resampling.LANCZOS)


def circular_crop(image: Image.Image) -> Image.Image:
    size = image.size[0]
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size - 1, size - 1), fill=255)
    rgba = image.convert("RGBA")
    rgba.putalpha(mask)
    return rgba


def padded_foreground(
    image: Image.Image, canvas_size: int, fill: tuple[int, int, int]
) -> Image.Image:
    content_size = round(canvas_size * 72 / 108)
    scaled = resize_square(image, content_size)
    canvas = Image.new("RGB", (canvas_size, canvas_size), fill)
    offset = (canvas_size - content_size) // 2
    canvas.paste(scaled, (offset, offset))
    return canvas


def write_ios_icons(master: Image.Image) -> None:
    IOS_ICONSET.mkdir(parents=True, exist_ok=True)
    for leftover in IOS_ICONSET.glob("*.png"):
        leftover.unlink()
    for size, filename in IOS_FILES.items():
        icon = resize_square(master, size)
        dest = IOS_ICONSET / filename
        icon.save(dest, format="PNG")
        print(f"wrote {dest.relative_to(ROOT)} {icon.size} {icon.mode}")
    contents = {
        "images": IOS_SLOTS,
        "info": {"author": "xcode", "version": 1},
    }
    (IOS_ICONSET / "Contents.json").write_text(
        json.dumps(contents, indent=2) + "\n"
    )
    print(f"wrote {(IOS_ICONSET / 'Contents.json').relative_to(ROOT)}")


def write_android_icons(master: Image.Image, fill: tuple[int, int, int]) -> None:
    for folder, size in ANDROID_LAUNCHERS.items():
        directory = ANDROID_RES / folder
        directory.mkdir(parents=True, exist_ok=True)
        launcher = resize_square(master, size)
        launcher.save(directory / "ic_launcher.png", format="PNG")
        circular_crop(launcher).save(directory / "ic_launcher_round.png", format="PNG")
        print(f"wrote {(directory / 'ic_launcher.png').relative_to(ROOT)}")

    for folder, size in ANDROID_FOREGROUNDS.items():
        directory = ANDROID_RES / folder
        directory.mkdir(parents=True, exist_ok=True)
        foreground = padded_foreground(master, size, fill)
        foreground.save(directory / "ic_launcher_foreground.png", format="PNG")
        print(f"wrote {(directory / 'ic_launcher_foreground.png').relative_to(ROOT)}")

    anydpi = ANDROID_RES / "mipmap-anydpi-v26"
    anydpi.mkdir(parents=True, exist_ok=True)
    (anydpi / "ic_launcher.xml").write_text(ADAPTIVE_XML)
    (anydpi / "ic_launcher_round.xml").write_text(ADAPTIVE_XML)
    print(f"wrote {(anydpi / 'ic_launcher.xml').relative_to(ROOT)}")

    hex_color = "#{:02X}{:02X}{:02X}".format(*fill)
    colors_path = ANDROID_RES / "values" / "colors.xml"
    colors_path.write_text(
        '<?xml version="1.0" encoding="utf-8"?>\n'
        "<resources>\n"
        f'    <color name="ic_launcher_background">{hex_color}</color>\n'
        "</resources>\n"
    )
    print(f"wrote {colors_path.relative_to(ROOT)} {hex_color}")


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"missing master icon: {SOURCE}")
    original = Image.open(SOURCE)
    fill = sample_edge_color(original.convert("RGB"))
    master = flatten_rgb(original, fill)
    if master.size != (1024, 1024):
        master = resize_square(master, 1024)
    master.save(SOURCE, format="PNG")
    print(f"master {SOURCE.relative_to(ROOT)} {master.size} {master.mode}")

    play_store = resize_square(master, 512)
    play_store.save(PLAY_STORE, format="PNG")
    print(f"wrote {PLAY_STORE.relative_to(ROOT)}")

    write_ios_icons(master)
    write_android_icons(master, fill)


if __name__ == "__main__":
    main()
