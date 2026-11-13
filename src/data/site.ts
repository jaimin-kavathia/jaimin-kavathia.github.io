/**
 * Everything personal on the site lives in this folder.
 * Edit the values here; no component needs to change.
 */

import { apps } from './apps';

const CAREER_START = new Date('2021-09-01');

/** Whole years of professional experience, computed at build time. */
export const yearsOfExperience = Math.floor(
  (Date.now() - CAREER_START.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
);

export const site = {
  name: 'Jaimin Kavathia',
  firstName: 'Jaimin',
  lastName: 'Kavathia',
  initials: 'JK',
  role: 'Senior Flutter Developer',
  location: 'Ahmedabad, India',
  city: 'Ahmedabad',
  region: 'Gujarat',
  country: 'India',
  coordinates: '23.0225° N · 72.5714° E',
  timeZone: 'Asia/Kolkata',
  careerStartYear: 2021,

  email: 'jaiminkavathia30@gmail.com',
  phone: '+91 94266 90867',
  phoneHref: '+919426690867',

  /** Home page title and description, as shown in search results. */
  title: 'Jaimin Kavathia | Senior Flutter Developer in Ahmedabad, India',
  description: `Jaimin Kavathia is a senior Flutter developer in Ahmedabad, India: ${yearsOfExperience}+ years of Android, iOS, web and desktop apps, 2 pub.dev packages, ${apps.length} Play Store apps.`,

  /**
   * Paste the code from Google Search Console ("HTML tag" method) here to
   * verify ownership. Leave empty until you have one.
   */
  googleSiteVerification: '',
  /** Same for Bing Webmaster Tools. */
  bingSiteVerification: '',
} as const;

/**
 * Profiles that belong to the same person. They are published as structured
 * data only (schema.org "sameAs"), which is how search engines connect this
 * site to the name. They are not shown as links on the page.
 */
export const profiles = [
  'https://www.linkedin.com/in/jaimin-kavathia-flutter-developer/',
  'https://github.com/jaimin-kavathia',
  'https://medium.com/@jaiminkavathia30',
  'https://play.google.com/store/apps/developer?id=Jaimin+Kavathia',
] as const;

/** Topics the person is known for, used in structured data. */
export const knowsAbout = [
  'Flutter',
  'Dart',
  'Cross-platform mobile app development',
  'Android app development',
  'iOS app development',
  'Flutter web and desktop',
  'BLoC state management',
  'Clean Architecture',
  'Firebase',
  'REST APIs',
  'Bluetooth Low Energy',
  'MQTT and IoT apps',
  'NFC',
  'In-app purchases',
  'Open-source Flutter packages',
] as const;

export const stats = [
  { value: yearsOfExperience, suffix: '+', label: 'Years with Flutter' },
  { value: 30, suffix: '+', label: 'Projects delivered' },
  { value: 2, suffix: '', label: 'Packages on pub.dev' },
  { value: apps.length, suffix: '', label: 'Apps on Google Play' },
] as const;

/** Tech names that scroll past under the hero. */
export const marquee = [
  'Flutter',
  'Dart',
  'BLoC',
  'Clean Architecture',
  'Firebase',
  'REST APIs',
  'Socket.io',
  'Bluetooth LE',
  'MQTT',
  'NFC',
  'In-App Purchases',
  'RevenueCat',
  'Push Notifications',
  'Platform Channels',
  'GetX',
  'Provider',
] as const;
