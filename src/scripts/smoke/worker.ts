/**
 * Runs the smoke shader off the main thread. The page transfers its canvas
 * here, so creating the GPU context, compiling the shader and drawing every
 * frame never compete with scrolling or input.
 */
import { createSmoke, type Smoke } from './engine';

type Message =
  | { type: 'init'; canvas: OffscreenCanvas; width: number; height: number }
  | { type: 'resize'; width: number; height: number }
  | { type: 'pointer'; x: number; y: number }
  | { type: 'run'; active: boolean };

const scope = self as unknown as {
  onmessage: ((event: MessageEvent<Message>) => void) | null;
  postMessage(message: { type: 'ready' | 'lost' | 'unsupported' }): void;
};

let smoke: Smoke | null = null;

scope.onmessage = ({ data }) => {
  switch (data.type) {
    case 'init':
      data.canvas.width = data.width;
      data.canvas.height = data.height;
      smoke = createSmoke(data.canvas, {
        ready: () => scope.postMessage({ type: 'ready' }),
        lost: () => scope.postMessage({ type: 'lost' }),
      });
      if (!smoke) scope.postMessage({ type: 'unsupported' });
      break;
    case 'resize':
      smoke?.resize(data.width, data.height);
      break;
    case 'pointer':
      smoke?.pointer(data.x, data.y);
      break;
    case 'run':
      smoke?.run(data.active);
      break;
  }
};
