import { withContentCollections } from '@content-collections/next';

const httpsDomainPattern = (domain) => {
  return {
    hostname: domain,
    protocol: 'https',
    port: '',
    pathname: '**',
  };
};

/**
 * @type {import('next').NextConfig}
 */
export default withContentCollections({
  images: {
    remotePatterns: [
      httpsDomainPattern('vanenshi.com'),
      httpsDomainPattern('vercel.com'),
      httpsDomainPattern('images.unsplash.com'),
      httpsDomainPattern('images.ctfassets.net'),
      httpsDomainPattern('i.ytimg.com'),
    ],
  },
});
