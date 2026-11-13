export interface Milestone {
  /** Short date label shown in the margin. */
  when: string;
  title: string;
  body: string;
  kind: 'career' | 'award' | 'release' | 'learning';
}

export const journey: Milestone[] = [
  {
    when: 'Sep 2021',
    title: 'Started as a Flutter Developer',
    body: 'First production apps in Flutter and Dart. The beginning of working on mobile full time.',
    kind: 'career',
  },
  {
    when: '2022',
    title: 'Best Team Award',
    body: 'Recognised along with the team for the July to September 2022 quarter.',
    kind: 'award',
  },
  {
    when: '2023',
    title: 'Flutter Development Bootcamp with Dart',
    body: 'Completed the full bootcamp certification on Udemy.',
    kind: 'learning',
  },
  {
    when: 'Jun 2025',
    title: 'Synergic Team Award',
    body: 'Team recognition for the April to June 2025 quarter.',
    kind: 'award',
  },
  {
    when: 'Sep 2025',
    title: 'Published adaptive_media_picker',
    body: 'First open-source package on pub.dev: media picking with permissions and limited-access support built in.',
    kind: 'release',
  },
  {
    when: 'Oct 2025',
    title: 'Published smart_permission',
    body: 'Second package: runtime permissions as a single call, with the full denied and settings flow handled.',
    kind: 'release',
  },
  {
    when: 'Oct 2026',
    title: 'adaptive_media_picker 2.0 and smart_permission 1.1',
    body: 'Major new versions of both packages, published on the same day.',
    kind: 'release',
  },
  {
    when: 'Now',
    title: 'Senior Flutter Developer',
    body: 'Building cross-platform apps, maintaining two open-source packages, and publishing my own apps on Google Play.',
    kind: 'career',
  },
];
