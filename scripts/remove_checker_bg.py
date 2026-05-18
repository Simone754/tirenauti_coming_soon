"""Remove baked-in dark checkerboard background from a logo PNG."""

from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

from PIL import Image


def load_rgb(path: Path) -> Image.Image:
    img = Image.open(path).convert("RGBA")
    return img


def is_checker_dark(r: int, g: int, b: int, *, lum_max: float = 78.0) -> bool:
    """Checkerboard cells are near-black / dark gray; logo colors are vivid."""
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    if lum > lum_max:
        return False
    # Reject saturated logo colors that are still somewhat dark (e.g. deep blue)
    mx = max(r, g, b)
    mn = min(r, g, b)
    sat = (mx - mn) / max(mx, 1)
    if sat > 0.35 and mx > 55:
        return False
    return True


def border_flood_transparent(img: Image.Image, lum_max: float = 78.0) -> Image.Image:
    w, h = img.size
    px = img.load()
    visited = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    def try_add(x: int, y: int) -> None:
        if x < 0 or y < 0 or x >= w or y >= h or visited[y][x]:
            return
        r, g, b, _a = px[x, y]
        if not is_checker_dark(r, g, b, lum_max=lum_max):
            return
        visited[y][x] = True
        q.append((x, y))

    for x in range(w):
        try_add(x, 0)
        try_add(x, h - 1)
    for y in range(h):
        try_add(0, y)
        try_add(w - 1, y)

    while q:
        x, y = q.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if nx < 0 or ny < 0 or nx >= w or ny >= h or visited[ny][nx]:
                continue
            r, g, b, _a = px[nx, ny]
            if not is_checker_dark(r, g, b, lum_max=lum_max):
                continue
            visited[ny][nx] = True
            q.append((nx, ny))

    out = img.copy()
    opx = out.load()
    for y in range(h):
        for x in range(w):
            if visited[y][x]:
                r, g, b, _ = opx[x, y]
                opx[x, y] = (r, g, b, 0)
    return out


def main() -> int:
    repo = Path(__file__).resolve().parents[1]
    default_src = repo / "assets" / "logo-source-checker.png"
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else default_src
    if not src.exists():
        # Cursor-saved filename fallback
        alt = list((repo / "assets").glob("*image-17c83a81*.png"))
        src = alt[0] if alt else src
    dst = Path(sys.argv[2]) if len(sys.argv) > 2 else repo / "assets" / "logo-transparent.png"

    img = load_rgb(src)
    out = border_flood_transparent(img)
    out.save(dst, format="PNG", optimize=True)
    print(f"Wrote {dst} ({out.size[0]}x{out.size[1]})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
