import seed from '../../../data/curriculum.json';
import {getChatGPTUser} from '../../chatgpt-auth';
import {db} from '../../../lib/server';
export const dynamic='force-dynamic';
export async function GET(){const u=await getChatGPTUser();let personal:any[]=[];let storageError=false;if(u){try{const result=await db().prepare('SELECT body FROM standards WHERE user_id = ? AND status = ?').bind(u.userId,'personal_reviewed').all<{body:string}>();personal=result.results.map(r=>JSON.parse(r.body))}catch{storageError=true}}return Response.json({records:[...seed,...personal],signedIn:!!u,storageError,mode:'expanded-keyword',aiConnected:false},{headers:{'Cache-Control':'private, no-store'}})}
