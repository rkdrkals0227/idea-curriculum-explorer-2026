export type Source={title:string;publisher:string;notice:string;date:string;book:string;page:number;printedPage?:string;url:string;pdf:string;checked?:string;versionNote?:string};
export type Standard={entryType?:'standard'|'activity';id:string;code:string;text:string;school:string;grades:number[];band:string;subject:string;area:string;status:'source_verified'|'personal_reviewed'|'draft';source:Source;tags:string[];explanation?:string|null;keyIdeas?:string[]|null;knowledge?:string[]|null;process?:string[]|null;values?:string[]|null;competencies?:string[]|null;contentScope?:string;contentPage?:number|null;explanationPage?:number|null;subjectCompetenciesPage?:number|null;unit?:string|null;unitStatus?:string;};
export type Filters={school?:string;grade?:string;subject?:string;area?:string;notice?:string;exact?:boolean;personal?:boolean};
const groups=[['환경','생태','생태계','보호','보전','지속가능','기후','생물','자연','환경문제'],['지역','고장','우리동네','주민','공동체','지역문제','민주'],['소수','덧셈','뺄셈','계산','연산'],['디지털','시민성','정보통신','온라인','매체','인공지능','저작권','미디어'],['우주','행성','태양계','별자리','밤하늘','태양','지구의 운동','공전']];
export const coreCompetencies=['자기관리 역량','지식정보처리 역량','창의적 사고 역량','심미적 감성 역량','협력적 소통 역량','공동체 역량'];
export function normalize(s:string){return s.normalize('NFKC').replace(/[–−]/g,'-').replace(/\s+/g,'').toLowerCase()}
export function searchStandards(records:Standard[],query:string,f:Filters={}){
 const q=normalize(query);
 const words=[...new Set(query.split(/\s+/).map(normalize).map(w=>w.length>2?w.replace(/(에서|으로|과|와|의|를|을)$/,''):w).filter(w=>w.length>1&&!['우리','하는','수업'].includes(w)))];
 const expanded=[...new Set(groups.filter(g=>g.some(w=>q.includes(w))).flat())];
 return records.filter(r=>r.status!=='draft'&&(r.status!=='personal_reviewed'||f.personal)&&(!f.school||f.school==='전체'||r.school===f.school)&&(!f.grade||r.grades.includes(+f.grade))&&(!f.subject||r.subject===f.subject)&&(!f.area||r.area===f.area)&&(!f.notice||r.source.notice===f.notice)).map(r=>{
 const body=normalize([r.code,r.text].join(' '));
 const area=normalize(r.area);
 const official=body+area+normalize(r.subject);
 const auxiliary=normalize(r.tags.join(' '));
 const direct=!!q&&official.includes(q);
 const bodyMatch=!!q&&body.includes(q);
 const areaMatch=!!q&&area.includes(q);
 const matches=words.filter(w=>body.includes(w));
 const terms=expanded.filter(w=>body.includes(w)&&!q.includes(w));
 const tagMatch=!!q&&auxiliary.includes(q);
 const score=!q?1:f.exact?(direct?200:0):(bodyMatch?220:0)+(areaMatch?20:0)+matches.length*20+terms.length*35+(tagMatch?12:0);
 const reason=!q?'등록된 공식 원문에서 출발해 수업 주제와의 연결을 살펴보세요.':bodyMatch?'입력한 표현이 성취기준 원문 또는 코드에 직접 나타납니다.':terms.length?`원문의 ‘${terms.slice(0,4).join(' · ')}’ 표현을 통해 주제와 연결한 탐색 제안입니다. 원문을 읽고 실제 관련성을 확인하세요.`:areaMatch?'입력한 표현이 교육과정 영역에 나타납니다. 성취기준 원문의 내용도 확인해 주세요.':matches.length?`원문의 ‘${matches.join(' · ')}’ 내용과 연결됩니다. 수업 목표와 일치하는지 직접 판단해 보세요.`:'검색 보조어로 연결한 탐색 제안입니다. 원문을 읽고 주제와의 실제 관련성을 확인하세요.';
 return {...r,score,reason};
 }).filter(r=>r.score>0).sort((a,b)=>b.score-a.score||a.code.localeCompare(b.code));
}
export function officialUrl(s:string){try{const u=new URL(s);return u.protocol==='https:'&&['moe.go.kr','ncic.re.kr','ncic.go.kr','ne.go.kr','law.go.kr'].some(d=>u.hostname===d||u.hostname.endsWith('.'+d))}catch{return false}}
export function validateRecord(r:Standard,pageCount?:number){
 const errors:string[]=[];
 if(!r||typeof r!=='object')return ['성취기준 형식을 확인하세요.'];
 if(r.entryType==='activity'){if(r.code!==''||r.subject!=='창의적 체험활동')errors.push('활동 자료는 창의적 체험활동에 한하며 성취기준 코드를 만들 수 없습니다.')}else if(typeof r.code!=='string'||!/^\[?\d{1,2}[가-힣A-Za-z0-9·]+(?:[-–−]\d{2}){1,2}\]?$/.test(r.code))errors.push('성취기준 코드를 확인하세요.');
 if(typeof r.text!=='string'||!r.text.trim())errors.push('원문이 필요합니다.');
 if(!r.source||typeof r.source.url!=='string'||!officialUrl(r.source.url))errors.push('교육부·NCIC·국가교육위원회 공식 HTTPS 출처가 필요합니다.');
 if(!Number.isInteger(r.source?.page)||r.source.page<1||(pageCount!==undefined&&r.source.page>pageCount))errors.push('PDF 실제 쪽수 범위를 확인하세요.');
 for(const k of ['title','publisher','notice','date','book'] as const)if(typeof r.source?.[k]!=='string'||!r.source[k].trim())errors.push(`${k} 출처 정보가 필요합니다.`);
 if(!['초등학교','중학교','고등학교'].includes(r.school)||!Array.isArray(r.grades)||!r.grades.length||r.grades.some(g=>!Number.isInteger(g)||g<1||g>(r.school==='초등학교'?6:3)))errors.push('학교급·학년 범위를 확인하세요.');
 for(const k of ['band','subject','area'] as const)if(typeof r[k]!=='string'||!r[k].trim())errors.push('학년군·교과·영역을 확인하세요.');
 for(const k of ['tags','keyIdeas','knowledge','process','values','competencies'] as const){const v=r[k];if((k==='tags'||v!=null)&&(!Array.isArray(v)||v.some(x=>typeof x!=='string')))errors.push(`${k}는 문자열 목록이어야 합니다.`)}
 for(const k of ['explanation','contentScope','unit'] as const)if(r[k]!=null&&typeof r[k]!=='string')errors.push(`${k} 내용을 확인하세요.`);
 for(const k of ['contentPage','explanationPage','subjectCompetenciesPage'] as const)if(r[k]!=null&&(!Number.isInteger(r[k])||r[k]!<1||(pageCount!==undefined&&r[k]!>pageCount)))errors.push(`${k} 쪽수를 확인하세요.`);
 return errors;
}
export function applicationYear(school:string,grade:number){return school==='초등학교'?2023+Math.ceil(grade/2):2024+grade}
export function extractCandidates(pages:string[]){return pages.flatMap((s,i)=>{const matches=[...s.matchAll(/\[(\d{1,2}[가-힣A-Za-z0-9·]+(?:[-–−]\d{2}){1,2})\]/g)];return matches.map((m,j)=>({code:`[${m[1]}]`,text:s.slice((m.index||0)+m[0].length,matches[j+1]?.index??s.length).trim().split(/(?:\(가\)|성취기준 해설|성취기준 적용 시)/)[0].trim(),page:i+1})).filter(x=>x.text.length>5)}).filter((r,i,all)=>all.findIndex(x=>x.code===r.code)===i)}
export function competencySuggestions(r:Standard){if(r.subject==='수학')return ['지식정보처리 역량','창의적 사고 역량','협력적 소통 역량'];if(r.subject==='과학')return ['지식정보처리 역량','공동체 역량','창의적 사고 역량'];if(r.subject==='도덕')return ['자기관리 역량','공동체 역량','협력적 소통 역량'];return ['공동체 역량','협력적 소통 역량','지식정보처리 역량']}

export const elementarySubjects=['국어','수학','사회','과학','영어','음악','미술','도덕','실과','창의적 체험활동','바른 생활','슬기로운 생활','즐거운 생활'];
export function gradeSubjectNote(grade:string|undefined,subject:string|undefined){
 if(!grade||!subject)return '';
 const g=Number(grade);
 if(g<=2&&['사회','과학','영어','음악','미술','도덕','실과'].includes(subject))return `초등 ${g}학년에는 ${subject}이(가) 독립 교과로 편성되지 않습니다. 1~2학년의 바른 생활·슬기로운 생활·즐거운 생활을 별도로 탐색해 보세요. 통합교과의 내용이 해당 교과의 성취기준을 뜻하지는 않습니다.`;
 if(g<=4&&subject==='실과')return '실과는 초등 5~6학년군 교과입니다. 5학년 또는 6학년을 선택해 주세요.';
 if(g>=3&&['바른 생활','슬기로운 생활','즐거운 생활'].includes(subject))return '이 통합교과는 초등 1~2학년군에 해당합니다. 1학년 또는 2학년을 선택해 주세요.';
 return '';
}
export function recordLabel(r:Standard){return r.entryType==='activity'?'활동 내용 · 성취기준 코드 없음':r.code}
