import { NextRouter } from 'next/router';
import { siteConfig } from 'site.config';

export function addQuery(router: NextRouter, key: string, value: string | string[]) {
  const { pathname, query } = router;
  const newQuery = {
    ...query,
    [key]: value.toString(),
  };
  router.replace({ pathname, query: newQuery }, undefined, { scroll: false });
}

export function removeQuery(router: NextRouter, key: string) {
  const { pathname, query } = router;
  const newQuery = { ...query };
  delete newQuery[key];
  router.replace({ pathname, query: newQuery }, undefined, { scroll: false });
}

export function getBaseUrl() {
  return process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : siteConfig.siteUrl;
}

export function getAbsoluteURL(path: string) {
  return getBaseUrl() + path;
}
