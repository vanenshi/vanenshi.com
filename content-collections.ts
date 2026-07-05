import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMDX } from '@content-collections/mdx';
import { z } from 'zod';
import readingTime from 'reading-time';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeCodeTitles from 'rehype-code-titles';
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import type { Pluggable } from 'unified';
import { toKebabCase } from './lib/string-utils';
import { siteConfig } from './site.config';

const remarkPlugins: Pluggable[] = [remarkGfm];
const rehypePlugins: Pluggable[] = [
  rehypeSlug,
  rehypeCodeTitles,
  rehypePrism,
  [
    rehypeAutolinkHeadings,
    {
      behavior: 'append',
      test: ['h2', 'h3', 'h4', 'h5', 'h6'],
      properties: {
        className: ['anchor'],
      },
    },
  ],
];

// reading-time returns an interface, which fails CC's Serializable check
// (no index signature) — re-wrap as an object literal.
function readStats(content: string) {
  const { text, time, words, minutes } = readingTime(content, { wordsPerMinute: 300 });
  return { text, time, words, minutes };
}

// Mirrors contentlayer's `doc._raw.sourceFileName` — the file's basename without extension.
function slugFromMeta(meta: { fileName: string }) {
  return meta.fileName.replace(/\.(mdx|md)$/, '');
}

// Mirrors contentlayer's `doc._raw.flattenedPath.split('/')`.
function paramsFromMeta(meta: { path: string }) {
  return meta.path.split('/');
}

function tweetUrlFor(type: string, title: string, slug: string) {
  return `https://twitter.com/intent/tweet?${new URLSearchParams({
    url: `${siteConfig.siteUrl}/${type.toLowerCase()}/${slug}`,
    text: `I just read "${title}" by @vanenshi\n\n`,
  })}`;
}

const blog = defineCollection({
  name: 'Blog',
  directory: 'data/blog',
  include: '**/*.mdx',
  schema: z.object({
    content: z.string(),
    featured: z.boolean().optional(),
    title: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
    description: z.string(),
    image: z.string(),
    tags: z.array(z.string()).optional(),
  }),
  transform: async (doc, context) => {
    const slug = slugFromMeta(doc._meta);
    const mdx = await compileMDX(context, doc, { remarkPlugins, rehypePlugins });
    return {
      ...doc,
      mdx,
      slug,
      readingTime: readStats(doc.content),
      editUrl: `${siteConfig.repo.editUrl}blog/${doc._meta.filePath}`,
      tweetUrl: tweetUrlFor('blog', doc.title, slug),
      params: paramsFromMeta(doc._meta),
      ogImageUrl: `${siteConfig.siteUrl}/static/images/og/${toKebabCase(doc.title)}.png`,
    };
  },
});

const talk = defineCollection({
  name: 'Talk',
  directory: 'data/talk',
  include: '*.mdx',
  schema: z.object({
    content: z.string(),
    featured: z.boolean().optional(),
    format: z.string().optional(),
    title: z.string(),
    description: z.string(),
    publishedAt: z.string(),
    image: z.string(),
    url: z.string(),
    host: z.string().optional(),
    tags: z.array(z.string()),
  }),
  transform: async (doc, context) => {
    const slug = slugFromMeta(doc._meta);
    const mdx = await compileMDX(context, doc, { remarkPlugins, rehypePlugins });
    return {
      ...doc,
      mdx,
      slug,
      readingTime: readStats(doc.content),
      editUrl: `${siteConfig.repo.editUrl}talk/${doc._meta.filePath}`,
      tweetUrl: tweetUrlFor('talk', doc.title, slug),
      params: paramsFromMeta(doc._meta),
    };
  },
});

const newsletter = defineCollection({
  name: 'Newsletter',
  directory: 'data/newsletter',
  include: '*.mdx',
  schema: z.object({
    content: z.string(),
    title: z.string(),
    publishedAt: z.string(),
    description: z.string(),
    image: z.string(),
  }),
  transform: async (doc, context) => {
    const slug = slugFromMeta(doc._meta);
    const mdx = await compileMDX(context, doc, { remarkPlugins, rehypePlugins });
    return {
      ...doc,
      mdx,
      slug,
      readingTime: readStats(doc.content),
      editUrl: `${siteConfig.repo.editUrl}newsletter/${doc._meta.filePath}`,
      tweetUrl: tweetUrlFor('newsletter', doc.title, slug),
      params: paramsFromMeta(doc._meta),
    };
  },
});

const snippet = defineCollection({
  name: 'Snippet',
  directory: 'data/snippet',
  include: '**/*.mdx',
  schema: z.object({
    content: z.string(),
    title: z.string(),
    description: z.string(),
    logo: z.string(),
    categories: z.array(z.string()).optional(),
  }),
  transform: async (doc, context) => {
    const slug = slugFromMeta(doc._meta);
    const mdx = await compileMDX(context, doc, { remarkPlugins, rehypePlugins });
    return {
      ...doc,
      mdx,
      slug,
      readingTime: readStats(doc.content),
      editUrl: `${siteConfig.repo.editUrl}snippet/${doc._meta.filePath}`,
      tweetUrl: tweetUrlFor('snippet', doc.title, slug),
      params: paramsFromMeta(doc._meta),
    };
  },
});

const project = defineCollection({
  name: 'Project',
  directory: 'data/project',
  include: '*.mdx',
  schema: z.object({
    content: z.string(),
    featured: z.boolean().optional(),
    title: z.string(),
    description: z.string().optional(),
    github: z.string().optional(),
    website: z.string().optional(),
    ios: z.string().optional(),
    android: z.string().optional(),
    metadata: z.array(z.object({ title: z.string(), content: z.string() })).optional(),
    image: z.string().optional(),
    objectPosition: z.string().optional(),
    rtl: z.boolean().optional(),
  }),
  transform: async (doc, context) => {
    const slug = slugFromMeta(doc._meta);
    const mdx = await compileMDX(context, doc, { remarkPlugins, rehypePlugins });
    return {
      ...doc,
      mdx,
      slug,
      readingTime: readStats(doc.content),
      editUrl: `${siteConfig.repo.editUrl}project/${doc._meta.filePath}`,
      tweetUrl: tweetUrlFor('project', doc.title, slug),
      params: paramsFromMeta(doc._meta),
    };
  },
});

const testimonial = defineCollection({
  name: 'Testimonial',
  directory: 'data/testimonial',
  include: '*.md',
  schema: z.object({
    content: z.string(),
    featured: z.boolean().optional(),
    image: z.string(),
    name: z.string(),
    title: z.string(),
    source: z.enum(['twitter', 'linkedin']),
  }),
  transform: async (doc, context) => {
    const slug = slugFromMeta(doc._meta);
    const mdx = await compileMDX(context, doc, { remarkPlugins, rehypePlugins });
    return {
      ...doc,
      mdx,
      slug,
      readingTime: readStats(doc.content),
      editUrl: `${siteConfig.repo.editUrl}testimonial/${doc._meta.filePath}`,
      tweetUrl: tweetUrlFor('testimonial', doc.title, slug),
      params: paramsFromMeta(doc._meta),
    };
  },
});

export default defineConfig({
  content: [blog, talk, newsletter, snippet, project, testimonial],
});
