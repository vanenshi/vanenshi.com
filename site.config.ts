import * as baseConfig from './base-config';

export const tags = [
  'finance',
  'hiring',
  'career',
  'software',
  'design',
  'interview',
  'speaking',
  'design-system',
  'accessibility',
  'state-machine',
  'react',
  'jest',
  'testing',
  'component',
  'open-source',
  'tips',
  'github-actions',
  'ci',
];

const shared = {
  ...baseConfig,
  repo: 'https://github.com/vanenshi/vanenshi.com',
  editUrl: 'https://github.com/vanenshi/vanenshi.com/edit/main/data/',
  title: `${baseConfig.name} (aka ${baseConfig.nickname}) - Software Developer`,
  description:
    'UI Engineer passionate about design systems, state machines, accessibility, DX and Rust.',
  image: `${baseConfig.siteUrl}/static/images/banner.png`,
} as const;

export const siteConfig = {
  name: shared.name,
  nickname: shared.nickname,
  image: shared.image,
  type: 'website',
  title: shared.title,
  titleTemplate: `%s - ${shared.name}`,
  description: shared.description,
  siteUrl: shared.siteUrl,
  profiles: {
    github: 'https://github.com/vanenshi',
    twitter: 'https://twitter.com/vanenshi',
    linkedin: 'https://linkedin.com/in/vanenshi',
    email: 'mailto:vanenshi@gmail.com',
  },
  repo: {
    url: shared.repo,
    editUrl: shared.editUrl,
  },
  twitter: {
    handle: '@vanenshi',
    site: '@vanenshi',
    cardType: 'summary_large_image',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: shared.siteUrl,
    title: shared.title,
    site_name: shared.name,
    description: shared.description,
    images: [
      {
        url: `${shared.siteUrl}/static/images/banner.png`,
        width: 1200,
        height: 630,
        alt: shared.title,
      },
    ],
  },
} as const;
