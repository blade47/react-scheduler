import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './src'),
    },
  },
  test: {
    // vitest defaults to one worker per core; parallel runs (agents, turbo) overload the machine
    maxWorkers: '50%',
    globals: true,
    environment: 'node',
  },
});
