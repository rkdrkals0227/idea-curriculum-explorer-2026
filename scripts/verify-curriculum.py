"""Verify quoted text against immutable official PDF files using pdftotext."""
from pathlib import Path
import json,re,subprocess,hashlib
root=Path(__file__).resolve().parents[1]
records=json.loads((root/'data/curriculum.json').read_text())
normal=lambda s:re.sub(r'\s+','',s)
pages={}
for record in records:
    source=record['source'];path=root/'public'/source['pdf'].lstrip('/')
    if path not in pages:
        pages[path]=subprocess.check_output(['pdftotext','-layout',str(path),'-']).decode().split('\f')
        assert hashlib.sha256(path.read_bytes()).hexdigest()==source['sha256'],str(path)
    text=pages[path][source['page']-1]
    if record.get('entryType')=='activity':
        assert record['code']=='' and record['subject']=='창의적 체험활동',record['id']
    else:
        assert record['code'] in text,(record['id'],'code')
    assert normal(record['text']) in normal(text),(record['id'],'text')
    if record.get('explanation'):
        assert normal(record['explanation']) in normal(pages[path][record['explanationPage']-1]),record['id']
    for name in record.get('competencies') or []:
        assert normal(name) in normal(pages[path][record['subjectCompetenciesPage']-1]),(record['id'],name)
general=json.loads((root/'data/general.json').read_text())
general_text=subprocess.check_output(['pdftotext','-layout',str(root/'public'/general['pdf'].lstrip('/')),'-']).decode().split('\f')[general['page']-1]
for definition in general['definitions']:assert normal(definition) in normal(general_text)
print(f'PASS: {len(records)} standards, source PDF hashes, registered explanations/subject competencies and 6 general competencies match the specified source pages.')
