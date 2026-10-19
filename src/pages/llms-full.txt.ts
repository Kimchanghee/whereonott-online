import {siteEntries} from '../lib/seo';import {site} from '../site.config';import {guidePath,postPath,ymd} from '../lib/content';
const clean=(md:string)=>md.replace(/<[^>]+>/g,'').replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\n{3,}/g,'\n\n').trim();
export async function GET(){const {guides,posts,latest}=await siteEntries();const L:string[]=[];
L.push('# '+site.name+' — 전체 본문','','> '+site.description,'','마지막 갱신: '+ymd(latest),'');
for(const [kind,list,path] of [['상영 준비 가이드',guides,guidePath],['상품 노트(제휴 링크 포함)',posts,postPath]] as const){
  for(const e of list as any[]){const d=e.data;L.push('---','','## '+d.title,'','- URL: '+site.url+(path as any)(d.slug),'- 구분: '+kind,'- 발행: '+ymd(d.published)+' / 수정: '+ymd(d.updated),...(d.data_asof?['- 자료 기준일: '+d.data_asof]:[]),...(d.product?['- 상품: '+d.product.name+' ('+d.product.optionDetail+')','- 제휴: 이 글의 상품 링크는 제휴 링크입니다.']:[]),'','질문: '+d.question,'','답: '+d.answer,'',clean(e.body??''),'');
    if(d.faq?.length){L.push('### 자주 묻는 질문');for(const f of d.faq)L.push('- Q. '+f.q,'  A. '+f.a);L.push('');}
    L.push('### 출처');for(const s of d.sources)L.push('- '+s.title+': '+s.url);L.push('');}
}
return new Response(L.join('\n'),{headers:{'Content-Type':'text/plain; charset=utf-8'}})}
