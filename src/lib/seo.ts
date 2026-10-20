import {allGuides,allPosts,guidePath,postPath} from './content';import {site} from '../site.config';
import legal from '../data/legal.json';
export const POLICY_DATE='2026-10-16';
export async function siteEntries(){
  const guides=await allGuides();const posts=await allPosts();
  const latest=[...guides.map(g=>g.data.updated),...posts.map(p=>p.data.updated),POLICY_DATE+'T00:00:00+09:00'].sort().at(-1)!;
  const latestOf=(xs:string[])=>xs.length?xs.sort().at(-1)!:latest;
  const urls:{path:string,lastmod:string}[]=[
    {path:'/',lastmod:latest},
    {path:'/guides/',lastmod:latestOf(guides.map(g=>g.data.updated))},
    {path:'/picks/',lastmod:latestOf(posts.map(p=>p.data.updated))},
    ...['about','methodology','contact','privacy','terms','disclaimer'].map(s=>({path:'/'+s+'/',lastmod:POLICY_DATE+'T00:00:00+09:00'})),
    ...site.categories.map(c=>({path:'/category/'+c.slug+'/',lastmod:latestOf([...guides,...posts].filter(e=>e.data.category===c.slug).map(e=>e.data.updated))})),
    ...guides.map(g=>({path:guidePath(g.data.slug),lastmod:g.data.updated})),
    ...posts.map(p=>({path:postPath(p.data.slug),lastmod:p.data.updated})),
  ];
  return {guides,posts,latest,urls,legal};
}
export const iso=(s:string)=>new Date(s).toISOString();

/** Unique title/description per utility page (5-lane pass 2026-10-20). Text restates existing page copy only. */
export const PAGE_META:Record<string,{title:string,description:string,type:string}>={
  about:{title:'거실상영관(WhereOnOTT) 소개: 홈시네마 장비 구매 가이드',description:'거실상영관(WhereOnOTT, whereonott.online)은 OTT 서비스 안내가 아니라 프로젝터·사운드바·TV 주변기기를 공간과 연결 조건으로 고르는 한국어 홈시네마 구매 가이드입니다.',type:'AboutPage'},
  methodology:{title:'편집 방법론: 제조사 문서 우선, 가격·별점 추정 없음',description:'거실상영관은 공식 제조사 문서를 먼저 읽고 공간·연결·설치 조건으로 나누어 설명합니다. 가격·별점·체험 결과를 추정하지 않고, 제휴 글은 상품 옵션과 링크 도착지를 확인한 뒤 고지합니다.',type:'WebPage'},
  contact:{title:'문의 안내: 내용 수정·출처 관련 이메일 접수',description:'거실상영관 글의 내용 수정이나 출처 관련 문의는 contact@whereonott.online으로 보내 주세요. 개인정보와 결제 정보는 메일에 포함하지 마세요.',type:'ContactPage'},
  privacy:{title:'개인정보 및 쿠키 정책: 접속 기록과 분석·광고 쿠키',description:'거실상영관은 회원 가입이나 입력 양식이 없습니다. 호스팅 접속 기록 처리, GA4·Google AdSense 사용 시 쿠키와 기기 식별자, 동의 절차 전 광고 비활성 원칙과 쿠키 설정 방법을 안내합니다.',type:'WebPage'},
  terms:{title:'이용약관: 일반 안내 정보와 판매처 거래 조건',description:'거실상영관의 정보는 구매 판단을 돕는 일반 안내입니다. 상품 거래·배송·반품은 판매처 조건을 따르며, 저작권자 허락 없는 재배포 제한과 오류 신고·수정 절차를 안내합니다.',type:'WebPage'},
  disclaimer:{title:'구매 정보의 범위와 면책: 제조사 설명과 실제 성능',description:'제조사 설명과 편집상 선택 기준은 실제 집에서 측정한 성능과 다릅니다. 거실상영관은 특정 제품의 품질·호환성을 보장하지 않으며 구매 전 설명서·설치 조건·판매 조건 확인을 권합니다.',type:'WebPage'},
  guides:{title:'홈시네마 구매 기준 가이드 전체 목록: 거리·연결·공간',description:'프로젝터 설치 거리, 사운드바 연결 단자, 상영 공간 조건부터 확인하는 거실상영관의 홈시네마 구매 기준 가이드 전체 목록입니다. 상영 준비 가이드에는 제휴 링크가 없습니다.',type:'CollectionPage'},
};
