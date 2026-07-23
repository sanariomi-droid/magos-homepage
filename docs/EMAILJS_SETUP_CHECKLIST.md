# EmailJS 상담메일 최종 설정 체크리스트

홈페이지 코드는 EmailJS REST API로 직접 전송하도록 완성되어 있습니다. 실제 수신은 EmailJS 계정 설정이 모두 정상이어야 합니다.

## 1. Email Service

- Service ID: `service_grnbxc8`
- Gmail 계정 연결상태: Connected
- EmailJS의 `Test Service` 시험메일: 성공
- Gmail 인증이 만료되었다면 Reconnect 실행

## 2. Email Template

- Template ID: `template_ry142uj`
- To Email: `ceo@magos.ai.kr`로 고정 권장
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

## 3. Public Key

- Public Key: `GvUELP6idsY4ppGNa`
- Private Key는 홈페이지·GitHub·Vercel 환경변수에 넣지 않음

## 4. 허용 도메인

EmailJS에서 도메인 허용목록을 사용하는 경우 실제 사용하는 출처를 모두 등록합니다.

```text
https://magos.ai.kr
https://www.magos.ai.kr
https://magos.co.kr
https://www.magos.co.kr
```

Vercel Preview 주소에서도 시험하려면 해당 `https://...vercel.app` 출처도 임시 등록합니다.

## 5. Vercel 환경변수

세 변수 모두 Production·Preview·Development에 동일하게 등록합니다.

```text
VITE_EMAILJS_SERVICE_ID=service_grnbxc8
VITE_EMAILJS_TEMPLATE_ID=template_ry142uj
VITE_EMAILJS_PUBLIC_KEY=GvUELP6idsY4ppGNa
```

저장 후 반드시 새로운 Production 배포를 생성합니다.

## 6. 오류별 확인

- 400: 서비스·템플릿·공개키·템플릿 변수 확인
- 401: 인증정보 확인
- 403: 허용 도메인·보안설정 확인
- 404: Service ID 또는 Template ID 확인
- 412: Gmail 서비스 재인증
- 422: 템플릿 필수 변수 확인
- 429: 전송속도 또는 월간 한도 확인
- 네트워크: CSP, 브라우저 확장 프로그램, 방화벽 확인

## 7. 최종 시험

1. 시크릿 창에서 실제 도메인 접속
2. 상담양식 전송
3. 홈페이지 성공문구와 접수번호 확인
4. EmailJS Email History 확인
5. `ceo@magos.ai.kr` 받은편지함·스팸함 확인
