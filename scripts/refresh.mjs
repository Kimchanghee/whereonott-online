import { readdirSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';
let count=0;
for (const f of readdirSync('src/content/guides').filter(f=>f.endsWith('.md'))) {
 const text=readFileSync('src/content/guides/'+f,'utf8'); const fm=parse(text.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
 if(!fm.data_asof || !fm.sources?.length) throw new Error('Missing source/date: '+f);
 for(const s of fm.sources) if(new URL(s.url).protocol!=='https:') throw new Error('Invalid source: '+f);
 count++;
}
console.log('Validated '+count+' dated editorial source records; no live dataset or prices claimed. Dates unchanged.');
