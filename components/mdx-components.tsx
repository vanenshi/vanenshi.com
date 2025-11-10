import { AspectRatio, Stack, chakra } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { GistEmbed } from './gist-embed';

const ChakraLink = React.forwardRef<HTMLAnchorElement, any>(function ChakraLink(props, ref) {
  return (
    <chakra.a
      ref={ref}
      color="white"
      fontWeight="semibold"
      textDecor="underline"
      textUnderlineOffset="6px"
      textDecorationColor="cyan.700"
      _hover={{ bg: 'neutral.700' }}
      {...props}
    />
  );
});

const CustomLink = (props) => {
  const { href } = props;
  const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'));
  if (isInternalLink) {
    return <ChakraLink as={Link} href={href} {...props} />;
  }
  return <ChakraLink target="_blank" rel="noopener noreferrer" {...props} />;
};

const MDXComponents: Record<string, React.FC<any>> = {
  a: CustomLink,
  GistEmbed,
  ul(props) {
    return <chakra.ul paddingStart="4" marginY="5" {...props} />;
  },
  ol(props) {
    return <chakra.ul paddingStart="4" marginY="5" {...props} />;
  },
  li(props) {
    return <chakra.li marginY="2" sx={{ '&::marker': { color: 'cyan.600' } }} {...props} />;
  },
  h2(props) {
    return (
      <chakra.h2
        lineHeight="1.5em"
        fontSize="2xl"
        fontFamily="heading"
        fontWeight="semibold"
        marginTop="16"
        marginBottom="4"
        {...props}
      />
    );
  },
  h3(props) {
    return (
      <chakra.h3
        lineHeight="1.5em"
        fontSize="xl"
        fontFamily="heading"
        fontWeight="semibold"
        marginTop="12"
        marginBottom="4"
        {...props}
      />
    );
  },
  blockquote(props) {
    return (
      <chakra.blockquote
        color="white"
        marginY="8"
        paddingX="6"
        paddingY="4"
        marginX="-6"
        bg="neutral.800"
        sx={{ borderLeft: '4px solid', borderColor: 'cyan.600' }}
        {...props}
      />
    );
  },
  Image({ ratio, alt, marginY = '6em', fit, caption, ...rest }) {
    if (ratio) {
      return (
        <Stack as="figure" marginY={marginY} spacing="5">
          <AspectRatio ratio={ratio} position="relative">
            <Image
              alt={alt}
              className="img"
              style={{ overflow: 'visible', objectFit: fit }}
              {...rest}
            />
          </AspectRatio>
          {caption && (
            <chakra.figcaption fontSize="small" textAlign="center" color="neutral.400">
              {alt}
            </chakra.figcaption>
          )}
        </Stack>
      );
    }
    return (
      <Stack as="figure" marginY={marginY}>
        <Image alt={alt} className="img" style={{ objectFit: fit }} {...rest} />
        {caption && (
          <chakra.figcaption fontSize="small" textAlign="center" color="neutral.400">
            {alt}
          </chakra.figcaption>
        )}
      </Stack>
    );
  },
  hr(props) {
    return <chakra.hr borderColor="whiteAlpha.100" marginY="3em" {...props} />;
  },
  code(props) {
    if (typeof props.children === 'string') {
      return <chakra.code color="cyan.600" rounded="sm">{`\`${props.children}\``}</chakra.code>;
    }
    return <code {...props} />;
  },
  strong(props) {
    return <chakra.strong fontWeight="semibold" color="white" {...props} />;
  },
  table(props) {
    return (
      <chakra.table
        marginY="10"
        width="full"
        sx={{
          borderCollapse: 'collapse',
          thead: {
            borderBottomWidth: '1px',
            borderBottomColor: 'neutral.700',
            th: {
              textAlign: 'start',
              padding: '2',
              verticalAlign: 'bottom',
              color: 'neutral.200',
            },
          },
          tbody: {
            tr: {
              borderBottomWidth: '1px',
              borderBottomColor: 'neutral.800',
            },
            td: {
              padding: '2',
            },
          },
        }}
        {...props}
      />
    );
  },
};

export default MDXComponents;
