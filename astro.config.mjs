// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// Fonts are self-hosted from the @fontsource packages (latin subset only),
// so the build never depends on a font CDN and the browser makes no
// third-party requests.
const font = (/** @type {string} */ path) => `./node_modules/${path}`;

export default defineConfig({
  site: 'https://jaimin-kavathia.github.io',
  compressHTML: true,
  build: {
    // One HTML response carries all the CSS: no render-blocking stylesheet request.
    inlineStylesheets: 'always',
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Geist',
      cssVariable: '--font-sans',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            weight: '100 900',
            style: 'normal',
            src: [font('@fontsource-variable/geist/files/geist-latin-wght-normal.woff2')],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Instrument Serif',
      cssVariable: '--font-serif',
      fallbacks: ['Georgia', 'serif'],
      options: {
        variants: [
          {
            weight: '400',
            style: 'italic',
            src: [font('@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2')],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Geist Mono',
      cssVariable: '--font-mono',
      fallbacks: ['ui-monospace', 'monospace'],
      options: {
        variants: [
          {
            weight: '100 900',
            style: 'normal',
            src: [font('@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2')],
          },
        ],
      },
    },
  ],
});
