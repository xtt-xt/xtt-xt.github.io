import { Card } from '../flat-ui';
import { ANNOUNCEMENTS } from '../data/announcements';
import { PageHeader } from '../components/PageHeader';

/* 往期公告：ANNOUNCEMENTS 里的全部，最新的在最上面 */
export default function Announcements() {
  return (
    <>
      <PageHeader title="公告" sub="最新的在最上面" />

      {ANNOUNCEMENTS.length === 0 ? (
        <p className="xt-muted">还没有公告。</p>
      ) : (
        <div className="xt-anno-list">
          {ANNOUNCEMENTS.map((a) => (
            <Card key={a.id}>
              <div className="xt-anno-item">
                <div className="xt-anno-item__head">
                  <span className="xt-anno-item__date">{a.date}</span>
                  <h3 className="xt-anno-item__title">{a.title}</h3>
                </div>
                <div className="xt-prose">
                  <p>{a.body}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
