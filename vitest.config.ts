import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      exclude: ['**/node_modules/**', '**/coverage/**'],
    },
    projects: [
      {
        test: {
          name: 'unit',
          include: ['app/**/*unit.spec.js'],
        },
      },
      {
        test: {
          name: 'integration',
          include: ['app/**/*int.spec.js'],
        },
      },
    ],
  },
});
