import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import UnoCSS from 'unocss/vite';

export default defineConfig({
  plugins: [
    UnoCSS(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: {
          '': '4KHD Plus',
          'zh-CN': '4KHD 增强阅读',
        },
        namespace: 'http://tampermonkey.net/',
        version: '1.0.0',
        author: 'Viki',
        description: {
          '': 'Reader mode with image navigation and floating controls for 4KHD and mirrors',
          'zh-CN': '为 4KHD 及镜像站提供阅读器模式，支持图片导航与悬浮控制',
        },
        license: 'MIT',
        match: [
          '*://*.4khd.com/*/*',
          '*://*.xxtt.ink/*/*',
          '*://*.uuss.uk/*/*',
          '*://*.ssuu.uk/*/*',
        ],
        grant: [
          'GM_addStyle',
          'GM_getValue',
          'GM_registerMenuCommand',
          'GM_setValue',
        ],
      },
      build: {
        fileName: '4khd-plus.user.js',
      },
    }),
  ],
});
