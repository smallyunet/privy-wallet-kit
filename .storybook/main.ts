import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: '@storybook/react-vite',
  async viteFinal(config) {
    // Declaration generation belongs to the library build. Running vite-plugin-dts
    // inside Storybook writes outside storybook-static and fails in a clean checkout.
    config.plugins = config.plugins?.filter(
      (plugin) =>
        !(plugin && typeof plugin === 'object' && 'name' in plugin && plugin.name === 'vite:dts'),
    );

    return mergeConfig(config, {
      resolve: {
        alias: {
          '@privy-io/react-auth': path.resolve(__dirname, '../src/mocks/privy-auth.ts'),
        },
      },
    });
  },
};
export default config;
