# IDEA 교육과정 탐색 도우미

[사이트 바로 열기 — GPT 로그인 없이 검색](https://idea-curriculum-2026.workspace-889499.chatgpt.site/)

2022 개정 교육과정 초등 1~6학년 성취기준 562건과 창의적 체험활동 영역 3건. 주제 검색, 공식 PDF 원문 확인, 같은 학년군 교과 융합 탐색, 나의 분석 저장. 비로그인 분석은 현재 브라우저에만 보관되며 사이트 데이터 삭제나 다른 기기에서는 복원되지 않습니다. 로그인 계정 저장은 계정과 연결됩니다.

교과 융합의 학기 선택은 수업 예정 학기입니다. 교과서별 실제 단원 배정은 확인이 필요합니다. 연결 활동은 설계 제안이며 공식 성취기준 원문과 구분됩니다.

## 개발 실행

Node.js 22+에서 `pnpm install` 후 `pnpm dev`. `scripts/prepare-assets.mjs`가 공개 사이트에서 공식 PDF 사본을 내려받아 해시를 대조하고 pdf.js worker를 복사합니다. 공식 출처와 버전은 `docs/SOURCES.md`에 있습니다. 서버의 계정별 저장·PDF 업로드에는 Cloudflare Workers D1/R2가 필요하며, GitHub Pages만으로는 실행되지 않습니다.
