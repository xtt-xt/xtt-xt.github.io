import { Card } from '../flat-ui';
import { Link } from '../router';
import { SITE } from '../site';
import { PROJECTS, featuredProjects } from '../data/projects';
import { ProjectCard } from '../components/ProjectCard';
import { Announcement } from '../components/Announcement';
import { IconSpark } from '../appIcons';

export default function Home() {
  const featured = featuredProjects(3);

  return (
    <>
      {/* ---------------- 站顶公告（只在首页显示） ---------------- */}
      <Announcement />

      {/* ---------------- 首屏 ---------------- */}
      <div className="xt-hero">
        <div>
          <span className="xt-hero__badge">
            <IconSpark size={13} />
            个人站 · 纯静态
          </span>
          <h2 className="xt-hero__title">
            我是 <em>{SITE.name}</em>
          </h2>
          <div className="xt-hero__cta">
            <Link to="/projects" className="fui-btn fui-btn--primary">
              <IconSpark size={16} />
              看看我的项目
            </Link>
            <Link to="/about" className="fui-btn fui-btn--outline">
              关于我
            </Link>
          </div>
        </div>

        <div className="xt-hero__aside">
          <div className="xt-stat">
            <div className="xt-stat__num">{PROJECTS.length}</div>
            <div className="xt-stat__label">项目</div>
          </div>
          <div className="xt-stat">
            <div className="xt-stat__num">{featured.length}</div>
            <div className="xt-stat__label">首页精选</div>
          </div>
        </div>
      </div>

      {/* ---------------- 精选项目 ---------------- */}
      <section className="xt-section xt-section--bare">
        <div className="xt-section__head">
          <h3 className="xt-section__title">精选项目</h3>
          <span className="xt-section__sub">点卡片进详情</span>
          <Link to="/projects" className="xt-section__more">
            全部项目 →
          </Link>
        </div>
        <div className="xt-grid">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      {/* ---------------- 最近在做 ---------------- */}
      <section className="xt-section">
        <div className="xt-section__head">
          <h3 className="xt-section__title">最近在做</h3>
        </div>
        <Card>
          <div className="xt-timeline">
            {PROJECTS.filter((p) => p.status === 'active' || p.status === 'wip')
              .slice(0, 3)
              .map((p) => (
                <div className="xt-timeline__row" key={p.slug}>
                  <span className="xt-timeline__when">{p.year ?? '现在'}</span>
                  <span>
                    <Link to={`/projects/${p.slug}`} className="xt-inline-link">
                      {p.name}
                    </Link>{' '}
                    <span className="xt-muted">{p.tagline}</span>
                  </span>
                </div>
              ))}
          </div>
        </Card>
      </section>
    </>
  );
}
