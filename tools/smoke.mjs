/**
 * 冒烟测试：用 jsdom 把构建产物真跑一遍。
 * 覆盖：挂载 → 首页 → 路由跳转（项目列表 / 详情 / 关于 / 404）→ 筛选与搜索 → 主题切换 → 手机端抽屉
 * 用法：node tools/smoke.mjs [dist|dist-single]
 */
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM, VirtualConsole } from 'jsdom';

const root = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const which = process.argv[2] || 'dist';
const entry =
  which === 'dist-single'
    ? path.join(root, 'dist-single/xing-tian-standalone.html')
    : path.join(root, 'dist/index.html');

const errors = [];
const known = [];
const vc = new VirtualConsole();
vc.on('jsdomError', (e) => {
  const msg = String(e.message || e);
  // 已知的 jsdom 局限（真浏览器没问题）：
  //  - CSS 解析器不认 color-mix 这类现代写法
  //  - 没有实现 window.scrollTo（每个项目都有的 DOM 能力）
  if (msg.includes('Could not parse CSS stylesheet') || msg.includes("Not implemented: Window's scrollTo")) {
    known.push(msg);
  } else {
    errors.push('jsdomError: ' + msg);
  }
});
vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ').slice(0, 200)));

/* GitHub Releases 的桩数据：jsdom 里没有 fetch，喂一份假的，好让「更新」那条链路也能测到 */
const FAKE_RELEASE = {
  tag_name: 'v9.9.9',
  name: '测试版本',
  published_at: '2026-10-03T00:00:00Z',
  body: [
    '# 大标题',
    '',
    '普通段落，**加粗**、`行内码`、[链接](https://example.com)。',
    '',
    '## 小标题',
    '',
    '- 无序项 A',
    '- 无序项 B',
    '',
    '1. 有序项',
    '',
    '> 引用一段',
    '',
    '```js',
    'console.log(1)',
    '```',
    '',
    '- [x] 已完成',
    '- [ ] 未完成',
    '',
  ].join('\n'),
  html_url: 'https://github.com/xtt-xt/flat-ui/releases/tag/v9.9.9',
  prerelease: false,
  draft: false,
  author: { login: 'tester' },
};

/** 25 个版本：用来验「每页 10 条 + 分页」 */
const FAKE_RELEASES = Array.from({ length: 25 }, (_, i) => {
  const n = 25 - i;
  const day = String((n % 28) + 1).padStart(2, '0');
  return { ...FAKE_RELEASE, tag_name: `v1.0.${n}`, name: `版本 ${n}`, published_at: `2026-09-${day}T00:00:00Z` };
});

const dom = new JSDOM(fs.readFileSync(entry, 'utf8'), {
  runScripts: 'dangerously',
  resources: 'usable',
  pretendToBeVisual: true,
  url: 'file://' + entry,
  virtualConsole: vc,
  beforeParse(win) {
    win.fetch = async (url) => {
      const u = String(url);
      const data = u.includes('/releases/tags/') ? FAKE_RELEASE : FAKE_RELEASES;
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => data,
      };
    };
  },
});

const { window } = dom;
const doc = window.document;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const out = [];
const check = (name, ok, extra = '') => out.push([name, (ok ? 'OK' : '失败') + (extra ? ` ${extra}` : '')]);
const text = () => (doc.body.textContent || '').replace(/\s+/g, ' ');
const press = (el) => el && el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
const type = (input, value) => {
  const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  set.call(input, value);
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
};
const goto = async (hash) => {
  window.location.hash = hash;
  window.dispatchEvent(new window.Event('hashchange'));
  await wait(180);
};

await new Promise((r) => window.addEventListener('load', r, { once: true }));
await wait(600);

/* ---------- 挂载与首页 ---------- */
check('挂载', doc.querySelector('.xt-app') !== null);
check('顶栏品牌', text().includes('星天'));
check('首页首屏', text().includes('我是'));
check('「最近在做」没有占位小标题', !text().includes('占位，之后换成真的进度'));
check('「最近在做」卡片没有那句占位说明', !text().includes('这里以后可以放时间线'));
const cards = doc.querySelectorAll('.xt-card').length;
check('首页精选卡片', cards >= 1, `${cards} 张`);

/* ---------- 页脚构建时间（用来分辨缓存） ---------- */
const buildTag = doc.querySelector('.xt-foot__build')?.textContent || '';
check('页脚有构建时间', /构建 \d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(buildTag), buildTag.trim());
check('页脚没有那句描述', !doc.querySelector('.xt-foot__desc'));

/* ---------- 站顶公告 ---------- */
const anno = doc.querySelector('.xt-anno');
const annoId = anno?.dataset?.annoId ?? '';
check('公告在站顶', !!anno && doc.querySelector('.xt-main')?.firstElementChild === anno);
check(
  '公告有日期标题与正文',
  !!anno && /^\d{4}-\d{2}-\d{2} · .+/.test(anno.querySelector('.fui-alert__title')?.textContent || '') &&
    (anno.querySelector('.fui-alert__desc')?.textContent || '').trim().length > 10,
  `id=${annoId}`,
);
if (anno) {
  press(anno.querySelector('.fui-alert__close'));
  await wait(150);
  check('公告能关掉', !doc.querySelector('.xt-anno'));
  let lsOk = true;
  let saved = null;
  try {
    saved = window.localStorage.getItem('xt-anno-dismissed');
  } catch {
    lsOk = false;
  }
  check(
    '关闭状态写进本地存储',
    !lsOk || saved === annoId,
    lsOk ? `saved=${saved}（当前公告 ${annoId}）` : 'file:// 下 localStorage 不可用，跳过',
  );
} else {
  check('公告能关掉', false, '没找到公告');
}

/* ---------- 项目列表 ---------- */
await goto('/projects');
check('项目页标题', !!doc.querySelector('.xt-page-head h1')?.textContent?.includes('项目'));
check('公告只在首页显示', !doc.querySelector('.xt-anno'));
const listCards = doc.querySelectorAll('.xt-card').length;
check('项目列表卡片', listCards >= 1, `${listCards} 张`);

/* 分段控制器筛选 */
const segs = [...doc.querySelectorAll('.fui-segmented__item')];
check('分类筛选存在', segs.length >= 3, `${segs.length} 个`);
press(segs[2]);
await wait(150);
const webCount = doc.querySelectorAll('.xt-card').length;
check('按分类筛选（网页）', webCount >= 1 && webCount < listCards, `网页 → ${webCount} 张`);
press(segs[3]);
await wait(150);
const libCount = doc.querySelectorAll('.xt-card').length;
check('按分类筛选（库）', libCount >= 1 && libCount < listCards, `库 → ${libCount} 张`);
press(segs[1]);
await wait(150);
check(
  '筛选无结果时有提示',
  !!doc.querySelector('.fui-empty') && doc.querySelectorAll('.xt-card').length === 0,
);
press(segs[0]);
await wait(120);

/* 搜索 */
const search = doc.querySelector('.fui-input input, .xt-toolbar input');
if (search) {
  type(search, '主页');
  await wait(160);
  const found = doc.querySelectorAll('.xt-card').length;
  check('搜索命中', found >= 1 && found <= listCards, `${found} 张`);
  type(search, 'zzzzzz');
  await wait(160);
  check('空结果有提示', !!doc.querySelector('.fui-empty'));
  type(search, '');
  await wait(120);
} else {
  check('搜索框', false, '没找到输入框');
}

/* ---------- 点卡片进详情 ---------- */
const card = doc.querySelector('.xt-card');
press(card);
await wait(200);
check('卡片点击进详情', !!doc.querySelector('.xt-detail__title'), doc.querySelector('.xt-detail__title')?.textContent || '');
check('详情页有键值表', doc.querySelectorAll('.xt-kv__row').length >= 3);

/* 详情页的标签页 */
const tabs = [...doc.querySelectorAll('.fui-tabs__tab')];
check('详情页标签页', tabs.length >= 3, `${tabs.length} 个`);
press(tabs[1]);
await wait(150);
check('切到看点', !!doc.querySelector('.fui-empty') || !!doc.querySelector('.xt-list'));

/* ---------- 关于页 ---------- */
await goto('/about');
check('关于页', text().includes('这个站怎么搭的'));
check('「常见问题」已注释掉', !text().includes('常见问题'));
check('「接下来想做」已删掉', !text().includes('接下来想做'));

/* 头像：亮/暗各一张，按主题只显示一张 */
const avatars = [...doc.querySelectorAll('.xt-avatar-pair img')];
check(
  '关于页有头像（亮暗各一张）',
  avatars.length === 2 && avatars.every((i) => i.src.startsWith('data:image/jpeg;base64,')),
  `${avatars.length} 张`,
);
const visibleAvatars = avatars.filter((i) => window.getComputedStyle(i).display !== 'none').length;
check('头像按主题只显示一张', visibleAvatars === 1, `可见 ${visibleAvatars} 张`);

/* ---------- 公告页（往期公告） ---------- */
await goto('/announcements');
check('公告页标题', !!doc.querySelector('.xt-page-head h1')?.textContent?.includes('公告'));
const annoItems = doc.querySelectorAll('.xt-anno-item').length;
check('公告页有历史公告', annoItems >= 2, `${annoItems} 条`);

/* ---------- 项目详情 · 更新 tab（GitHub Releases） ---------- */
await goto('/projects/flat-ui');
await wait(200);
const updTab = [...doc.querySelectorAll('.fui-tabs__tab')].find((t) => t.textContent?.includes('更新'));
if (updTab) press(updTab);
await wait(600);
const relTag = doc.querySelector('.xt-rel__tag')?.textContent;
check('详情页「更新」按版本号从大到小', relTag === 'v1.0.25', relTag ? `第一条 ${relTag}` : '没有版本条目');
const relRows = doc.querySelectorAll('.xt-rel').length;
check('每页 10 条', relRows === 10, `${relRows} 条`);
check('超过一页出现分页控件', !!doc.querySelector('.fui-pagination'));
check('没有每页条数切换控件', !doc.querySelector('.fui-segmented'));
const pager = [...doc.querySelectorAll('.fui-pagination__btn')];
press(pager[pager.length - 1]); // 下一页
await wait(250);
check('翻页后换了一批版本', doc.querySelector('.xt-rel__tag')?.textContent !== 'v1.0.25', `现在第一条 ${doc.querySelector('.xt-rel__tag')?.textContent}`);

/* ---------- 更新日志页：Markdown 渲染 ---------- */
await goto('/projects/flat-ui/updates/v9.9.9');
await wait(900);
const md = doc.querySelector('.xt-md');
check(
  '更新日志页渲染 Markdown',
  !!md &&
    md.querySelectorAll('.xt-md__h').length >= 2 &&
    md.querySelectorAll('.xt-md__list').length >= 2 &&
    md.querySelectorAll('.xt-md__pre').length >= 1 &&
    md.querySelectorAll('.xt-md__quote').length >= 1 &&
    md.querySelectorAll('.xt-md__check').length >= 2 &&
    !!md.querySelector('a'),
  md
    ? `标题 ${md.querySelectorAll('.xt-md__h').length} / 列表 ${md.querySelectorAll('.xt-md__list').length} / 代码块 ${md.querySelectorAll('.xt-md__pre').length} / 引用 ${md.querySelectorAll('.xt-md__quote').length} / 勾选 ${md.querySelectorAll('.xt-md__check').length}`
    : '没有 .xt-md',
);

/* ---------- 404 ---------- */
await goto('/nope/whatever');
check('未知地址有兜底', !!doc.querySelector('.fui-empty') && text().includes('不见了'));

/* ---------- 主题 ---------- */
await goto('/');
const themeBtn = doc.querySelector('button[aria-label="切换主题"]');
const before = doc.documentElement.dataset.theme;
if (themeBtn) {
  press(themeBtn);
  await wait(100);
  check('主题切换', doc.documentElement.dataset.theme !== before, `${before} → ${doc.documentElement.dataset.theme}`);
} else {
  check('主题切换', false, '没找到按钮');
}

/* ---------- 手机端抽屉 ---------- */
const burger = doc.querySelector('.xt-burger');
check('汉堡按钮在', !!burger);
if (burger) {
  press(burger);
  await wait(180);
  const drawer = doc.querySelector('.fui-drawer');
  check('抽屉能开', !!drawer && !!drawer.querySelector('.xt-drawer-link'));
  const link = drawer?.querySelector('.xt-drawer-link');
  press(link);
  await wait(220);
  check('抽屉里能跳页', !!doc.querySelector('.xt-page-head h1') || !!doc.querySelector('.xt-hero'));
} else {
  check('抽屉能开', false, '没有汉堡按钮');
}

/* ---------- 公告的「记住关闭状态 / 新公告再冒出来」用单文件版另开两个实例验 ---------- */
const singleEntry = path.join(root, 'dist-single/xing-tian-standalone.html');
if (fs.existsSync(singleEntry)) {
  const bootWith = async (dismissedId) => {
    const quiet = new VirtualConsole(); // 静默：这批实例的报错不计入
    const d = new JSDOM(fs.readFileSync(singleEntry, 'utf8'), {
      runScripts: 'dangerously',
      pretendToBeVisual: true,
      url: 'https://xing-tian.test/index.html', // 换成 http(s) 源，localStorage 才可用
      virtualConsole: quiet,
      beforeParse(w) {
        try {
          w.localStorage.setItem('xt-anno-dismissed', dismissedId);
        } catch {
          /* 忽略 */
        }
      },
    });
    await wait(600);
    return d.window.document;
  };
  const sameDoc = await bootWith(annoId || 'current');
  check('关过的同一条公告不再出现', !sameDoc.querySelector('.xt-anno'));
  const newDoc = await bootWith(`${annoId || 'current'}-old`);
  check('换了公告 id 会重新出现', !!newDoc.querySelector('.xt-anno'));
} else {
  check('公告关闭状态持久化', false, '没找到 dist-single 产物');
}

console.log(`=== 星天的主站 · ${which} 冒烟 ===`);
for (const [k, v] of out) console.log(String(k).padEnd(20, ' '), v);
const failed = out.filter(([, v]) => v.startsWith('失败'));
console.log('运行时错误：', errors.length ? errors.slice(0, 5) : '无');
console.log('通过：', `${out.length - failed.length}/${out.length}`);
if (known.length) console.log('已知 jsdom 局限：', known.length + ' 条 CSS 解析警告（忽略）');
process.exit(errors.length || failed.length ? 1 : 0);
