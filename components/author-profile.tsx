import { Box, Circle, Flex, Heading, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Emoji from './emoji';
import { siteConfig } from '../site.config';

export default function AuthorProfile() {
  return (
    <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: '4', md: '8' }}>
      <Circle size="80px" overflow="hidden">
        <Image
          alt={siteConfig.name}
          src="/static/images/segun-adebayo-headshot.jpg"
          width={80}
          height={80}
        />
      </Circle>
      <Box>
        <Heading size="md">{`Written by Segun Adebayo (Sage)`}</Heading>
        <Text mt="4" lineHeight="taller">
          {siteConfig.nickname} is a Github Star <Emoji label="Github star">🌟</Emoji> and Design
          Engineer <Emoji label="Software developer">👨🏽‍💻</Emoji>. He is passionate about helping
          people build an accessible web faster. Sage is the author of Chakra UI, a React UI library
          for building accessible experiences.
        </Text>
      </Box>
    </Flex>
  );
}
