import { ArticleJsonLd, NextSeo } from 'next-seo';
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
      <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
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
        }}
        titleTemplate={siteConfig.titleTemplate}
      />
      {post && url && (
        <ArticleJsonLd
          url={url}
          title={title}
          description={description}
          images={image ? [image] : []}
          datePublished={post.date}
          dateModified={post.modifiedDate ?? post.date}
          authorName={[{ name: siteConfig.name, url: siteConfig.siteUrl }]}
          publisherName={siteConfig.name}
          publisherLogo={`${siteConfig.siteUrl}/static/images/vanenshi-headshot.jpeg`}
          isAccessibleForFree
        />
      )}
    </>
  );
}
