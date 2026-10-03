import { useEffect, useState } from 'react';
import { Alert, Badge, Breadcrumb, Button, Card, EmptyState, Skeleton } from '../flat-ui';
import { navigate } from '../router';
import { bySlug } from '../data/projects';
import { githubRepoOf, loadRelease, shortDate } from '../lib/github';
import type { GhRelease } from '../lib/github';
import { Markdown } from '../lib/markdown';
import { IconArrowLeft, IconExternal } from '../appIcons';

/* 某一版的更新日志：拉 GitHub Release 的 body，按 Markdown 渲染 */

type State =
  | { status: 'loading' }
  | { status: 'ok'; release: GhRelease }
  | { status: 'error'; error: string };

export default function UpdateDetail({ slug, tag }: { slug: string; tag: string }) {
  const project = bySlug(slug);
  const repo = githubRepoOf(project?.links);
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    if (!repo) return;
    let alive = true;
    setState({ status: 'loading' });
    loadRelease(repo, tag)
      .then((release) => {
        if (alive) setState({ status: 'ok', release });
      })
      .catch((err: unknown) => {
        if (alive) setState({ status: 'error', error: err instanceof Error ? err.message : String(err) });
      });
    return () => {
      alive = false;
    };
  }, [repo, tag]);

  if (!project || !repo) {
    return (
      <EmptyState
        text={`没找到「${slug}」的更新记录`}
        action={<Button onClick={() => navigate('/projects')}>回项目列表</Button>}
      />
    );
  }

  const release = state.status === 'ok' ? state.release : null;

  return (
    <>
      <Breadcrumb
        items={[
          { label: '首页', href: '#/' },
          { label: '项目', href: '#/projects' },
          { label: project.name, href: `#/projects/${slug}` },
          { label: tag },
        ]}
      />

      <div className="xt-detail__head">
        <span className="xt-detail__mark">{(project.name.replace(/[（(].*$/, '').slice(0, 1) || '·').slice(0, 1)}</span>
        <div>
          <h1 className="xt-detail__title">{tag}</h1>
          <div className="xt-detail__meta">
            <span>{project.name} 的更新日志</span>
            {release?.publishedAt && <span>{shortDate(release.publishedAt)}</span>}
            {release?.author && <span>by {release.author}</span>}
            {release?.prerelease && <Badge tone="warning">预发布</Badge>}
          </div>
        </div>
        <div className="xt-detail__actions">
          <a
            className="fui-btn fui-btn--outline"
            href={`https://github.com/${repo}/releases/tag/${encodeURIComponent(tag)}`}
            target="_blank"
            rel="noreferrer"
          >
            在 GitHub 看
            <IconExternal size={15} />
          </a>
          <Button variant="outline" icon={<IconArrowLeft size={15} />} onClick={() => navigate(`/projects/${slug}`)}>
            返回项目
          </Button>
        </div>
      </div>

      {state.status === 'loading' && (
        <Card>
          <div className="xt-md-skeleton">
            <Skeleton variant="title" width="45%" />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="70%" />
          </div>
        </Card>
      )}

      {state.status === 'error' && (
        <Alert tone="danger" title="拉不到这一版的更新日志">
          {state.error}
          <div className="xt-rel-retry">
            <Button size="sm" variant="outline" onClick={() => navigate(`/projects/${slug}`)}>
              回项目
            </Button>
          </div>
        </Alert>
      )}

      {release && (
        <>
          {release.name && release.name !== release.tag && <p className="xt-lead">{release.name}</p>}
          <Card>
            {release.body.trim() ? (
              <Markdown text={release.body} />
            ) : (
              <p className="xt-muted">这一版没有写更新说明。</p>
            )}
          </Card>
        </>
      )}
    </>
  );
}
