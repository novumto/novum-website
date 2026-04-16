// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// 安裝指令（只需跑一次）：
//   npx astro add cloudflare

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
});
