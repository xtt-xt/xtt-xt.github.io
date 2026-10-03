import React from 'react';
import { useSlideIndicator } from './indicator';

/* ============ Button ============ */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ControlSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ControlSize;
  loading?: boolean;
  block?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  variant = 'primary', size = 'md', loading = false, block = false,
  icon, className = '', children, disabled, ...rest
}: ButtonProps) {
  const cls = [
    'fui-btn', `fui-btn--${variant}`,
    size !== 'md' && `fui-btn--${size}`,
    block && 'fui-btn--block',
    loading && 'is-loading', className,
  ].filter(Boolean).join(' ');
  return (
    <button className={cls} disabled={disabled || loading} {...rest}>
      {loading ? <span className="fui-btn__spinner" /> : icon}
      {children}
    </button>
  );
}

/* ============ IconButton ============ */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ControlSize;
  ghost?: boolean;
}

export function IconButton({ size = 'md', ghost = false, className = '', children, ...rest }: IconButtonProps) {
  const cls = ['fui-iconbtn', size !== 'md' && `fui-iconbtn--${size}`, ghost && 'fui-iconbtn--ghost', className]
    .filter(Boolean).join(' ');
  return <button className={cls} {...rest}>{children}</button>;
}

/* ============ Segmented ============ */
export interface SegmentedProps {
  options: { label: React.ReactNode; value: string }[];
  value: string;
  onChange: (value: string) => void;
}

export function Segmented({ options, value, onChange }: SegmentedProps) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const key = options.map((o) => o.value).join('|');
  const ind = useSlideIndicator(wrapRef, '.fui-segmented__item.is-active', `${value}|${key}`);

  return (
    <div className="fui-segmented" role="tablist" ref={wrapRef}>
      <span className="fui-segmented__thumb" aria-hidden="true"
        data-anim={ind.anim ? '1' : '0'}
        data-ready={ind.ready ? '1' : '0'}
        style={ind.ready ? { transform: `translateX(${ind.x}px)`, width: ind.w } : undefined} />
      {options.map((o) => (
        <button key={o.value} role="tab" aria-selected={value === o.value}
          className={`fui-segmented__item${value === o.value ? ' is-active' : ''}`}
          onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
