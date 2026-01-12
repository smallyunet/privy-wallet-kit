/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// https://vite.dev/config/

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PrivyWalletKit',
      fileName: 'privy-wallet-kit',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@privy-io/react-auth',
        'viem',
        'tailwindcss',
        'clsx',
        'tailwind-merge',
        'lucide-react',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@privy-io/react-auth': 'PrivyReactAuth',
          viem: 'viem',
        },
      },
    },
  },
});
