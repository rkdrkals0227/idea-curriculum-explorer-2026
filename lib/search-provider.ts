import type {Standard} from './curriculum';
export type AiSuggestion={recordId:string;explanation:string};
export interface CurriculumSearchProvider{search(query:string,candidates:Standard[]):Promise<AiSuggestion[]>}
// AI may rank known records and add clearly labelled interpretations; it cannot create official fields.
export function applyAiSuggestions(candidates:Standard[],suggestions:AiSuggestion[]){
 const known=new Map(candidates.filter(r=>r.status!=='draft').map(r=>[r.id,r]));const seen=new Set<string>();
 return suggestions.flatMap(s=>{const record=known.get(s.recordId);if(!record||seen.has(record.id)||typeof s.explanation!=='string')return [];seen.add(record.id);return [{record,interpretation:s.explanation.slice(0,3000),kind:'ai_interpretation' as const}]});
}
