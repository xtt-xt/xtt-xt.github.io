/* ============================================================
   拉 GitHub Releases —— 纯前端、匿名调 REST API

   · 只读公开仓库；匿名有速率限制（每小时 60 次/IP），所以结果缓存 10 分钟；
   · 会顺着 Link 头自动翻页，把「全部版本」都取回来（最多 6 页防呆）；
   · 网络失败时如果有旧缓存，先用旧的顶着，不让页面白屏。
   ============================================================ */

import type { ProjectLink } from '../data/projects';

/** 从项目的 links 里挑出 GitHub 仓库（owner/name）；没接就返回 null */
export function githubRepoOf(links?: readonly ProjectLink[]): string | null {
  for (const l of links ?? []) {
    const m = /^https?:\/\/github\.com\/([^/?#]+)\/([^/?#]+)/i.exec(l.href);
    if (m) return `${m[1]}/${m[2].replace(/\.git$/i, '')}`;
  }
  return null;
}

export interface GhRelease {
  tag: string;
  name: string;
  publishedAt: string;
  body: string;
  htmlUrl: string;
  prerelease: boolean;
  /** 发布人 */
  author: string;
}

const TTL = 10 * 60 * 1000;
const API = 'https://api.github.com';
const MAX_PAGES = 6; // 每页 100 条 → 最多 600 个版本

interface RawRelease {
  tag_name: string;
  name: string | null;
  published_at: string | null;
  body: string | null;
  html_url: string;
  prerelease: boolean;
  draft: boolean;
  author?: { login?: string } | null;
}

const cacheKey = (k: string) => `xt-gh:${k}`;

function readCache(key: string): { t: number; data: unknown } | null {
  try {
    const raw = localStorage.getItem(cacheKey(key));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { t: number; data: unknown };
    return typeof parsed?.t === 'number' ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(key: string, data: unknown) {
  try {
    localStorage.setItem(cacheKey(key), JSON.stringify({ t: Date.now(), data }));
  } catch {
    /* 隐私模式 / file:// 下存不了就算了 */
  }
}

function toRelease(raw: RawRelease): GhRelease {
  return {
    tag: raw.tag_name,
    name: raw.name || raw.tag_name,
    publishedAt: raw.published_at ?? '',
    body: raw.body ?? '',
    htmlUrl: raw.html_url,
    prerelease: raw.prerelease,
    author: raw.author?.login ?? '',
  };
}

function httpError(status: number): Error {
  if (status === 403 || status === 429) {
    return new Error('GitHub API 被限流了（匿名每小时 60 次），过一会儿再刷新试试');
  }
  if (status === 404) return new Error('仓库或这个版本不存在（私有仓库匿名读不到）');
  return new Error(`GitHub 返回了 ${status}`);
}

/** 从 Link 头里挑出 rel="next" 的地址 */
function nextLink(header: string | null): string | null {
  if (!header) return null;
  for (const part of header.split(',')) {
    const m = part.match(/<([^>]+)>\s*;\s*rel="next"/);
    if (m) return m[1];
  }
  return null;
}

const GH_HEADERS = { Accept: 'application/vnd.github+json' };

/** 拉全部版本（自动翻页） */
async function fetchAllReleases(repo: string): Promise<GhRelease[]> {
  const raw: RawRelease[] = [];
  let url: string | null = `${API}/repos/${repo}/releases?per_page=100`;
  for (let page = 0; page < MAX_PAGES && url; page++) {
    const res = await fetch(url, { headers: GH_HEADERS });
    if (!res.ok) {
      if (page === 0) throw httpError(res.status); // 第一页就失败 → 报错
      break; // 后面某页失败 → 有多少算多少
    }
    const batch = (await res.json()) as RawRelease[];
    if (!Array.isArray(batch) || batch.length === 0) break;
    raw.push(...batch);
    url = nextLink(res.headers.get('link'));
  }
  return raw.filter((r) => !r.draft).map(toRelease);
}

/** 带缓存的请求：新鲜缓存直接用；失败时退回过期缓存 */
async function cached<T>(key: string, loader: () => Promise<T>): Promise<T> {
  const hit = readCache(key);
  if (hit && Date.now() - hit.t < TTL) return hit.data as T;
  try {
    const data = await loader();
    writeCache(key, data);
    return data;
  } catch (err) {
    if (hit) return hit.data as T;
    throw err;
  }
}

/** 某个仓库的全部 Release（草稿已过滤，已按版本号从大到小排） */
export function loadReleases(repo: string): Promise<GhRelease[]> {
  return cached(`releases:v2:${repo}`, async () => sortReleases(await fetchAllReleases(repo)));
}

/** 单个版本 */
export function loadRelease(repo: string, tag: string): Promise<GhRelease> {
  return cached(`release:v2:${repo}@${tag}`, async () => {
    const res = await fetch(`${API}/repos/${repo}/releases/tags/${encodeURIComponent(tag)}`, { headers: GH_HEADERS });
    if (!res.ok) throw httpError(res.status);
    return toRelease((await res.json()) as RawRelease);
  });
}

/** 版本号解析：v1.2.3 / 1.2 / 2.0.0-beta.1 都认 */
function versionParts(tag: string): number[] | null {
  const m = tag.trim().match(/^v?(\d+)(?:\.(\d+))?(?:\.(\d+))?/i);
  if (!m) return null;
  return [Number(m[1]), Number(m[2] ?? 0), Number(m[3] ?? 0)];
}

/** 版本号从大到小排；解析不出数字的（比如 nightly）排在后面，按发布时间倒序 */
export function sortReleases(list: GhRelease[]): GhRelease[] {
  return [...list].sort((a, b) => {
    const va = versionParts(a.tag);
    const vb = versionParts(b.tag);
    if (va && vb) {
      for (let i = 0; i < 3; i++) {
        if (va[i] !== vb[i]) return vb[i] - va[i];
      }
      return b.publishedAt.localeCompare(a.publishedAt);
    }
    if (va) return -1;
    if (vb) return 1;
    return b.publishedAt.localeCompare(a.publishedAt);
  });
}

/** 2026-10-03T12:00:00Z → 2026-10-03 */
export const shortDate = (iso: string) => (iso ? iso.slice(0, 10) : '');
