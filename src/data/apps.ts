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
  },
];
