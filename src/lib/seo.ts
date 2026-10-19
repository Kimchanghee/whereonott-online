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
