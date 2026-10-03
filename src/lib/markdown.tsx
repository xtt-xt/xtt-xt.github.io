import type { ReactNode } from 'react';

/* ============================================================
   迷你 Markdown 渲染器 —— 只服务一个场景：把 GitHub Release 的
   更新说明（Markdown）渲染出来。

   支持：# 标题、**粗**、*斜* / _斜_、~~删除~~、`行内代码`、
        ``` 代码块 ```、- / 1. 列表（含 [ ] 勾选框）、> 引用、
        --- 分割线、[文字](链接)、![图](链接)、裸链接、段内换行。

   输出的是 React 元素（不走 dangerouslySetInnerHTML），
   Release 里写什么 HTML 进来都只是纯文本，没有 XSS 风险。
   ============================================================ */

type Block =
  | { t: 'h'; level: number; text: string }
  | { t: 'p'; text: string }
  | { t: 'list'; ordered: boolean; items: { text: string; checked?: boolean }[] }
  | { t: 'quote'; text: string }
  | { t: 'code'; code: string }
  | { t: 'hr' };

/* 每次解析都新建一个正则实例。
   踩过的坑：以前共用一个带 g 的正则，inline() 递归解析粗体里的内容时
   会把 lastIndex 重置，外层 while 于是反复从头匹配 —— 直接死循环 + OOM。 */
const inlineRe = () =>
  /`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|!\[[^\]\n]*\]\([^)\s]+\)|\[[^\]\n]*\]\([^)\s]+\)|\*[^*\n]+\*|(?<![A-Za-z0-9])_[^_\n]+_(?![A-Za-z0-9])|https?:\/\/[^\s<>()]+/g;

function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n?/g, '\n').split('\n');
  const blocks: Block[] = [];
  const para: string[] = [];
  const flush = () => {
    if (para.length) {
      blocks.push({ t: 'p', text: para.join('\n') });
      para.length = 0;
    }
  };

  for (let i = 0; i < lines.length; ) {
    const line = lines[i];

    /* ``` 代码块 */
    const fence = line.match(/^\s*```/);
    if (fence) {
      flush();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) buf.push(lines[i++]);
      i++; // 跳过后面的 ```
      blocks.push({ t: 'code', code: buf.join('\n') });
      continue;
    }

    /* # 标题 */
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      flush();
      blocks.push({ t: 'h', level: h[1].length, text: h[2].trim() });
      i++;
      continue;
    }

    /* --- 分割线 */
    if (/^\s*([-*_])\s*(\1\s*){2,}$/.test(line)) {
      flush();
      blocks.push({ t: 'hr' });
      i++;
      continue;
    }

    /* > 引用 */
    if (/^\s*>\s?/.test(line)) {
      flush();
      const buf: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^\s*>\s?/, ''));
      blocks.push({ t: 'quote', text: buf.join('\n') });
      continue;
    }

    /* 列表 */
    const first = line.match(/^\s*([-*+]|\d+[.)])\s+(.*)$/);
    if (first) {
      flush();
      const ordered = /\d/.test(first[1]);
      const items: { text: string; checked?: boolean }[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^\s*([-*+]|\d+[.)])\s+(.*)$/);
        if (m) {
          let text = m[2];
          let checked: boolean | undefined;
          const task = text.match(/^\[([ xX])\]\s*(.*)$/);
          if (task) {
            checked = task[1].toLowerCase() === 'x';
            text = task[2];
          }
          items.push({ text, checked });
          i++;
        } else if (/^\s+\S/.test(lines[i]) && items.length) {
          // 缩进的续行，并到上一条里
          items[items.length - 1].text += ` ${lines[i].trim()}`;
          i++;
        } else {
          break;
        }
      }
      blocks.push({ t: 'list', ordered, items });
      continue;
    }

    /* 空行 → 段落断开 */
    if (/^\s*$/.test(line)) {
      flush();
      i++;
      continue;
    }

    para.push(line);
    i++;
  }

  flush();
  return blocks;
}

function token(tok: string, k: string): ReactNode {
  if (tok.startsWith('`')) return <code key={k} className="xt-md__code">{tok.slice(1, -1)}</code>;
  if (tok.startsWith('**') || tok.startsWith('__')) return <strong key={k}>{inline(tok.slice(2, -2), k)}</strong>;
  if (tok.startsWith('~~')) return <del key={k}>{inline(tok.slice(2, -2), k)}</del>;
  if (tok.startsWith('![')) {
    const m = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(tok);
    if (m) return <img key={k} className="xt-md__img" src={m[2]} alt={m[1]} loading="lazy" />;
  }
  if (tok.startsWith('[')) {
    const m = /^\[([^\]]*)\]\(([^)]+)\)$/.exec(tok);
    if (m) return <a key={k} href={m[2]} target="_blank" rel="noreferrer">{inline(m[1], k)}</a>;
  }
  if (/^https?:\/\//.test(tok)) return <a key={k} href={tok} target="_blank" rel="noreferrer">{tok}</a>;
  if (tok.startsWith('*') || tok.startsWith('_')) return <em key={k}>{inline(tok.slice(1, -1), k)}</em>;
  return tok;
}

/** 行内语法 → React 节点 */
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = inlineRe();
  let last = 0;
  let n = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m[0].length === 0) {
      re.lastIndex++; // 保险：真出现零宽匹配也不能卡住
      continue;
    }
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(token(m[0], `${keyBase}-i${n++}`));
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** 段落内的单个换行 → <br>（GitHub 上就是这个效果） */
function lines(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  text.split('\n').forEach((l, i) => {
    if (i) out.push(<br key={`${keyBase}-br${i}`} />);
    out.push(...inline(l, `${keyBase}-l${i}`));
  });
  return out;
}

function renderBlock(b: Block, i: number): ReactNode {
  const k = `md${i}`;
  switch (b.t) {
    case 'h': {
      const content = inline(b.text, k);
      const cls = `xt-md__h xt-md__h--${Math.min(6, b.level)}`;
      if (b.level <= 1) return <h2 key={k} className={cls}>{content}</h2>;
      if (b.level === 2) return <h3 key={k} className={cls}>{content}</h3>;
      return <h4 key={k} className={cls}>{content}</h4>;
    }
    case 'hr':
      return <hr key={k} className="xt-md__hr" />;
    case 'code':
      return (
        <pre key={k} className="xt-md__pre">
          <code>{b.code}</code>
        </pre>
      );
    case 'quote':
      return (
        <blockquote key={k} className="xt-md__quote">
          {lines(b.text, k)}
        </blockquote>
      );
    case 'list': {
      const items = b.items.map((it, j) => (
        <li key={`${k}-${j}`} className={`xt-md__li${it.checked !== undefined ? ' is-task' : ''}`}>
          {it.checked !== undefined && (
            <span className={`xt-md__check${it.checked ? ' is-on' : ''}`} aria-hidden="true">
              {it.checked ? '✓' : ''}
            </span>
          )}
          {inline(it.text, `${k}-${j}`)}
        </li>
      ));
      return b.ordered ? (
        <ol key={k} className="xt-md__list">
          {items}
        </ol>
      ) : (
        <ul key={k} className="xt-md__list">
          {items}
        </ul>
      );
    }
    default:
      return (
        <p key={k} className="xt-md__p">
          {lines(b.text, k)}
        </p>
      );
  }
}

/** 渲染一段 Markdown */
export function Markdown({ text }: { text: string }) {
  const blocks = parseBlocks(text);
  if (!blocks.length) return null;
  return <div className="xt-md">{blocks.map(renderBlock)}</div>;
}
