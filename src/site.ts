/* ============================================================
   站点级别的信息，改这里就能改全站（标题、导航、页脚、链接）
   ============================================================ */

export const SITE = {
  /** 中文名 */
  name: '星天',
  /** 英文名 / ID */
  en: 'XingTian',
  /** 浏览器标签页上的站名 */
  title: '星天的主站',
  /** 站点一句话（页脚那句按用户要求去掉了，先留着备用；index.html 的 meta description 是单独写的） */
  description: '星天的主站：项目、折腾记录，和一点自我介绍。',

  /** 链接：填上以后「关于」页与页脚会自动显示 */
  github: 'https://github.com/xtt-xt',
  email: 'xt11451488@outlook.com',
  /** B 站空间 */
  bilibili: 'https://space.bilibili.com/3707031221438668',
  blog: '',

  /** 顶栏导航（path 对应 router 里的路由） */
  nav: [
    { path: '/', label: '首页', en: 'Home' },
    { path: '/projects', label: '项目', en: 'Projects' },
    { path: '/about', label: '关于', en: 'About' },
    { path: '/announcements', label: '公告', en: 'Announcements' },
  ],
} as const;

export type NavItem = (typeof SITE.nav)[number];
