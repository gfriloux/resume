import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://guillaume.friloux.me',
  output: 'static',
  build: {
    assets: 'assets'
  }
});
