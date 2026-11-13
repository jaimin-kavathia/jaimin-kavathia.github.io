/**
 * All page behaviour, in one small module. Everything here is progressive:
 * the page reads fine without it, and motion is skipped when the visitor
 * prefers reduced motion.
 */

declare global {
  interface Window {
    __siteReady?: boolean;
  }
}

const root = document.documentElement;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

const $ = <T extends HTMLElement>(selector: string, scope: ParentNode = document) =>
  scope.querySelector<T>(selector);
const $$ = <T extends HTMLElement>(selector: string, scope: ParentNode = document) =>
  Array.from(scope.querySelectorAll<T>(selector));
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const whenIdle = (task: () => void, timeout: number) => {
  if ('requestIdleCallback' in window) window.requestIdleCallback(task, { timeout });
  else setTimeout(task, 120);
};

/* ----------------------------------------------------------------
   Reveal on scroll
---------------------------------------------------------------- */
function initReveals() {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
  );
  $$('[data-reveal], [data-split]').forEach((element) => observer.observe(element));
}

/* ----------------------------------------------------------------
   Looping demos only run while they are on screen
---------------------------------------------------------------- */
function initPlayback() {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) entry.target.classList.toggle('is-playing', entry.isIntersecting);
    },
    { threshold: 0.3 },
  );
  $$('[data-play]').forEach((element) => observer.observe(element));
}

/* ----------------------------------------------------------------
   Counters
---------------------------------------------------------------- */
function initCounters() {
  if (reducedMotion) return;
  const counters = $$('[data-count]');
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const element = entry.target as HTMLElement;
        const goal = Number(element.dataset.count);
        const started = performance.now();
        const duration = 1600;
        const tick = (now: number) => {
          const progress = clamp((now - started) / duration);
          const eased = 1 - Math.pow(1 - progress, 4);
          element.textContent = String(Math.round(goal * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    },
    { threshold: 0.6 },
  );
  for (const counter of counters) {
    counter.textContent = '0';
    observer.observe(counter);
  }
}

/* ----------------------------------------------------------------
   Progressive rendering
   Sections below the hero start with content-visibility: auto, so the
   first paint only lays out what is on screen, and the rest is rendered
   as it nears the viewport. As soon as the visitor does anything, the
   remaining sections are rendered ahead of them, one per frame while
   the browser is idle. In-page links render everything first, so the
   jump lands exactly.
---------------------------------------------------------------- */
function initDeferredRender() {
  const pending = $$('.defer:not(.is-rendered)');
  if (!pending.length || root.classList.contains('no-defer')) return;

  const renderAll = () => {
    for (const section of pending.splice(0)) section.classList.add('is-rendered');
  };

  const renderNext = () => {
    const section = pending.shift();
    if (!section) return;
    section.classList.add('is-rendered');
    // Give that section a frame to lay out before taking the next one.
    requestAnimationFrame(() => whenIdle(renderNext, 1500));
  };

  const intents = ['pointerdown', 'pointermove', 'touchstart', 'wheel', 'keydown', 'scroll'] as const;
  const onIntent = () => {
    for (const type of intents) window.removeEventListener(type, onIntent);
    whenIdle(renderNext, 1500);
  };
  for (const type of intents) window.addEventListener(type, onIntent, { passive: true });

  document.addEventListener(
    'click',
    (event) => {
      if ((event.target as Element).closest?.('a[href^="#"]')) renderAll();
    },
    { capture: true },
  );
  window.addEventListener('hashchange', renderAll);
}

/* ----------------------------------------------------------------
   Scroll-linked effects: hero stage, statement words, timeline line
   Only elements near the viewport are measured, so nothing here
   forces layout on a section that has not been rendered yet.
---------------------------------------------------------------- */
function initScrollEffects() {
  const stage = $('[data-stage]');
  const nav = $('[data-nav]');
  const scrubs = new Map(
    $$('[data-scrub]').map((element) => [element as Element, { words: $$('.sw', element), lit: -1 }]),
  );
  const tracks = new Set<Element>($$('[data-progress]'));
  const near = new Set<Element>();
  let stageHeight = 0;
  let queued = false;

  const light = (element: Element, progress: number) => {
    const scrub = scrubs.get(element);
    if (!scrub) return;
    const lit = Math.round(progress * scrub.words.length);
    if (lit === scrub.lit) return;
    scrub.lit = lit;
    scrub.words.forEach((word, index) => word.classList.toggle('on', index < lit));
  };

  const fill = (element: Element, progress: number) =>
    (element as HTMLElement).style.setProperty('--progress', progress.toFixed(3));

  const update = () => {
    queued = false;
    const viewport = window.innerHeight;
    const scrolled = window.scrollY;

    nav?.classList.toggle('is-scrolled', scrolled > 24);

    if (stage && stageHeight && !reducedMotion && scrolled < stageHeight * 1.2) {
      stage.style.setProperty('--p', clamp(scrolled / (stageHeight * 0.9)).toFixed(3));
    }

    for (const element of near) {
      const box = element.getBoundingClientRect();
      if (scrubs.has(element)) light(element, clamp((viewport * 0.82 - box.top) / (box.height + viewport * 0.3)));
      else fill(element, clamp((viewport * 0.62 - box.top) / box.height));
    }
  };

  const request = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  if (reducedMotion) {
    for (const element of scrubs.keys()) light(element, 1);
    for (const element of tracks) fill(element, 1);
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            near.add(entry.target);
            continue;
          }
          near.delete(entry.target);
          // Settle the final state for anything that has scrolled out of range.
          const done = entry.boundingClientRect.bottom < 0 ? 1 : 0;
          if (scrubs.has(entry.target)) light(entry.target, done);
          else fill(entry.target, done);
        }
        request();
      },
      { rootMargin: '30% 0px' },
    );
    for (const element of [...scrubs.keys(), ...tracks]) observer.observe(element);
  }

  if (stage) {
    new ResizeObserver(([entry]) => {
      stageHeight = entry.contentRect.height;
      request();
    }).observe(stage);
  }

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request, { passive: true });
  request();
}

/* ----------------------------------------------------------------
   Navigation: sliding highlight, current section, mobile menu
---------------------------------------------------------------- */
function initNav() {
  const bar = $('[data-nav-links]');
  if (bar) {
    const links = $$<HTMLAnchorElement>('a', bar);
    let current: HTMLAnchorElement | undefined;

    const moveTo = (link?: HTMLAnchorElement) => {
      if (!link) {
        bar.style.setProperty('--o', '0');
        return;
      }
      bar.style.setProperty('--x', `${link.offsetLeft}px`);
      bar.style.setProperty('--w', `${link.offsetWidth}px`);
      bar.style.setProperty('--o', '1');
    };

    for (const link of links) {
      link.addEventListener('pointerenter', () => moveTo(link));
      link.addEventListener('focus', () => moveTo(link));
    }
    bar.addEventListener('pointerleave', () => moveTo(current));
    bar.addEventListener('focusout', () => moveTo(current));

    const byId = new Map(links.map((link) => [link.hash.slice(1), link]));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const link = byId.get(entry.target.id);
          if (!link) continue;
          if (entry.isIntersecting) {
            current?.removeAttribute('aria-current');
            current = link;
            link.setAttribute('aria-current', 'true');
          } else if (current === link) {
            link.removeAttribute('aria-current');
            current = undefined;
          }
        }
        if (!bar.matches(':hover')) moveTo(current);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const id of byId.keys()) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    window.addEventListener('resize', () => moveTo(current), { passive: true });
  }

  const toggle = $<HTMLButtonElement>('[data-menu-toggle]');
  const menu = $('[data-menu]');
  const label = $('[data-menu-label]');
  if (!toggle || !menu) return;

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    menu.inert = !open;
    root.style.overflow = open ? 'hidden' : '';
    if (label) label.textContent = open ? 'Close' : 'Menu';
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) setOpen(false);
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

/* ----------------------------------------------------------------
   Pointer niceties (mouse only): magnetic buttons, card light, tilt
---------------------------------------------------------------- */
function initPointerEffects() {
  if (!finePointer || reducedMotion) return;

  for (const element of $$('[data-magnetic]')) {
    element.addEventListener('pointermove', (event) => {
      const box = element.getBoundingClientRect();
      element.style.setProperty('--tx', `${((event.clientX - box.left) / box.width - 0.5) * 14}px`);
      element.style.setProperty('--ty', `${((event.clientY - box.top) / box.height - 0.5) * 12}px`);
    });
    element.addEventListener('pointerleave', () => {
      element.style.setProperty('--tx', '0px');
      element.style.setProperty('--ty', '0px');
    });
  }

  for (const element of $$('[data-spot]')) {
    element.addEventListener(
      'pointermove',
      (event) => {
        const box = element.getBoundingClientRect();
        element.style.setProperty('--mx', `${event.clientX - box.left}px`);
        element.style.setProperty('--my', `${event.clientY - box.top}px`);
      },
      { passive: true },
    );
  }

  for (const element of $$('[data-tilt]')) {
    element.addEventListener(
      'pointermove',
      (event) => {
        const box = element.getBoundingClientRect();
        element.style.setProperty('--rx', `${((event.clientY - box.top) / box.height - 0.5) * -9}deg`);
        element.style.setProperty('--ry', `${((event.clientX - box.left) / box.width - 0.5) * 12}deg`);
      },
      { passive: true },
    );
    element.addEventListener('pointerleave', () => {
      element.style.setProperty('--rx', '0deg');
      element.style.setProperty('--ry', '0deg');
    });
  }
}

/* ----------------------------------------------------------------
   Copy to clipboard
---------------------------------------------------------------- */
function initCopy() {
  const announce = $('[data-announce]');
  for (const button of $$<HTMLButtonElement>('[data-copy]')) {
    let timer = 0;
    button.addEventListener('click', async () => {
      const value = button.dataset.copy ?? '';
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        return;
      }
      button.dataset.copied = 'true';
      if (announce) announce.textContent = `Copied ${value}`;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        delete button.dataset.copied;
        if (announce) announce.textContent = '';
      }, 1800);
    });
  }
}

/* ----------------------------------------------------------------
   Local time in the hero
---------------------------------------------------------------- */
function initClock() {
  const clocks = $$('[data-clock]');
  if (!clocks.length) return;
  const format = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  });
  const render = () => {
    const now = format.format(new Date());
    for (const clock of clocks) clock.textContent = now;
  };
  render();
  window.setInterval(render, 15_000);
}

/* ----------------------------------------------------------------
   Hero smoke: loaded separately, after the page is interactive
---------------------------------------------------------------- */
function initSmoke() {
  const canvas = $<HTMLCanvasElement>('[data-smoke]');
  if (!canvas) return;
  const start = () =>
    import('./smoke').then(({ mountSmoke }) => mountSmoke(canvas, !reducedMotion)).catch(() => {});
  // Wait until the page has loaded and painted, so setting up the GPU
  // context never delays the first frame.
  const begin = () => setTimeout(() => whenIdle(start, 1500), 350);
  if (document.readyState === 'complete') begin();
  else window.addEventListener('load', begin, { once: true });
}

initDeferredRender();
initReveals();
initPlayback();
initCounters();
initScrollEffects();
initNav();
initPointerEffects();
initCopy();
initClock();
initSmoke();

window.__siteReady = true;

export {};
