import {db,userId,errorResponse,mutationAllowed} from '../../../lib/server';
import {validWorkspace} from '../../../lib/workspace';
export const dynamic='force-dynamic';
export async function GET(){try{const id=await userId();const r=await db().prepare('SELECT body, updated_at FROM workspaces WHERE user_id = ?').bind(id).first<{body:string;updated_at:string}>();return Response.json({workspace:r?JSON.parse(r.body):null,updatedAt:r?.updated_at||null},{headers:{'Cache-Control':'private, no-store'}})}catch(e){return errorResponse(e)}}
export async function PUT(req:Request){try{
 if(!mutationAllowed(req))return new Response(null,{status:403});
 const id=await userId();const raw=await req.text();if(raw.length>1000000)return Response.json({error:'분석 내용이 너무 큽니다.'},{status:413});
 let input:any;try{input=JSON.parse(raw)}catch{return Response.json({error:'분석 형식을 확인하세요.'},{status:400})}
 if(!validWorkspace(input))return Response.json({error:'분석 항목과 입력 형식을 확인하세요.'},{status:400});
 const data={saved:input.saved,analyses:input.analyses};const at=new Date().toISOString();
 const result=input.revision?await db().prepare('UPDATE workspaces SET body=?,updated_at=? WHERE user_id=? AND updated_at=?').bind(JSON.stringify(data),at,id,String(input.revision)).run():await db().prepare('INSERT INTO workspaces(user_id,body,updated_at) VALUES(?,?,?) ON CONFLICT(user_id) DO NOTHING').bind(id,JSON.stringify(data),at).run();
 if(result.meta.changes===0)return Response.json({error:'다른 탭에서 분석이 변경되었습니다. 작성 내용은 임시 초안으로 보관됩니다. 새로고침 후 다시 저장해 주세요.'},{status:409});
 return Response.json({ok:true,updatedAt:at});
 }catch(e){return errorResponse(e)}}
