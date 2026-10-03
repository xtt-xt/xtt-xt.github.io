import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconX, IconInfo, IconCheckCircle, IconWarning, IconXCircle } from './icons';

/* ============ Alert ============ */
export type AlertTone = 'info' | 'success' | 'warning' | 'danger';
const ALERT_ICONS: Record<AlertTone, (p: { size?: number }) => React.ReactElement> = {
  info: IconInfo, success: IconCheckCircle, warning: IconWarning, danger: IconXCircle,
};

export function Alert({ tone = 'info', title, children, closable, onClose }: {
  tone?: AlertTone; title?: string; children?: React.ReactNode; closable?: boolean; onClose?: () => void;
}) {
  const [show, setShow] = useState(true);
  if (!show) return null;
  const Ico = ALERT_ICONS[tone];
  return (
    <div className={`fui-alert fui-alert--${tone}`} role="alert">
      <span className="fui-alert__icon"><Ico size={17} /></span>
      <div>
        {title && <p className="fui-alert__title">{title}</p>}
        {children && <p className="fui-alert__desc">{children}</p>}
      </div>
      {closable && (
        <button className="fui-alert__close" aria-label="关闭"
          onClick={() => { setShow(false); onClose?.(); }}>
          <IconX size={14} />
        </button>
      )}
    </div>
  );
}

/* ============ Toast ============ */
type ToastItem = { id: number; text: string; tone: AlertTone | 'default'; leaving?: boolean };
const ToastCtx = createContext<(text: string, tone?: ToastItem['tone']) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);
  const push = useCallback((text: string, tone: ToastItem['tone'] = 'default') => {
    const id = ++idRef.current;
    setItems((s) => [...s, { id, text, tone }]);
    setTimeout(() => setItems((s) => s.map((t) => (t.id === id ? { ...t, leaving: true } : t))), 2600);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 2900);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      {createPortal(
        <div className="fui-toast-wrap">
          {items.map((t) => (
            <div key={t.id} className={`fui-toast${t.tone !== 'default' ? ` fui-toast--${t.tone}` : ''}${t.leaving ? ' is-leaving' : ''}`}>
              {t.text}
            </div>
          ))}
        </div>, document.body)}
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);

/* ============ Dialog ============ */
export function Dialog({ open, title, onClose, children, footer }: {
  open: boolean; title?: React.ReactNode; onClose: () => void;
  children: React.ReactNode; footer?: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className="fui-overlay" onClick={onClose}>
      <div className="fui-dialog" role="dialog" aria-modal onClick={(e) => e.stopPropagation()}>
        <div className="fui-dialog__head">
          <h3 className="fui-dialog__title">{title}</h3>
          <button className="fui-alert__close" onClick={onClose} aria-label="关闭"><IconX size={16} /></button>
        </div>
        <div className="fui-dialog__body">{children}</div>
        {footer && <div className="fui-dialog__foot">{footer}</div>}
      </div>
    </div>, document.body);
}

/* ============ Drawer ============ */
export function Drawer({ open, side = 'right', title, head, foot, onClose, children }: {
  open: boolean;
  /** 从哪边滑出来 */
  side?: 'left' | 'right';
  /** 头部换成自己的内容（给了 head 就用它，title 那套默认头不渲染） */
  head?: React.ReactNode;
  /** 贴底的脚注 */
  foot?: React.ReactNode;
  title?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <>
      <div className="fui-drawer-overlay" onClick={onClose} />
      <div className={`fui-drawer fui-drawer--${side}`} role="dialog" aria-modal>
        {head ? (
          <div className="fui-drawer__head fui-drawer__head--bare">{head}</div>
        ) : (
          <div className="fui-drawer__head">
            <h3 className="fui-drawer__title">{title}</h3>
            <button className="fui-alert__close" onClick={onClose} aria-label="关闭"><IconX size={16} /></button>
          </div>
        )}
        <div className="fui-drawer__body">{children}</div>
        {foot ? <div className="fui-drawer__foot">{foot}</div> : null}
      </div>
    </>,
    document.body,
  );
}

/* ============ Tooltip ============ */
export function Tooltip({ tip, side = 'top', children }: {
  tip: string; side?: 'top' | 'bottom'; children: React.ReactNode;
}) {
  return (
    /* tabIndex 让非按钮子元素也能靠键盘 / 触屏聚焦唤出提示 */
    <span className={`fui-tip${side === 'bottom' ? ' fui-tip--bottom' : ''}`} tabIndex={0}>
      {children}
      <span className="fui-tip__bubble" role="tooltip">{tip}</span>
    </span>
  );
}

/* ============ Progress ============ */
export function Progress({ value, tone, striped }: { value: number; tone?: 'success' | 'danger'; striped?: boolean }) {
  return (
    <div className={`fui-progress${tone ? ` fui-progress--${tone}` : ''}`}>
      <div className="fui-progress__track">
        <div className={`fui-progress__bar${striped ? ' fui-progress__bar--striped' : ''}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
      <span className="fui-progress__val">{value}%</span>
    </div>
  );
}

/* ============ Spinner ============ */
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return <span className={`fui-spinner${size !== 'md' ? ` fui-spinner--${size}` : ''}`} role="status" aria-label="加载中" />;
}

/* ============ Skeleton ============ */
export function Skeleton({ variant = 'text', width, height, style }: {
  variant?: 'text' | 'title' | 'circle'; width?: number | string; height?: number | string;
  style?: React.CSSProperties;
}) {
  return <span className={`fui-skeleton fui-skeleton--${variant}`}
    style={{ display: 'block', width, height, ...style }} />;
}
