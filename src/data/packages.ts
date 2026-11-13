export type Platform = 'Android' | 'iOS' | 'Web' | 'macOS' | 'Windows' | 'Linux';

export interface PackageInfo {
  /** pub.dev package name. */
  name: string;
  /** Headline. Wrap a word in *asterisks* for the serif accent. */
  headline: string;
  summary: string;
  features: string[];
  snippet: string;
  demo: 'permission' | 'picker';
  blogUrl: string;
  repoUrl: string;
  /** Used only if pub.dev cannot be reached while building. */
  fallback: {
    version: string;
    likes: number;
    points: number;
    maxPoints: number;
    downloads: number;
    platforms: Platform[];
  };
}

export interface ResolvedPackage extends PackageInfo {
  version: string;
  likes: number;
  points: number;
  maxPoints: number;
  downloads: number;
  platforms: Platform[];
  pubUrl: string;
  install: string;
}

const packages: PackageInfo[] = [
  {
    name: 'smart_permission',
    headline: 'Runtime permissions, handled in *one line.*',
    summary:
      'Ask for a permission with a single call and let the package run the whole flow: rationale, the native prompt, denied and permanently-denied states, and the trip to Settings and back.',
    features: [
      'One call for a single permission, or a batch of them',
      'Complete flows for denied, permanently denied and restricted states',
      'Adaptive Material and Cupertino dialogs, themeable and localised',
      'PermissionGate widget, analytics hooks and a fake gateway for tests',
    ],
    snippet: `final granted = await SmartPermission.request(
  permission: Permission.camera,
);`,
    demo: 'permission',
    blogUrl:
      'https://medium.com/@jaiminkavathia30/introducing-smart-permission-runtime-permissions-made-effortless-in-flutter-30f4785a588f',
    repoUrl: 'https://github.com/jaimin-kavathia/smart_permission',
    fallback: {
      version: '1.1.0',
      likes: 19,
      points: 160,
      maxPoints: 160,
      downloads: 14362,
      platforms: ['Android', 'iOS', 'Web', 'Windows'],
    },
  },
  {
    name: 'adaptive_media_picker',
    headline: 'Media picking that *just works,* everywhere.',
    summary:
      'An image and video picker with the hard parts built in: permissions, a camera or gallery sheet, cropping and validation. On Android it uses the system photo picker, so your app never declares a media permission.',
    features: [
      'Images, videos or both, single or multiple with a hard limit',
      'Built-in permission handling, including iOS limited photo access',
      'Cropping with ratio presets, plus circle crop for avatars',
      'Typed results instead of exceptions, with size and type validation',
    ],
    snippet: `final picker = AdaptiveMediaPicker();
final result = await picker.pickImage(context: context);`,
    demo: 'picker',
    blogUrl:
      'https://medium.com/@jaiminkavathia30/flutters-missing-piece-effortless-media-picking-with-limited-access-support-9a1a24404667',
    repoUrl: 'https://github.com/jaimin-kavathia/adaptive_media_picker',
    fallback: {
      version: '2.0.0',
      likes: 37,
      points: 160,
      maxPoints: 160,
      downloads: 536,
      platforms: ['Android', 'iOS', 'Web', 'macOS', 'Windows', 'Linux'],
    },
  },
];

const PLATFORM_TAGS: Record<string, Platform> = {
  'platform:android': 'Android',
  'platform:ios': 'iOS',
  'platform:web': 'Web',
  'platform:macos': 'macOS',
  'platform:windows': 'Windows',
  'platform:linux': 'Linux',
};
const PLATFORM_ORDER: Platform[] = ['Android', 'iOS', 'Web', 'macOS', 'Windows', 'Linux'];

async function getJson(url: string): Promise<any> {
  const response = await fetch(url, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(6000),
  });
  if (!response.ok) throw new Error(`${url} responded ${response.status}`);
  return response.json();
}

async function resolve(pkg: PackageInfo): Promise<ResolvedPackage> {
  const base = {
    ...pkg,
    ...pkg.fallback,
    pubUrl: `https://pub.dev/packages/${pkg.name}`,
    install: `flutter pub add ${pkg.name}`,
  };

  try {
    const [info, score] = await Promise.all([
      getJson(`https://pub.dev/api/packages/${pkg.name}`),
      getJson(`https://pub.dev/api/packages/${pkg.name}/score`),
    ]);
    const tagged = (score.tags as string[])
      .map((tag) => PLATFORM_TAGS[tag])
      .filter((platform): platform is Platform => Boolean(platform));

    return {
      ...base,
      version: info.latest?.version ?? base.version,
      likes: score.likeCount ?? base.likes,
      points: score.grantedPoints ?? base.points,
      maxPoints: score.maxPoints ?? base.maxPoints,
      downloads: score.downloadCount30Days ?? base.downloads,
      platforms: tagged.length ? PLATFORM_ORDER.filter((p) => tagged.includes(p)) : base.platforms,
    };
  } catch (error) {
    console.warn(`[packages] pub.dev unreachable for ${pkg.name}; using saved numbers.`, error);
    return base;
  }
}

let cache: Promise<ResolvedPackage[]> | undefined;

/**
 * Package details with live numbers from pub.dev, fetched once per build.
 * The deploy workflow rebuilds weekly, so the numbers never go stale.
 */
export function getPackages(): Promise<ResolvedPackage[]> {
  cache ??= Promise.all(packages.map(resolve));
  return cache;
}

export function compactNumber(value: number): string {
  if (value < 1000) return String(value);
  const thousands = value / 1000;
  return `${thousands >= 100 ? Math.round(thousands) : thousands.toFixed(1).replace(/\.0$/, '')}k`;
}
