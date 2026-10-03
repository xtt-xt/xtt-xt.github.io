import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Badge, Drawer, Icons, IconButton, Tooltip } from './flat-ui';
import { Link, matchPath, useRoute } from './router';
import { SITE } from './site';
import { bySlug } from './data/projects';
import { IconCode, IconSpark } from './appIcons';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Announcements from './pages/Announcements';
import UpdateDetail from './pages/UpdateDetail';
import NotFound from './pages/NotFound';

/* ============================================================
   路由表 —— 加页面只改这里（path 支持 :参数）
   ============================================================ */

type Params = Record<string, string>;

interface RouteDef {
  path: string;
  /** 浏览器标签页标题 */
  title: (p: Params) => string;
  render: (p: Params) => ReactNode;
}

const ROUTES: RouteDef[] = [
  { path: '/', title: () => '首页', render: () => <Home /> },
  { path: '/projects', title: () => '项目', render: () => <Projects /> },
  {
    path: '/projects/:slug',
    title: (p) => bySlug(p.slug)?.name ?? '项目',
    render: (p) => <ProjectDetail slug={p.slug} />,
  },
  { path: '/about', title: () => '关于', render: () => <About /> },
  { path: '/announcements', title: () => '公告', render: () => <Announcements /> },
  {
    path: '/projects/:slug/updates/:tag',
    title: (p) => `${p.tag} · ${bySlug(p.slug)?.name ?? '更新'}`,
    render: (p) => <UpdateDetail slug={p.slug} tag={p.tag} />,
  },
];

const THEME_KEY = 'xt-theme';

function readTheme(): 'light' | 'dark' {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch {
    /* file:// 下 localStorage 可能不可用 */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const route = useRoute();
  const [theme, setTheme] = useState<'light' | 'dark'>(readTheme);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* 忽略 */
    }
  }, [theme]);

  const hit = ROUTES.map((r) => ({ r, params: matchPath(r.path, route.path) })).find((x) => x.params !== null);
  const params: Params = hit?.params ?? {};
  const pageTitle = hit ? hit.r.title(params) : '页面不见了';

  useEffect(() => {
    document.title = route.path === '/' ? SITE.title : `${pageTitle} · ${SITE.title}`;
  }, [route.path, pageTitle]);

  // 切页时顺手收起手机端菜单
  useEffect(() => setMenuOpen(false), [route.path]);

  const isActive = (path: string) =>
    path === '/' ? route.path === '/' : route.path === path || route.path.startsWith(`${path}/`);

  return (
    <div className="fui-root xt-app">
      <header className="xt-top">
        <div className="xt-top__inner">
          <Link to="/" className="xt-brand">
            <span className="xt-brand__mark">
              <IconSpark size={18} />
            </span>
            <span className="xt-brand__text">
              <span className="xt-brand__name">{SITE.name}</span>
              <span className="xt-brand__sub">
                {SITE.en} · 个人站
              </span>
            </span>
          </Link>

          <nav className="xt-nav">
            {SITE.nav.map((n) => (
              <Link key={n.path} to={n.path} className={`xt-nav__link${isActive(n.path) ? ' is-active' : ''}`}>
                {n.label}
              </Link>
            ))}
          </nav>

          <span className="xt-top__spacer" />

          <div className="xt-actions">
            <Tooltip tip="GitHub" side="bottom">
              <IconButton
                aria-label="GitHub"
                ghost
                onClick={() => window.open(SITE.github, '_blank', 'noopener')}
              >
                <IconCode size={17} />
              </IconButton>
            </Tooltip>
            <Tooltip tip={theme === 'dark' ? '切到亮色' : '切到暗色'} side="bottom">
              <IconButton
                aria-label="切换主题"
                ghost
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Icons.IconSun size={17} /> : <Icons.IconMoon size={17} />}
              </IconButton>
            </Tooltip>
            <IconButton className="xt-burger" aria-label="打开菜单" ghost onClick={() => setMenuOpen(true)}>
              <Icons.IconMenu size={18} />
            </IconButton>
          </div>
        </div>
      </header>

      <main className="xt-main">
        {hit ? hit.r.render(params) : <NotFound />}
      </main>

      <Footer />

      <Drawer
        open={menuOpen}
        side="right"
        onClose={() => setMenuOpen(false)}
        head={
          <>
            <Link to="/" className="xt-drawer-brand">
              <span className="xt-drawer-brand__mark">
                <IconSpark size={18} />
              </span>
              <span className="xt-drawer-brand__text">
                <span className="xt-drawer-brand__name">{SITE.name}</span>
                <span className="xt-drawer-brand__sub">{SITE.en} · 个人站</span>
              </span>
            </Link>
            <IconButton
              className="xt-drawer-close"
              aria-label="关闭菜单"
              onClick={() => setMenuOpen(false)}
            >
              <Icons.IconX size={17} />
            </IconButton>
          </>
        }
        foot={<span>v1.0.0 · 2026</span>}
      >
        <nav className="xt-drawer-nav">
          <div className="xt-drawer-group">
            <div className="xt-drawer-group__title">导航</div>
            {SITE.nav.map((n) => (
              <Link
                key={n.path}
                to={n.path}
                className={`xt-drawer-link${isActive(n.path) ? ' is-active' : ''}`}
              >
                <span>{n.label}</span>
                <em className="xt-drawer-link__en">{n.en}</em>
              </Link>
            ))}
          </div>

          <div className="xt-drawer-group">
            <div className="xt-drawer-group__title">链接</div>
            <a className="xt-drawer-link" href={SITE.github} target="_blank" rel="noreferrer">
              <span>GitHub</span>
              <em className="xt-drawer-link__en">github.com/xtt-xt</em>
            </a>
            {SITE.email ? (
              <a className="xt-drawer-link" href={`mailto:${SITE.email}`}>
                <span>邮箱</span>
                <em className="xt-drawer-link__en">{SITE.email}</em>
              </a>
            ) : null}
            {SITE.bilibili ? (
              <a className="xt-drawer-link" href={SITE.bilibili} target="_blank" rel="noreferrer">
                <span>B 站</span>
                <em className="xt-drawer-link__en">space.bilibili.com</em>
              </a>
            ) : null}
          </div>
        </nav>
      </Drawer>
    </div>
  );
}

function Footer() {
  return (
    <footer className="xt-foot">
      <div className="xt-foot__inner">
        <div>
          <div className="xt-foot__brand">
            <span className="xt-brand__mark">
              <IconSpark size={16} />
            </span>
            <span className="xt-brand__name">{SITE.name}</span>
          </div>
          <div className="xt-foot__badges">
            <Badge tone="accent">FlatUI</Badge>
            <Badge>纯静态</Badge>
            <Badge>GitHub Pages</Badge>
          </div>
        </div>

        <div>
          <div className="xt-foot__title">导航</div>
          {SITE.nav.map((n) => (
            <Link key={n.path} to={n.path} className="xt-foot__link">
              {n.label}
            </Link>
          ))}
        </div>

        <div>
          <div className="xt-foot__title">链接</div>
          <a className="xt-foot__link" href={SITE.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          {SITE.email ? (
            <a className="xt-foot__link" href={`mailto:${SITE.email}`}>
              邮箱
            </a>
          ) : (
            <span className="xt-foot__link xt-foot__link--muted">邮箱（待填）</span>
          )}
          {SITE.bilibili && (
            <a className="xt-foot__link" href={SITE.bilibili} target="_blank" rel="noreferrer">
              B 站
            </a>
          )}
        </div>
      </div>

      <div className="xt-foot__bottom">
        <div className="xt-foot__bottom-inner">
          <span>© 2026 {SITE.name}</span>
          <span>·</span>
          <span>用 FlatUI 控件库搭的静态站</span>
          <span className="xt-foot__build">构建 {__BUILD_TIME__}</span>
        </div>
      </div>
    </footer>
  );
}
