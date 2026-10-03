import type { ReactNode } from 'react';

/** 普通页面的标题区：标题 + 说明 + 右侧操作 */
export function PageHeader({ title, sub, extra }: { title: string; sub?: ReactNode; extra?: ReactNode }) {
  return (
    <div className="xt-page-head">
      <div className="xt-page-head__row">
        <div>
          <h1>{title}</h1>
          {sub && <p>{sub}</p>}
        </div>
        {extra && <div className="xt-page-head__extra">{extra}</div>}
      </div>
    </div>
  );
}
