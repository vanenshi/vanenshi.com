import { extendTheme } from '@chakra-ui/react';

const colors = {
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  brown: {
    50: 'hsl(30, 50.0%, 97.6%)',
    100: 'hsl(30, 52.5%, 94.6%)',
    200: 'hsl(30, 53.0%, 91.2%)',
    300: 'hsl(29, 52.9%, 86.8%)',
    400: 'hsl(29, 52.5%, 80.9%)',
    500: 'hsl(29, 51.5%, 72.8%)',
    600: 'hsl(28, 50.0%, 63.1%)',
    700: 'hsl(28, 34.0%, 51.0%)',
    800: 'hsl(27, 31.8%, 47.6%)',
    900: 'hsl(25, 30.0%, 41.0%)',
  },
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
    950: '#083344',
  },
};

const fonts = {
  heading: 'PolySans, -apple-system, system-ui, sans-serif',
  body: 'Inter, -apple-system, system-ui, sans-serif',
  mono: `SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
};

const theme = {
  colors,
  fonts,
  space: {
    vGutter: '6.25rem',
  },
  shadows: {
    highlight: 'inset 0 2px 0 0 rgb(255 255 255 / 5%)',
  },
  styles: {
    global: {
      'html, body': {
        bg: 'neutral.900',
        color: 'neutral.300',
        minH: '100vh',
        overflowX: 'hidden',
        colorScheme: 'dark',
      },
      '*:focus, *[data-focus]': {
        outline: '2px solid',
        outlineColor: 'cyan.400',
        outlineOffset: '3px',
      },
      'h2,h3,h4': {
        scrollMarginTop: '4rem',
        '&:hover': {
          'a.anchor': {
            opacity: 1,
          },
        },
      },
      '.img': {
        rounded: 'lg',
      },
      'a.anchor': {
        opacity: 0,
        marginX: '3',
        '&:before': {
          content: `"#"`,
          color: 'cyan.600',
        },
        '&:focus': {
          opacity: 1,
        },
      },
    },
  },
};

export default extendTheme(theme);
