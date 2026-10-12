# 星天的主站 · XingTian

用 **FlatUI**（自己的扁平化控件库）搭的纯静态个人站：首页 + 项目列表 + 项目详情 + 关于。
产物是几十 KB 的静态文件，**可以直接丢到 GitHub Pages**，也能双击 `index.html` 用 `file://` 打开。

线上：<https://xtt.p8.ink/>（源码就在这个仓库里，推 `main` 自动构建并发布）

## 目录里有什么

```
dist/                                  ← 构建产物，丢进任意静态托管就能跑
  index.html                           （经典 script + 相对路径，file:// 也支持）
  assets/index-*.js|css
  .nojekyll                            （GitHub Pages 需要，别删）
dist-single/xing-tian-standalone.html  ← 单文件版：CSS/JS 全内联，发给别人最省事
```

## 本地构建

```bash
npm install
npm run build                      # tsc -b && vite build
node tools/postbuild.mjs           # 1) dist 转经典 script 2) 生成单文件版
node tools/smoke.mjs dist          # 冒烟：jsdom 真跑一遍产物
node tools/smoke.mjs dist-single   # 单文件版也跑一遍
```

> 一行版：`npm run post`（构建后处理 + 两个冒烟）

**手机端（Termux / proot 里的 Ubuntu）用 Makefile 更省事**：

```bash
make            # 看全部命令
make check      # 构建 + 冒烟（dist 与 dist-single 各一遍）
make serve      # 起个零依赖静态预览服务器 → 手机浏览器开 http://127.0.0.1:4173/
make dev        # 开发服务器（热更新）→ http://127.0.0.1:5173/
make pack       # 打一份源码压缩包 xing-tian-source.zip（排除 node_modules/dist/.git）
```

> 预览服务器是 `tools/preview.mjs`（Node 原生 http，零依赖），服务的是 `dist/`。
> 直接双击 `dist/index.html` 也能看（file:// 下站点本身没问题）。

## 部署到 GitHub Pages

**方式 A：GitHub Actions（推荐）**

仓库里已经有 `.github/workflows/deploy.yml`：

1. 把这个工程推到 GitHub 仓库的 `main` 分支；
2. 仓库 **Settings → Pages → Source** 选 **GitHub Actions**；
3. 之后每次推 `main` 都会自动构建并发布。

地址：

- 仓库名是 `<用户名>.github.io` → `https://<用户名>.github.io/`
- 普通仓库 → `https://<用户名>.github.io/<仓库名>/`

两种都对：`vite.config.ts` 里 `base: './'`（相对路径），hash 路由所以刷新不 404。

**方式 B：手传**

把 `dist/` 里的东西全丢到仓库根（或 `docs/`，Pages 里选那个目录）就行。**记得别漏 `.nojekyll`**
（下划线开头的文件会被 Jekyll 吃掉）。

**方式 C：只想本地看**

`dist/index.html` 双击就能开，或 `dist-single/xing-tian-standalone.html` 单文件发给别人。

## 要改东西，改哪儿

| 想改什么 | 改哪里 |
| --- | --- |
| 站名、简介、导航、GitHub / 邮箱链接 | `src/site.ts` |
| **站顶公告**（只在首页显示；标题 / 正文 / 什么时候再弹） | `src/data/announcements.tsx` |
| **头像**（亮色 / 暗色两张，自动跟主题切） | 图丢进 `src/assets/avatar/` → 跑 `python3 tools/make-avatar.py` |
| 加 / 改项目（卡片 + 详情页） | `src/data/projects.ts` |
| 加一个页面 | `src/App.tsx` 的 `ROUTES` 加一行 + `src/pages/` 写个组件 |
| 主色 / 圆角 / 字体 | `src/flat-ui/tokens.css`（改 `--fui-accent` 一处全站生效） |
| **访客自定义主色**（设置页那套：派生规则、预设色板） | `src/lib/accent.ts`（首屏脚本在 `index.html` 里有一份同款算法，要一起改） |
| 站点布局样式 | `src/app.css` |

## 说明

- **公告**：站顶那条来自 `src/data/announcements.tsx`，数组第一项就是当前公告，**只在首页显示**。
  访客关掉后按公告 `id` 记在本地（localStorage 的 `xt-anno-dismissed`），**同一条不再出现**；
  以后发新公告（**换个 id**）就会重新弹出来。
- **头像**：「关于」页的头像有亮色 / 暗色两张（浅底给白天、深底给暗色），跟主题自动切、圆形描边。
  图片放在 `src/assets/avatar/`（`avatar-light.*` / `avatar-dark.*`），换图后跑
  `python3 tools/make-avatar.py` 会压成 base64 写进 `src/data/avatar.ts`（内联是为了单文件版也能显示）。
- **路由**：自己写的 hash 路由（`src/router.tsx`，约 100 行，零依赖）。用 hash 是为了静态托管
  刷新/直链不 404，也不需要在 GitHub Pages 上搞 404 重写。
- **主题**：亮 / 暗两套，跟随系统 + 本地记忆（localStorage 的 `xt-theme`），首屏前置脚本防闪白。
- **自定义配色**：导航「设置」页里可以换主色（8 个预设 + 系统取色器）。只换一个色，
  hover / active / soft / ink 由 `src/lib/accent.ts` 按亮暗主题各派生一套（色上文字按对比度自动取白或黑）。
  选中后写在 `<html>` 的内联变量上（优先级最高），并存 localStorage 的 `xt-accent`，**只在这台设备生效**，
  换设备 / 别人访问还是默认紫；`index.html` 首屏脚本里内联了同一套算法，避免刷新闪一下默认色。
- **字体**：Space Grotesk / JetBrains Mono 走 Google Fonts CDN，离线回落系统字体。
- **控件库**：`src/flat-ui/` 是从 FlatUI 控件库拷过来的源码，没改功能（只多导出了 `useSlideIndicator`）。
