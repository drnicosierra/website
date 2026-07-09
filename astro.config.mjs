import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.drnicosierra.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'always'
  },
  image: {
    domains: ['images.unsplash.com']
  }
});
