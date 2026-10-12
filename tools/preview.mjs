/**
 * 极简静态预览服务器（零依赖，手机上也跑得动）
 *
 *   node tools/preview.mjs [目录] [端口]
 *   node tools/preview.mjs dist 4173
 *
 * 手机端用法：先跑起来，再用手机浏览器打开 http://127.0.0.1:4173/
 * （站点是 hash 路由，任何路径都回到 index.html，所以直接开根地址就行）
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve(process.argv[2] || 'dist');
const port = Number(process.argv[3] || 4173);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.zip': 'application/zip',
  '.woff2': 'font/woff2',
};

if (!fs.existsSync(dir)) {
  console.error(`目录不存在：${dir}（先 npm run build）`);
  process.exit(1);
}

http
  .createServer((req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    let file = path.normalize(path.join(dir, url));
    if (!file.startsWith(dir)) {
      res.writeHead(403);
      return res.end('403');
    }
    fs.stat(file, (err, st) => {
      if (!err && st.isDirectory()) file = path.join(file, 'index.html');
      fs.stat(file, (err2, st2) => {
        if (err2 || !st2.isFile()) {
          res.writeHead(404);
          return res.end('404 Not Found');
        }
        res.writeHead(200, {
          'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
          'Content-Length': st2.size,
          'Cache-Control': 'no-store',
        });
        fs.createReadStream(file).pipe(res);
      });
    });
  })
  .listen(port, '0.0.0.0', () => {
    console.log(`预览地址：http://127.0.0.1:${port}/`);
    console.log(`服务目录：${dir}`);
  });
