import React, { useEffect, useRef, useState } from 'react';
import { IconChevronDown, IconCheck, IconSearch, IconMinus, IconPlus } from './icons';
import type { ControlSize } from './buttons';

/* ============ Field 表单字段包装 ============ */
export interface FieldProps {
  label?: React.ReactNode;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export function Field({ label, required, hint, error, children }: FieldProps) {
  return (
    <div className="fui-field">
      {label && <label className="fui-field__label">{label}{required && <span className="req">*</span>}</label>}
      {children}
      {error ? <span className="fui-field__error">{error}</span>
        : hint ? <span className="fui-field__hint">{hint}</span> : null}
    </div>
  );
}

/* ============ Input ============ */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  size?: ControlSize;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  error?: boolean;
}

export function Input({ size = 'md', prefix, suffix, error, disabled, className = '', ...rest }: InputProps) {
  const cls = ['fui-input', size !== 'md' && `fui-input--${size}`,
    error && 'is-error', disabled && 'is-disabled', className].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      {prefix && <span className="fui-input__affix">{prefix}</span>}
      <input disabled={disabled} {...rest} />
      {suffix && <span className="fui-input__affix">{suffix}</span>}
    </div>
  );
}

/* ============ SearchInput ============ */
export function SearchInput(props: InputProps) {
  return <Input prefix={<IconSearch size={15} />} {...props} />;
}

/* ============ Textarea ============ */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  maxLength?: number;
  showCount?: boolean;
}

export function Textarea({ error, disabled, maxLength, showCount, value, defaultValue, onChange, ...rest }: TextareaProps) {
  const [len, setLen] = useState(String(defaultValue ?? value ?? '').length);
  const cls = ['fui-input', 'fui-input--area', error && 'is-error', disabled && 'is-disabled'].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <textarea disabled={disabled} maxLength={maxLength} value={value} defaultValue={defaultValue}
        onChange={(e) => { setLen(e.target.value.length); onChange?.(e); }} {...rest} />
      {showCount && maxLength && <span className="fui-input__count">{len}/{maxLength}</span>}
    </div>
  );
}

/* ============ NumberInput ============ */
export interface NumberInputProps {
  value: number;
  onChange: (v: number) => void;
  min?: number; max?: number; step?: number;
}

export function NumberInput({ value, onChange, min = -Infinity, max = Infinity, step = 1 }: NumberInputProps) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <div className="fui-numinput">
      <button type="button" className="fui-numinput__step" onClick={() => onChange(clamp(value - step))} aria-label="减少">
        <IconMinus size={14} />
      </button>
      <div className="fui-input">
        <input value={value} onChange={(e) => {
          const n = Number(e.target.value);
          if (!Number.isNaN(n)) onChange(clamp(n));
        }} />
      </div>
      <button type="button" className="fui-numinput__step" onClick={() => onChange(clamp(value + step))} aria-label="增加">
        <IconPlus size={14} />
      </button>
    </div>
  );
}

/* ============ Select ============ */
export interface SelectOption { label: string; value: string; disabled?: boolean }
export interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function Select({ options, value, placeholder = '请选择', onChange }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  const selected = options.find((o) => o.value === value);
  return (
    <div ref={ref} className={`fui-select${open ? ' is-open' : ''}`}>
      <button type="button" className="fui-select__trigger" onClick={() => setOpen((v) => !v)}>
        <span className={selected ? '' : 'ph'}>{selected ? selected.label : placeholder}</span>
        <IconChevronDown size={15} style={{}} />
      </button>
      {open && (
        <div className="fui-select__menu" role="listbox">
          {options.map((o) => (
            <div key={o.value} role="option" aria-selected={o.value === value}
              className={['fui-select__option', o.value === value && 'is-selected', o.disabled && 'is-disabled'].filter(Boolean).join(' ')}
              onClick={() => { if (o.disabled) return; onChange(o.value); setOpen(false); }}>
              {o.label}
              {o.value === value && <IconCheck size={14} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============ Checkbox ============ */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
}

export function Checkbox({ label, description, disabled, className = '', ...rest }: CheckboxProps) {
  return (
    <label className={`fui-check${disabled ? ' is-disabled' : ''} ${className}`}>
      <input type="checkbox" disabled={disabled} {...rest} />
      <span className="fui-check__box">
        <IconCheck size={12} style={{ color: '#fff', strokeWidth: 3 }} />
      </span>
      {(label || description) && (
        <span className="fui-check__text">
          {label}
          {description && <span className="fui-check__desc">{description}</span>}
        </span>
      )}
    </label>
  );
}

/* ============ Radio ============ */
export function Radio({ label, description, disabled, className = '', ...rest }: CheckboxProps) {
  return (
    <label className={`fui-check fui-radio${disabled ? ' is-disabled' : ''} ${className}`}>
      <input type="radio" disabled={disabled} {...rest} />
      <span className="fui-check__box fui-radio__box" />
      {(label || description) && (
        <span className="fui-check__text">
          {label}
          {description && <span className="fui-check__desc">{description}</span>}
        </span>
      )}
    </label>
  );
}

/* ============ Switch ============ */
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode;
  size?: 'sm' | 'md';
}

export function Switch({ label, size = 'md', disabled, ...rest }: SwitchProps) {
  return (
    <label className={`fui-switch${size === 'sm' ? ' fui-switch--sm' : ''}${disabled ? ' is-disabled' : ''}`}>
      <input type="checkbox" disabled={disabled} {...rest} />
      <span className="fui-switch__track"><span className="fui-switch__thumb" /></span>
      {label && <span className="fui-switch__label">{label}</span>}
    </label>
  );
}

/* ============ Slider ============ */
export interface SliderProps {
  value: number;
  onChange: (v: number) => void;
  min?: number; max?: number; step?: number;
  showValue?: boolean;
}

export function Slider({ value, onChange, min = 0, max = 100, step = 1, showValue = true }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="fui-slider">
      <input type="range" min={min} max={max} step={step} value={value}
        style={{ ['--_val' as string]: `${pct}%` }}
        onChange={(e) => onChange(Number(e.target.value))} />
      {showValue && <span className="fui-slider__val">{value}</span>}
    </div>
  );
}
