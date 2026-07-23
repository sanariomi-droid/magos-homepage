# MAGOS 홈페이지 v3.1 최종 검증 보고서

## 소스 구조

- React + Vite 구조: 정상
- 실제 실행 파일: `src/App.jsx`
- 중복 루트 `App.jsx`: 없음
- 이미지·PDF 경로: `public/` 기준으로 통일
- 미배포 PoC 주소 404 방지: 반영

## 상담메일

- EmailJS REST `/send` 방식: 반영
- JSON 요청구조: service_id / template_id / user_id / template_params
- Vercel 환경변수 우선 + 공개 운영값 기본값: 반영
- 15초 타임아웃: 반영
- 접수번호·접수시각·도메인·페이지주소: 반영
- 성공 후 폼 초기화: 반영
- 실패 상태코드·상세원인 표시: 반영
- 자동 mailto 실행: 제거

## 콘텐츠

- 고객 요구 3가지: 반영
- 현장 적용 4개 분야: 반영
- 구조검토서·공학판단서 비교표: 반영
- 샘플 결과물 3종: 반영
- 현장 PoC 3종: 반영
- 특허출원 포트폴리오 14건: 반영
- 2026~2031 로드맵: 반영

## 보안·검색

- EmailJS API CSP 허용: 반영
- 불필요한 외부 PoC 연결 제거: 반영
- JSON-LD CSP SHA-256 해시 재계산: 완료
- 정적 사전 렌더링 파일 구성: 정상
- robots.txt·sitemap.xml·webmanifest: 포함

## 수행한 정적 검증

- `src/App.jsx`, `src/main.jsx`, `src/entry-server.jsx` JSX 구문 파싱: 정상
- 필수 로컬 이미지·PDF 존재 확인: 정상
- 오래된 특허 13건 문구 제거: 완료
- 자동 mailto 안내문 제거: 완료

## 외부 계정 의존사항

EmailJS의 Gmail 서비스 연결, 템플릿 수신자, 허용도메인과 전송한도는 소스파일 바깥의 계정 설정입니다. 해당 설정은 `EMAILJS_SETUP_CHECKLIST.md`에 따라 별도로 확인해야 합니다.
