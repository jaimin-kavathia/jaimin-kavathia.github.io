export interface Milestone {
  /** Short date label shown in the margin. */
  when: string;
  title: string;
  /** Employer, school or platform, shown beside the kind label. */
  place?: string;
  body: string;
  kind: 'career' | 'education' | 'release' | 'learning';
  /** Optional recognition earned during this period. */
  award?: string;
}

export const journey: Milestone[] = [
  {
    when: '2017 – 2021',
    title: 'BE in Computer Engineering',
    place: 'SVBIT, Gujarat',
    body: 'Bachelor of Engineering at Shankersinh Vaghela Bapu Institute of Technology.',
    kind: 'education',
  },
  {
    when: 'Sep 2021',
    title: 'Flutter Developer',
    place: 'Digimonk Solutions',
    body: 'First professional Flutter apps, built closely with clients, with real-time communication and authentication integrations.',
    kind: 'career',
  },
  {
    when: 'Jan 2022',
    title: 'Flutter Developer',
    place: 'Bluepixel Technologies',
    body: 'Cross-platform apps and IoT products, including home automation, with regular code reviews to keep the quality bar high.',
    kind: 'career',
    award: 'Best Team Award, 2022',
  },
  {
    when: 'May 2023',
    title: 'Software Developer',
    place: 'Plutus Technologies',
    body: 'Agile delivery of mobile, desktop and web apps. Modernised legacy codebases, handled estimates and mentored junior developers.',
    kind: 'career',
  },
  {
    when: 'Jun 2023',
    title: 'Flutter Development Bootcamp with Dart',
    place: 'Udemy',
    body: 'Completed the full bootcamp certification.',
    kind: 'learning',
  },
  {
    when: 'May 2024',
    title: 'Software Engineer',
    place: 'Impero IT Services',
    body: 'Led design and development of production apps, drove architecture upgrades for stability, and owned releases on the App Store and Google Play.',
    kind: 'career',
    award: 'Synergic Team Award, 2025',
  },
  {
    when: 'Aug 2025',
    title: 'Flutter Developer',
    place: 'LogicRays Technologies',
    body: 'Where I work today, building cross-platform apps with Flutter.',
    kind: 'career',
  },
  {
    when: 'Sep 2025',
    title: 'Published adaptive_media_picker',
    place: 'pub.dev',
    body: 'First open-source package: media picking with permissions and limited-access support built in.',
    kind: 'release',
  },
  {
    when: 'Oct 2025',
    title: 'Published smart_permission',
    place: 'pub.dev',
    body: 'Second package: runtime permissions as a single call, with the full denied and settings flow handled.',
    kind: 'release',
  },
  {
    when: '2026',
    title: 'Three apps of my own',
    place: 'Google Play',
    body: 'PDF Tools in May, Arrow Escape in October and SpotBuddy in November. Designed, built and published independently.',
    kind: 'release',
  },
];
