# MAGOS Contact Relay v3.3.0

## 전송 구조

```text
홈페이지 문의양식
→ POST /api/contact
→ Vercel Node.js Function
→ EmailJS REST /send
→ ceo@magos.ai.kr
```

## Vercel 자동 탐지 원칙

- 함수 파일 위치: `api/contact.js`
- 함수 형식: Web Standard `Request`/`Response`를 사용하는 기본 `fetch` export
- `vercel.json`의 `functions` 사용자 지정 패턴: 사용하지 않음
- 공개 경로: `/api/contact`

## 상태확인

브라우저에서 다음 주소를 엽니다.

```text
https://magos.ai.kr/api/contact
```

정상 응답의 핵심:

```json
{
  "ok": true,
  "service": "MAGOS Contact Relay",
  "version": "3.3.0",
  "configured": true
}
```

## 지원 환경변수

권장 이름:

```text
EMAILJS_SERVICE_ID
EMAILJS_TEMPLATE_ID
EMAILJS_PUBLIC_KEY
EMAILJS_PRIVATE_KEY   # 선택사항
```

기존 설정 호환 이름:

```text
VITE_EMAILJS_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID
VITE_EMAILJS_PUBLIC_KEY
```

## 오류 전달

EmailJS가 403을 반환하면 홈페이지에는 `상담메일 접수 실패 (403)`과 상세 응답이 표시됩니다. 서버중계 계층 자체의 오류는 503, 시간초과는 504로 표시됩니다.
