# vanenshi.com

Personal portfolio + blog. Next.js (pages router), Contentlayer (MDX in `data/`), Chakra UI, deployed on Vercel.

- `yarn dev` — dev server. `yarn build` — contentlayer + next build + RSS (`scripts/rss.mjs`) + sitemap (`scripts/sitemap.mjs`). RSS/sitemap are chained into `build` directly — do NOT move them to a `postbuild` hook: yarn 4 (Berry) does not run npm lifecycle hooks, so Vercel would silently skip them.
- New post: `yarn create:blog` (plop template), content lives in `data/blog/*.mdx`.
- Site-wide config in `site.config.ts` / `base-config.js` (siteUrl, profiles, titleTemplate).
- **Node 20 pin is load-bearing** (`engines`, `.nvmrc`). Contentlayer's generated `index.mjs` uses `assert { type: 'json' }`, removed in node ≥ 22.12, so `scripts/rss.mjs`/`sitemap.mjs` break on newer node. Bumping node means first migrating off contentlayer (unmaintained) or switching the scripts to read `.contentlayer/generated/*/_index.json` via `fs`. Node 20 is past EOL (April 2026) — this migration is the pending follow-up.

## SEO

Every blog post must ship with full SEO metadata. The plumbing lives in
`components/seo.tsx` (next-seo + `ArticleJsonLd`) and is wired in
`pages/blog/[slug].tsx`.

Rules when creating or editing posts:

1. **Frontmatter is the source of truth.** Required: `title`, `description`,
   `publishedAt`, `image`, `tags`. Optional: `updatedAt` — set it whenever a
   post gets a meaningful content update (feeds `dateModified` in JSON-LD and
   `article:modified_time` in OG tags).
2. **Description**: unique per post, 140–160 chars, phrased around the search
   query the post answers. Never reuse the site default.
3. **Title**: match search intent — write it as the question/phrase someone
   would type, not a clever pun. Keep the primary keyword near the front.
4. **Canonical**: pages pass `path` to `<SEO>`; any new page type must do the
   same or it ships without canonical/og:url.
5. **Internal links**: every new post links to 2–3 related existing posts,
   and at least one older post is edited to link back to the new one.
6. **Headings**: one `h1` (the page title, rendered by the layout); body
   starts at `h2`. Don't skip levels.
7. **Images**: descriptive `alt` text always; hero image required in
   frontmatter (used for OG + JSON-LD).
8. **Structured data**: blog posts get Article JSON-LD automatically via
   `<SEO post={...}>` — don't hand-roll `<script type="application/ld+json">`.
9. After adding/renaming posts, sitemap and RSS regenerate on build — no
   manual step, but slugs are permanent once published (renaming breaks URLs;
   if unavoidable, add a redirect in `next.config.js`).
