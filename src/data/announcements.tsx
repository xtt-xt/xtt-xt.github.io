import type { ReactNode } from 'react';
import type { AlertTone } from '../flat-ui';
import { Link } from '../router';

/* ============================================================
   公告（站顶那条）
   —— 数组最上面的那条是「当前公告」，全站每个页面顶部都会显示。

   两个要点：
     · 访客点了关闭 → 关的是这一条（按 id 记在本地），下次来不再打扰；
     · 以后发了新公告（换 id）→ 哪怕他关过旧的，新公告照样会冒出来。
   ============================================================ */

export interface Announcement {
  /** 唯一 id：换公告就换 id，关闭状态是按它记的 */
  id: string;
  /** 显示在标题前面，如 2026-10-03 */
  date: string;
  title: string;
  body: ReactNode;
  tone?: AlertTone;
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: '2026-10-03-003',
    date: '2026-10-03',
    title: 'FlatUI 上线了',
    tone: 'info',
    body: (
      <>
        我把自己的扁平化控件库 <b>FlatUI</b> 整理开源了：代码在 GitHub，在线文档在{' '}
        <a href="https://flatui.xtt.p8.ink/" target="_blank" rel="noreferrer">
          flatui.xtt.p8.ink
        </a>
        （36 个控件、67 个设计令牌）。这个站也是用它搭的 —— 顺手把手机端侧边栏和项目页都更新了一遍。
        往期公告都收在这里：<Link to="/announcements">往期公告</Link>。
      </>
    ),
  },
  {
    id: '2026-10-03-002',
    date: '2026-10-03',
    title: '公告换新了',
    tone: 'info',
    body: (
      <>
        这是刚发的第二条公告（<b>id 换了</b>）。你要是关过上一条，这条照样会冒出来 —— 就是现在这条。
        关掉它以后，只有我更新的公告才会再打扰你；站顶这条跟下面的内容留了 24px 空隙。
      </>
    ),
  },
  {
    id: '2026-10-03-launch',
    date: '2026-10-03',
    title: '网站开张',
    tone: 'info',
    body: (
      <>
        框架搭好了：首页、项目、关于都能点，项目文案还在陆续补。这条关掉之后不会再出现，
        <b>但发新公告还会再冒出来</b>。
      </>
    ),
  },
];

/** 本地存「已关闭的公告 id」的 key */
export const ANNOUNCEMENT_KEY = 'xt-anno-dismissed';
