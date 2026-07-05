import { Box, Circle, Flex, HStack, Heading, Text, chakra } from '@chakra-ui/react';
import AuthorProfile from 'components/author-profile';
import Container from 'components/container';
import HashTags from 'components/hash-tags';
import LinkItem from 'components/link-item';
import MDXComponents from 'components/mdx-components';
import { BlogIcon } from 'components/nav-icons';
import SEO from 'components/seo';
import { TwitterIcon } from 'components/social-icons';
import { Blog, allBlogs } from 'content-collections';
import formatDate from 'lib/format-date';
import { getAbsoluteURL } from 'lib/router-utils';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { useMDXComponent } from '@content-collections/mdx/react';
import Image from 'next/image';
import { siteConfig } from 'site.config';

export default function BlogPage({ blog, ogImageUrl }: { blog: Blog; ogImageUrl: string }) {
  const Component = useMDXComponent(blog.mdx);
  const date = formatDate(blog.publishedAt);

  return (
    <Container>
      <SEO
        image={ogImageUrl}
        title={blog.title}
        description={blog.description}
        path={`/blog/${blog.slug}`}
        post={{
          date: date.iso,
          modifiedDate: blog.updatedAt ? formatDate(blog.updatedAt).iso : undefined,
          tags: blog.tags,
        }}
      />
      <Box maxWidth="4xl" marginX="auto" paddingTop="12" paddingBottom="8rem">
        <article>
          <Box marginBottom="6">
            <Heading size="2xl" as="h1" marginBottom="8" color="white">
              {blog.title}
            </Heading>

            <HashTags data={blog.tags} />

            <Flex
              direction={{ base: 'column-reverse', md: 'row' }}
              gap="4"
              justify="space-between"
              marginTop={{ base: '4', md: '8' }}
            >
              <HStack spacing="3">
                <Circle overflow="hidden">
                  <Image
                    alt={`${siteConfig.name} (${siteConfig.nickname})`}
                    src="/static/images/vanenshi-headshot.jpeg"
                    width={32}
                    height={32}
                  />
                </Circle>
                <Text fontWeight="medium">{siteConfig.name}</Text>
              </HStack>

              <HStack color="cyan.600">
                <chakra.span>{blog.readingTime.text}</chakra.span>
                <span aria-hidden>•</span>
                <time dateTime={date.iso}>{date.pretty}</time>
              </HStack>
            </Flex>
          </Box>

          <Box position="relative" rounded="lg" overflow="hidden" marginTop="10" marginBottom="6">
            <Image
              src={blog.image}
              alt={blog.title}
              width={0}
              height={0}
              sizes="100vw"
              priority
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </Box>

          <Box
            sx={{
              color: 'neutral.300',
              lineHeight: 'taller',
              'p + p': {
                marginY: '1.25em',
              },
            }}
          >
            <Component components={MDXComponents} />
          </Box>
        </article>

        <Flex justify="space-between" my="20">
          <LinkItem href={blog.tweetUrl} icon={TwitterIcon}>
            Tweet this article
          </LinkItem>
          <LinkItem href={blog.editUrl} icon={BlogIcon}>
            Edit on github
          </LinkItem>
        </Flex>

        <Box as="hr" borderColor="whiteAlpha.200" mt="3rem" mb="9rem" />
        <AuthorProfile />
      </Box>
    </Container>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: allBlogs.map((blog) => ({ params: { slug: blog.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const blog = allBlogs.find((blog) => blog.slug === params.slug);

  const searchParams = new URLSearchParams();
  searchParams.set('title', blog.title);
  searchParams.set('tags', blog.tags.join(','));
  searchParams.set('date', formatDate(blog.publishedAt).pretty);
  searchParams.set('readingTime', blog.readingTime.text);
  const ogImageUrl = getAbsoluteURL(`/api/open-graph-image?${searchParams.toString()}`);

  return { props: { blog, ogImageUrl } };
};
