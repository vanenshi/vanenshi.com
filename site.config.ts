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

const me = {
  name: 'Amir Hossein Shekari',
  nickname: 'Vanenshi',
};

const shared = {
  ...me,
  repo: 'https://github.com/vanenshi/vanenshi.com',
  editUrl: 'https://github.com/vanenshi/vanenshi.com/edit/main/data/',
  website: 'https://vanenshi.com',
  title: `${me.name} (aka ${me.nickname}) - Software Developer`,
  description:
    'UI Engineer passionate about design systems, state machines, accessibility, DX and Rust.',
  image: 'https://adebayosegun.com/static/images/banner.png',
};

export const siteConfig = {
  name: shared.name,
  nickname: shared.nickname,
  image: shared.image,
  type: 'website',
  title: shared.title,
  titleTemplate: `%s - ${shared.name}`,
  description: shared.description,
  siteUrl: shared.website,
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
    url: shared.website,
    title: shared.title,
    site_name: shared.name,
    description: shared.description,
    images: [
      {
        url: 'https://adebayosegun.com/static/images/banner.png',
        width: 1200,
        height: 630,
        alt: shared.title,
      },
    ],
  },
};
