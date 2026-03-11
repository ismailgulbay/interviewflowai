import globals from 'globals';

import { baseConfig } from './base.mjs';

export const nodeConfig = [
  ...baseConfig,
  {
    files: ['**/*.{ts,js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
