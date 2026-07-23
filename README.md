# MAGOS 현장 적용형 홈페이지 v3.1 전체교체본

마고스 구조기술사사무소의 **React + Vite + Vercel 운영 홈페이지**입니다.

> 책임은 명확하게, 추가공사비는 정당하게, 사고 대응은 증거로 준비합니다.

MAGOS는 구조기술사의 구조검토·공학판단·업무이력을 전자증거 패키지로 구성하고, BIM·3차원 스캔 연계와 장기검증 가능한 Evidence Envelope로 확장합니다.

## v3.1 핵심 수정

- 현장 적용·PoC 신청·샘플 결과물 중심의 홈페이지 구성 유지
- 특허출원 포트폴리오 14건 반영
- 상담폼을 EmailJS REST API 직접 전송 방식으로 교체
- 전송 성공 시 접수번호 표시 및 입력값 초기화
- 실패 시 HTTP 상태코드와 원인 안내 표시
- `mailto:` 자동 실행 제거
- 미배포 `app.magos.ai.kr` 404 방지
- 실제 PoC 서버 배포 전에는 공개용 PDF로 안전하게 연결
- Content Security Policy에서 EmailJS API 연결 허용
- 정적 사전 렌더링과 검색엔진 메타데이터 유지

## 최종 저장소 구조

```text
magos-homepage/
├─ public/
│  ├─ assets/
│  ├─ documents/
│  │  └─ MAGOS_LedgerProof_PoC_v0.1.pdf
│  ├─ robots.txt
│  ├─ sitemap.xml
│  └─ site.webmanifest
├─ src/
│  ├─ App.jsx
│  ├─ App.css
│  ├─ index.css
│  ├─ main.jsx
│  └─ entry-server.jsx
├─ docs/
│  ├─ CHANGELOG_FINAL.md
│  ├─ CLEANUP_REPORT.md
│  ├─ DEPLOY_CHECKLIST.md
│  ├─ EMAILJS_SETUP_CHECKLIST.md
│  ├─ FULL_REPLACEMENT_GUIDE.md
│  └─ FINAL_VALIDATION_REPORT.md
├─ .env.example
├─ .gitignore
├─ .npmrc
├─ .nvmrc
├─ build.mjs
├─ index.html
├─ package.json
├─ package-lock.json
├─ vite.config.js
├─ vercel.json
└─ README.md
```

## 로컬 실행

```bash
npm ci
npm run dev
```

브라우저에서 `http://localhost:5173/`을 엽니다.

운영 빌드:

```bash
npm run build
npm run preview
```

## Vercel 설정

- Framework Preset: `Vite`
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: 저장소 최상위

## Vercel 환경변수

`.env.example`의 네 값을 Vercel 프로젝트의 Production·Preview·Development에 등록합니다.

```text
VITE_LEDGERPROOF_URL=/documents/MAGOS_LedgerProof_PoC_v0.1.pdf
VITE_EMAILJS_SERVICE_ID=service_grnbxc8
VITE_EMAILJS_TEMPLATE_ID=template_ry142uj
VITE_EMAILJS_PUBLIC_KEY=GvUELP6idsY4ppGNa
```

EmailJS 세 값은 브라우저용 공개 식별값입니다. **Private Key는 입력하지 않습니다.**

## EmailJS 외부 설정

코드만 교체해도 EmailJS 계정의 Gmail 서비스 연결과 템플릿이 정상이어야 실제 메일이 도착합니다. `docs/EMAILJS_SETUP_CHECKLIST.md`의 항목을 확인하세요.

템플릿에서 사용하는 변수:

```text
{{inquiry_id}}
{{from_name}}
{{name}}
{{company}}
{{reply_to}}
{{email}}
{{phone}}
{{inquiry_type}}
{{subject}}
{{message}}
{{to_email}}
{{submitted_at}}
{{page_url}}
{{site_domain}}
```

## 중요 경로

- 대표 로고: `/assets/magos-logo.png`
- 공개용 PoC 설계서: `/documents/MAGOS_LedgerProof_PoC_v0.1.pdf`
- 실제 PoC 앱: 정식 배포 완료 후 `VITE_LEDGERPROOF_URL`만 변경


## Contact Relay v3.2.0

상담 양식은 브라우저에서 EmailJS로 직접 호출하지 않고, 동일 도메인의 Vercel Function `/api/contact`를 거쳐 EmailJS REST API로 전송합니다.

배포 후 `https://magos.ai.kr/api/contact`를 열어 다음 값이 표시되는지 확인합니다.

```json
{"ok":true,"service":"MAGOS Contact Relay","version":"3.2.0","configured":true}
```
