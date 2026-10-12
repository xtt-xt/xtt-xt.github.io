#!/usr/bin/env python3
"""打一份源码 zip：xing-tian-source.zip

排除 node_modules / dist / dist-single / .git，以及所有 .zip（免得把自己打进去）。
手机和容器里都没有 zip 命令，所以用 python3 的 zipfile。
"""
import os
import zipfile

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = os.path.join(root, 'xing-tian-source.zip')
SKIP_DIRS = {'node_modules', 'dist', 'dist-single', '.git', '__pycache__'}

files = []
for dirpath, dirnames, filenames in os.walk(root):
    dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
    for name in filenames:
        if name.endswith('.zip') or name == '.DS_Store':
            continue
        files.append(os.path.relpath(os.path.join(dirpath, name), root))

with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for rel in sorted(files):
        z.write(os.path.join(root, rel), rel)

print('{}  {} 个文件  {:.1f} KB'.format(out, len(files), os.path.getsize(out) / 1024))
