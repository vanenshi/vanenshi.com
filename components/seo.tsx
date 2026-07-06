import { ArticleJsonLd } from 'next-seo';
import { generateNextSeo } from 'next-seo/pages';
import Head from 'next/head';
import { siteConfig } from 'site.config';

type SEOProps = {
  title?: string;
  description?: string;
  image?: string;
  /** Path of the page, e.g. `/blog/my-post`. Used for canonical + og:url. */
  path?: string;
  post?: {
    date?: string;
    modifiedDate?: string;
    tags?: string[];
  };
};

export default function SEO(props: SEOProps) {
  const { title, description, post, image, path } = props;
  const url = path ? `${siteConfig.siteUrl}${path}` : undefined;
  return (
    <>
      <Head>
        {generateNextSeo({
          title,
          description,
          canonical: url,
          openGraph: {
            url,
            images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined,
            title,
            description,
            type: post ? 'article' : undefined,
            article: post
              ? {
                  publishedTime: post.date,
                  modifiedTime: post.modifiedDate ?? post.date,
                  tags: post.tags,
                }
              : undefined,
          },
          titleTemplate: siteConfig.titleTemplate,
        })}
      </Head>
      {post && url && (
        <ArticleJsonLd
          type="BlogPosting"
          url={url}
          headline={title}
          description={description}
          image={image ? [image] : []}
          datePublished={post.date}
          dateModified={post.modifiedDate ?? post.date}
          author={[{ name: siteConfig.name, url: siteConfig.siteUrl }]}
          publisher={{
            name: siteConfig.name,
            logo: `${siteConfig.siteUrl}/static/images/vanenshi-headshot.jpeg`,
          }}
          isAccessibleForFree
        />
      )}
    </>
  );
}
