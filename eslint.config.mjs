import next from 'eslint-config-next';

const config = [
  ...next,
  {
    rules: {
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      // New opinionated react-hooks@7 rules. They flag the long-standing
      // useMDXComponent pattern (internally memoized, safe) and lib/debounce's
      // ref usage. Revisit if those files are rewritten.
      'react-hooks/static-components': 'off',
      'react-hooks/refs': 'off',
    },
  },
  {
    ignores: ['.next/**', '.content-collections/**', 'public/**', 'next-env.d.ts'],
  },
];

export default config;
