# MAGOS 홈페이지 최종 변경사항

## v3.1.0 — 상담메일·PoC 연결 완전교체본

- 실제 실행파일 `src/App.jsx`를 기준으로 전체 정리
- EmailJS SDK 동적 로딩 대신 공식 REST `/send` 방식 적용
- `service_id`, `template_id`, `user_id`, `template_params` 구조 적용
- 전송 제한시간 15초와 오류 상태코드 표시 추가
- 접수번호·접수시각·페이지주소·접속도메인 전송 추가
- 성공 시 상담 입력란 자동 초기화
- 자동 `mailto:` 전환 제거
- 미배포 `https://app.magos.ai.kr` 주소를 자동 차단
- 실제 PoC 앱 배포 전 공개 PDF로 연결
- CSP `connect-src`에 `https://api.emailjs.com` 유지
- CSP JSON-LD SHA-256 해시 재계산
- 특허출원 포트폴리오 14건 표현 통일
- README·배포문서·검증보고서 전면 갱신

## v3.0.0 — 현장 적용형 개편

- 메인 메시지를 고객가치 중심으로 교체
- 현장 적용·샘플 결과물·PoC 프로그램 추가
- 고객 요구 3가지 전용 섹션 추가
- 구조검토서와 공학판단서 비교표 추가
- BIM·3차원 스캔 객체증거 적용분야 반영
- 2026~2031 사업화 로드맵 추가
- 정적 사전 렌더링과 Vercel 보안헤더 적용
