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
  /** 开源协议（如 MIT / GPL-3.0）；没填的话详情页不显示「开源协议」这行 */
  license?: string;
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
    slug: 'mcpbox',
    name: 'MCPBox',
    en: '手机上的 MCP 文件盒',
    tagline: '把 Android 手机变成 MCP 服务器：AI 能读写手机文件、跑命令、开浏览器，每一步都要你点同意。',
    kind: 'app',
    tags: ['Android', 'Kotlin', 'MCP', 'AI'],
    status: 'active',
    year: '2026',
    license: 'GPL-3.0',
    featured: true,
    links: [
      { label: 'GitHub', href: 'https://github.com/xtt-xt/MCPBox', kind: 'repo' },
      { label: '下载 APK', href: 'https://github.com/xtt-xt/MCPBox/releases', kind: 'download' },
    ],
    intro: [
      '把 Android 手机变成 MCP 服务器：AI 客户端连上它，就能读写手机里的文件、执行终端命令、用内置浏览器上网、操作界面。',
      '自带 70 多个工具，权限分四态（允许 / 询问 / 拒绝 / 跟随预设），危险操作默认都要你在悬浮窗或通知栏里点一下同意；除了应用沙箱，还能借 Root / Shizuku 做更重的事。',
    ],
    highlights: [
      '逐次审批：写文件、跑命令这类操作默认都要过你这一关，还能选「每次都问」还是「这个会话全允许」',
      '工具包与会话隔离：只给 AI 开它这轮用得到的那几个工具，免得几十个工具全塞给模型',
      '记忆库：AI 可以往里记项目笔记，换客户端也带得走，支持导入导出与备份',
      '静态站点托管：手机里的文件直接当网页，用内置浏览器就能看效果',
    ],
    facts: [
      { k: '技术栈', v: 'Kotlin + Jetpack Compose' },
      { k: '规模', v: '70+ 个 MCP 工具 / 7 个内置工具包' },
      { k: '最新版本', v: 'v1.2.2（2026-10-09）' },
      { k: '安装包', v: 'release APK 约 2.7 MB' },
    ],
  },
  {
    slug: 'flat-ui',
    name: 'FlatUI',
    en: '扁平控件库',
    tagline: '一套扁平化前端控件库：零渐变、单一主色、1px 描边，这个站就是用它搭的。',
    kind: 'lib',
    tags: ['设计系统', 'React', 'CSS'],
    status: 'active',
    year: '2026',
    license: 'MIT',
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
    links: [
      { label: 'GitHub', href: 'https://github.com/xtt-xt/xtt-xt.github.io', kind: 'repo' },
      { label: '打开网站', href: 'https://xtt.p8.ink/', kind: 'site' },
    ],
    intro: ['这个站自己：首页 / 项目 / 关于三个页面，纯静态，源码推到 GitHub 就自动构建发布。'],
    highlights: [],
    facts: [
      { k: '技术栈', v: 'Vite + React 19 + TypeScript' },
      { k: '线上地址', v: 'xtt.p8.ink' },
    ],
  },
];

export const bySlug = (slug: string): Project | undefined => PROJECTS.find((p) => p.slug === slug);

/** 首页「精选」用 */
export const featuredProjects = (n = 3): Project[] => PROJECTS.filter((p) => p.featured).slice(0, n);

/** 详情页底部的「相关项目」 */
export const relatedProjects = (slug: string, n = 3): Project[] => PROJECTS.filter((p) => p.slug !== slug).slice(0, n);
