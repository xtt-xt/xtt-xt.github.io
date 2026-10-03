import { useState } from 'react';
import { Alert } from '../flat-ui';
import { ANNOUNCEMENTS, ANNOUNCEMENT_KEY } from '../data/announcements';

/* 站顶公告条：
   · 只显示 ANNOUNCEMENTS 里最新的一条（数组第一项）
   · 关闭状态存 localStorage（key 里记的是公告 id），所以
     - 关过旧公告 → 不再出现
     - 换了新公告（id 变了）→ 会重新出现 */

function readDismissed(): string {
  try {
    return localStorage.getItem(ANNOUNCEMENT_KEY) ?? '';
  } catch {
    return ''; // file:// 下 localStorage 可能不可用，那就每次都显示
  }
}

export function Announcement() {
  const latest = ANNOUNCEMENTS[0];
  const [closed, setClosed] = useState(readDismissed);

  if (!latest || closed === latest.id) return null;

  const close = () => {
    try {
      localStorage.setItem(ANNOUNCEMENT_KEY, latest.id);
    } catch {
      /* 忽略 */
    }
    setClosed(latest.id);
  };

  return (
    <div className="xt-anno" data-anno-id={latest.id}>
      <Alert tone={latest.tone ?? 'info'} title={`${latest.date} · ${latest.title}`} closable onClose={close}>
        {latest.body}
      </Alert>
    </div>
  );
}
