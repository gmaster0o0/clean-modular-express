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
          include: ['test/integration-test/**/*.int.js'],
          setupFiles: ['test/setup/integration.setup.js'],
        },
      },
    ],
  },
});
