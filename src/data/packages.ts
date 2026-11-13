import type { Question } from '../lib/schema';

export type Platform = 'Android' | 'iOS' | 'Web' | 'macOS' | 'Windows' | 'Linux';

export interface PackageSection {
  heading: string;
  body: string;
  code?: string;
}

export interface PackageTable {
  caption: string;
  head: string[];
  rows: string[][];
}

/** Content for the package's own page at /packages/<slug>/. */
export interface PackageDetail {
  slug: string;
  /** <title> for search results. */
  seoTitle: string;
  seoDescription: string;
  /** Page heading. Wrap words in *asterisks* for the serif accent, ~tildes~ to dim. */
  pageTitle: string;
  intro: string[];
  sections: PackageSection[];
  table: PackageTable;
  requirements: string;
  faq: Question[];
}

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
  detail: PackageDetail;
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
  /** Site path of the package page. */
  path: string;
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
  context,
  permission: Permission.camera,
);`,
    demo: 'permission',
    blogUrl:
      'https://medium.com/@jaiminkavathia30/introducing-smart-permission-runtime-permissions-made-effortless-in-flutter-30f4785a588f',
    repoUrl: 'https://github.com/jaimin-kavathia/smart_permission',
    detail: {
      slug: 'smart-permission',
      seoTitle: 'smart_permission: Flutter Runtime Permissions Package | Jaimin Kavathia',
      seoDescription:
        'smart_permission is a Flutter package for runtime permissions: one-line requests, adaptive dialogs and the full denied and Open Settings flow.',
      pageTitle: 'smart_permission: Flutter runtime permissions ~in~ *one line*',
      intro: [
        'Asking for a permission in Flutter is easy. Handling everything that can happen next is not. The user may deny once, deny forever, be blocked by parental controls, or change their mind later in the system settings.',
        'smart_permission handles all of it with one call. It shows the right dialog at each step, sends the user to Settings when that is the only way forward, re-checks when they come back, and tells you exactly how the request ended. It is built on permission_handler, so every permission that plugin supports works here.',
      ],
      sections: [
        {
          heading: 'Request a permission in one line',
          body: 'Call request with the permission you need and an optional description. If the permission is already allowed it returns immediately. Otherwise the user sees the native prompt, and the follow-up dialogs if they decline.',
          code: `final granted = await SmartPermission.request(
  context,
  permission: Permission.camera,
  description: 'We need the camera to scan QR codes.',
);
if (granted) openScanner();`,
        },
        {
          heading: 'Request several permissions at once',
          body: 'The native prompts run as one batch, followed by at most one combined explanation dialog and one combined settings dialog. The user never gets a dialog per permission.',
          code: `final results = await SmartPermission.requestMultiple(
  context,
  permissions: [Permission.camera, Permission.microphone],
);
// {Permission.camera: true, Permission.microphone: false}`,
        },
        {
          heading: 'Explain before the native prompt',
          body: 'On iOS the native prompt can only be shown once, so explaining first is worth it. Turn it on for one call, or for every call through the global config.',
          code: `await SmartPermission.request(
  context,
  permission: Permission.camera,
  showRationaleFirst: true,
);

// Or for every request:
SmartPermission.config.showRationaleBeforeRequest = true;`,
        },
        {
          heading: 'Guard a screen with PermissionGate',
          body: 'PermissionGate shows its content only while a permission is usable. Otherwise it shows a fallback with an Allow button, or Open Settings when the permission is permanently denied. It re-checks whenever the app returns to the foreground.',
          code: `PermissionGate(
  permission: Permission.camera,
  description: 'We need the camera to scan QR codes.',
  builder: (context) => const QrScanner(),
)`,
        },
        {
          heading: 'Know why a request failed',
          body: 'requestResult runs the same flow but returns a SmartPermissionResult instead of a bool, so you can tell a simple denial from a permanent one, or from a restriction the user cannot change.',
          code: `final result = await SmartPermission.requestResult(
  context: context,
  permission: Permission.camera,
);

if (result.canProceed) {
  openCamera();
} else if (result == SmartPermissionResult.permanentlyDenied) {
  showSettingsShortcut();
} else if (result == SmartPermissionResult.restricted) {
  hideCameraFeature();
}`,
        },
        {
          heading: 'Check a permission without asking',
          body: 'These calls never prompt and never show a dialog. Use them to decide what to render before the user has done anything.',
          code: `final usable = await SmartPermission.hasPermission(Permission.camera);
final result = await SmartPermission.status(Permission.location);

// Open this app's page in the system settings:
await SmartPermission.openSettings();`,
        },
      ],
      table: {
        caption: 'How the request flow handles each situation',
        head: ['Situation', 'What the user sees'],
        rows: [
          ['Already allowed', 'Nothing. The call returns immediately.'],
          ['First time', 'The native system prompt, optionally after your explanation.'],
          ['Denied', 'An explanation dialog offering to ask again.'],
          ['Permanently denied', 'An Open Settings dialog. The package waits for the user to return, then re-checks.'],
          ['Restricted', 'An informational dialog, for example with parental controls, where Settings cannot help.'],
        ],
      },
      requirements: 'Flutter 3.27 or newer (Dart 3.6+). macOS and Linux are not supported, because permission_handler has no implementation for them.',
      faq: [
        {
          question: 'Is smart_permission a replacement for permission_handler?',
          answer:
            'It is built on top of permission_handler rather than replacing it. permission_handler talks to the operating system; smart_permission adds the complete request flow, the dialogs and the result handling around it. Permission and PermissionStatus are re-exported, so one import is enough.',
        },
        {
          question: 'How do I open the app settings when a permission is permanently denied?',
          answer:
            'You do not have to. When a request finds a permanent denial, the package shows an Open Settings dialog, waits for the user to come back to the app, and checks the permission again. If you want your own button, call SmartPermission.openSettings().',
        },
        {
          question: 'Which platforms does smart_permission support?',
          answer:
            'Android, iOS, Web (including WASM builds) and Windows. macOS and Linux are not supported because the underlying permission_handler plugin has no implementation for them.',
        },
        {
          question: 'Can I use my own dialogs and translations?',
          answer:
            'Yes. The built-in dialogs come in Material, Cupertino and adaptive styles, follow light and dark themes and take your brand colour. Every built-in string can be replaced, and you can swap in your own dialog or bottom sheet entirely.',
        },
        {
          question: 'Can I test code that requests permissions?',
          answer:
            'Yes. The package ships FakeSmartPermissionGateway, so widget tests can simulate granted, denied and permanently denied results without platform channels.',
        },
      ],
    },
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
    detail: {
      slug: 'adaptive-media-picker',
      seoTitle: 'adaptive_media_picker: Flutter Image & Video Picker | Jaimin Kavathia',
      seoDescription:
        'adaptive_media_picker is a Flutter image and video picker with permissions, a camera or gallery sheet, cropping and validation built in, on every platform.',
      pageTitle: 'adaptive_media_picker: a Flutter image and video picker ~with the~ *hard parts built in*',
      intro: [
        'image_picker opens the system picker. Everything around it, every app writes again: asking for permissions, letting the user choose between camera and gallery, cropping, checking the file size, and working out why nothing came back.',
        'adaptive_media_picker does that work for you, on top of image_picker. One call picks an image or a video with permissions explained and requested when needed, iOS limited photo access handled, and failures returned as a typed error instead of an exception.',
      ],
      sections: [
        {
          heading: 'Pick an image in one call',
          body: 'Permissions are requested, and explained, only when they are needed. The result carries the picked item, or the reason there is none.',
          code: `final picker = AdaptiveMediaPicker();

final result = await picker.pickImage(context: context);
final photo = result.item; // null if the user canceled`,
        },
        {
          heading: 'Profile photo: camera or gallery, with a circle crop',
          body: 'The source sheet is a Cupertino action sheet on iOS and macOS and a Material bottom sheet elsewhere. Where there is no camera, the camera option is hidden.',
          code: `final result = await picker.pickImage(
  context: context,
  sourceSheet: SourceSheetOptions(title: 'Profile photo'),
  options: const PickOptions(
    wantToCrop: true,
    cropShape: CropShape.circle,
    preferredCameraDevice: CameraDevice.front,
    maxFileSizeBytes: 5 * 1024 * 1024, // 5 MB
  ),
);`,
        },
        {
          heading: 'Pick multiple images with a limit',
          body: 'Set a maximum and an image quality. The limit is enforced by the picker, not checked afterwards.',
          code: `final result = await picker.pickMultiImage(
  context: context,
  options: const PickOptions(maxImages: 5, imageQuality: 80),
);
for (final image in result.items) {
  // ...
}`,
        },
        {
          heading: 'Videos, and photos and videos together',
          body: 'Pick one video, record one with a maximum length, pick several, or let the user choose photos and videos in the same picker.',
          code: `final video = await picker.pickVideo(
  context: context,
  options: const PickOptions(
    source: ImageSource.camera,
    maxVideoDuration: Duration(seconds: 30),
  ),
);

final media = await picker.pickMultipleMedia(
  context: context,
  options: const PickOptions(maxImages: 10),
);`,
        },
        {
          heading: 'Limit file size and type',
          body: 'Valid files come back in items. Files that fail a rule come back in rejected, each with its reason.',
          code: `final result = await picker.pickMultiImage(
  context: context,
  options: const PickOptions(
    maxFileSizeBytes: 10 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png'],
  ),
);`,
        },
        {
          heading: 'Crop on every platform',
          body: 'Android and iOS use the native croppers. Web, macOS, Windows and Linux use a built-in Flutter crop editor with ratio presets, with no extra setup.',
          code: `const PickOptions(
  wantToCrop: true,
  cropAspectRatio: CropAspectRatioOption.ratio16x9,
  lockCropAspectRatio: true,
)`,
        },
      ],
      table: {
        caption: 'image_picker on its own, compared with adaptive_media_picker',
        head: ['You need', 'image_picker alone', 'adaptive_media_picker'],
        rows: [
          ['Camera and Photos permission prompts, with the Settings flow', 'Build it yourself', 'Built in, with customisable text'],
          ['A "Take photo or choose from gallery" sheet', 'Build it yourself', 'Built in, Cupertino on iOS'],
          ['Cropping, including circle avatars', 'A separate package and setup', 'One option: wantToCrop'],
          ['Cropping on web and desktop', 'Not available', 'Built-in editor, no setup'],
          ['iOS "Selected Photos" limited access', 'Build it yourself', 'Built-in selection sheet'],
          ['Maximum file size and allowed types', 'Build it yourself', 'maxFileSizeBytes and allowedMimeTypes'],
          ['Why nothing was picked', 'null', 'A typed PickError and the permission state'],
          ['Google Play photo and video policy', 'Your responsibility', 'No READ_MEDIA permission needed'],
        ],
      },
      requirements: 'Works on Android, iOS, Web (JavaScript and WASM), macOS, Windows and Linux.',
      faq: [
        {
          question: 'How is adaptive_media_picker different from image_picker?',
          answer:
            'It is built on top of image_picker and adds what apps usually write around it: permission prompts with the Settings flow, a camera or gallery chooser, cropping, file size and type validation, and typed results that say why nothing was picked.',
        },
        {
          question: 'Does it handle iOS limited photo access?',
          answer:
            'Yes. When the user shares only some photos ("Selected Photos"), the package shows its own grid of those photos, with Select more, and Open Settings if the selection is empty.',
        },
        {
          question: 'Do I need the READ_MEDIA_IMAGES permission on Android?',
          answer:
            'No. Gallery picks go through the Android photo picker, so you should not declare READ_MEDIA_IMAGES, READ_MEDIA_VIDEO or READ_EXTERNAL_STORAGE for this package. That also keeps your app in line with the Google Play photo and video permissions policy. Only the camera needs a permission.',
        },
        {
          question: 'Does image cropping work on Flutter web and desktop?',
          answer:
            'Yes. Android and iOS use the native croppers, and Web, macOS, Windows and Linux use a built-in Flutter crop editor with ratio presets and a circle crop for avatars.',
        },
        {
          question: 'What do I get back if the user cancels or a pick fails?',
          answer:
            'A result with a typed PickError rather than a null or an exception: canceled, cropCanceled, permissionDenied, fileTooLarge, unsupportedType, io or unknown. For permission denials you also get whether the user has to change it in Settings.',
        },
      ],
    },
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
    path: `/packages/${pkg.detail.slug}/`,
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

/** Paths and names only, for navigation and the sitemap (no network). */
export const packageLinks = packages.map((pkg) => ({ name: pkg.name, path: `/packages/${pkg.detail.slug}/` }));

export function compactNumber(value: number): string {
  if (value < 1000) return String(value);
  const thousands = value / 1000;
  return `${thousands >= 100 ? Math.round(thousands) : thousands.toFixed(1).replace(/\.0$/, '')}k`;
}
