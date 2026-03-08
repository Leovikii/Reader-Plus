import { defineConfig, presetUno } from 'unocss';

export default defineConfig({
  presets: [presetUno()],
  content: {
    filesystem: ['src/**/*.ts'],
  },
});
