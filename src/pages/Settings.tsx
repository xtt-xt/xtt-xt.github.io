import { useSyncExternalStore } from 'react';
import { Badge, Button, Card, Tag } from '../flat-ui';
import { PageHeader } from '../components/PageHeader';
import { IconCheck, IconPalette } from '../appIcons';
import {
  ACCENT_PRESETS,
  DEFAULT_ACCENT,
  getAccent,
  setAccent,
  subscribeAccent,
} from '../lib/accent';

/** 派生出来的五个变量，用 CSS 变量名当说明，值交给浏览器算（亮暗主题自动跟随） */
const SCALE = [
  { name: 'accent', desc: '主色', v: 'var(--fui-accent)' },
  { name: 'hover', desc: '悬停', v: 'var(--fui-accent-hover)' },
  { name: 'active', desc: '按下', v: 'var(--fui-accent-active)' },
  { name: 'soft', desc: '浅底', v: 'var(--fui-accent-soft)' },
  { name: 'ink', desc: '色上文字', v: 'var(--fui-accent-ink)' },
];

export default function Settings() {
  const custom = useSyncExternalStore(subscribeAccent, getAccent);
  const current = (custom ?? DEFAULT_ACCENT).toLowerCase();

  return (
    <>
      <PageHeader
        title="设置"
        sub="这些偏好只存在你这台设备的浏览器里，换设备不会跟着走。"
      />

      <section className="xt-section xt-section--bare">
        <div className="xt-section__head">
          <h3 className="xt-section__title xt-section__title--icon">
            <IconPalette size={16} />
            配色
          </h3>
          <p className="xt-section__sub">
            挑一个主色就行 —— 悬停、按下、浅底和色上的文字，亮色 / 暗色主题各自动算一套。
            太浅的色在浅色底上会有点难读，选深一点的更稳。
          </p>
        </div>

        <Card>
          <div className="xt-accent">
            <div className="xt-accent__row">
              <div className="xt-accent__label">预设</div>
              <div className="xt-swatches" role="group" aria-label="预设主色">
                {ACCENT_PRESETS.map((p) => {
                  const on = p.hex.toLowerCase() === current;
                  return (
                    <button
                      key={p.hex}
                      type="button"
                      className={`xt-swatch${on ? ' is-active' : ''}`}
                      style={{ background: p.hex }}
                      aria-label={p.name}
                      aria-pressed={on}
                      title={p.name}
                      data-hex={p.hex}
                      onClick={() => setAccent(p.hex)}
                    >
                      {on && <IconCheck size={15} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="xt-accent__row">
              <div className="xt-accent__label">自定义</div>
              <div className="xt-accent__custom">
                <label className="xt-picker" title="打开取色器">
                  <input
                    type="color"
                    value={current}
                    aria-label="自定义主色"
                    onChange={(e) => setAccent(e.target.value)}
                  />
                  <span className="xt-picker__chip" style={{ background: current }} />
                  <span className="xt-picker__hex">{current.toUpperCase()}</span>
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!custom}
                  onClick={() => setAccent(null)}
                >
                  恢复默认
                </Button>
              </div>
            </div>

            <div className="xt-accent__row">
              <div className="xt-accent__label">这一套</div>
              <div className="xt-scale">
                {SCALE.map((s) => (
                  <div className="xt-scale__cell" key={s.name}>
                    <span className="xt-scale__chip" style={{ background: s.v }} />
                    <span className="xt-scale__name">{s.name}</span>
                    <span className="xt-scale__desc">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="xt-accent__row">
              <div className="xt-accent__label">用起来</div>
              <div className="xt-accent__demo">
                <Button size="sm">主按钮</Button>
                <Button size="sm" variant="outline">
                  次要按钮
                </Button>
                <Tag variant="accent">标签</Tag>
                <Badge tone="accent">徽标</Badge>
                <a className="xt-inline-link" href="#/settings" onClick={(e) => e.preventDefault()}>
                  一个链接
                </a>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}
