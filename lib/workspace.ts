import type {Standard} from './curriculum.ts';
export function analysisRecords(a:{ids:string[];snapshots?:Standard[]},catalog:Standard[]):Standard[]{return a.ids.map(id=>a.snapshots?.find(r=>r.id===id)||catalog.find(r=>r.id===id)).filter((r):r is Standard=>!!r)}
export function mergeCandidates(extracted:{code:string;text:string;page:number}[],saved:any[]){const all=new Map(extracted.map(x=>[x.code,x]));for(const r of saved)all.set(r.code,{code:r.code,text:r.text,page:r.source.page});return [...all.values()]}
export function validWorkspace(data:any):boolean{
 const strings=(a:any)=>Array.isArray(a)&&a.length<=500&&a.every(x=>typeof x==='string'&&x.length<200);
 if(!data||!strings(data.saved)||!Array.isArray(data.analyses)||data.analyses.length>100)return false;
 return data.analyses.every((a:any)=>a&&['id','title','grade','subject','needs','elements','ai','fusion','reflection','updatedAt'].every(k=>typeof a[k]==='string'&&a[k].length<=15000)&&strings(a.ids)&&strings(a.competencies)&&(a.snapshots===undefined||(Array.isArray(a.snapshots)&&a.snapshots.length<=100&&a.snapshots.every((r:any)=>r&&typeof r.id==='string'&&typeof r.text==='string'&&typeof r.code==='string'&&r.source&&typeof r.source.url==='string'&&typeof r.source.pdf==='string'))));
}
