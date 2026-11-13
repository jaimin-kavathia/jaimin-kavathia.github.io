/**
 * Copy for /hire-flutter-developer/ and the "Work with me" teaser on the home page.
 * This page describes how Jaimin works with clients, so review it and
 * change anything that does not match how you actually take on work.
 */
import type { Question } from '../lib/schema';
import { yearsOfExperience } from './site';

export const hirePath = '/hire-flutter-developer/';

export const hireSeo = {
  title: 'Hire a Freelance Flutter Developer in India | Jaimin Kavathia',
  description: `Hire Jaimin Kavathia, a freelance Flutter developer in Ahmedabad, India. ${yearsOfExperience}+ years building Android, iOS, web and desktop apps. Remote worldwide.`,
};

export const hireIntro = [
  `I'm Jaimin Kavathia, a senior Flutter developer based in Ahmedabad, India. I take on freelance and contract work for startups and product teams: new apps, existing apps that need rescuing, and the difficult parts in between.`,
  'You work directly with the person who writes the code. No account managers, no hand-offs to a junior team.',
];

export interface Service {
  icon: 'device' | 'play' | 'code' | 'chip' | 'box' | 'star' | 'browser' | 'check';
  title: string;
  body: string;
}

export const services: Service[] = [
  {
    icon: 'device',
    title: 'Flutter app development',
    body: 'A complete app for Android and iOS from one codebase, with web, macOS and Windows when you need them. From the first screen to the store release.',
  },
  {
    icon: 'play',
    title: 'MVPs for startups',
    body: 'A focused first version you can put in front of users and investors, on an architecture that will not need a rewrite at version two.',
  },
  {
    icon: 'code',
    title: 'App rescue and modernisation',
    body: 'I take over an existing Flutter codebase: fix crashes, upgrade Flutter and its dependencies, migrate state management and clean up the architecture.',
  },
  {
    icon: 'chip',
    title: 'IoT, Bluetooth and hardware',
    body: 'Apps that talk to devices over Bluetooth LE, NFC and MQTT: scanning, pairing and controlling hardware nearby or through the cloud.',
  },
  {
    icon: 'browser',
    title: 'Real-time features',
    body: 'Chat, live scores, presence and location that stay in sync over sockets, with Firebase or your own backend.',
  },
  {
    icon: 'star',
    title: 'Payments and subscriptions',
    body: 'In-app purchases and subscriptions with RevenueCat or the store APIs, plus the analytics to see what is working.',
  },
  {
    icon: 'box',
    title: 'Packages and native bridges',
    body: 'Custom Flutter packages and platform channels in Kotlin and Swift, for when Flutter has to reach the platform. I maintain two public packages on pub.dev.',
  },
  {
    icon: 'check',
    title: 'Store releases',
    body: 'Google Play and App Store submissions, store listings, review fixes and updates. I have published my own apps as well as client ones.',
  },
];

export const steps = [
  {
    title: 'Tell me about the app',
    body: 'Send what you have: an idea, a design file, a spec or an existing codebase. I reply with questions, not a sales deck.',
  },
  {
    title: 'A clear scope and estimate',
    body: 'You get a written scope, a timeline and an estimate before any work starts, so you know what you are paying for.',
  },
  {
    title: 'Build, with working versions',
    body: 'You get builds to install and try as the app takes shape, rather than a big reveal at the end.',
  },
  {
    title: 'Release and after',
    body: 'I handle the store submissions and stay available for fixes, updates and the next round of features.',
  },
];

/** "How to choose the best Flutter developer": an honest checklist, with evidence. */
export const checklist = [
  {
    title: 'Apps you can install today',
    body: 'A portfolio of screenshots proves little. Ask for apps that are live in a store, then use them.',
    proof: 'Three of my own apps are on Google Play.',
    link: { label: 'See the apps', href: '/#apps' },
  },
  {
    title: 'Code you can read',
    body: 'Public code shows how someone structures, documents and tests their work better than any interview answer.',
    proof: 'My two Flutter packages are open source on pub.dev and GitHub.',
    link: { label: 'See the packages', href: '/#packages' },
  },
  {
    title: 'Experience with your hard part',
    body: 'Most apps have one difficult piece: hardware, real-time sync, payments or offline data. Hire someone who has shipped that piece before.',
    proof: 'I have built Bluetooth and IoT apps, real-time social and sports apps, and subscription flows.',
    link: { label: 'See my expertise', href: '/#expertise' },
  },
  {
    title: 'The person who talks is the person who builds',
    body: 'Ask who will actually write your code. With an independent developer, it is the person on the call.',
    proof: 'I do the work myself, from the first commit to the release.',
  },
  {
    title: 'Proof they can finish',
    body: 'Releasing is a skill of its own: store policies, review rejections, signing and updates.',
    proof: `${yearsOfExperience}+ years and 30+ projects delivered, with releases on both stores.`,
    link: { label: 'See my journey', href: '/#journey' },
  },
];

export const hireFaq: Question[] = [
  {
    question: 'How much does it cost to hire a Flutter developer in India?',
    answer:
      'It depends on the scope more than anything else. A small, well-defined app is a very different job from a product with real-time features, payments and hardware. Send me what you have and I will reply with a scoped estimate, with no obligation.',
  },
  {
    question: 'Do you work with clients outside India?',
    answer:
      'Yes. I am based in Ahmedabad, on India Standard Time (UTC+5:30), and work remotely. We agree on working hours that overlap with yours, and on how often we check in.',
  },
  {
    question: 'Can you take over an app that someone else started?',
    answer:
      'Yes. I have modernised legacy Flutter apps: upgrading old Flutter versions, moving to null safety, replacing the state management and cleaning up the architecture. I start by reading the code and telling you plainly what state it is in.',
  },
  {
    question: 'Which platforms can one Flutter app cover?',
    answer:
      'Android and iOS from one codebase, and the same code can also run on the web, macOS and Windows. I have shipped Flutter on all five.',
  },
  {
    question: 'Do you handle the Google Play and App Store release?',
    answer:
      'Yes. I prepare the builds, the store listings and the submissions, deal with review feedback, and publish updates afterwards.',
  },
  {
    question: 'Should I hire a freelance Flutter developer or an agency?',
    answer:
      'An agency makes sense when you need a large team at once. A freelance developer is usually the better fit for a single app, an MVP or a specific feature: you pay for senior time only, and you talk directly to the person doing the work.',
  },
];
