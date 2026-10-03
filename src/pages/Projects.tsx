import { useMemo, useState } from 'react';
import { Button, EmptyState, SearchInput, Segmented } from '../flat-ui';
import { FILTERS, KIND_META, PROJECTS, STATUS_META } from '../data/projects';
import { ProjectCard } from '../components/ProjectCard';
import { PageHeader } from '../components/PageHeader';

export default function Projects() {
  const [kind, setKind] = useState('all');
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const key = q.trim().toLowerCase();
    return PROJECTS.filter((p) => {
      if (kind !== 'all' && p.kind !== kind) return false;
      if (!key) return true;
      const hay = [
        p.name,
        p.en ?? '',
        p.tagline,
        p.year ?? '',
        KIND_META[p.kind],
        STATUS_META[p.status].label,
        ...p.tags,
        ...(p.intro ?? []),
        ...(p.highlights ?? []),
        ...(p.facts ?? []).flatMap((f) => [f.k, f.v]),
        ...(p.links ?? []).map((l) => l.label),
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(key);
    });
  }, [kind, q]);

  return (
    <>
      <PageHeader
        title="项目"
        extra={<span className="xt-muted">{PROJECTS.length} 个项目</span>}
      />

      <div className="xt-toolbar">
        <Segmented options={FILTERS} value={kind} onChange={setKind} />
        <div className="xt-toolbar__search">
          <SearchInput
            placeholder="搜名字 / 标签 / 描述"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState
          text="没有匹配的项目"
          action={
            <Button
              variant="outline"
              onClick={() => {
                setKind('all');
                setQ('');
              }}
            >
              清空筛选
            </Button>
          }
        />
      ) : (
        <div className="xt-grid">
          {list.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      )}
    </>
  );
}
