import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    isolate: false,
    coverage: {
      provider: 'v8',
      include: ['src/*'],
      exclude: ['src/types.ts', 'src/app.ts', 'src/**/*.test.ts']
    }
  },
});