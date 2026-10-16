import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, join } from 'node:path';
import { parse } from 'yaml';
import { gateSource, RULES } from '../scripts/gate.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const slugs = ['projector-distance','living-room-layout','soundbar-earc','streaming-settop-compatibility'];
const readings = JSON.parse(readFileSync(join(root,'content/research/primary-readings-20261016.json'),'utf8'));
const paths = new Set(slugs.map(s => '/guides/'+s+'/'));
for (const slug of slugs) test(slug + ': substantive source, primary readings, FAQ and internal targets', () => {
 const file = join(root,'src/content/guides',slug+'.md');
 const text = readFileSync(file,'utf8');
 const fm = parse(text.match(/^---\n([\s\S]*?)\n---/)[1]);
 const result = gateSource(file,{knownPaths:paths});
 assert.deepEqual(result.errors,[]);
 assert.ok(result.bodyChars >= 1400);
 assert.equal(fm.draft,false);
 assert.ok(fm.checklist.length >= 3);
 assert.ok(fm.faq.length >= 2);
 assert.ok(result.questionH2 >= 4);
 for(const source of fm.sources) assert.ok(readings.readings.some(r => r.url === source.url && r.usedBy.includes(slug)),source.url);
 assert.ok(!fm.product);
});
test('required topics retained and launch threshold preserved', () => {
 const files = readdirSync(join(root,'src/content/guides')); for (const slug of slugs) assert.ok(files.includes(slug+'.md'));
 assert.equal(RULES.bodyMinNonSpaceKo,1400);
 assert.match(readFileSync(join(root,'scripts/gate.mjs'),'utf8'),/guides.length<8/);
});

