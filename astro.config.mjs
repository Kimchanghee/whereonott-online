import { defineConfig } from 'astro/config';
import { rehypeAffiliate as affiliate } from './scripts/lib/rehype-affiliate.mjs';
export default defineConfig({site:'https://whereonott.online',output:'static',markdown:{rehypePlugins:[affiliate]}});
