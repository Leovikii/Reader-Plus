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
          '': 'JM Plus',
          'zh-CN': '禁漫 增强阅读',
        },
        namespace: 'http://tampermonkey.net/',
        version: '1.0.0',
        author: 'Viki',
        description: {
          '': 'Reader mode with image navigation and floating controls for 18comic',
          'zh-CN': '为禁漫天堂提供阅读器模式，支持图片导航与悬浮控制',
        },
        license: 'MIT',
        match: [
          '*://18comic.ink/photo/*',
          '*://18comic.vip/photo/*',
        ],
        grant: [
          'GM_addStyle',
          'GM_getValue',
          'GM_registerMenuCommand',
          'GM_setValue',
          'GM_xmlhttpRequest',
        ],
      },
      build: {
        fileName: 'jm-plus.user.js',
      },
    }),
  ],
});
