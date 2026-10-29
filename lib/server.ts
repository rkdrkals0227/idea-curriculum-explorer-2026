import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../app/chatgpt-auth';
export async function userId(){const u=await getChatGPTUser();if(!u)throw new Error('AUTH');return u.userId}
export function db(){if(!env.DB)throw new Error('STORAGE');return env.DB}
export function bucket(){if(!env.BUCKET)throw new Error('STORAGE');return env.BUCKET}
export function errorResponse(e:unknown){const s=e instanceof Error?e.message:'';if(s!=='AUTH')console.error('IDEA request error',e instanceof Error?e.stack:String(e));return Response.json({error:s==='AUTH'?'로그인 후 사용할 수 있습니다.':s==='STORAGE'?'저장소 연결을 확인해 주세요.':'요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.'},{status:s==='AUTH'?401:500})}
export function mutationAllowed(req:Request){const origin=req.headers.get('origin');return !origin||origin===new URL(req.url).origin}
