import { useState } from 'react';
import { Alert, Badge, Breadcrumb, Button, EmptyState, Tabs, Tag } from '../flat-ui';
import { Link, navigate } from '../router';
import { KIND_META, STATUS_META, bySlug, relatedProjects } from '../data/projects';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectReleases } from '../components/ProjectReleases';
import { githubRepoOf } from '../lib/github';
import { IconArrowLeft, IconExternal, IconSpark } from '../appIcons';

export default function ProjectDetail({ slug }: { slug: string }) {
  const project = bySlug(slug);
  const [tab, setTab] = useState('overview');

  if (!project) {
    return (
      <EmptyState
        text={`没找到「${slug}」这个项目`}
        action={<Button onClick={() => navigate('/projects')}>回项目列表</Button>}
      />
    );
  }

  const status = STATUS_META[project.status];
  const repo = project.links?.find((l) => l.kind === 'repo') ?? project.links?.[0];
  const related = relatedProjects(project.slug, 3);
  const ghRepo = githubRepoOf(project.links);

  const facts: { k: string; v: string }[] = [
    { k: '分类', v: KIND_META[project.kind] },
    { k: '状态', v: status.label },
    { k: '标签', v: project.tags.join(' · ') },
    { k: '时间', v: project.year ?? '（待填）' },
    ...(project.facts ?? []),
  ];

  return (
    <>
      <Breadcrumb
        items={[
          { label: '首页', href: '#/' },
          { label: '项目', href: '#/projects' },
          { label: project.name },
        ]}
      />

      <div className="xt-detail__head">
        <span className="xt-detail__mark">
          {project.name.replace(/[（(].*$/, '').slice(0, 1) || <IconSpark size={22} />}
        </span>
        <div>
          <h1 className="xt-detail__title">{project.name}</h1>
          <div className="xt-detail__meta">
            {project.en && <span>{project.en}</span>}
            <Badge tone={status.tone}>{status.label}</Badge>
            <Badge>{KIND_META[project.kind]}</Badge>
          </div>
        </div>
        <div className="xt-detail__actions">
          {repo && (
            <a className="fui-btn fui-btn--primary" href={repo.href} target="_blank" rel="noreferrer">
              {repo.label}
              <IconExternal size={15} />
            </a>
          )}
          {(project.links ?? [])
            .filter((l) => l !== repo)
            .map((l) => (
              <a
                key={l.href}
                className="fui-btn fui-btn--outline"
                href={l.href}
                target="_blank"
                rel="noreferrer"
              >
                {l.label}
                <IconExternal size={15} />
              </a>
            ))}
          <Button variant="outline" icon={<IconArrowLeft size={15} />} onClick={() => navigate('/projects')}>
            返回列表
          </Button>
        </div>
      </div>

      <p className="xt-lead">{project.tagline}</p>

      <Tabs
        activeKey={tab}
        onChange={setTab}
        items={[
          {
            key: 'overview',
            label: '概览',
            children: (
              <div className="xt-stack">
                {project.intro && project.intro.length > 0 ? (
                  <div className="xt-prose">
                    {project.intro.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                ) : (
                  <Alert tone="info" title="介绍待补充">
                    这个项目的正文还没写。把稿子发我，我填到 <code>src/data/projects.ts</code> 的{' '}
                    <code>{project.slug}</code> 这条里。
                  </Alert>
                )}

                <div className="xt-kv">
                  {facts.map((f) => (
                    <div className="xt-kv__row" key={f.k}>
                      <span className="xt-kv__k">{f.k}</span>
                      <span className="xt-kv__v">{f.v}</span>
                    </div>
                  ))}
                </div>

                <div className="xt-shot">截图 / 封面（占位）</div>
              </div>
            ),
          },
          {
            key: 'highlights',
            label: '看点',
            children:
              project.highlights && project.highlights.length > 0 ? (
                <ul className="xt-list">
                  {project.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              ) : (
                <EmptyState text="看点还没写 —— 比如「为什么做它」「最难的地方」" />
              ),
          },
          {
            key: 'changelog',
            label: '更新',
            children: ghRepo ? (
              <ProjectReleases slug={project.slug} repo={ghRepo} />
            ) : (
              <EmptyState text="这个项目还没接 GitHub 仓库 —— 在 links 里加一条仓库地址，这里就会自动列出它的版本" />
            ),
          },
        ]}
      />

      <section className="xt-section">
        <div className="xt-section__head">
          <h3 className="xt-section__title">相关项目</h3>
          <Link to="/projects" className="xt-section__more">
            全部 →
          </Link>
        </div>
        <div className="xt-grid">
          {related.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <div className="xt-tagrow">
        {project.tags.map((t) => (
          <Tag key={t} variant="accent">
            {t}
          </Tag>
        ))}
      </div>
    </>
  );
}
