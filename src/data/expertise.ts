export interface ExpertiseArea {
  id: 'platforms' | 'architecture' | 'realtime' | 'hardware' | 'native' | 'growth' | 'backend';
  title: string;
  body: string;
  tags: string[];
}

export const expertise: ExpertiseArea[] = [
  {
    id: 'platforms',
    title: 'One codebase, five platforms',
    body: 'Android, iOS, web, macOS and Windows from a single Flutter codebase, with layouts and behaviour that respect each platform.',
    tags: ['Android', 'iOS', 'Web', 'macOS', 'Windows'],
  },
  {
    id: 'architecture',
    title: 'Architecture that stays readable',
    body: 'Predictable state and clear boundaries, so features are easy to add and easy to test.',
    tags: ['BLoC', 'Cubit', 'Clean Architecture', 'GetX', 'Provider', 'MVC'],
  },
  {
    id: 'realtime',
    title: 'Real-time experiences',
    body: 'Live scores, chat and presence that stay in sync over sockets.',
    tags: ['Socket.io', 'Live scores', 'Chat'],
  },
  {
    id: 'hardware',
    title: 'IoT and connected devices',
    body: 'Apps that talk to hardware: scanning, pairing, and controlling devices nearby or across the cloud.',
    tags: ['Bluetooth LE', 'MQTT', 'NFC', 'AWS IoT'],
  },
  {
    id: 'native',
    title: 'Native when it matters',
    body: 'Platform channels into Kotlin and Swift for the things Flutter does not reach on its own.',
    tags: ['MethodChannel', 'Kotlin', 'Swift'],
  },
  {
    id: 'growth',
    title: 'Monetisation and analytics',
    body: 'Subscriptions, payments and the measurement to know what is working.',
    tags: ['In-App Purchases', 'RevenueCat', 'Mixpanel', 'Google Analytics', 'UXCam'],
  },
  {
    id: 'backend',
    title: 'Backend and cloud',
    body: 'Auth, data, storage and messaging wired up cleanly, online and offline.',
    tags: ['Firebase', 'REST APIs', 'Push Notifications', 'Google Maps', 'SQLite', 'Hive'],
  },
];

export interface SkillGroup {
  label: string;
  items: string[];
}

export const toolbox: SkillGroup[] = [
  { label: 'Languages', items: ['Dart', 'Kotlin', 'Swift'] },
  { label: 'Framework', items: ['Flutter', 'Flutter Web', 'Flutter Desktop', 'FlutterFlow'] },
  { label: 'State', items: ['BLoC', 'Cubit', 'GetX', 'Provider'] },
  { label: 'Data', items: ['REST APIs', 'Firebase', 'Socket.io', 'MQTT', 'SQLite', 'Hive'] },
  { label: 'Device', items: ['Bluetooth LE', 'NFC', 'Biometrics', 'Camera', 'Maps', 'Background audio'] },
  { label: 'Growth', items: ['RevenueCat', 'In-App Purchases', 'Mixpanel', 'Google Analytics', 'Segment'] },
  { label: 'Tooling', items: ['Android Studio', 'Xcode', 'Git', 'Jira'] },
];
