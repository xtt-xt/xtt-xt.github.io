/**
 * 构建后处理，产出两种都能「零依赖打开」的形态：
 *
 *  1) dist/index.html —— 改成经典 script（去掉 type="module" / crossorigin，移到 </body> 前）
 *     → 双击（file://）能跑，丢进任意静态服务器 / GitHub Pages 也能跑。
 *  2) dist-single/xing-tian-standalone.html —— CSS/JS 全内联，发给别人最省事。
 *
 * 用法：node tools/postbuild.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const root = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const dist = path.join(root, 'dist');
const indexPath = path.join(dist, 'index.html');
const singleDir = path.join(root, 'dist-single');
const singleFile = path.join(singleDir, 'xing-tian-standalone.html');

const SCRIPT_RE = /<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g;
const CSS_RE = /<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g;
const read = (href) => fs.readFileSync(path.join(dist, href.replace(/^\.\//, '')), 'utf8');

let html = fs.readFileSync(indexPath, 'utf8');
if (!SCRIPT_RE.test(html)) throw new Error('没找到 vite 的入口 script，构建产物变了？');
SCRIPT_RE.lastIndex = 0;

/* ---------- 1. dist：经典脚本，外链保留 ---------- */
let jsHref = '';
const classic = html
  .replace(/<link rel="modulepreload"[^>]*>\s*/g, '')
  .replace(SCRIPT_RE, (_m, href) => { jsHref = href; return ''; })
  // file:// 下 crossorigin 会让样式表变成 CORS 请求（origin 为 null）而被拦
  .replace(/\s+crossorigin/g, '')
  .replace('</body>', () => `<script src="${jsHref}"></script>\n</body>`);
fs.writeFileSync(indexPath, classic);

/* ---------- 2. dist-single：全部内联 ---------- */
let js = '';
let single = html
  .replace(/<link rel="modulepreload"[^>]*>\s*/g, '')
  .replace(CSS_RE, (_m, href) => `<style>\n${read(href)}\n</style>`)
  .replace(SCRIPT_RE, (_m, href) => { js = read(href); return ''; });

if (/<\/script/i.test(js)) throw new Error('JS 里出现 </script，需要转义后再内联');
single = single.replace('</body>', () => `<script>\n${js}\n</script>\n</body>`);
fs.mkdirSync(singleDir, { recursive: true });
fs.writeFileSync(singleFile, single);

const kb = (p) => (fs.statSync(p).size / 1024).toFixed(1) + ' KB';
console.log('dist/index.html   →', kb(indexPath), `(经典脚本 ${jsHref})`);
console.log('单文件            →', kb(singleFile));
