import { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, EmptyState, Pagination, Skeleton } from '../flat-ui';
import { Link } from '../router';
import { loadReleases, shortDate } from '../lib/github';
import type { GhRelease } from '../lib/github';

/* ============================================================
   项目详情页的「更新」标签页 —— 接这个项目对应仓库的 GitHub Releases

   · 版本号从大到小排（v1.10 > v1.9，不是按字符串比）
   · 每页固定 10 条，超过一页才出现 FlatUI 的 Pagination
   · 点版本号 → /projects/<slug>/updates/<tag> 看那一版的更新日志
   ============================================================ */

/** 每页条数（写死：不给切换，省得列表上一堆控件） */
const PAGE_SIZE = 10;

type State =
  | { status: 'loading' }
  | { status: 'ok'; list: GhRelease[] }
  | { status: 'error'; error: string };

export function ProjectReleases({ slug, repo }: { slug: string; repo: string }) {
  const [state, setState] = useState<State>({ status: 'loading' });
  const [page, setPage] = useState(1);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setState({ status: 'loading' });
    loadReleases(repo)
      .then((list) => {
        if (alive) setState({ status: 'ok', list });
      })
      .catch((err: unknown) => {
        if (alive) setState({ status: 'error', error: err instanceof Error ? err.message : String(err) });
      });
    return () => {
      alive = false;
    };
  }, [repo, nonce]);

  const list = state.status === 'ok' ? state.list : [];
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const cur = Math.min(page, totalPages);
  const slice = useMemo(() => list.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE), [list, cur]);

  if (state.status === 'loading') {
    return (
      <div className="xt-rel-list">
        {[0, 1, 2].map((i) => (
          <div className="xt-rel xt-rel--skeleton" key={i}>
            <Skeleton variant="text" width={72} height={14} />
            <Skeleton variant="text" width={180} height={12} />
          </div>
        ))}
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <Alert tone="danger" title="拉不到版本列表">
        {state.error}
        <div className="xt-rel-retry">
          <Button size="sm" variant="outline" onClick={() => setNonce((n) => n + 1)}>
            重试
          </Button>
        </div>
      </Alert>
    );
  }

  if (list.length === 0) {
    return <EmptyState text="这个仓库还没发过 Release" />;
  }

  return (
    <>
      <div className="xt-rel-list">
        {slice.map((r, i) => (
          <Link key={r.tag} to={`/projects/${slug}/updates/${encodeURIComponent(r.tag)}`} className="xt-rel">
            <span className="xt-rel__tag">{r.tag}</span>
            {r.prerelease && <Badge tone="warning">预发布</Badge>}
            {cur === 1 && i === 0 && !r.prerelease && <Badge tone="accent">最新</Badge>}
            {r.name && r.name !== r.tag && <span className="xt-rel__name">{r.name}</span>}
            <span className="xt-rel__date">{shortDate(r.publishedAt)}</span>
          </Link>
        ))}
      </div>

      <div className="xt-repo__foot">
        <span className="xt-muted xt-repo__count">
          共 {list.length} 个版本 · 第 {cur} / {totalPages} 页
        </span>
        <span className="xt-repo__spacer" />
        {totalPages > 1 && (
          <Pagination page={cur} total={list.length} pageSize={PAGE_SIZE} onChange={setPage} />
        )}
      </div>
    </>
  );
}
