import { writeFileSync } from 'fs';
import RSS from 'rss';
import { allBlogs } from '.contentlayer/data';
import * as baseConfig from 'base-config';

async function generate() {
  const feed = new RSS({
    title: baseConfig.name,
    site_url: baseConfig.siteUrl,
    feed_url: `${baseConfig.siteUrl}/feed.xml`,
  });

  allBlogs.map((blog) => {
    feed.item({
      title: blog.title,
      url: `${baseConfig.siteUrl}/blog/${blog.slug}`,
      date: blog.publishedAt,
      description: blog.description,
    });
  });

  writeFileSync('./public/feed.xml', feed.xml({ indent: true }));
}

generate();
