/**
 * Everything personal on the site lives in this folder.
 * Edit the values here; no component needs to change.
 */

const CAREER_START = new Date('2021-09-01');

/** Whole years of professional experience, computed at build time. */
export const yearsOfExperience = Math.floor(
  (Date.now() - CAREER_START.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
);

export const site = {
  name: 'Jaimin Kavathia',
  firstName: 'Jaimin',
  initials: 'JK',
  role: 'Senior Flutter Developer',
  location: 'Ahmedabad, India',
  coordinates: '23.0225° N · 72.5714° E',
  timeZone: 'Asia/Kolkata',
  careerStartYear: 2021,

  email: 'jaiminkavathia30@gmail.com',
  phone: '+91 94266 90867',
  phoneHref: '+919426690867',

  title: 'Jaimin Kavathia — Senior Flutter Developer',
  description: `Senior Flutter Developer with ${yearsOfExperience}+ years building cross-platform apps for Android, iOS, web and desktop. Author of the smart_permission and adaptive_media_picker packages on pub.dev.`,
} as const;

export const stats = [
  { value: yearsOfExperience, suffix: '+', label: 'Years with Flutter' },
  { value: 25, suffix: '+', label: 'Projects delivered' },
  { value: 2, suffix: '', label: 'Packages on pub.dev' },
  { value: 5, suffix: '', label: 'Platforms shipped' },
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
