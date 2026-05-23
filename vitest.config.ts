import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/tests/**/*.test.ts', 'src/tests/**/*.test.tsx'],
  },
  resolve: {
    alias: [
      // @/src/foo → src/foo  (for explicit src/ paths in tests)
      { find: /^@\/src\/(.*)$/, replacement: path.resolve(__dirname, 'src/$1') },
      // @/foo → src/foo  (for component-style imports like @/lib/utils)
      { find: /^@\/(.*)$/, replacement: path.resolve(__dirname, 'src/$1') },
    ],
  },
});
