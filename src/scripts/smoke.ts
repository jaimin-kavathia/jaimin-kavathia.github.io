/**
 * Connects the hero canvas to the smoke shader. Rendering happens in a Web
 * Worker when the browser supports OffscreenCanvas, otherwise on the main
 * thread. Either way the shader is rendered at reduced resolution, and only
 * while the stage is on screen and the tab is visible.
 */
import { createSmoke, type Smoke } from './smoke/engine';

const RESOLUTION_SCALE = 0.5;

export function mountSmoke(canvas: HTMLCanvasElement, animate: boolean): void {
  const host = canvas.parentElement ?? canvas;

  const measure = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5) * RESOLUTION_SCALE;
    return {
      width: Math.max(2, Math.round(canvas.clientWidth * ratio)),
      height: Math.max(2, Math.round(canvas.clientHeight * ratio)),
    };
  };

  const events = {
    ready: () => canvas.classList.add('is-live'),
    lost: () => canvas.classList.remove('is-live'),
  };

  let smoke: Smoke | null = null;

  if (typeof Worker === 'function' && 'transferControlToOffscreen' in canvas) {
    let worker: Worker;
    try {
      worker = new Worker(new URL('./smoke/worker.ts', import.meta.url), { type: 'module' });
    } catch {
      return;
    }
    const offscreen = canvas.transferControlToOffscreen();
    worker.onmessage = ({ data }: MessageEvent<{ type: 'ready' | 'lost' | 'unsupported' }>) => {
      if (data.type === 'ready') events.ready();
      else if (data.type === 'lost') events.lost();
      else worker.terminate();
    };
    worker.postMessage({ type: 'init', canvas: offscreen, ...measure() }, [offscreen]);
    smoke = {
      resize: (width, height) => worker.postMessage({ type: 'resize', width, height }),
      pointer: (x, y) => worker.postMessage({ type: 'pointer', x, y }),
      run: (active) => worker.postMessage({ type: 'run', active }),
    };
  } else {
    const size = measure();
    canvas.width = size.width;
    canvas.height = size.height;
    smoke = createSmoke(canvas, events);
  }

  if (!smoke) return;
  const link = smoke;

  let visible = true;
  const sync = () => link.run(animate && visible && !document.hidden);

  new ResizeObserver(() => {
    const size = measure();
    link.resize(size.width, size.height);
  }).observe(canvas);

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }).observe(canvas);

  document.addEventListener('visibilitychange', sync);

  if (animate) {
    host.addEventListener(
      'pointermove',
      (event) => {
        const box = host.getBoundingClientRect();
        link.pointer((event.clientX - box.left) / box.width, 1 - (event.clientY - box.top) / box.height);
      },
      { passive: true },
    );
  }

  sync();
}
