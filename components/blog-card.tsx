import { Blog } from 'content-collections';
import { Box, Heading, HStack, LinkBox, LinkOverlay } from '@chakra-ui/react';
import formatDate from 'lib/format-date';
import Image from 'next/image';
import Link from 'next/link';

type Field = 'publishedAt' | 'readingTime' | 'description' | 'title' | 'image' | 'slug';

type BlogCardProps = {
  data: Pick<Blog, Field>;
};

export function BlogCard(props: BlogCardProps) {
  const { data } = props;
  const { title, publishedAt, image, readingTime, slug } = data;
  const date = formatDate(publishedAt);

  return (
    <LinkBox>
      <Box sx={{ aspectRatio: '16 / 10' }} rounded="lg" overflow="hidden" position="relative">
        <Image src={image} alt={title} fill style={{ objectFit: 'cover' }} />
      </Box>

      <Box flex="1" mt="5">
        <HStack spacing="5" fontSize="sm">
          <HStack spacing="2" color="cyan.600">
            <Box as="time" dateTime={date.iso}>
              {date.pretty}
            </Box>
            <span aria-hidden>•</span>
            <Box>{readingTime.text}</Box>
          </HStack>
        </HStack>

        <Heading size="lg" fontWeight="semibold" marginY="4">
          <LinkOverlay as={Link} href={`/blog/${slug}`}>
            {title}
          </LinkOverlay>
        </Heading>
      </Box>
    </LinkBox>
  );
}
