import { writeFileSync } from 'fs';
import { globby } from 'globby';
import prettier from 'prettier';
import {
  allBlogs,
  allNewsletters,
  allSnippets,
} from '../.contentlayer/generated/index.mjs';
import baseConfig from '../base-config.js';

function url(route, lastmod) {
  return `
    <url>
      <loc>${baseConfig.siteUrl}${route}</loc>
      ${lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ''}
    </url>
  `;
}

async function generate() {
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js');

  // static, non-dynamic pages
  const pageFiles = await globby([
    'pages/**/*.tsx',
    '!pages/_*',
    '!pages/_*/**',
    '!pages/api/**',
    '!pages/404.tsx',
    '!pages/**/[[]*', // dynamic routes ([slug].tsx) — handled from contentlayer below
  ]);
  const staticRoutes = pageFiles.map((page) => {
    const path = page.replace(/^pages/, '').replace(/\.tsx$/, '');
    return path === '/index' ? '' : path.replace(/\/index$/, '');
  });

  const entries = [
    ...staticRoutes.map((route) => url(route)),
    ...allBlogs.map((doc) => url(`/blog/${doc.slug}`, doc.updatedAt ?? doc.publishedAt)),
    ...allNewsletters.map((doc) => url(`/newsletter/${doc.slug}`, doc.publishedAt)),
    ...allSnippets.map((doc) => url(`/snippets/${doc.slug}`)),
  ];

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${entries.join('')}
    </urlset>
  `;

  const formatted = prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
    printWidth: 500, // keep long URLs on one line — whitespace inside <loc> trips some crawlers
  });

  writeFileSync('public/sitemap.xml', formatted);
}

generate();
