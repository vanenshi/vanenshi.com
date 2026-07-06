import { type Project } from 'content-collections';
import { Box, Flex, Heading, HStack, Stack } from '@chakra-ui/react';
import { useMDXComponent } from '@content-collections/mdx/react';
import Image from 'next/image';
import { DescriptionList } from './description-item';
import LinkItem from './link-item';
import { AndroidIcon, AppleIcon, GithubIcon, WebsiteIcon } from './social-icons';

type ProjectCardProps = {
  data: Project;
  priority?: boolean;
};

export default function ProjectCard(props: ProjectCardProps) {
  const { data: project, priority } = props;
  const Component = useMDXComponent(project.mdx);

  return (
    <Flex gap="20" direction={{ base: 'column', md: 'row' }}>
      <Box maxWidth={{ md: '27.5rem' }} flex="1">
        <Stack spacing="6">
          <Heading as="h3" color="cyan.600" letterSpacing="tight">
            {project.title}
          </Heading>
          {(project.github || project.website || project.ios || project.android) && (
            <HStack spacing="12">
              {project.github && (
                <LinkItem icon={GithubIcon} href={project.github} iconColor="whiteAlpha.600">
                  Github
                </LinkItem>
              )}
              {project.website && (
                <LinkItem icon={WebsiteIcon} href={project.website} iconColor="whiteAlpha.600">
                  Website
                </LinkItem>
              )}
              {project.android && (
                <LinkItem icon={AndroidIcon} href={project.android} iconColor="green.300">
                  Android
                </LinkItem>
              )}
              {project.ios && (
                <LinkItem icon={AppleIcon} href={project.ios} iconColor="whiteAlpha.700">
                  iOS
                </LinkItem>
              )}
            </HStack>
          )}
          <Box fontSize="lg">
            <Component />
          </Box>
        </Stack>

        <Box marginTop="12">
          {!!project.metadata && <DescriptionList data={project.metadata} />}
        </Box>
      </Box>

      <ProjectImageCard
        src={project.image}
        alt={project.title}
        rtl={project.rtl}
        objectPosition={project.objectPosition}
        priority={priority}
      />
    </Flex>
  );
}

type ProjectImageCardProps = {
  src?: string;
  alt: string;
  rtl?: boolean;
  objectPosition?: string;
  priority?: boolean;
};

function ProjectImageCard(props: ProjectImageCardProps) {
  const { src, alt, rtl, objectPosition = '-16%', priority } = props;
  return (
    <Box
      flex={{ md: '1' }}
      position="relative"
      height="25rem"
      width="100%"
      overflow="hidden"
      bg="linear-gradient(180deg, #FEB48C 0%, #1EBBFF 100%);"
      rounded="2xl"
    >
      <Box
        position="absolute"
        left={rtl ? undefined : 10}
        right={rtl ? 10 : undefined}
        top="10"
        width="56.25rem"
        height="31.25rem"
        bg="white"
        rounded="lg"
        overflow="hidden"
        boxShadow="xl"
        sx={{
          ' > span': {
            transform: 'scale(1.01)',
          },
        }}
      >
        <Image
          alt={alt}
          src={src}
          fill
          priority={priority}
          sizes="(max-width: 900px) 100vw, 900px"
          style={{ objectFit: 'cover', objectPosition }}
        />
      </Box>
    </Box>
  );
}
