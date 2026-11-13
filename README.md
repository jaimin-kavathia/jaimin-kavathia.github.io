# Jaimin Kavathia — Portfolio

Personal site of Jaimin Kavathia, Senior Flutter Developer.
Built with [Astro](https://astro.build): the page ships as static HTML with its CSS inlined, under 8 KB of JavaScript (gzipped), and self-hosted fonts. About 104 KB in total, with no framework runtime and no third-party requests.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # production build in dist/
npm run preview  # serve the production build
npm run check    # type check
```

Requires Node 22 or newer.

## Edit the content

All text and data live in `src/data/`. No component needs to change for a content update.

| File | What it holds |
| --- | --- |
| `site.ts` | Name, role, location, email, phone, headline stats, the tech marquee |
| `packages.ts` | The two pub.dev packages: headline, summary, features, code snippet, links |
| `apps.ts` | Your own apps on Google Play (see below) |
| `expertise.ts` | The expertise tiles and the toolbox list |
| `journey.ts` | Timeline milestones |

Years of experience are calculated from the September 2021 start date at build time.

Likes, pub points, downloads, version and platforms on the package cards are fetched from pub.dev during the build. If pub.dev cannot be reached, the saved numbers in `packages.ts` are used. The deploy workflow rebuilds every Monday so they stay current.

### Change the photo

The About portrait is `src/assets/portrait.webp`. Replace that file (`.jpg` and `.png` also work) and it is resized and converted at build time. Without a portrait file, a monogram card is shown instead.

Best results: 4:5 portrait, at least 1200 × 1500 px, face in the upper half, dark or neutral background.

### Add or edit a Play Store app

1. Put the app icon in `src/assets/apps/` (512 × 512 px is ideal). Portrait screenshots are optional.
2. Add an entry to the `apps` array in `src/data/apps.ts`, newest first:

```ts
{
  name: 'App name',
  subtitle: 'Second half of the store title',
  category: 'Productivity',
  tagline: 'One line about what it does.',
  description: 'Two or three sentences.',
  highlights: ['Works offline', 'Material 3'],
  playUrl: 'https://play.google.com/store/apps/details?id=your.package.id',
  released: 'Nov 2026',
  tint: '#6a5cff',                          // brand colour for the glow
  icon: 'app-icon.png',
  screenshots: ['app-1.png', 'app-2.png'],  // optional: shown in phone frames instead of the icon
  rating: '5.0',                            // optional: update by hand
}
```

The Apps section, its navigation link and the "Apps on Google Play" stat all follow this list.

## Structure

```
src/
  data/         content
  components/   one file per section, styles included
  layouts/      Base.astro: <head>, SEO, fonts
  scripts/      main.ts (interactions), smoke.ts (hero WebGL shader)
  styles/       base.css: design tokens, type, buttons, cards, reveals
  pages/        index, 404, sitemap.xml
public/         favicon, icons, og.png, robots.txt, web manifest
```

## Motion

- Hero: a WebGL smoke shader that runs in a Web Worker (OffscreenCanvas), at half resolution, paused when off screen or when the tab is hidden. Without a GPU it is skipped and a CSS backdrop is shown.
- Scroll: word-by-word headline reveals, a paragraph that lights up as it crosses the viewport, counters, a timeline that fills.
- Packages: two CSS-only phone demos that play the permission flow and the media picker flow while visible.
- Pointer: magnetic buttons, cursor-following card light, phone tilt (mouse only).

Everything respects `prefers-reduced-motion`, and the page is fully readable without JavaScript.

## Performance

- Sections below the hero use `content-visibility: auto` (the `defer` class), so the first paint only lays out what is on screen. They are rendered ahead of the visitor after their first interaction, and all at once before an in-page link jumps.
- Looping animations only run while their section is visible, and animate `transform` and `opacity` only.
- Lighthouse on the production build, run locally: desktop 100 / 100 / 100 / 100. Mobile (simulated slow 4G, 4x CPU slowdown) 100 for accessibility, best practices and SEO, and 83 to 100 for performance across runs, with first contentful paint at 1.2 s and no layout shift.

To re-measure:

```bash
npm run build && npm run preview
npx lighthouse http://localhost:4321 --view
```

## Deploy

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub Pages.
In the repository settings, Pages must be set to **Source: GitHub Actions**.

If you move to a custom domain, update `site` in `astro.config.mjs` and the sitemap line in `public/robots.txt`.
