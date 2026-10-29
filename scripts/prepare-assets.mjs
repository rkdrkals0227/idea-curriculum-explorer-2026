import {mkdir,copyFile,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {dirname,join} from 'node:path';
const root=new URL('../',import.meta.url);
await mkdir(new URL('../public/sources/',import.meta.url),{recursive:true});
await copyFile(new URL('../node_modules/pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url),new URL('../public/pdf.worker.min.mjs',import.meta.url));
const records=JSON.parse(await readFile(new URL('../data/curriculum.json',import.meta.url),'utf8'));
const general=JSON.parse(await readFile(new URL('../data/general.json',import.meta.url),'utf8'));
const sources=new Map(records.map(r=>[r.source.pdf,r.source.sha256]));
sources.set(general.pdf,'343e41fa969209381eabebcc8cf852e4e37d91810cf59e7b8f25cb71285ef9af');
for(const [path,sha] of sources){
 const dest=new URL('../public'+path,import.meta.url);
 let bytes;try{bytes=await readFile(dest)}catch{}
 if(bytes&&createHash('sha256').update(bytes).digest('hex')===sha)continue;
 const response=await fetch('https://idea-curriculum-2026.workspace-889499.chatgpt.site'+path);
 if(!response.ok)throw new Error('원문 PDF 다운로드 실패: '+path+' '+response.status);
 bytes=Buffer.from(await response.arrayBuffer());
 if(createHash('sha256').update(bytes).digest('hex')!==sha)throw new Error('원문 PDF 해시 불일치: '+path);
 await writeFile(dest,bytes);
 console.log('Prepared '+path);
}
