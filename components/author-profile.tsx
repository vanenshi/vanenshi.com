import { Box, Circle, Flex, Heading, Link, LinkOverlay, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Emoji from './emoji';
import { siteConfig } from '../site.config';

export default function AuthorProfile() {
  return (
    <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: '4', md: '8' }}>
      <Circle size="80px" overflow="hidden">
        <Image
          alt={siteConfig.name}
          src="/static/images/vanenshi-headshot.jpeg"
          width={80}
          height={80}
        />
      </Circle>
      <Box>
        <Heading size="md">{`Written by ${siteConfig.name} (${siteConfig.nickname})`}</Heading>
        <Text mt="4" lineHeight="taller">
          {siteConfig.nickname} is a Software developer<Emoji label="Software developer">👨🏽‍💻</Emoji>. He is passionate about helping
          startups to build new ideas. {siteConfig.nickname} is the builder of <Link color="cyan.600" href='https://roombadi.com/'>Roombadi</Link>, 
          <Link color="cyan.600" href='https://kisshe.com/'> Kisshe</Link> and <Link color="cyan.600" href='http://mozayedegar.ir/'>Mozayedegar</Link>.
        </Text>
      </Box>
    </Flex>
  );
}
