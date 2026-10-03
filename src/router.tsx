import { useEffect, useState } from 'react';
import type { AnchorHTMLAttributes, MouseEvent as ReactMouseEvent, ReactNode } from 'react';

/* ============================================================
   一个极简的 hash 路由（不到 100 行，不引任何依赖）

   为什么用 hash 而不是 history：
   GitHub Pages 是纯静态托管，/projects/mcpbox 这种真路径刷新会 404，
   得额外搞 404.html 重写。hash 路由（#/projects/mcpbox）刷新、直链、
   从微信里点开都不会坏，换到任何静态托管也照样跑。

   要加页面：只在 App.tsx 的 ROUTES 表里加一行就行。
   ============================================================ */

export interface RouteInfo {
  /** 规范化后的路径，如 /projects/mcpbox */
  path: string;
  /** ?a=1 这种查询参数（本项目暂时没用到，留着方便以后加） */
  query: URLSearchParams;
}

export function parseHash(raw: string): RouteInfo {
  const body = raw.replace(/^#/, '') || '/';
  const q = body.indexOf('?');
  const rawPath = q >= 0 ? body.slice(0, q) : body;
  const query = new URLSearchParams(q >= 0 ? body.slice(q + 1) : '');
  let path = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  if (path.length > 1) path = path.replace(/\/+$/, '') || '/';
  return { path, query };
}

export function useRoute(): RouteInfo {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

/** 跳转；replace=true 时不留历史（比如重定向） */
export function navigate(to: string, opts: { replace?: boolean; keepScroll?: boolean } = {}) {
  const target = `#${to.startsWith('/') ? to : `/${to}`}`;
  if (opts.replace) {
    const url = `${window.location.pathname}${window.location.search}${target}`;
    window.history.replaceState(null, '', url);
    // jsdom / 老浏览器不一定有 HashChangeEvent，用普通事件兜底
    window.dispatchEvent(new Event('hashchange'));
  } else {
    window.location.hash = target;
  }
  if (!opts.keepScroll) window.scrollTo({ top: 0 });
}

/** 把 '/projects/:slug' 和 '/projects/mcpbox' 对起来；对不上返回 null */
export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const p = pattern.split('/').filter(Boolean);
  const s = path.split('/').filter(Boolean);
  if (p.length !== s.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(s[i]);
    else if (p[i] !== s[i]) return null;
  }
  return params;
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; children?: ReactNode };

export function Link({ to, children, onClick, ...rest }: LinkProps) {
  const href = `#${to.startsWith('/') ? to : `/${to}`}`;
  const handle = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    // 新窗口/新标签打开这类操作交回给浏览器
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={href} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
