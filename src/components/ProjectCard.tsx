import { Badge, Tag } from '../flat-ui';
import { navigate } from '../router';
import { KIND_META, STATUS_META } from '../data/projects';
import type { Project } from '../data/projects';
import { IconArrowRight, IconExternal } from '../appIcons';

/** 项目卡片：整张可点（进详情页），卡里的链接单独可点 */
export function ProjectCard({ project }: { project: Project }) {
  const status = STATUS_META[project.status];
  const open = () => navigate(`/projects/${project.slug}`);

  return (
    <div
      className={`xt-card${project.placeholder ? ' xt-card--placeholder' : ''}`}
      role="link"
      tabIndex={0}
      aria-label={`${project.name} 详情`}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
    >
      <div className="xt-card__top">
        <span className="xt-card__mark">{project.name.replace(/[（(].*$/, '').slice(0, 1) || '新'}</span>
        <span className="xt-card__names">
          <span className="xt-card__name">{project.name}</span>
          <span className="xt-card__en">
            {project.en ? `${project.en} · ` : ''}
            {KIND_META[project.kind]}
          </span>
        </span>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>

      <p className="xt-card__tagline">{project.tagline}</p>

      <div className="xt-card__tags">
        {project.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

      <div className="xt-card__foot">
        <span>{project.year ?? '——'}</span>
        {project.links && project.links.length > 0 && (
          <span className="xt-card__links">
            {project.links.slice(0, 2).map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                {l.label}
                <IconExternal size={13} />
              </a>
            ))}
          </span>
        )}
        <span className="xt-card__go">
          详情
          <IconArrowRight size={14} />
        </span>
      </div>
    </div>
  );
}
