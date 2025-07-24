import { Achievement, Certification } from '../types';

export const achievements: Achievement[] = [
  {
    id: 'best-attendance-q2-2022',
    title: 'Best Attendance Award',
    description: '2nd Quarter (July to September - 2022)',
    date: '2022-09',
    type: 'award'
  },
  {
    id: 'best-team-q2-2022',
    title: 'Best Team Award',
    description: '2nd Quarter (July to September - 2022)',
    date: '2022-09',
    type: 'award'
  },
  {
    id: 'best-attendance-q4-2022',
    title: 'Best Attendance Award',
    description: '4th Quarter (October to December - 2022)',
    date: '2022-12',
    type: 'award'
  },
  {
    id: 'synergic-team-q2-2025',
    title: 'Synergic Team Award',
    description: '2nd Quarter (April to June - 2025)',
    date: '2025-06',
    type: 'award'
  }
];

export const certifications: Certification[] = [
  {
    id: 'flutter-bootcamp-udemy',
    title: 'The Complete Flutter Development Bootcamp with Dart',
    issuer: 'Udemy',
    date: '2023',
    credentialUrl: 'https://www.udemy.com/certificate/UC-fc8a0460-caf8-4b26-b914-cc2ade34dea4/',
    description: 'Comprehensive Flutter development course covering Dart programming, UI design, state management, and app deployment.',
    skills: ['Flutter', 'Dart', 'Mobile Development', 'Cross-platform Development']
  }
];