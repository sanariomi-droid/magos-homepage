# MAGOS 홈페이지 v3.3 최종 검증 보고서

## 검증 완료

- 필수 경로 존재 확인
- 루트 중복 실행파일 부재 확인
- `.git`, `node_modules`, `dist`, `.vercel` 부재 확인
- package.json·package-lock.json 일치 확인
- Node.js 22.x 설정 확인
- `vercel.json` JSON 문법 확인
- `vercel.json.functions` 제거 확인
- `api/contact.js` JavaScript 문법 확인
- App.jsx·main.jsx·entry-server.jsx JSX 구문 파싱 확인
- `/api/contact` GET 상태검사 테스트 통과
- 필수값 누락 422 테스트 통과
- EmailJS 성공중계 모의시험 통과
- EmailJS 403 상세전달 모의시험 통과
- Content Security Policy 인라인 JSON-LD SHA-256 해시 확인
- 필수 로고·OG 이미지·PoC PDF 존재 확인

## 배포 후 반드시 확인할 외부 항목

코드 검증과 별개로 다음은 실제 계정에서 확인해야 합니다.

- Vercel Production 환경변수
- EmailJS Gmail 연결 상태
- EmailJS 템플릿 To Email과 Reply To
- EmailJS 허용 도메인
- EmailJS 월간 전송한도
- 실제 ceo@magos.ai.kr 수신

## 빌드 검증 안내

교체본에는 `npm run validate`, `npm test`, `npm run build` 순서가 포함되어 있습니다. 최종 배포 전 로컬 또는 Vercel에서 세 단계가 모두 성공해야 합니다.
