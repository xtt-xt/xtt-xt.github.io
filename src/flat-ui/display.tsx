import React from 'react';
import { IconX, IconInbox } from './icons';

/* ============ Badge ============ */
export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
export interface BadgeProps {
  tone?: BadgeTone;
  variant?: 'solid' | 'soft' | 'outline';
  dot?: boolean;
  children: React.ReactNode;
}

export function Badge({ tone = 'neutral', variant = 'soft', dot = false, children }: BadgeProps) {
  const cls = ['fui-badge', `fui-badge--${variant}`, tone !== 'neutral' && `fui-badge--${tone}`].filter(Boolean).join(' ');
  return <span className={cls}>{dot && <span className="fui-badge__dot" />}{children}</span>;
}

/* ============ Tag ============ */
export interface TagProps {
  variant?: 'default' | 'accent' | 'filled';
  closable?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

export function Tag({ variant = 'default', closable, onClose, children }: TagProps) {
  return (
    <span className={`fui-tag${variant !== 'default' ? ` fui-tag--${variant}` : ''}`}>
      {children}
      {closable && (
        <button className="fui-tag__close" onClick={onClose} aria-label="移除">
          <IconX size={12} />
        </button>
      )}
    </span>
  );
}

/* ============ Avatar ============ */
export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  square?: boolean;
  style?: React.CSSProperties;
}

const AVATAR_COLORS = ['#5340ff', '#1c9a6c', '#d97b06', '#e5484d', '#3e7bfa', '#8b5cf6', '#0e9aa7'];

export function Avatar({ src, name = '', size = 'md', square, style }: AvatarProps) {
  const initial = name.trim().slice(0, 1).toUpperCase();
  const colorIdx = [...name].reduce((s, c) => s + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  const cls = ['fui-avatar', size !== 'md' && `fui-avatar--${size}`, square && 'fui-avatar--square'].filter(Boolean).join(' ');
  return (
    <span className={cls} style={{ ...(src ? {} : { background: AVATAR_COLORS[colorIdx] + '1f', color: AVATAR_COLORS[colorIdx] }), ...style }}>
      {src ? <img src={src} alt={name} /> : initial || '?'}
    </span>
  );
}

export function AvatarGroup({ children }: { children: React.ReactNode }) {
  return <span className="fui-avatar-group">{children}</span>;
}

/* ============ Card ============ */
export function Card({ hover, children, style }: { hover?: boolean; children: React.ReactNode; style?: React.CSSProperties }) {
  return <div className={`fui-card${hover ? ' fui-card--hover' : ''}`} style={style}>{children}</div>;
}
Card.Head = ({ children, extra }: { children: React.ReactNode; extra?: React.ReactNode }) => (
  <div className="fui-card__head">
    <h4 className="fui-card__title">{children}</h4>
    {extra}
  </div>
);
Card.Body = ({ children }: { children: React.ReactNode }) => <div className="fui-card__body">{children}</div>;
Card.Foot = ({ children }: { children: React.ReactNode }) => <div className="fui-card__foot">{children}</div>;

/* ============ Table ============ */
export interface Column<T> {
  key: string;
  title: React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  zebra?: boolean;
  rowKey: (row: T) => string | number;
}

export function Table<T>({ columns, data, zebra, rowKey }: TableProps<T>) {
  return (
    <div className="fui-table-wrap">
      <table className={`fui-table${zebra ? ' fui-table--zebra' : ''}`}>
        <thead>
          <tr>{columns.map((c) => <th key={c.key} style={{ textAlign: c.align }}>{c.title}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={rowKey(row)}>
              {columns.map((c) => (
                <td key={c.key} style={{ textAlign: c.align }}>
                  {c.render ? c.render(row, i) : String((row as Record<string, unknown>)[c.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ============ Kbd / Divider ============ */
export function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="fui-kbd">{children}</kbd>;
}

export function Divider({ text }: { text?: string }) {
  if (text) return <div className="fui-divider--text" role="separator">{text}</div>;
  return <hr className="fui-divider" />;
}

/* ============ EmptyState ============ */
export function EmptyState({ text = '暂无数据', action }: { text?: string; action?: React.ReactNode }) {
  return (
    <div className="fui-empty">
      <span className="fui-empty__icon"><IconInbox size={44} /></span>
      <p className="fui-empty__text">{text}</p>
      {action}
    </div>
  );
}
