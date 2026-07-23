# EmailJS 상담메일 설정 체크리스트

홈페이지는 `/api/contact` Vercel Function을 통해 EmailJS REST API를 호출합니다. 코드 배포가 성공해도 EmailJS 계정 설정이 잘못되어 있으면 메일은 전송되지 않습니다.

## 1. Email Service

- Service ID: `service_grnbxc8`
- Gmail 연결 상태: Connected
- EmailJS `Test Service` 시험: 성공
- 인증 만료 시 Gmail Reconnect

## 2. Email Template

- Template ID: `template_ry142uj`
- To Email: `ceo@magos.ai.kr` 고정 권장
- Reply To: `{{reply_to}}`
- Subject: `[MAGOS 상담] {{inquiry_type}} · {{from_name}}`

권장 본문:

```text
접수번호: {{inquiry_id}}
접수시각: {{submitted_at}}
접속도메인: {{site_domain}}
접수페이지: {{page_url}}

성명: {{from_name}}
회사·기관: {{company}}
이메일: {{reply_to}}
연락처: {{phone}}
문의 유형: {{inquiry_type}}

문의 내용:
{{message}}
```

## 3. Vercel 환경변수

권장:

```text
EMAILJS_SERVICE_ID=service_grnbxc8
EMAILJS_TEMPLATE_ID=template_ry142uj
EMAILJS_PUBLIC_KEY=GvUELP6idsY4ppGNa
```

선택사항:

```text
EMAILJS_PRIVATE_KEY=
```

Private Key 사용을 강제한 EmailJS 계정에서만 Vercel 서버 환경변수로 등록합니다. GitHub에는 절대 넣지 않습니다.

기존 `VITE_EMAILJS_*` 이름도 호환되지만, 신규 설정은 `EMAILJS_*` 이름을 권장합니다.

## 4. 허용 도메인

EmailJS Domains allowlist를 사용하는 경우:

```text
https://magos.ai.kr
https://www.magos.ai.kr
https://magos.co.kr
https://www.magos.co.kr
```

Preview에서 시험할 때만 해당 `https://...vercel.app` 출처를 임시 추가합니다.

## 5. 오류별 확인

- 400: 요청 형식·서비스·템플릿·공개키 확인
- 401: 인증정보 확인
- 403: EmailJS 보안설정·허용 도메인 확인
- 404: Service ID·Template ID 확인
- 412: Gmail 서비스 재인증
- 422: 템플릿 필수 변수 확인
- 429: 1초당 요청 제한 또는 월간 한도 확인
- 503: Vercel Function에서 EmailJS 네트워크 연결 실패
- 504: EmailJS 응답시간 초과

## 6. API 진단

```text
https://magos.ai.kr/api/contact
```

`configured: true`인지 확인합니다. 이 값은 ID·키의 존재 여부만 뜻하며, Gmail 인증과 템플릿 수신자까지 보장하지는 않습니다.
