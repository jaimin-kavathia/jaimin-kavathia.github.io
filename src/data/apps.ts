import type { Question } from '../lib/schema';

export interface AppFeatureGroup {
  title: string;
  items: string[];
}

/** Content for the app's own page at /apps/<slug>/. */
export interface AppDetail {
  slug: string;
  /** <title> for search results. */
  seoTitle: string;
  seoDescription: string;
  /** Page heading. Wrap words in *asterisks* for the serif accent, ~tildes~ to dim. */
  pageTitle: string;
  intro: string[];
  groups: AppFeatureGroup[];
  facts: { label: string; value: string }[];
  faq: Question[];
  /** schema.org application category. */
  schemaCategory: string;
}

export interface AppInfo {
  /** Short name, as shown on the card. */
  name: string;
  /** Second half of the store title. */
  subtitle: string;
  category: string;
  /** One line under the name. */
  tagline: string;
  description: string;
  highlights: string[];
  /** Full Google Play listing URL. */
  playUrl: string;
  /** Month and year of the first release. */
  released: string;
  /** Brand colour, used for the glow behind the icon. */
  tint: string;
  /** File name inside src/assets/apps/. */
  icon: string;
  /** Optional portrait screenshots inside src/assets/apps/. Up to two are shown, in phone frames. */
  screenshots?: string[];
  /** Optional Google Play rating, e.g. "5.0". Update by hand when it changes. */
  rating?: string;
  detail: AppDetail;
}

/** The developer page that lists every app. */
export const developerUrl = 'https://play.google.com/store/apps/developer?id=Jaimin+Kavathia';

/**
 * Jaimin's own apps on Google Play, newest first.
 * The "Apps" section and its navigation link appear automatically
 * as soon as this list has at least one entry.
 */
export const apps: AppInfo[] = [
  {
    name: 'SpotBuddy',
    subtitle: 'Find My Parked Car',
    category: 'Maps & Navigation',
    tagline: 'Never forget where you parked.',
    description:
      'Save your parking spot in one tap, then walk back to it with directions, a compass arrow and live distance, even underground where GPS gets lost. A meter timer warns you before your ticket runs out.',
    highlights: ['One-tap save', 'Meter timer', 'Home-screen widgets'],
    playUrl: 'https://play.google.com/store/apps/details?id=com.toolverse.parking',
    released: 'Nov 2026',
    tint: '#6a5cff',
    icon: 'spotbuddy.png',
    screenshots: ['spotbuddy-1.webp', 'spotbuddy-2.webp'],
    detail: {
      slug: 'spotbuddy',
      seoTitle: 'SpotBuddy: Find My Parked Car App for Android | Jaimin Kavathia',
      seoDescription:
        'SpotBuddy is a free Android app that saves your parking spot in one tap and guides you back with directions, a compass and a meter timer.',
      pageTitle: 'SpotBuddy: the *find my parked car* app ~for Android~',
      intro: [
        'Where did I park? SpotBuddy remembers for you. Tap once when you leave the car and it saves the exact spot. When you come back, it takes you there, whether that is a mall car park, a multi-storey or an underground garage.',
        'I designed, built and published SpotBuddy on my own, with Flutter. It is live on Google Play.',
      ],
      groups: [
        {
          title: 'Find your car, fast',
          items: [
            'Save your spot in one tap from the app, a home-screen widget, the Quick Settings tile or a shortcut',
            'Walking directions in Google Maps',
            'A compass arrow and live distance that keep working underground, where GPS gets lost',
            'Add the floor, zone or spot number, a photo or a note',
          ],
        },
        {
          title: 'Never overstay a meter',
          items: [
            'A parking timer with an alert before your meter or ticket runs out',
            'History and a parking cost tracker with monthly insights',
            'Share your parking location with family and friends',
          ],
        },
        {
          title: 'For every vehicle',
          items: [
            'Works for cars, bikes and scooters',
            'Home-screen widgets for status, quick save, directions and your timer',
            'Light and dark themes, with a dark map to match',
            'Distances in kilometres or miles',
          ],
        },
        {
          title: 'SpotBuddy Premium',
          items: [
            'Automatic parking detection when your car Bluetooth disconnects or your drive ends',
            'Ticket scanner: snap your parking ticket and the timer sets itself',
            'Garage trail: record your walk out of an underground car park and follow it back',
            'Recurring reminders, multiple vehicles, unlimited history with CSV export, backup and restore',
          ],
        },
        {
          title: 'Private by design',
          items: [
            'Your spots, photos, notes and vehicles stay on your phone',
            'No sign-up and no ads',
            'Location is read only when you save a spot or look for your car, never in the background',
          ],
        },
      ],
      facts: [
        { label: 'Platform', value: 'Android' },
        { label: 'Category', value: 'Maps & Navigation' },
        { label: 'Price', value: 'Free, with optional Premium' },
        { label: 'Released', value: 'November 2026' },
        { label: 'Built with', value: 'Flutter' },
      ],
      faq: [
        {
          question: 'Is SpotBuddy free?',
          answer:
            'Yes. Saving your spot, finding your car, the meter timer, history and the widgets are free, with no ads. SpotBuddy Premium is an optional monthly or yearly subscription through Google Play that adds automatic parking detection, the ticket scanner, the garage trail and more.',
        },
        {
          question: 'Does it work in underground car parks?',
          answer:
            'Yes. When GPS is lost you can follow the compass arrow and live distance back to your car. With Premium you can also record a garage trail on your walk out and follow it back.',
        },
        {
          question: 'Does SpotBuddy track my location?',
          answer:
            'No. It reads your location only when you save a spot or look for your car, and never tracks it in the background. Your spots, photos and notes stay on your phone.',
        },
        {
          question: 'Can I use it for a bike or scooter?',
          answer: 'Yes. SpotBuddy works for cars, bikes and scooters, and Premium lets you keep several vehicles.',
        },
      ],
      schemaCategory: 'TravelApplication',
    },
  },
  {
    name: 'Arrow Escape',
    subtitle: 'Tap Away Puzzle',
    category: 'Puzzle game',
    tagline: 'Tap the arrows away. Clear the board.',
    description:
      'A tap-away logic puzzle where every arrow wants off the board, but only if nothing blocks its way. 10,000 levels across 100 worlds, nine themes and a daily challenge, all playable offline.',
    highlights: ['10,000 levels', '9 themes', 'Plays offline'],
    playUrl: 'https://play.google.com/store/apps/details?id=com.toolverse.arrowescape',
    released: 'Oct 2026',
    tint: '#7b6cf6',
    icon: 'arrow-escape.png',
    screenshots: ['arrow-escape-1.webp', 'arrow-escape-2.webp'],
    detail: {
      slug: 'arrow-escape',
      seoTitle: 'Arrow Escape: Tap Away Arrow Puzzle for Android | Jaimin Kavathia',
      seoDescription:
        'Arrow Escape is a free tap-away arrow puzzle for Android with 10,000 logic levels, 9 themes and a daily challenge. Plays offline.',
      pageTitle: 'Arrow Escape: a *tap-away arrow puzzle* ~with 10,000 levels~',
      intro: [
        'Simple to learn, satisfying to escape, surprisingly difficult to master. Every arrow wants to fly off the board, but only if nothing blocks its way. Find the free arrows, tap them in the right order and watch the maze untangle. One wrong tap costs a heart.',
        'Arrow Escape is a logic puzzle game I designed, built and published on my own, with Flutter. It is live on Google Play.',
      ],
      groups: [
        {
          title: 'A journey of 10,000 levels',
          items: [
            '10,000 logic puzzles across 100 worlds in space, from Mercury to the Andromeda galaxy',
            'Boards grow from 14×14 to giant 60×60 arrow mazes',
            'Every fifth level is a picture board: hearts, cats, rockets, castles and more',
            'Earn up to 3 stars per level and open star chests in every world',
          ],
        },
        {
          title: 'Themes and arrow skins',
          items: [
            '9 themes that change the whole game: Forest, Neon City, Snow Peaks, Sunset, Deep Sea, Cherry Blossom, Volcano, Galaxy and Classic',
            '13 arrow skins, including Dragon, Train, Rocket, Snake, Lightning and Neon Tube',
            'Every theme has its own sky, board markers and win effect',
          ],
        },
        {
          title: 'Something new every day',
          items: [
            'One big daily challenge, the same puzzle for every player',
            'Daily and weekly quests, and streaks with a shield for a missed day',
            '64 achievements to unlock',
          ],
        },
        {
          title: 'Cloud save and rankings',
          items: [
            'Sign in with Google Play Games and your progress follows you to a new phone',
            'Leaderboards for highest level, total stars and best daily streak, worldwide and against friends',
          ],
        },
        {
          title: 'Relaxed, but not easy',
          items: [
            'No timers. Take as long as you need',
            'Hold any arrow to preview its path before you tap',
            'Hints when you are stuck, with satisfying sounds and gentle haptics',
            'Plays offline, with no Wi-Fi needed',
          ],
        },
      ],
      facts: [
        { label: 'Platform', value: 'Android' },
        { label: 'Category', value: 'Puzzle game' },
        { label: 'Price', value: 'Free to play' },
        { label: 'Released', value: 'October 2026' },
        { label: 'Built with', value: 'Flutter' },
      ],
      faq: [
        {
          question: 'Is Arrow Escape free?',
          answer:
            'Yes, it is free to play. Ads appear between levels, and a one-time Remove Ads purchase turns them off for good.',
        },
        {
          question: 'Can I play Arrow Escape offline?',
          answer: 'Yes. The puzzles play offline with no Wi-Fi needed.',
        },
        {
          question: 'Is there a time limit on levels?',
          answer:
            'No. There are no timers. You can hold any arrow to preview its path before you tap, and use a hint when you are stuck.',
        },
        {
          question: 'Is my progress saved if I change phones?',
          answer:
            'Yes, if you sign in with Google Play Games. Your game is saved to your Google account and comes back after a reinstall or on a new phone.',
        },
      ],
      schemaCategory: 'GameApplication',
    },
  },
  {
    name: 'PDF Tools',
    subtitle: 'PDF Editor & Scan',
    category: 'Productivity',
    tagline: 'Edit any PDF on your phone.',
    description:
      'A PDF editor, document scanner and converter in one app. Edit text, fill and sign forms, scan paper with OCR, and merge, split or compress files. Documents are processed on the phone and never uploaded.',
    highlights: ['Works offline', 'Scan with OCR', 'Fill and sign'],
    playUrl: 'https://play.google.com/store/apps/details?id=com.toolverse.pdftools.app',
    released: 'May 2026',
    tint: '#c5f135',
    icon: 'pdf-tools.png',
    screenshots: ['pdf-tools-1.webp', 'pdf-tools-2.webp'],
    rating: '5.0',
    detail: {
      slug: 'pdf-tools',
      seoTitle: 'PDF Tools: Offline PDF Editor for Android | Jaimin Kavathia',
      seoDescription:
        'PDF Tools is a free Android PDF editor, scanner and converter. Edit text, fill and sign, scan with OCR, merge and compress, all offline on your phone.',
      pageTitle: 'PDF Tools: an *offline PDF editor* ~and scanner for Android~',
      intro: [
        'PDF Tools is a PDF editor, document scanner and PDF converter in one app. Edit the text of a PDF, fill and sign forms, scan paper with OCR, convert PDF to Word and back, and merge, split or compress files.',
        'Everything happens on your phone. Your documents are never uploaded, there is no account to create, and no watermark is added to your files. I designed, built and published PDF Tools on my own, with Flutter.',
      ],
      groups: [
        {
          title: 'Edit PDF',
          items: [
            'Edit text: fix a typo or retype a line right on the page',
            'Find and replace a word everywhere in the document',
            'Add images, shapes, arrows, links and freehand drawing',
            'Highlight, underline, stamp, and redact private details for good',
          ],
        },
        {
          title: 'Fill and sign',
          items: [
            'Fill PDF forms: type in fields, tick boxes, pick from lists',
            'Draw or type your signature and place it anywhere',
            'Make a fillable form with text fields, checkboxes and signature boxes',
            'Digital signature with your own certificate',
          ],
        },
        {
          title: 'Scan to PDF and OCR',
          items: [
            'PDF scanner with automatic edge detection',
            'Make scans searchable: search, select and copy the text',
            'ID card to PDF, with front and back on one A4 page',
            'Image to PDF, QR and barcode scanner',
          ],
        },
        {
          title: 'Convert and organise',
          items: [
            'PDF to Word and Word to PDF, PDF to JPG, PNG or text',
            'Merge, split and extract pages',
            'Reorder, delete, rotate and crop pages',
            'Headers, footers, page numbers and watermarks',
          ],
        },
        {
          title: 'Compress and compare',
          items: [
            'Compress a PDF for email, WhatsApp and upload limits',
            'Compress a photo to fit a limit such as "under 200 KB"',
            'Compare two PDFs and see every word that was added or removed',
          ],
        },
        {
          title: 'Files and privacy',
          items: [
            'Works offline: editing, scanning and converting happen on your device',
            'App lock with your fingerprint, face or screen lock',
            'Add or remove a password, block printing or copying',
            'Available in 10 languages, including Hindi and Gujarati',
          ],
        },
      ],
      facts: [
        { label: 'Platform', value: 'Android phones and tablets' },
        { label: 'Category', value: 'Productivity' },
        { label: 'Price', value: 'Free, supported by ads' },
        { label: 'Released', value: 'May 2026' },
        { label: 'Built with', value: 'Flutter' },
      ],
      faq: [
        {
          question: 'Does PDF Tools work offline?',
          answer:
            'Yes. Editing, scanning and converting happen on your device, so the app works without an internet connection. Translation downloads each language pack once and then works offline too.',
        },
        {
          question: 'Are my documents uploaded anywhere?',
          answer:
            'No. Your files are processed on your phone and stay there. There is no account and no sign-up.',
        },
        {
          question: 'Is PDF Tools free, and does it add a watermark?',
          answer:
            'It is free to use and supported by ads. No watermark is added to your documents.',
        },
        {
          question: 'Can it convert a PDF to Word?',
          answer:
            'Yes. PDF to Word gives you the text and paragraphs in a .docx file, ready to edit. The original layout and tables are not kept. Word to PDF is supported as well.',
        },
      ],
      schemaCategory: 'BusinessApplication',
    },
  },
];

/** Paths and names only, for navigation and the sitemap. */
export const appLinks = apps.map((app) => ({ name: app.name, path: `/apps/${app.detail.slug}/` }));
