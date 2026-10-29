# IDEA 교육과정 탐색 도우미

**[웹사이트 바로 열기](https://idea-curriculum-2026.workspace-889499.chatgpt.site/)** — 계정 없이 검색하고 공식 교육과정 PDF 원문을 확인할 수 있습니다. 개인 분석 저장에는 ChatGPT 로그인이 필요합니다.

2022 개정 교육과정 초등 1~6학년 성취기준 562건, 창의적 체험활동 영역 3건을 검색합니다. 원문 근거와 PDF 쪽을 연결하고 교과 비교와 IDEA I 단계 분석을 지원합니다. 관련어 검색은 규칙 기반이며 생성형 AI는 연결되지 않았습니다.

## 개발 실행
Node.js 22+ 및 pnpm을 준비하고 `pnpm install` 후 `pnpm dev`를 실행하세요. 첫 실행 시 `scripts/prepare-assets.mjs`가 운영 사이트에서 공식 PDF 사본을 내려받아 SHA-256으로 대조하고 pdf.js worker를 복사합니다. PDF 사본과 worker는 GitHub 저장소에 포함하지 않았습니다. 공식 문서별 출처와 버전은 [docs/SOURCES.md](docs/SOURCES.md)에 있습니다.

개인 저장·PDF 업로드 등 서버 기능은 Cloudflare Workers의 D1/R2와 ChatGPT 로그인 환경이 필요합니다. GitHub Pages는 이 서버 기능을 실행하지 않으므로 위의 운영 사이트 URL을 공유하세요.
