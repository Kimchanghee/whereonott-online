// OG cards (1200x630) in the screening-room palette, set in self-hosted Pretendard (public/fonts, OFL).
// fontconfig is pointed at public/fonts through a throwaway config in the OS temp dir before sharp loads.
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
const fontDir=path.resolve('public/fonts').replace(/\\/g,'/');
const confDir=fs.mkdtempSync(path.join(os.tmpdir(),'whereonott-og-'));
const conf=path.join(confDir,'fonts.conf');
fs.writeFileSync(conf,`<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><dir>${fontDir}</dir><cachedir>${confDir.replace(/\\/g,'/')}/cache</cachedir></fontconfig>`);
process.env.FONTCONFIG_FILE=conf;
const sharp=(await import('sharp')).default;
const esc=(s)=>String(s).replace(/[<&>"]/g,'');
const F="font-family=\"Pretendard\"";
const frame=(inner)=>`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f5f0e8"/><rect x="0" y="0" width="1200" height="470" fill="#16120f"/><rect x="0" y="470" width="1200" height="8" fill="#c4863a"/>${inner}<text x="80" y="560" fill="#6b2230" font-size="30" ${F} font-weight="800">거실상영관</text><text x="250" y="560" fill="#51463c" font-size="26" ${F} font-weight="400">홈시네마 장비 구매 가이드 · whereonott.online</text></svg>`;
const wrap=(title,max=16)=>{const lines=[];let cur='';for(const w of title.split(' ')){if((cur+' '+w).trim().length>max&&cur){lines.push(cur.trim());cur=w;}else cur=(cur+' '+w).trim();}if(cur)lines.push(cur);return lines.slice(0,3);};
fs.mkdirSync('public/og',{recursive:true});
await sharp(Buffer.from(frame(`<text x="80" y="120" fill="#c4863a" font-size="30" ${F} font-weight="700">상영 전 확인 노트</text><text x="80" y="250" fill="#f4ede2" font-size="76" ${F} font-weight="800">오늘의 영화보다 먼저,</text><text x="80" y="350" fill="#f4ede2" font-size="76" ${F} font-weight="800">우리 집의 조건.</text><text x="80" y="425" fill="#cdbfa9" font-size="32" ${F} font-weight="400">거리 → 연결 → 자리</text>`))).png().toFile('public/og/home.png');

// Per-pick OG cards from post frontmatter (title text only; no product imagery).
const postsDir='src/content/posts';
if(fs.existsSync(postsDir)){fs.mkdirSync('public/og/picks',{recursive:true});
for(const n of fs.readdirSync(postsDir)){if(!n.endsWith('.md')||n.startsWith('_'))continue;const raw=fs.readFileSync(postsDir+'/'+n,'utf8');const slug=(raw.match(/^slug:\s*"?([a-z0-9-]+)"?/m)||[])[1];const title=esc((raw.match(/^title:\s*"(.*)"\s*$/m)||[])[1]||'');if(!slug)continue;
const t=wrap(title).map((l,i)=>`<text x="80" y="${215+i*84}" fill="#f4ede2" font-size="62" ${F} font-weight="800">${l}</text>`).join('');
await sharp(Buffer.from(frame(`<text x="80" y="110" fill="#c4863a" font-size="28" ${F} font-weight="700">구매 전 확인 노트 · 제휴 링크 포함</text>${t}`))).png().toFile(`public/og/picks/${slug}.png`);}}

// Per-category OG cards.
const siteData=JSON.parse(fs.readFileSync('src/data/site.json','utf8'));fs.mkdirSync('public/og/category',{recursive:true});
for(const c of siteData.categories){await sharp(Buffer.from(frame(`<text x="80" y="120" fill="#c4863a" font-size="30" ${F} font-weight="700">분야별 모음 · ${esc(c.code)}</text><text x="80" y="270" fill="#f4ede2" font-size="80" ${F} font-weight="800">${esc(c.name)}</text><text x="80" y="370" fill="#cdbfa9" font-size="32" ${F} font-weight="400">${esc(c.blurb).slice(0,40)}</text>`))).png().toFile(`public/og/category/${c.slug}.png`);}
fs.rmSync(confDir,{recursive:true,force:true});
