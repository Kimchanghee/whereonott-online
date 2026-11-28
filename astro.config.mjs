import { defineConfig } from 'astro/config';
import { rehypeAffiliate as affiliate } from './scripts/lib/rehype-affiliate.mjs';
import { thumbs } from './scripts/lib/thumbs.mjs';
export default defineConfig({site:'https://whereonott.online',output:'static',integrations:[thumbs()],markdown:{rehypePlugins:[affiliate]}});
