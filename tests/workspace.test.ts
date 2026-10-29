import {test} from 'node:test';
import assert from 'node:assert/strict';
import {analysisRecords,mergeCandidates} from '../lib/workspace.ts';
const original:any={id:'record-1',code:'[4수01-16]',text:'당시 원문',source:{notice:'2022-33'}};
test('analysis preserves original evidence after catalog edit or withdrawal',()=>{const a={ids:['record-1'],snapshots:[original]};assert.equal(analysisRecords(a,[])[0].text,'당시 원문');assert.equal(analysisRecords(a,[{...original,text:'수정됨'}])[0].text,'당시 원문')});
test('manual saved candidates can be reopened even with no extracted text',()=>{const c=mergeCandidates([],[{...original,source:{page:7}}]);assert.equal(c.length,1);assert.equal(c[0].code,original.code);assert.equal(c[0].page,7)});
import {validWorkspace} from '../lib/workspace.ts';
test('workspace rejects records that would break saved analysis UI',()=>{assert.equal(validWorkspace({saved:[],analyses:[{}]}),false);assert.equal(validWorkspace({saved:[null],analyses:[]}),false);assert.equal(validWorkspace({saved:[],analyses:[]}),true)});
