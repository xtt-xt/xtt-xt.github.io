import React, { useEffect, useRef, useState } from 'react';
import { useSlideIndicator } from './indicator';
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconCheck } from './icons';

/* ============ Tabs ============ */
export interface TabsProps {
  items: { key: string; label: React.ReactNode; children: React.ReactNode }[];
  activeKey: string;
  onChange: (key: string) => void;
  variant?: 'line' | 'card';
}

export function Tabs({ items, activeKey, onChange, variant = 'line' }: TabsProps) {
  const active = items.find((i) => i.key === activeKey);
  const listRef = useRef<HTMLDivElement>(null);
  const key = items.map((i) => i.key).join('|');
  // line 变体滑的是下划线，card 变体滑的是一张卡片，几何不同、测量一样
  const ind = useSlideIndicator(listRef, '.fui-tabs__tab.is-active', `${activeKey}|${key}`);
  return (
    <div className={`fui-tabs${variant === 'card' ? ' fui-tabs--card' : ''}`}>
      <div className="fui-tabs__list" role="tablist" ref={listRef}>
        <span className="fui-tabs__indicator" aria-hidden="true"
          data-anim={ind.anim ? '1' : '0'}
          data-ready={ind.ready ? '1' : '0'}
          style={ind.ready ? { transform: `translateX(${ind.x}px)`, width: ind.w } : undefined} />
        {items.map((i) => (
          <button key={i.key} role="tab" aria-selected={i.key === activeKey}
            className={`fui-tabs__tab${i.key === activeKey ? ' is-active' : ''}`}
            onClick={() => onChange(i.key)}>
            {i.label}
          </button>
        ))}
      </div>
      <div className="fui-tabs__panel" role="tabpanel">{active?.children}</div>
    </div>
  );
}

/* ============ Accordion ============ */
export interface AccordionProps {
  items: { key: string; title: React.ReactNode; content: React.ReactNode }[];
  defaultOpen?: string[];
}

export function Accordion({ items, defaultOpen = [] }: AccordionProps) {
  const [open, setOpen] = useState<Set<string>>(new Set(defaultOpen));
  const toggle = (key: string) =>
    setOpen((s) => { const n = new Set(s); n.has(key) ? n.delete(key) : n.add(key); return n; });
  return (
    <div className="fui-accordion">
      {items.map((i) => (
        <div key={i.key} className={`fui-accordion__item${open.has(i.key) ? ' is-open' : ''}`}>
          <button className="fui-accordion__head" onClick={() => toggle(i.key)} aria-expanded={open.has(i.key)}>
            {i.title}
            <span className="fui-accordion__icon"><IconChevronDown size={15} /></span>
          </button>
          <div className="fui-accordion__body">
            <div className="fui-accordion__inner">
              <div className="fui-accordion__content">{i.content}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============ Breadcrumb ============ */
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="fui-crumb" aria-label="面包屑">
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="fui-crumb__sep">/</span>}
          {it.href && i < items.length - 1 ? <a href={it.href}>{it.label}</a>
            : <span className="fui-crumb__cur">{it.label}</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}

/* ============ Pagination ============ */
export function Pagination({ page, total, pageSize = 10, onChange }: {
  page: number; total: number; pageSize?: number; onChange: (p: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const list: (number | '…')[] = [];
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - page) <= 1) list.push(p);
    else if (list[list.length - 1] !== '…') list.push('…');
  }
  return (
    <div className="fui-pagination">
      <button className="fui-pagination__btn" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="上一页">
        <IconChevronLeft size={14} />
      </button>
      {list.map((p, i) => p === '…'
        ? <span key={`e${i}`} className="fui-pagination__ellipsis">…</span>
        : <button key={p} className={`fui-pagination__btn${p === page ? ' is-active' : ''}`} onClick={() => onChange(p)}>{p}</button>)}
      <button className="fui-pagination__btn" disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="下一页">
        <IconChevronRight size={14} />
      </button>
    </div>
  );
}

/* ============ Steps ============ */
export function Steps({ current, items }: {
  current: number;
  items: { title: string; description?: string }[];
}) {
  return (
    <div className="fui-steps">
      {items.map((it, i) => (
        <div key={i} className={`fui-step${i < current ? ' is-done' : ''}${i === current ? ' is-active' : ''}`}>
          <div className="fui-step__head">
            <span className="fui-step__dot">{i < current ? <IconCheck size={13} /> : i + 1}</span>
            {i < items.length - 1 && <span className="fui-step__line" />}
          </div>
          <div>
            <div className="fui-step__title">{it.title}</div>
            {it.description && <div className="fui-step__desc">{it.description}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============ Dropdown ============ */
export interface DropdownItem {
  key: string; label: React.ReactNode; icon?: React.ReactNode;
  danger?: boolean; disabled?: boolean; divider?: boolean; kbd?: string;
}

export function Dropdown({ items, onSelect, children }: {
  items: DropdownItem[];
  onSelect?: (key: string) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  return (
    <div className="fui-dropdown" ref={ref}>
      <span onClick={() => setOpen((v) => !v)} style={{ display: 'inline-flex' }}>{children}</span>
      {open && (
        <div className="fui-dropdown__menu" role="menu">
          {items.map((it) => it.divider
            ? <div key={it.key} className="fui-dropdown__divider" />
            : (
              <button key={it.key} role="menuitem" disabled={it.disabled}
                className={`fui-dropdown__item${it.danger ? ' fui-dropdown__item--danger' : ''}`}
                onClick={() => { onSelect?.(it.key); setOpen(false); }}>
                {it.icon}{it.label}
                {it.kbd && <span className="fui-dropdown__kbd">{it.kbd}</span>}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
