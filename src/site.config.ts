import data from './data/site.json';
export const site={...data,adsEnabled:import.meta.env.PUBLIC_ADS_ENABLED==='true',ga4Id:import.meta.env.PUBLIC_GA4_ID||'',gscVerification:import.meta.env.PUBLIC_GSC_VERIFICATION||'',naverVerification:import.meta.env.PUBLIC_NAVER_VERIFICATION||'',affiliateUrls:{coupang:'',ohou:'',toss:'',naver:''}};
