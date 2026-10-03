import { Badge, Card, Tag } from '../flat-ui';
// import { Accordion } from '../flat-ui'; // 「常见问题」先注释掉了，要用就把这行和下面那段一起放开
import { Link } from '../router';
import { SITE } from '../site';
import { PROJECTS } from '../data/projects';
import { AVATAR_DARK, AVATAR_LIGHT } from '../data/avatar';
import { PageHeader } from '../components/PageHeader';
import { IconBilibili, IconCode, IconMail, IconSpark } from '../appIcons';

export default function About() {
  return (
    <>
      <PageHeader title="关于" />

      <div className="xt-about__head">
        <div className="xt-avatar-pair">
          <img
            className="xt-avatar xt-avatar--light"
            src={AVATAR_LIGHT}
            alt={SITE.name}
            width={72}
            height={72}
          />
          <img
            className="xt-avatar xt-avatar--dark"
            src={AVATAR_DARK}
            alt=""
            aria-hidden="true"
            width={72}
            height={72}
          />
        </div>
        <div className="xt-about__info">
          <div className="xt-about__name">{SITE.name}</div>
          <div className="xt-about__en">{SITE.en}</div>
          <div className="xt-tagrow">
            <Tag variant="accent">Android</Tag>
            <Tag variant="accent">Kotlin</Tag>
            <Tag variant="accent">前端</Tag>
            <Tag variant="accent">AI</Tag>
            <Tag variant="accent">Minecraft</Tag>
          </div>
        </div>
        <div className="xt-about__social">
          <a className="fui-btn fui-btn--outline" href={SITE.github} target="_blank" rel="noreferrer">
            <IconCode size={15} />
            GitHub
          </a>
          {SITE.email ? (
            <a className="fui-btn fui-btn--outline" href={`mailto:${SITE.email}`} title={SITE.email}>
              <IconMail size={15} />
              邮箱
            </a>
          ) : (
            <span className="fui-btn fui-btn--outline" aria-disabled="true" title="邮箱待填">
              <IconMail size={15} />
              邮箱（待填）
            </span>
          )}
          {SITE.bilibili && (
            <a
              className="fui-btn fui-btn--outline"
              href={SITE.bilibili}
              target="_blank"
              rel="noreferrer"
            >
              <IconBilibili size={15} />
              B 站
            </a>
          )}
        </div>
      </div>

      <section className="xt-section">
        <div className="xt-section__head">
          <h3 className="xt-section__title">关于我</h3>
        </div>
        <Card>
          <div className="xt-prose">
            <p>不知道写什么了，就空着吧…</p>
          </div>
        </Card>
      </section>

      <section className="xt-section">
        <div className="xt-section__head">
          <h3 className="xt-section__title">联系方式</h3>
        </div>
        <div className="xt-kv">
          <div className="xt-kv__row">
            <span className="xt-kv__k">GitHub</span>
            <span className="xt-kv__v">
              <a href={SITE.github} target="_blank" rel="noreferrer" className="xt-inline-link">
                {SITE.github.replace('https://', '')}
              </a>
            </span>
          </div>
          <div className="xt-kv__row">
            <span className="xt-kv__k">邮箱</span>
            <span className="xt-kv__v">
              {SITE.email ? (
                <a href={`mailto:${SITE.email}`} className="xt-inline-link">
                  {SITE.email}
                </a>
              ) : (
                '（待填）'
              )}
            </span>
          </div>
          <div className="xt-kv__row">
            <span className="xt-kv__k">别的地方</span>
            <span className="xt-kv__v">
              {SITE.bilibili ? (
                <a
                  href={SITE.bilibili}
                  target="_blank"
                  rel="noreferrer"
                  className="xt-inline-link"
                >
                  {SITE.bilibili.replace('https://', '')}
                </a>
              ) : (
                '（待填：博客 / B站 / X …）'
              )}
            </span>
          </div>
        </div>
      </section>

      <section className="xt-section">
        <div className="xt-section__head">
          <h3 className="xt-section__title">这个站怎么搭的</h3>
        </div>
        <div className="xt-kv">
          <div className="xt-kv__row">
            <span className="xt-kv__k">框架</span>
            <span className="xt-kv__v">Vite + React 19 + TypeScript</span>
          </div>
          <div className="xt-kv__row">
            <span className="xt-kv__k">控件库</span>
            <span className="xt-kv__v">自己的 FlatUI（扁平化、单一主色、1px 描边）</span>
          </div>
          <div className="xt-kv__row">
            <span className="xt-kv__k">路由</span>
            <span className="xt-kv__v">自己写的 hash 路由（静态托管刷新不 404）</span>
          </div>
          <div className="xt-kv__row">
            <span className="xt-kv__k">数据</span>
            <span className="xt-kv__v">项目全在 src/data/projects.ts，加一条就多一个详情页</span>
          </div>
          <div className="xt-kv__row">
            <span className="xt-kv__k">部署</span>
            <span className="xt-kv__v">GitHub Pages（推 main 自动构建，配置见仓库里的 workflow）</span>
          </div>
          <div className="xt-kv__row">
            <span className="xt-kv__k">现在有</span>
            <span className="xt-kv__v">{PROJECTS.length} 个项目卡片</span>
          </div>
        </div>
        <div className="xt-tagrow">
          <Badge tone="accent">
            <IconSpark size={13} />
            FlatUI
          </Badge>
          <Link to="/projects/flat-ui" className="xt-inline-link">
            看详情 →
          </Link>
        </div>
      </section>

      {/* ================= 「常见问题」先注释掉（2026-10-03 用户要求） =================
          要恢复：把这一整段外面的注释去掉，并恢复顶部的 Accordion import。
      =================
      <section className="xt-section">
        <div className="xt-section__head">
          <h3 className="xt-section__title">常见问题</h3>
          <span className="xt-section__sub">占位问答，想到再加</span>
        </div>
        <Accordion
          defaultOpen={['add']}
          items={[
            {
              key: 'add',
              title: '怎么加一个新项目？',
              content: (
                <>
                  打开 <code>src/data/projects.ts</code>，往 PROJECTS 里加一条：slug 是地址（
                  <code>/projects/你的slug</code>），填上 name、tagline、tags、status 就行，首页「精选」由 featured
                  决定。
                </>
              ),
            },
            {
              key: 'theme',
              title: '配色能改吗？',
              content: (
                <>
                  能。全站颜色都走 <code>src/flat-ui/tokens.css</code> 里的设计令牌，改{' '}
                  <code>--fui-accent</code> 一处，按钮、标签、链接跟着全变。
                </>
              ),
            },
            {
              key: 'page',
              title: '以后想加博客 / 相册？',
              content: (
                <>
                  在 <code>src/App.tsx</code> 的 ROUTES 表里加一行，再在 <code>src/pages/</code> 下写个组件就行，
                  路由表支持 <code>/blog/:id</code> 这种参数写法。
                </>
              ),
            },
          ]}
        />
      </section>
      ================= 「常见问题」注释到此为止 ================= */}

      {/* 「接下来想做」整块已删（2026-10-03 用户要求） */}
    </>
  );
}
