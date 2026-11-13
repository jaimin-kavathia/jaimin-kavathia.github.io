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
| `site.ts` | Name, role, location, email, phone, search title and description, headline stats, the tech marquee |
| `packages.ts` | The two pub.dev packages: card content, plus the content of each package page |
| `apps.ts` | Your own apps on Google Play: card content, plus the content of each app page |
| `hire.ts` | The hire page: services, process, checklist and questions |
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

## Pages and search

| URL | Targets searches for | Content lives in |
| --- | --- | --- |
| `/` | the name, "Flutter developer", "senior Flutter developer Ahmedabad / India" | `site.ts` and the section components |
| `/hire-flutter-developer/` | "hire Flutter developer India", "freelance Flutter developer", "Flutter app developer for hire" | `hire.ts` |
| `/packages/smart-permission/` | "Flutter runtime permissions package", "permission_handler" questions | `packages.ts` → `detail` |
| `/packages/adaptive-media-picker/` | "Flutter image picker with crop", "Flutter media picker" | `packages.ts` → `detail` |
| `/apps/spotbuddy/`, `/apps/arrow-escape/`, `/apps/pdf-tools/` | each app's name and category | `apps.ts` → `detail` |

Each page sets its own title, description and canonical URL, and publishes schema.org structured data (built in `src/lib/schema.ts`): a `Person` and `WebSite` on every page, plus `ProfilePage`, `Service`, `SoftwareSourceCode`, `MobileApplication`, `BreadcrumbList` and `FAQPage` where they apply. `sitemap.xml` lists every page and is regenerated on each build.

The hire page describes how you work with clients. Read `src/data/hire.ts` and change anything that is not how you actually take on work.

### Search engines

The site `https://jaimin-kavathia.github.io/` is registered with both search consoles, under the same Google account. Each one proves ownership with a file in `public/`. **Do not delete or rename either file**, or that console loses verification.

| Console | Covers | Ownership file |
| --- | --- | --- |
| [Google Search Console](https://search.google.com/search-console) | Google | `public/google7d159be857f1c52e.html` |
| [Bing Webmaster Tools](https://www.bing.com/webmasters) (sign in with Google) | Bing, and the engines that use its index: Yahoo, DuckDuckGo, Microsoft Copilot | `public/BingSiteAuth.xml` |

Bing is told about changes automatically. After every deploy, except the automatic Monday rebuild, the workflow runs `.github/scripts/indexnow.mjs`, which sends each URL in the live sitemap to [IndexNow](https://www.indexnow.org/), the notification feed that Bing, Yandex and a few other engines read. It identifies the site with the key file `public/a815de20e6a34f4e5187faf50a900407.txt`, so that file must stay too. Google does not use IndexNow.

When you add a new page:

1. Add it to `src/pages/sitemap.xml.ts` if it is not picked up from the data files.
2. Push. Bing hears about it through IndexNow.
3. For Google, open Search Console, paste the new URL into **URL inspection** and press **Request indexing**.

To see what would be sent, without sending it:

```bash
node .github/scripts/indexnow.mjs https://jaimin-kavathia.github.io/ --dry-run
```

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
