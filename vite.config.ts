import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// base 用相对路径：同一个 dist 丢在 GitHub Pages 的
// 用户根站（https://xtt-xt.github.io/）或项目子路径
// （https://xtt-xt.github.io/xxx/）都能跑，file:// 双击也能跑。

// 构建时间（北京时间），页脚会显示 —— 用来一眼判断「我看的是不是最新构建」
const buildTime = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Shanghai' });

export default defineConfig({
  base: './',
  plugins: [react()],
  define: { __BUILD_TIME__: JSON.stringify(buildTime) },
  server: { port: 3000, host: true },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: { assetsInlineLimit: 8192 },
});
