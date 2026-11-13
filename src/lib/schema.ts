/**
 * Builders for the schema.org structured data that each page publishes.
 * Everything hangs off one Person node, identified by `${origin}/#person`,
 * so search engines read the whole site as being about the same person.
 */
import { knowsAbout, profiles, site } from '../data/site';

type Node = Record<string, unknown>;

const abs = (origin: URL, path: string) => new URL(path, origin).href;
export const personId = (origin: URL) => abs(origin, '/#person');
export const websiteId = (origin: URL) => abs(origin, '/#website');

export function personNode(origin: URL, image: string): Node {
  return {
    '@type': 'Person',
    '@id': personId(origin),
    name: site.name,
    givenName: site.firstName,
    familyName: site.lastName,
    jobTitle: site.role,
    description: site.description,
    url: abs(origin, '/'),
    image,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: 'IN',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Shankersinh Vaghela Bapu Institute of Technology',
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Flutter Developer',
      occupationLocation: { '@type': 'Country', name: site.country },
      skills: knowsAbout.join(', '),
    },
    knowsAbout: [...knowsAbout],
    sameAs: profiles.map((profile) => profile.href),
  };
}

export function websiteNode(origin: URL): Node {
  return {
    '@type': 'WebSite',
    '@id': websiteId(origin),
    url: abs(origin, '/'),
    name: site.name,
    alternateName: `${site.name}, Flutter Developer`,
    description: site.description,
    inLanguage: 'en',
    publisher: { '@id': personId(origin) },
  };
}

export function profilePageNode(origin: URL, modified: string): Node {
  return {
    '@type': 'ProfilePage',
    '@id': abs(origin, '/#profile'),
    url: abs(origin, '/'),
    name: site.title,
    isPartOf: { '@id': websiteId(origin) },
    about: { '@id': personId(origin) },
    mainEntity: { '@id': personId(origin) },
    dateModified: modified,
    inLanguage: 'en',
  };
}

export function webPageNode(origin: URL, path: string, name: string, description: string, modified: string): Node {
  return {
    '@type': 'WebPage',
    '@id': `${abs(origin, path)}#page`,
    url: abs(origin, path),
    name,
    description,
    isPartOf: { '@id': websiteId(origin) },
    about: { '@id': personId(origin) },
    author: { '@id': personId(origin) },
    dateModified: modified,
    inLanguage: 'en',
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbNode(origin: URL, crumbs: Crumb[]): Node {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: abs(origin, crumb.path),
    })),
  };
}

export interface Question {
  question: string;
  answer: string;
}

export function faqNode(questions: Question[]): Node {
  return {
    '@type': 'FAQPage',
    mainEntity: questions.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function graph(nodes: Node[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes });
}
