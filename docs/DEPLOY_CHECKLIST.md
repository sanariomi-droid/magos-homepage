# MAGOS v3.3 GitHub·Vercel 배포 체크리스트

## 1. 저장소 경로

GitHub 저장소 루트에 아래 항목이 직접 보여야 합니다.

```text
api/
public/
src/
scripts/
tests/
docs/
package.json
package-lock.json
vercel.json
vite.config.js
```

다음 형태는 잘못된 구조입니다.

```text
/contact.js
/App.jsx
/App.css
/main.jsx
```

정상 위치:

```text
/api/contact.js
/src/App.jsx
/src/App.css
/src/main.jsx
```

## 2. 제외 항목

```text
.git/
node_modules/
dist/
dist-ssr/
.vercel/
.env
.env.local
```

## 3. 로컬 검사

```bash
npm ci
npm run validate
npm test
npm run build
```

## 4. 기존 Vercel 프로젝트 사용

- 새 Vercel 프로젝트를 만들지 않음
- 기존 `magos-homepage` 프로젝트 사용
- 기존 도메인 연결 유지
- Root Directory: 저장소 루트
- Framework Preset: Vite
- Install: `npm ci`
- Build: `npm run build`
- Output: `dist`
- Node.js: `22.x`

## 5. 환경변수

```text
EMAILJS_SERVICE_ID
EMAILJS_TEMPLATE_ID
EMAILJS_PUBLIC_KEY
VITE_LEDGERPROOF_URL
```

Production은 반드시 포함합니다. 환경변수 변경 후에는 새 Production 배포가 필요합니다.

## 6. 배포 후 URL 점검

```text
https://magos.ai.kr/
https://magos.ai.kr/api/contact
https://magos.ai.kr/robots.txt
https://magos.ai.kr/sitemap.xml
https://magos.ai.kr/documents/MAGOS_LedgerProof_PoC_v0.1.pdf
https://www.magos.co.kr/
```

## 7. 상담메일 시험

1. API GET 응답에서 version `3.3.0` 확인
2. 홈페이지 문의폼 아래 `Contact Relay v3.3.0` 확인
3. 상담폼 실제 전송
4. 성공문구와 접수번호 확인
5. EmailJS Email History 확인
6. ceo@magos.ai.kr 받은편지함·스팸함 확인
