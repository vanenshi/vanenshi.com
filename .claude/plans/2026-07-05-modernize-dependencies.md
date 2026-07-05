---
status: done # draft -> approved -> done
date: 2026-07-05
adr: 0001 # docs/adr/0001-modernize-dependencies.md
skills: [react19-source-patterns, run, verify, code-review]
---

# Modernize dependencies — retire legacy, bring the stack current

## 1. Goal & scope

Bring the portfolio's toolchain to current (July 2026) versions: remove dead
dependencies, replace the abandoned **contentlayer** with **Content Collections**,
and upgrade Next/React/ESLint/TS/Prettier and the rest. This unpins Node 20 and
removes the last unmaintained core dependency.

Two decisions are settled (see §3): **stay on Chakra UI v2** (bump to latest 2.x,
skip the v3 rewrite) and migrate content to **Content Collections** (not the
contentlayer2 fork, not Velite). Delivery is **phased** — each phase builds + runs
green before the next.

**In scope:**
- Remove unused deps: `@sendgrid/client`, `@sendgrid/mail`, `swr`, `global`, `localtunnel`, `@types/localtunnel`, `@chakra-ui/cli` (verify last one).
- contentlayer → Content Collections (`@content-collections/{core,mdx,next,cli}` + `zod`), rewrite `contentlayer.config.ts`, all typed imports, MDX render hook, `next.config.js`, `tsconfig.json` alias, and rss/sitemap scripts.
- Bump Node 20 → 22 LTS (`.nvmrc`, `engines`).
- Migrate package manager **Yarn 4 (Berry) → pnpm**: replace `yarn.lock`/`.yarnrc.yml`/`.yarn/` with `pnpm-lock.yaml`, set `packageManager` field, update scripts + docs.
- **Upgrade Next.js itself 13 → 16** (the centerpiece bump), React 18 → 19, `next-seo` 5 → 7, ESLint 8 → 10 (flat config), TypeScript 5 → 6, Prettier 2 → 3, and remaining minor/patch deps.
- Bump Chakra UI v2.5 → latest v2.10.x (React 19 compatible). **Keep `framer-motion`** (Chakra v2 peer dep).

**Out of scope:**
- Chakra v3 migration — deliberately deferred (tracked debt, see §6/§8).
- Replacing `rehype-prism-plus` with shiki (`todo.md` item) — separate concern.
- Any content/copy or visual redesign.

## 2. Codebase findings

| Where | Fact that matters |
|---|---|
| `package.json:20-64` | Dead: `@sendgrid/*`, `swr`, `global`, `localtunnel`, `@types/localtunnel` — zero source imports. `@chakra-ui/cli` has no script usage (verify). |
| `package.json:31` | `framer-motion` has **no direct imports** but is Chakra v2's peer — must stay while on v2. |
| `package.json:66-68` | `engines.node: 20.x`; `.nvmrc` = `v20`. Next 16 needs node `>=20.9`; CC removes the import-assertion blocker → bump to 22 LTS. |
| `contentlayer.config.ts:1-166` | 6 doc types (Blog, Talk, Newsletter, Snippet, Project, Testimonial) + 6 computed fields (readingTime, slug, editUrl, tweetUrl, params, ogImageUrl). Rehype/remark plugins wired in `makeSource`. All map to CC `transform` + `compileMDX`. |
| 13 files import `contentlayer/generated` directly | Typed `allX` + types; plus `next-contentlayer/hooks` `useMDXComponent` in 3 of them (`pages/blog/[slug].tsx:14`, `pages/snippets/[slug].tsx:12`, `components/project-card.tsx:3`). `pages/index.tsx` + `pages/blog/index.tsx` go through `lib/contentlayer-utils` only. |
| `tsconfig.json:24-25` | Path alias `contentlayer/generated` → `./.contentlayer/generated`. Becomes `content-collections` → `./.content-collections/generated`. |
| `next.config.js:1,15` | Wrapped in `withContentlayer(...)` → becomes `withContentCollections(...)` (outermost). |
| `scripts/rss.mjs:3`, `scripts/sitemap.mjs:4-9` | Import `../.contentlayer/generated/index.mjs`. **This is the node-20 pin's root cause** (import assertions). Rewrite to read CC's generated JSON via `fs` → node-version-proof. |
| `scripts/sitemap.mjs:51` | `prettier.format(...)` called sync — Prettier 3 makes it **async**; needs `await`. |
| `package.json:12` | `build: contentlayer build && next build && yarn rss && yarn sitemap` — swap `contentlayer build` → `content-collections build`. Keep rss/sitemap chained (CLAUDE.md: yarn 4 skips lifecycle hooks). |
| `.yarnrc.yml`, `.yarn/releases/yarn-4.1.0.cjs`, `yarn.lock` | Yarn 4 Berry with `nodeLinker: node-modules`. No `packageManager` field in `package.json`. Migrating to pnpm: `pnpm import` converts the lockfile; delete `.yarnrc.yml` + `.yarn/`; Vercel auto-detects pnpm from `pnpm-lock.yaml` + `packageManager`. |
| `CLAUDE.md:5`, `package.json:12` | Build chains rss/sitemap directly into `build` because yarn 4 skips npm lifecycle hooks. pnpm also does not run `pre`/`post` scripts by default — **keep the chained build**, just re-word the doc note. |
| `.eslintrc:1-7` | Legacy eslintrc (`extends: next`). ESLint 10 + `eslint-config-next` 16 need flat config `eslint.config.mjs`. `next lint` is deprecated/removed in Next 16 → run `eslint` directly. |
| `lib/contentlayer-utils.ts:30` | Stray `console.log(allTestimonials)` — remove during migration. |
| `pages/api/open-graph-image.tsx` | Uses `satori` (0.4→0.26) + `@resvg/resvg-js`. OG generation — verify API after bump. |
| `components/seo.tsx`, `pages/_app.tsx` | Only `next-seo` consumers (`NextSeo`, `DefaultSeo`, `ArticleJsonLd`) — verify v7 API. |

**Latest versions (verified via npm, 2026-07-05):** next 16.2.10 · react 19.2.7 · @chakra-ui/react 3.36 (staying 2.10.x) · next-seo 7.2 · eslint 10.6 · eslint-config-next 16.2.10 · typescript 6.0.3 · @content-collections/core 0.15.2 / next 0.2.11 · satori 0.26 · sharp 0.35.3 · @vercel/analytics 2.0.1.

## 3. Assumptions & open questions

**Decisions settled (grill):**
- Chakra: **stay v2** (bump to 2.10.x), defer v3.
- Contentlayer replacement: **Content Collections**.
- Delivery: **phased**.
- Node target: **22 LTS** (safe once CC removes import-assertion dependence).

**Safe assumptions:**
- Content Collections' `useMDXComponent` (from `@content-collections/mdx/react`) is a drop-in for the contentlayer hook; compiled body field renamed `body.code` → `mdx`.
- CC generates JSON per collection under `.content-collections/generated/` that rss/sitemap can read via `fs`.
- Pages router still supported in Next 16 (deprecation warnings acceptable; no app-router migration).

**Residual risks / unknowns for reviewer:**
- `@chakra-ui/cli` removal — confirm nothing (e.g. a hidden token-gen step) needs it before deleting.
- `next-seo` v5→v7 may rename props on `ArticleJsonLd`/`NextSeo`; verify `components/seo.tsx` compiles.
- `satori` 0.4→0.26 and rehype/remark plugin majors (remark-gfm 3→4, rehype-* ) may have API/ESM changes surfaced only at build.
- Chakra v2.10.x + React 19: officially supported, but watch for `useColorMode`/SSR hydration warnings.

**Bookkeeping:** No `CONTEXT.md` change — this is infra work, introduces no new domain vocabulary.

## 4. Implementation tasks

### Phase A — Remove dead weight (zero behavior change)

- [x] **A1. Drop unused dependencies**
  - Files: `package.json`
  - Change: remove `@sendgrid/client`, `@sendgrid/mail`, `swr`, `global`, `localtunnel`, `@types/localtunnel`. Run `yarn` to update lockfile.
  - Verify `@chakra-ui/cli` is unreferenced, then remove it too; if in doubt, leave it for a follow-up.
- [x] **A2. Remove stray debug log**
  - Files: `lib/contentlayer-utils.ts:30`
  - Change: delete `console.log(allTestimonials)`.
- [x] **A3. Build + smoke check**
  - Verify: `yarn build` green, `yarn dev` renders home/blog/snippets.

### Phase B — contentlayer → Content Collections

- [x] **B1. Install Content Collections, remove contentlayer**
  - Files: `package.json`
  - Change: add `@content-collections/core`, `@content-collections/mdx`, `@content-collections/next`, `@content-collections/cli`, `zod`; remove `contentlayer`, `next-contentlayer`.
- [x] **B2. Author `content-collections.ts`**
  - Files: `content-collections.ts` (new), delete `contentlayer.config.ts`
  - Change: define the 6 collections with Zod schemas mirroring `contentlayer.config.ts` fields. Move the 6 computed fields + `ogImageUrl` into each collection's `transform`; call `compileMDX(ctx, doc, { remarkPlugins, rehypePlugins })` with the same plugin list.
  - Keep field names identical (`slug`, `readingTime`, `editUrl`, `tweetUrl`, `params`, `ogImageUrl`) so consumers need only import-path changes.
- [x] **B3. Wire Next plugin + tsconfig alias**
  - Files: `next.config.js`, `tsconfig.json`
  - Change: replace `withContentlayer` with `withContentCollections` (outermost). Swap tsconfig path `contentlayer/generated` → `content-collections` → `./.content-collections/generated`. Add `.content-collections` to `.gitignore` (mirror `.contentlayer`).
- [x] **B4. Update all typed imports (13 files)**
  - Files: `components/{testimonial-card,featured-blog-card,blog-card,project-card,snippet-card,talk-card}.tsx`, `lib/{contentlayer-utils,use-blog-search,use-snippet-search,use-talk-search}.ts`, `pages/projects/index.tsx`, `pages/blog/[slug].tsx`, `pages/snippets/[slug].tsx` (`pages/index.tsx` + `pages/blog/index.tsx` import via `contentlayer-utils` — no change unless the rename below happens)
  - Change: `from 'contentlayer/generated'` → `from 'content-collections'`; type names may change (`Blog` → the CC-generated type) — align to CC's exported types.
  - Consider renaming `lib/contentlayer-utils.ts` → `lib/content-utils.ts` (update 3 importers) — optional, keep if time-boxed.
- [x] **B5. Swap the MDX render hook (3 files)**
  - Files: `pages/blog/[slug].tsx:14,19`, `pages/snippets/[slug].tsx:12,16`, `components/project-card.tsx:3,15`
  - Change: `import { useMDXComponent } from 'next-contentlayer/hooks'` → `from '@content-collections/mdx/react'`; pass `doc.mdx` instead of `doc.body.code`.
- [x] **B6. Rewrite rss/sitemap to read generated JSON**
  - Files: `scripts/rss.mjs:3`, `scripts/sitemap.mjs:4-9`
  - Change: replace the `.contentlayer/generated/index.mjs` import with `fs.readFileSync` of `.content-collections/generated/<collection>.json` (JSON.parse). Removes import-assertion dependence entirely (root-cause fix, unblocks any node version).
  - Do NOT touch `scripts/sitemap.mjs:51` sync `prettier.format` here — Prettier is still v2 in Phase B; the `await` fix lands with the Prettier 3 bump in D3 (explicit dependency).
- [x] **B7. Update build script**
  - Files: `package.json:12`
  - Change: `contentlayer build` → `content-collections build`.
- [x] **B8. Verify content pipeline**
  - Verify: `yarn build` regenerates content; blog post pages, snippets, projects render MDX; `public/feed.xml` + `public/sitemap.xml` regenerate with correct URLs.

### Phase C — Node bump + pnpm migration

- [x] **C1. Bump Node to 22 LTS**
  - Files: `.nvmrc` (`v22`), `package.json` `engines.node` → `22.x`.
  - Depends on B6 (import-assertion fix). Update `CLAUDE.md` note that pinned node 20.
  - Verify: build green on node 22.
- [x] **C2. Migrate Yarn 4 → pnpm**
  - Files: `package.json`, `pnpm-lock.yaml` (new), delete `yarn.lock`, `.yarnrc.yml`, `.yarn/`
  - Change: `pnpm import` (converts yarn.lock → pnpm-lock.yaml), then delete yarn artifacts; add `"packageManager": "pnpm@<latest>"`; swap `yarn rss` / `yarn sitemap` inside the `build` script to `pnpm rss` / `pnpm sitemap`; update `CLAUDE.md` (`yarn dev`→`pnpm dev` etc., re-word the lifecycle-hook note: pnpm also skips pre/post by default → keep chained build).
  - Verify: `pnpm install` clean, `pnpm build` green, Vercel detects pnpm (lockfile + packageManager).

### Phase D — Framework & tooling upgrades

- [x] **D1. Next.js 13 → 16 + React 18 → 19 (the core upgrade)**
  - Files: `package.json` (`react`, `react-dom` → 19.x, `@types/react` → 19, `next` → 16, `eslint-config-next` → 16)
  - Change: bump, run codemods (`npx @next/codemod@latest upgrade`), fix breaking APIs. Load `react19-source-patterns` skill.
  - Verify: `yarn build`, then `yarn dev` — check hydration, images (`next/image` in 13 files), OG route.
- [x] **D2. next-seo 5 → 7**
  - Files: `package.json`, `components/seo.tsx`, `pages/_app.tsx`
  - Change: bump; adjust `NextSeo`/`DefaultSeo`/`ArticleJsonLd` props to v7 API.
- [x] **D3. TypeScript 5 → 6 + Prettier 2 → 3**
  - Files: `package.json`, `scripts/sitemap.mjs:51` (await async `format`)
  - Change: bump; fix any new type errors; make sitemap prettier call `await`ed (deferred from B6 — Prettier 2's `format` is sync).
- [x] **D4. ESLint 8 → 10 flat config**
  - Files: `eslint.config.mjs` (new), delete `.eslintrc`, `package.json` (`lint` script → `eslint .`)
  - Change: port `extends: next` + the 2 rule overrides to flat config via `eslint-config-next` flat export. `next lint` is gone in Next 16.
- [x] **D5. Chakra v2.5 → v2.10.x + remaining minor bumps**
  - Files: `package.json`
  - Change: bump `@chakra-ui/react`, `@emotion/*`, `framer-motion` (keep), plus `satori`, `@resvg/resvg-js`, `sharp`, `@vercel/analytics`, `@vercel/speed-insights`, `match-sorter`, `github-slugger`, `globby`, `plop`, `reading-time`, `rss`, `remark-gfm`, `rehype-*`, `vercel`.
  - Verify OG route + MDX code blocks (rehype-prism) still render.
- [x] **D6. Final full verification**
  - Verify: see §5.

## 5. Definition of done

- [ ] No unused deps remain — verify: `yarn build` clean; grep confirms removed packages have no imports.
- [ ] Content renders via Content Collections — verify: blog/snippet/project pages render MDX; `.content-collections/generated` present; no `contentlayer` imports remain (`grep -rn contentlayer` empty except history).
- [ ] `public/feed.xml` + `public/sitemap.xml` regenerate correctly — verify: `yarn build` then inspect both files for expected post URLs.
- [ ] Runs on Node 22 — verify: `node -v` 22, `pnpm build` + `pnpm dev` green.
- [ ] pnpm is the package manager — verify: `pnpm-lock.yaml` present; `yarn.lock`, `.yarnrc.yml`, `.yarn/` gone; `packageManager` set; `pnpm install && pnpm build` clean.
- [ ] Next 16 / React 19 app boots — verify: `pnpm dev`, load home, blog index, a post, snippets, projects; no console hydration errors.
- [ ] Lint passes on flat config — verify: `pnpm lint` (eslint) exits 0.
- [ ] OG image route works — verify: hit `/api/open-graph-image` with a title param, returns PNG.
- [ ] Type-check clean — verify: `tsc --noEmit` (or `next build`'s type step) passes.
- [ ] (No test suite exists — verification is build + type-check + manual smoke. Adding tests is a future add-on.)

## 6. Risk & rollback

| Risk | Severity | Mitigation |
|---|---|---|
| Content Collections `transform` misses a computed field → runtime undefined | high | B2 mirrors all 6 fields with identical names; B8 renders every page type before moving on. |
| Next 13→16 (3 majors) breaks pages-router/image/OG | high | Phased; run official codemods; verify build + dev each phase; rollback is per-phase git revert. |
| next-seo/satori/rehype API drift surfaces only at build | med | Isolated to D2/D5 with dedicated verify steps; each is its own commit. |
| Chakra v2.10 + React 19 hydration warnings | med | Chakra v2.10 officially supports React 19; smoke-check color mode + SSR. |
| Removing `@chakra-ui/cli` breaks a hidden step | low | Verify unreferenced before delete (A1); trivially re-addable. |
| Yarn→pnpm changes hoisting → phantom-dep breakage at build | med | pnpm's strict node_modules surfaces undeclared imports; fix by declaring the dep. `pnpm import` preserves resolved versions. Vercel auto-detects via lockfile. |

- **Rollback:** each phase is a separate commit on a feature branch; revert the offending commit. Lockfile + `package.json` restore prior versions.
- **Irreversible:** none. No data, schema, or public-URL changes (slugs preserved; sitemap/RSS regenerate identically).

## 7. Skills Needed

- `react19-source-patterns` — for: D1 — why: React 18→19 source migration (ref handling, context, API changes).
- `run` — for: A3, B8, C1, D6 — why: launch the app to confirm pages render after each phase.
- `verify` — for: D6 and every phase's verify step — why: run the app and observe behavior against the definition of done.
- `code-review` — for: post-D6 — why: review the full diff for correctness before merge.

## 8. ADR (compressed — /plan-execute expands)

- **Title:** Modernize dependencies — Content Collections for content, stay on Chakra v2.
- **Context:**
  - `contentlayer` 0.3.4 is abandoned and pins Node 20 via import-assertion codegen consumed by rss/sitemap scripts.
  - Whole stack is 3+ majors behind (Next 13, React 18, ESLint 8, TS 5).
  - Chakra v3 is a full rewrite touching 31 files with high regression risk for a working portfolio.
- **Decision:**
  - Replace contentlayer with **Content Collections** (closest 1:1 successor, actively maintained, Zod schemas).
  - Rewrite rss/sitemap to read generated JSON via `fs` — removes import-assertion dependence, unblocks Node 22.
  - Upgrade Next→16, React→19, ESLint→10 (flat), TS→6, Prettier→3, and minors.
  - **Stay on Chakra v2** (bump to 2.10.x); defer v3 as tracked debt.
- **Alternatives:**
  - contentlayer2 fork — rejected: still a small fork of an abandoned tool.
  - Velite / next-mdx-remote — rejected: Velite ≈ same effort as CC with less Next wiring; next-mdx-remote is a bigger paradigm shift (loses typed generated collections).
  - Chakra v3 now — rejected: large rewrite, marginal benefit, high risk; revisit separately.
- **Consequences:**
  - + Only maintained deps; Node unpinned; import-assertion fragility gone.
  - + Content model unchanged (field names preserved) → minimal consumer churn.
  - − Chakra v2 is EOL-ish → **known debt**: v3 migration remains a future task (ceiling: security/React-compat of v2; follow-up: dedicated v3 plan).

## Execution log

**Executed 2026-07-05 by /plan-execute. All 19 tasks complete. ADR: 0001.**

### Per-phase results

- **Phase A** — removed `@sendgrid/*`, `swr`, `global`, `localtunnel`, `@types/localtunnel`, `@chakra-ui/cli` (verified unreferenced in scripts/CI); deleted stray `console.log` in `lib/contentlayer-utils.ts`. Build green.
- **Phase B** — delegated initial migration to a subagent, which completed the wiring (next.config, tsconfig, .gitignore, 13 consumer imports, MDX hook swap, rss/sitemap scripts, build script) but left `content-collections.ts` broken: only `blog` registered in `defineConfig`, Blog transform missing `mdx`/`editUrl`/`tweetUrl`/`params`/`ogImageUrl`, and a stray `cc-check.ts` debug file. Fixed all three. Two additional fixes beyond plan:
  - `readingTime()` returns an interface → fails CC's `Serializable` type check (no index signature); wrapped in `readStats()` returning an object literal.
  - CC's `_meta.filePath` is relative to each collection dir (contentlayer's `_id` included the `data/`-relative prefix) → `editUrl` values would have dropped `blog/` etc.; prefixed per collection.
  - `components/talk-card.tsx` used `talk.type` (contentlayer's doc-type discriminator, always `"Talk"`) → replaced with the literal.
  - rss/sitemap import CC's generated `allX.js` modules (ESM, no import assertions) rather than JSON-via-fs — same root-cause fix, less code.
- **Phase C** — `.nvmrc` → v22, `engines` → 22.x; `pnpm import` → `pnpm-lock.yaml`; removed `yarn.lock`, `.yarnrc.yml`, `.yarn/`; `packageManager: pnpm@11.10.0`; `allowBuilds` in `pnpm-workspace.yaml` for sharp/esbuild/speed-insights/unrs-resolver; declared phantom dep `unified` (surfaced by pnpm strictness, exactly as §6 predicted); CLAUDE.md updated.
- **Phase D** — Next 16.2.10 + React 19.2.7 (react/react-dom must be exact-same version — Next 16 enforces); removed obsolete `swcMinify`; next-seo 7 (pages-router components replaced by `generateNextSeo`/`generateDefaultSeo` in `next/head`; `ArticleJsonLd` props renamed: `title`→`headline`, `images`→`image`, `authorName`→`author`, publisher merged into object); TS 6 (target es2022, dropped deprecated `downlevelIteration`/`baseUrl`, `"*"` paths mapping replaces baseUrl); Prettier 3 (`await format` in sitemap); Chakra 2.10.9 + framer-motion 12 + satori 0.26 + sharp 0.35 + all remaining minors.

### Divergences

1. **ESLint 9 instead of 10** — `eslint-config-next@16`'s plugin stack (eslint-plugin-react 7.37, ts-eslint scope-manager path) crashes at runtime under ESLint 10 (`scopeManager.addGlobals is not a function`, `Cannot create components during render` in rule init) despite peer ranges allowing 10. Flat config goal achieved on 9.39; bump to 10 when the Next stack is ready. Recorded in ADR.
2. **react-hooks v7 new rules disabled** — `react-hooks/static-components` and `react-hooks/refs` flag the pre-existing `useMDXComponent` pattern (internally memoized, safe) and `lib/debounce`; disabled in `eslint.config.mjs` with comment rather than refactoring out of scope.
3. `.claude/launch.json` added (dev-server launch config for verification tooling).

### Verification (§5)

All pass on Node 22 / pnpm 11.10: `pnpm build` (content-collections → next build → rss → sitemap) exit 0 · `pnpm lint` exit 0 · `tsc --noEmit` exit 0 · sitemap 14 URLs, feed 7 items · dev-server smoke: home/blog/post/snippets/projects all 200, prism highlighting present, zero browser console errors, no hydration warnings · OG route returns image/png (56 KB) · canonical/og:url/og:type=article/BlogPosting JSON-LD verified in rendered HTML.

### Files changed

`package.json`, `pnpm-lock.yaml` (new), `pnpm-workspace.yaml` (new), deleted `yarn.lock`/`.yarnrc.yml`/`.yarn/`/`.eslintrc`/`contentlayer.config.ts`, `content-collections.ts` (new), `eslint.config.mjs` (new), `next.config.js`, `tsconfig.json`, `.gitignore`, `.nvmrc`, `CLAUDE.md`, `scripts/rss.mjs`, `scripts/sitemap.mjs`, `components/{seo,talk-card,project-card,testimonial-card,blog-card,featured-blog-card,snippet-card}.tsx`, `lib/{contentlayer-utils,use-blog-search,use-snippet-search,use-talk-search}.ts`, `pages/_app.tsx`, `pages/blog/[slug].tsx`, `pages/snippets/[slug].tsx`, `pages/projects/index.tsx`, `docs/adr/{_TEMPLATE,0001-modernize-dependencies}.md` (new), `.claude/launch.json` (new).
</content>
</invoke>
