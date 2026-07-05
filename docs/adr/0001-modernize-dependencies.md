# 0001. Modernize dependencies — Content Collections for content, stay on Chakra v2

- **Status:** accepted
- **Date:** 2026-07-05
- **Deciders:** Amir Shekari

## Context

The site's content pipeline was built on `contentlayer` 0.3.4, which is
abandoned. Its code generation emits `import ... assert { type: 'json' }`
statements that the RSS and sitemap scripts consumed directly; import
assertions were removed in Node ≥ 22.12, which effectively pinned the whole
project to Node 20 (past EOL since April 2026). Around that pin, the rest of
the stack had also drifted three or more majors behind: Next.js 13, React 18,
ESLint 8, TypeScript 5, Prettier 2, plus a set of dependencies with zero
source imports.

Chakra UI v3 is a ground-up rewrite whose migration would touch all 31 files
that import Chakra components — high regression risk for a working portfolio,
so it forced an explicit stay-or-migrate decision.

## Decision

- Replace contentlayer with **Content Collections**
  (`@content-collections/{core,mdx,next,cli}` + Zod schemas) — the closest
  1:1 successor, actively maintained. Field names of all computed fields
  (`slug`, `readingTime`, `editUrl`, `tweetUrl`, `params`, `ogImageUrl`) are
  preserved so consumers only needed import-path changes.
- Rewrite `scripts/rss.mjs` and `scripts/sitemap.mjs` to import Content
  Collections' generated per-collection modules — no import assertions, so
  the scripts are node-version-agnostic. This removes the root cause of the
  Node 20 pin.
- Bump Node to 22 LTS, migrate the package manager from Yarn 4 (Berry) to
  pnpm, and upgrade Next.js → 16, React → 19, next-seo → 7, ESLint → 9 with
  flat config, TypeScript → 6, Prettier → 3, plus remaining minors.
- **Stay on Chakra UI v2** (bumped to 2.10.x, React 19 compatible);
  `framer-motion` stays as its peer dependency.

## Alternatives considered

- **contentlayer2 fork** — rejected: still a small fork of an abandoned tool.
- **Velite / next-mdx-remote** — rejected: Velite is roughly the same effort
  as Content Collections with less Next.js wiring; next-mdx-remote is a
  bigger paradigm shift that loses typed generated collections.
- **Chakra v3 now** — rejected: large rewrite, marginal benefit, high risk
  for a personal site; revisit as its own project.
- **ESLint 10** (planned) — deferred to ESLint 9: `eslint-config-next@16`'s
  plugin stack (notably `eslint-plugin-react`) crashes under ESLint 10 at
  runtime despite permissive peer ranges. ESLint 9 with flat config achieves
  the goal (legacy `.eslintrc` retired); bump to 10 once the Next config
  stack supports it.

## Consequences

## **Positive:**

- Only maintained dependencies remain; the Node version is unpinned and the
  import-assertion fragility is gone.
- Content model unchanged (field names preserved) → minimal consumer churn;
  slugs, sitemap, and RSS output are identical.
- pnpm's strict `node_modules` surfaced and fixed one phantom dependency
  (`unified`).

## **Negative / accepted trade-offs:**

- Chakra v2 is effectively end-of-life — **known debt**. Ceiling: future
  React compatibility and security maintenance of v2. Follow-up: a dedicated
  Chakra v3 (or replacement) migration plan.
- ESLint stays on 9.x until the Next.js config ecosystem is ESLint-10-clean.
- Two new `react-hooks` v7 rules (`static-components`, `refs`) are disabled
  in `eslint.config.mjs`; they flag the long-standing `useMDXComponent`
  pattern and `lib/debounce`. Revisit if those files are rewritten.

## **Follow-ups:**

- Chakra v3 migration plan (tracked debt above).
- Replace `rehype-prism-plus` with shiki (pre-existing `todo.md` item).
