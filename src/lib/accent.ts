/* ============================================================
   自定义主色（Accent）
   ------------------------------------------------------------
   站点只让访客改「一个颜色」，其余四个（hover / active / soft / ink）
   按亮色 / 暗色主题各自自动派生，保持 FlatUI「单一主色」的调性。

   ⚠ index.html 里首屏脚本内联了同一套算法（避免刷新时先闪一下默认紫），
     改这里的公式记得同步过去。
   ============================================================ */

export type ThemeMode = 'light' | 'dark';

/** localStorage 键 */
export const ACCENT_KEY = 'xt-accent';
/** 没自定义时的默认主色（跟 tokens.css 的 --fui-accent 一致） */
export const DEFAULT_ACCENT = '#5340ff';

/** 预设色板 */
export const ACCENT_PRESETS: { name: string; hex: string }[] = [
  { name: '星紫', hex: '#5340ff' },
  { name: '靛蓝', hex: '#3e7bfa' },
  { name: '青', hex: '#0ea5a5' },
  { name: '绿', hex: '#1c9a6c' },
  { name: '黄', hex: '#eab308' },
  { name: '橙', hex: '#ea580c' },
  { name: '红', hex: '#e5484d' },
  { name: '粉', hex: '#ec4899' },
];

const INK_DARK = '#141416';
const INK_LIGHT = '#ffffff';

/** 写入 <html> 的 5 个变量（顺序固定，方便两侧同步） */
export const ACCENT_VARS = [
  '--fui-accent',
  '--fui-accent-hover',
  '--fui-accent-active',
  '--fui-accent-soft',
  '--fui-accent-ink',
] as const;

export interface AccentSet {
  accent: string;
  hover: string;
  active: string;
  soft: string;
  ink: string;
}

/* ---------- 颜色小工具（零依赖） ---------- */

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

/** '#rgb' / '#rrggbb' → '#rrggbb'（小写）；不合法返回 null */
export function normalizeHex(input: string): string | null {
  const v = (input || '').trim();
  const m = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(v);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  return `#${h.toLowerCase()}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = normalizeHex(hex) || DEFAULT_ACCENT;
  return [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
}

function toHex(n: number): string {
  const v = Math.round(Math.min(255, Math.max(0, n)));
  return v.toString(16).padStart(2, '0');
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** RGB → HSL，h 0~360，s/l 0~1 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) * 60;
  else if (max === gg) h = ((bb - rr) / d + 2) * 60;
  else h = ((rr - gg) / d + 4) * 60;
  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = l - c / 2;
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

/** a 与 b 混合（a 占 weight） */
function mix(a: string, b: string, weight: number): string {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  const w = clamp01(weight);
  return rgbToHex(r1 * w + r2 * (1 - w), g1 * w + g2 * (1 - w), b1 * w + b2 * (1 - w));
}

/** WCAG 相对亮度 */
function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** 对比度 */
function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/* ---------- 派生 ---------- */

/**
 * 从一个主色派生出整套 accent 变量。
 * 亮色：hover/active 压暗，soft 往白色混，ink 取对比度更高的那个。
 * 暗色：主色先提亮到能看清，hover/active 再往亮走，soft 往深底混。
 */
export function deriveAccent(hex: string, mode: ThemeMode): AccentSet {
  const base = normalizeHex(hex) || DEFAULT_ACCENT;
  const [h, s, l] = rgbToHsl(...hexToRgb(base));

  if (mode === 'dark') {
    // 太暗的色在深色底上看不清，抬到 0.68 左右
    const l2 = l < 0.68 ? l + (0.68 - l) * 0.85 : l;
    const s2 = Math.min(1, s * 0.95);
    const accent = rgbToHex(...hslToRgb(h, s2, l2));
    return {
      accent,
      hover: rgbToHex(...hslToRgb(h, s2, clamp01(l2 + 0.07))),
      active: rgbToHex(...hslToRgb(h, s2, clamp01(l2 + 0.14))),
      soft: mix(accent, INK_DARK, 0.2),
      ink: contrast(accent, INK_DARK) >= contrast(accent, INK_LIGHT) ? INK_DARK : INK_LIGHT,
    };
  }

  const hover = rgbToHex(...hslToRgb(h, s, clamp01(l - 0.07)));
  const active = rgbToHex(...hslToRgb(h, s, clamp01(l - 0.13)));
  return {
    accent: base,
    hover,
    active,
    soft: mix(base, INK_LIGHT, 0.11),
    ink: contrast(base, INK_LIGHT) >= contrast(base, INK_DARK) ? INK_LIGHT : INK_DARK,
  };
}

/* ---------- 存取 ---------- */

function readStored(): string | null {
  try {
    return normalizeHex(localStorage.getItem(ACCENT_KEY) || '');
  } catch {
    /* file:// 下 localStorage 可能不可用 */
    return null;
  }
}

let current: string | null = readStored();
const listeners = new Set<() => void>();

/** 当前自定义主色；没自定义过返回 null（= 用 tokens.css 的默认色） */
export function getAccent(): string | null {
  return current;
}

/** 生效中的颜色（含默认值） */
export function activeAccent(): string {
  return current ?? DEFAULT_ACCENT;
}

/** 设成 null 表示恢复默认 */
export function setAccent(hex: string | null): void {
  const next = hex ? normalizeHex(hex) : null;
  if (next === current) return;
  current = next;
  try {
    if (next) localStorage.setItem(ACCENT_KEY, next);
    else localStorage.removeItem(ACCENT_KEY);
  } catch {
    /* 忽略 */
  }
  listeners.forEach((cb) => cb());
}

export function subscribeAccent(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** 把当前配色写到 <html> 的内联样式上（内联优先级最高，能盖过 tokens.css / 暗色主题） */
export function applyAccent(hex: string | null, mode: ThemeMode): void {
  const root = document.documentElement;
  if (!hex) {
    ACCENT_VARS.forEach((v) => root.style.removeProperty(v));
    updateThemeColor(null);
    return;
  }
  const set = deriveAccent(hex, mode);
  root.style.setProperty('--fui-accent', set.accent);
  root.style.setProperty('--fui-accent-hover', set.hover);
  root.style.setProperty('--fui-accent-active', set.active);
  root.style.setProperty('--fui-accent-soft', set.soft);
  root.style.setProperty('--fui-accent-ink', set.ink);
  updateThemeColor(mode === 'dark' ? set.accent : null);
}

/** 手机上地址栏颜色跟着走（暗色时用亮一点的那个色，亮色时交回 index.html 里的默认值） */
function updateThemeColor(hex: string | null): void {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  if (hex) meta.setAttribute('content', hex);
  else meta.setAttribute('content', DEFAULT_ACCENT);
}
