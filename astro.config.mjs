import { defineConfig } from 'astro/config';
import affiliate from './scripts/lib/rehype-affiliate.mjs';
export default defineConfig({site:'https://whereonott.online',output:'static',markdown:{rehypePlugins:[affiliate]}});