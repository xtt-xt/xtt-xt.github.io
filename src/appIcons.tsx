import type { CSSProperties } from 'react';

/* 站点自己用的几个小图标（线性风格，和 FlatUI 的图标保持一致），
   FlatUI 自带的图标都在 src/flat-ui/icons.tsx，通过 Icons.xxx 取用。 */

type P = { size?: number; className?: string; style?: CSSProperties };

const svgProps = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
});

export const IconCode = ({ size = 16, className, style }: P) => (
  <svg {...svgProps(size)} className={className} style={style}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

export const IconArrowRight = ({ size = 16, className, style }: P) => (
  <svg {...svgProps(size)} className={className} style={style}>
    <line x1="4" y1="12" x2="20" y2="12" />
    <polyline points="14 6 20 12 14 18" />
  </svg>
);

export const IconArrowLeft = ({ size = 16, className, style }: P) => (
  <svg {...svgProps(size)} className={className} style={style}>
    <line x1="20" y1="12" x2="4" y2="12" />
    <polyline points="10 6 4 12 10 18" />
  </svg>
);

export const IconExternal = ({ size = 16, className, style }: P) => (
  <svg {...svgProps(size)} className={className} style={style}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export const IconMail = ({ size = 16, className, style }: P) => (
  <svg {...svgProps(size)} className={className} style={style}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2.5 6 12 13 21.5 6" />
  </svg>
);

export const IconBilibili = ({ size = 16, className, style }: P) => (
  <svg {...svgProps(size)} className={className} style={style}>
    <rect x="3" y="6.5" width="18" height="14" rx="3" />
    <path d="M7.5 3.5L10 6.5M16.5 3.5L14 6.5" />
    <path d="M9.5 12.5v2M14.5 12.5v2" />
  </svg>
);

export const IconSpark = ({ size = 16, className, style }: P) => (
  <svg {...svgProps(size)} className={className} style={style}>
    <path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z" />
  </svg>
);

export const IconRocket = ({ size = 16, className, style }: P) => (
  <svg {...svgProps(size)} className={className} style={style}>
    <path d="M5 15c-1.5 1.5-2 6-2 6s4.5-.5 6-2c.9-.9.9-2.4 0-3.3-.9-1-2.4-1-3.3 0z" />
    <path d="M9 12l3-3c3-3 6-4.5 9-4.5 0 3-1.5 6-4.5 9l-3 3z" />
    <circle cx="15" cy="9" r="1.4" />
  </svg>
);

export const IconCalendar = ({ size = 16, className, style }: P) => (
  <svg {...svgProps(size)} className={className} style={style}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="8" y1="3" x2="8" y2="7" />
    <line x1="16" y1="3" x2="16" y2="7" />
  </svg>
);
