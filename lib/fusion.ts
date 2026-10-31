import {searchStandards,normalize,type Standard} from './curriculum.ts';
const bridges:Record<string,{terms:string[];activity:string}>={
 '국어':{terms:['자료','설명','발표','의견','토의','정보'],activity:'주제에 관한 자료를 읽고 근거를 정리해 설명하거나 발표하기'},
 '수학':{terms:['자료','그래프','측정','비교','분류'],activity:'주제와 관련된 자료를 모아 분류·비교하고 그래프로 표현하기'},
 '미술':{terms:['표현','시각','매체','이미지'],activity:'조사한 내용을 그림·시각 자료로 표현하고 의미를 나누기'},
 '음악':{terms:['만들','표현','느낌','상상'],activity:'주제에서 떠오른 느낌을 소리와 음악으로 표현하기'},
 '영어':{terms:['정보','문장','표현','소개'],activity:'학습한 쉬운 영어 표현으로 주제의 핵심 내용을 소개하기'},
 '사회':{terms:['조사','문제','참여','지역'],activity:'생활 속 사례를 조사하고 공동체와 연결해 의견 나누기'},
 '과학':{terms:['관찰','조사','탐구','자료'],activity:'주제와 관련된 현상을 관찰하고 자료를 근거로 설명하기'},
 '도덕':{terms:['존중','책임','배려','실천'],activity:'주제와 관련된 선택의 영향을 생각하고 책임 있는 실천을 토의하기'},
 '실과':{terms:['문제','설계','제작','생활'],activity:'생활 속 문제를 찾아 해결 방법을 설계하고 만들어 보기'},
};
export function fusionCandidates(records:Standard[],query:string,grade:string,weak=true){
 if(!query.trim()||!grade)return [];
 const pool=records.filter(r=>r.school==='초등학교'&&r.status==='source_verified'&&r.grades.includes(Number(grade)));
 const direct=searchStandards(pool,query,{});
 if(!direct.length)return [];
 const anchors=direct.slice(0,3);
 return pool.flatMap(r=>{
  const hit=direct.find(d=>d.id===r.id);const bridge=bridges[r.subject];
  const words=bridge?.terms.filter(t=>normalize(r.text).includes(normalize(t)))||[];
  const anchor=anchors.find(a=>a.subject!==r.subject);
  if(!hit&&(!weak||!anchor||!words.length))return [];
  const reason=hit?hit.reason:`활동을 통한 간접 연결 · 원문 ‘${words.join(' · ')}’와 연결 가능. ${anchor!.subject} ${anchor!.code}에서 탐색한 ‘${query}’ 내용을 활용해 ${bridge.activity}. 주제 자체의 직접 일치는 아닙니다.`;
  return [{...r,score:hit?hit.score+100:words.length,reason,connection:hit?'내용 연결':'활동 연결 · 검토 필요',idea:bridge?`‘${query}’: ${bridge.activity}. 성취기준의 내용 범위에 맞게 활동을 조정하세요.`:`‘${query}’와 원문의 공통 내용을 찾아 학습 활동을 구상하세요.`}];
 }).sort((a,b)=>b.score-a.score);
}
