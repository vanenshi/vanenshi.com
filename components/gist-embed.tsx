import Gist from 'super-react-gist';
import { Box, Spinner, Text } from '@chakra-ui/react';

interface GistEmbedProps {
  url: string;
  file?: string;
}

export const GistEmbed: React.FC<GistEmbedProps> = ({ url, file }) => {
  return (
    <Box marginY="6">
      <Gist
        url={url}
        file={file}
        LoadingComponent={() => (
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            minH="100px"
            bg="neutral.900"
            borderRadius="md"
            border="1px solid"
            borderColor="neutral.700"
          >
            <Spinner size="md" color="cyan.500" />
            <Text ml="3" color="neutral.400">Loading gist...</Text>
          </Box>
        )}
        ErrorComponent={() => (
          <Box 
            p="4"
            bg="red.900"
            borderRadius="md"
            border="1px solid"
            borderColor="red.700"
          >
            <Text color="red.200">Failed to load gist</Text>
            <Text 
              as="a" 
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              color="cyan.400"
              textDecor="underline"
              fontSize="sm"
              mt="2"
              display="block"
            >
              View on GitHub →
            </Text>
          </Box>
        )}
      />
    </Box>
  );
};
