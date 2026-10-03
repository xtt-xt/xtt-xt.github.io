#!/usr/bin/env python3
"""
把 src/assets/avatar/ 里的两张头像压成 base64，写进 src/data/avatar.ts。

为什么要内联：站点有「单文件版」（CSS/JS 全内联，发给别人最省事），
如果头像走外链文件，单文件版就会裂图；内联之后 dist / 单文件 / file:// /
GitHub Pages 四种场景都一样。

要换头像：
  1) 把新图丢进 src/assets/avatar/（文件名保持 avatar-light.* / avatar-dark.*）
  2) 跑：python3 tools/make-avatar.py
  3) 重新构建：npm run build && node tools/postbuild.mjs

依赖：pillow（沙箱里已装；本地没有就 pip install pillow）
"""

import base64
import io
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src/assets/avatar')
OUT = os.path.join(ROOT, 'src/data/avatar.ts')

SIZE = 192  # 头像显示 72px，2 倍图够用；再大只是白占体积

# 原图整张用（用户要求保留原图构图，不要裁到星星）
# 想裁的话：把这里改成像 {'avatar-light': 0.64, 'avatar-dark': 0.72} 的比例
CROP: dict[str, float] = {}


def find(prefix: str) -> str:
    for name in sorted(os.listdir(SRC)):
        if name.startswith(prefix) and not name.endswith('.ts'):
            return os.path.join(SRC, name)
    raise SystemExit(f'没找到 {prefix}.* —— 头像图要放在 {SRC}/')


def prep(prefix: str) -> str:
    path = find(prefix)
    im = Image.open(path).convert('RGB')
    ratio = CROP.get(prefix, 1.0)
    if ratio < 1.0:
        w, h = im.size
        side = int(min(w, h) * ratio)
        left = (w - side) // 2
        top = (h - side) // 2
        im = im.crop((left, top, left + side, top + side))
    if im.size != (SIZE, SIZE):
        im = im.resize((SIZE, SIZE), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'JPEG', quality=90, optimize=True)
    raw = buf.getvalue()
    print(f'{os.path.basename(path)} → 裁{ratio} → {SIZE}x{SIZE} JPEG {len(raw) / 1024:.1f} KB')
    return base64.b64encode(raw).decode()


HEADER = '''/* ============================================================
   头像（base64 内联，单文件版 / file:// / GitHub Pages 都能显示）

   由 tools/make-avatar.py 生成，不要手改。
   要换头像：把新图丢进 src/assets/avatar/，再跑
     python3 tools/make-avatar.py
   · avatar-light.* → 亮色主题（白天）用
   · avatar-dark.*  → 暗色主题用
   ============================================================ */

'''


def main() -> None:
    light = prep('avatar-light')
    dark = prep('avatar-dark')
    with open(OUT, 'w') as f:
        f.write(HEADER)
        f.write(f"export const AVATAR_LIGHT =\n  'data:image/jpeg;base64,{light}';\n\n")
        f.write(f"export const AVATAR_DARK =\n  'data:image/jpeg;base64,{dark}';\n")
    print(f'{OUT} → {os.path.getsize(OUT) / 1024:.1f} KB')


if __name__ == '__main__':
    main()
