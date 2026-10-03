import React from 'react';

/**
 * 滑动指示器的测量逻辑（Segmented 的滑块、Tabs 的下划线/卡片都共用）。
 *
 * 思路：容器 `position: relative`，指示器绝对定位在 left:0，
 * 组件量出「当前选中项」相对容器的左偏移与宽度，写进 translateX / width，
 * 靠 CSS transition 平移过去 —— 于是「切左边滑到左边、切右边滑到右边」。
 */

export interface SlideIndicator {
  /** 相对容器的左偏移（px） */
  x: number;
  /** 相对容器的上偏移（px）—— 竖向列表（侧边栏那种）用得上 */
  y: number;
  /** 选中项宽度（px） */
  w: number;
  /** 选中项高度（px） */
  h: number;
  /** 是否已经量到（false 时指示器先藏着，别在边缘闪一下） */
  ready: boolean;
  /** 首帧之后才为 true；这之前不开过渡，否则初值不在第一项时会从最左边「滑进来」 */
  anim: boolean;
}

/**
 * @param trackRef     带 position:relative 的容器
 * @param itemSelector 用来找当前选中项（要带 .is-active）
 * @param key          值/选项的指纹，变化时重量一次
 */
export function useSlideIndicator(
  trackRef: React.RefObject<HTMLElement | null>,
  itemSelector: string,
  key: string,
): SlideIndicator {
  const [pos, setPos] = React.useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [anim, setAnim] = React.useState(false);

  const measure = React.useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const active = track.querySelector<HTMLElement>(itemSelector);
    if (!active) { setPos(null); return; }
    const tr = track.getBoundingClientRect();
    const ar = active.getBoundingClientRect();
    const x = ar.left - tr.left;
    const y = ar.top - tr.top;
    const w = ar.width;
    const h = ar.height;
    // 值没变就复用旧对象，避免 effect 里 setState 引起的新一轮渲染
    setPos((prev) =>
      prev && prev.x === x && prev.y === y && prev.w === w && prev.h === h ? prev : { x, y, w, h });
  }, [trackRef, itemSelector]);

  // 布局阶段量，避免看到「先渲染到原位再跳过去」的中间态
  React.useLayoutEffect(() => { measure(); }, [measure, key]);

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(track);
      track.querySelectorAll<HTMLElement>(itemSelector).forEach((el) => ro!.observe(el));
    }
    // 字体晚到会改变文字宽度，重新量一次（没有 ResizeObserver 的环境也能自愈）
    Promise.resolve(document.fonts?.ready).then(measure).catch(() => {});
    window.addEventListener('resize', measure);
    const raf = requestAnimationFrame(() => setAnim(true));
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
      cancelAnimationFrame(raf);
    };
  }, [measure, itemSelector, key, trackRef]);

  return { x: pos?.x ?? 0, y: pos?.y ?? 0, w: pos?.w ?? 0, h: pos?.h ?? 0, ready: !!pos, anim };
}
