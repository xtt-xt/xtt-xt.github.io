/* ============================================================
   项目数据 —— 全站的项目卡片、详情页都从这里长出来

   加一个项目：往 PROJECTS 里塞一条就行，详情页路由会自己认。
   目前只留了「个人主页」一条，以后有别的项目再加。
   ============================================================ */

export type ProjectKind = 'app' | 'web' | 'lib' | 'tool';
export type ProjectStatus = 'active' | 'wip' | 'done' | 'paused';

export interface ProjectLink {
  label: string;
  href: string;
  kind?: 'repo' | 'site' | 'download';
}

export interface Project {
  /** 用在地址里：/projects/<slug> */
  slug: string;
  name: string;
  /** 英文名 / 副标题，可省 */
  en?: string;
  /** 一句话介绍（卡片上显示） */
  tagline: string;
  kind: ProjectKind;
  tags: string[];
  status: ProjectStatus;
  /** 年份或时间段，随便写 */
  year?: string;
  links?: ProjectLink[];
  /** 是否出现在首页「精选」里 */
  featured?: boolean;
  /** 详情页「概览」的段落 */
  intro?: string[];
  /** 详情页「看点」的条目 */
  highlights?: string[];
  /** 详情页键值表（会拼上自动算出来的几行） */
  facts?: { k: string; v: string }[];
  /** 占位卡（还没定下来的项目），只影响卡片描边样式 */
  placeholder?: boolean;
}

export const KIND_META: Record<ProjectKind, string> = {
  app: '应用',
  web: '网页',
  lib: '库',
  tool: '工具',
};

export const STATUS_META: Record<ProjectStatus, { label: string; tone: 'success' | 'warning' | 'accent' | 'neutral' }> = {
  active: { label: '在维护', tone: 'success' },
  wip: { label: '在做', tone: 'accent' },
  done: { label: '已做完', tone: 'neutral' },
  paused: { label: '搁置', tone: 'warning' },
};

/** 项目页顶部的筛选胶囊 */
export const FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: '全部' },
  ...(Object.keys(KIND_META) as ProjectKind[]).map((k) => ({ value: k, label: KIND_META[k] })),
];

export const PROJECTS: Project[] = [
  {
    slug: 'flat-ui',
    name: 'FlatUI',
    en: '扁平控件库',
    tagline: '一套扁平化前端控件库：零渐变、单一主色、1px 描边，这个站就是用它搭的。',
    kind: 'lib',
    tags: ['设计系统', 'React', 'CSS'],
    status: 'active',
    year: '2026',
    featured: true,
    links: [
      { label: 'GitHub', href: 'https://github.com/xtt-xt/flat-ui', kind: 'repo' },
      { label: '查看文档', href: 'https://flatui.xtt.p8.ink/', kind: 'site' },
    ],
    intro: [
      '67 个设计令牌、36 个控件、24 个线性图标：纯 CSS 变量 + React 组件，不依赖任何 UI 框架。',
      '自带 10 页文档站（总览 / 色彩 / 字体 / 间距 + 六组组件），支持亮暗双主题。',
    ],
    highlights: [],
    facts: [
      { k: '技术栈', v: 'CSS 变量 + React 19 + TypeScript' },
      { k: '规模', v: '36 个控件 / 67 个令牌 / 24 个图标' },
      { k: '在线文档', v: 'flatui.xtt.p8.ink' },
    ],
  },
  {
    slug: 'site',
    name: '个人主页',
    en: 'XingTian · Personal Site',
    tagline: '就是这个站：用 FlatUI 搭的纯静态个人主页。',
    kind: 'web',
    tags: ['前端', 'React', 'FlatUI'],
    status: 'active',
    year: '2026',
    featured: true,
    links: [],
    intro: ['这个站自己：首页 / 项目 / 关于三个页面，纯静态，丢到 GitHub Pages 就能跑。'],
    highlights: [],
    facts: [{ k: '技术栈', v: 'Vite + React 19 + TypeScript' }],
  },
];

export const bySlug = (slug: string): Project | undefined => PROJECTS.find((p) => p.slug === slug);

/** 首页「精选」用 */
export const featuredProjects = (n = 3): Project[] => PROJECTS.filter((p) => p.featured).slice(0, n);

/** 详情页底部的「相关项目」 */
export const relatedProjects = (slug: string, n = 3): Project[] => PROJECTS.filter((p) => p.slug !== slug).slice(0, n);
