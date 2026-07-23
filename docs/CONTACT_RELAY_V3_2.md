# MAGOS Contact Relay v3.2

상담 양식은 브라우저에서 EmailJS로 직접 전송하지 않습니다.

1. 브라우저가 동일 도메인의 `/api/contact`에 문의정보를 전송합니다.
2. Vercel Function이 입력값을 검증합니다.
3. Vercel Function이 EmailJS REST API를 호출합니다.
4. 성공 시 접수번호를 반환하고, 실패 시 실제 상태코드와 상세사유를 반환합니다.

## Vercel 환경변수
기존 `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`를 그대로 사용할 수 있습니다.
서버 전용 이름 `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`를 추가해도 됩니다.

## 배포 확인
- 홈페이지 문의 폼 아래 `Contact Relay v3.2.0` 표시 확인
- `https://도메인/api/contact`를 브라우저에서 열면 `MAGOS Contact Relay`, `version: 3.2.0`, `configured: true` JSON 응답이 나와야 정상
- 상담 전송 실패 시 화면에 상태코드와 상세내용 표시
