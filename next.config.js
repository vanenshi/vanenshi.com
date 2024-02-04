const { withContentlayer } = require('next-contentlayer');

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
module.exports = withContentlayer({
  swcMinify: true,
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
