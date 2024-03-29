import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteTsconfigPaths(), react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['@testing-library/jest-dom', './test/testSetup.ts'],
    coverage: {
      reporter: ['text', 'cobertura', 'html'],
      provider: 'v8',
      exclude: [
        'build',
        'node_modules',
        'backend',
        '.eslintrc.js',
        'firebase-messaging-sw.js',
        'postcss.config.js',
        'tailwind.config.js',
        '**/*.interface.ts',
        'src/Root.tsx',
        'src/index.tsx',
        'src/routes.tsx',
        'src/service-worker.ts',
        'src/serviceWorkerRegistration.ts',
      ],
    },
    reporters: ['verbose'],
  },

  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
      {
        find: '@test',
        replacement: path.resolve(__dirname, './test'),
      },
    ],
  },
})
