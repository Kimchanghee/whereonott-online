import {siteEntries} from '../lib/seo';import {site} from '../site.config';import {guidePath,postPath,ymd} from '../lib/content';
export async function GET(){const {guides,posts,latest}=await siteEntries();const L:string[]=[];
L.push('# '+site.name+' ('+site.nameEn+')','','> '+site.description,'');
L.push('- 사이트: '+site.url+'/','- 언어: 한국어(ko-KR)','- 마지막 갱신: '+ymd(latest),'- 전체 본문: '+site.url+'/llms-full.txt','- 사이트맵: '+site.url+'/sitemap-index.xml','- RSS: '+site.url+'/rss.xml','');
L.push('## 편집 원칙','- 사양과 수치는 제조사 공식 문서·표준 문서에서만 옮기고, 출처와 기준일을 글마다 표시합니다.','- 사용 후기·체험담·가격·재고·평점은 만들지 않습니다.','- 상영 준비 가이드(/guides/)에는 제휴 링크가 없습니다. 상품 노트(/picks/)는 쿠팡 파트너스 등 제휴 링크를 포함하며 글 맨 위에 제휴 사실을 표시합니다.','- 인용 시 페이지 URL과 기준일을 함께 표기해 주세요.','');
L.push('## 상영 준비 가이드');for(const g of guides)L.push('- ['+g.data.title+']('+site.url+guidePath(g.data.slug)+'): '+g.data.answer);L.push('');
if(posts.length){L.push('## 상품 노트 (제휴 링크 포함)');for(const p of posts)L.push('- ['+p.data.title+']('+site.url+postPath(p.data.slug)+'): '+p.data.answer);L.push('');}
L.push('## 사이트 정보','- [편집 기준]('+site.url+'/methodology/)','- [소개]('+site.url+'/about/)','- [면책]('+site.url+'/disclaimer/)','- 문의: '+site.contactEmail,'');
return new Response(L.join('\n'),{headers:{'Content-Type':'text/plain; charset=utf-8'}})}
