import { ChakraProvider } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import fontFace from 'lib/fontface';
import theme from 'lib/theme';
import { generateDefaultSeo } from 'next-seo/pages';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { siteConfig } from 'site.config';
import '../styles/prism.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>{generateDefaultSeo(siteConfig)}</Head>
      <ChakraProvider theme={theme}>
        <Global styles={fontFace} />
        <Component {...pageProps} />
      </ChakraProvider>
      <SpeedInsights />
      <Analytics />
    </>
  );
}
