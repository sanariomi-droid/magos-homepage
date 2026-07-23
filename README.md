# MAGOS 홈페이지 v3.3.0 — Vercel 안정화 전체교체본

마고스 구조기술사사무소의 **React + Vite + Vercel 운영 홈페이지**입니다.

> 책임은 명확하게, 추가공사비는 정당하게, 사고 대응은 증거로 준비합니다.

MAGOS는 구조기술사의 구조검토·공학판단·업무이력을 전자증거 패키지로 구성하고, BIM·3차원 스캔 연계와 장기검증 가능한 Evidence Envelope로 확장합니다.

## v3.3.0에서 해결한 핵심 문제

1. `vercel.json`의 잘못된 `functions` 패턴을 제거했습니다.
2. `api/contact.js`는 Vercel이 자동 탐지하는 Web Standard `fetch` 함수로 통일했습니다.
3. 상담폼은 브라우저에서 EmailJS를 직접 호출하지 않고 `/api/contact`를 거칩니다.
4. EmailJS 실패 상태코드와 응답내용을 화면에 표시합니다.
5. 미배포 `app.magos.ai.kr` 대신 공개용 PoC PDF를 안전한 기본값으로 사용합니다.
6. 루트 중복 실행파일, `.git`, `node_modules`, `dist`가 교체본에 포함되지 않도록 검증합니다.
7. Node.js를 `22.x`로 고정하고 npm 버전을 명시했습니다.
8. 프로젝트 구조·CSP 해시·API 경로·필수 자산을 자동 검사하는 `npm run validate`를 추가했습니다.
9. `/api/contact`의 GET·검증실패·성공중계·상위오류 전달을 Node 테스트로 확인합니다.

## 최종 저장소 구조

```text
magos-homepage/
├─ api/
│  └─ contact.js
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
├─ scripts/
│  └─ validate-project.mjs
├─ tests/
│  └─ contact-api.test.mjs
├─ docs/
├─ .env.example
├─ .gitignore
├─ .npmrc
├─ .nvmrc
├─ build.mjs
├─ index.html
├─ package.json
├─ package-lock.json
├─ vercel.json
└─ vite.config.js
```

다음 항목은 GitHub에 올리지 않습니다.

```text
.git/
node_modules/
dist/
dist-ssr/
.vercel/
.env
.env.local
```

## 로컬 점검

```bash
npm ci
npm run validate
npm test
npm run build
npm run dev
```

전체 점검을 한 번에 실행하려면:

```bash
npm run check
```

## Vercel 프로젝트 설정

기존 도메인이 연결된 **기존 `magos-homepage` 프로젝트**를 사용합니다. 새 프로젝트를 만들지 않습니다.

- Framework Preset: `Vite`
- Root Directory: `./` 또는 비워 둠
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js: `22.x`

`vercel.json`에는 `functions` 항목이 없습니다. 루트의 `api/contact.js`를 Vercel이 자동으로 함수로 배포합니다.

## Vercel 환경변수

Production·Preview·Development에 등록합니다.

```text
EMAILJS_SERVICE_ID=service_grnbxc8
EMAILJS_TEMPLATE_ID=template_ry142uj
EMAILJS_PUBLIC_KEY=GvUELP6idsY4ppGNa
VITE_LEDGERPROOF_URL=/documents/MAGOS_LedgerProof_PoC_v0.1.pdf
```

`EMAILJS_PRIVATE_KEY`는 EmailJS 계정에서 Private Key 사용을 강제한 경우에만 Vercel에 등록합니다. GitHub에는 넣지 않습니다.

기존에 `VITE_EMAILJS_*` 이름으로 등록한 값도 서버 함수가 읽도록 호환성을 유지했습니다.

## 배포 후 확인

1. `https://magos.ai.kr/api/contact`
2. `https://magos.ai.kr/`
3. `https://www.magos.co.kr/`
4. 문의양식 실제 전송
5. EmailJS Email History 및 `ceo@magos.ai.kr` 받은편지함

API 정상 응답 예시:

```json
{
  "ok": true,
  "service": "MAGOS Contact Relay",
  "version": "3.3.0",
  "configured": true
}
```

문의폼 아래에는 다음 문구가 표시됩니다.

```text
Contact Relay v3.3.0
```

## GitHub 교체 권장 절차

현재 작업 폴더에서 `git status`가 `not a git repository`로 나오면, 새 폴더에 저장소를 다시 복제하는 방식이 가장 안전합니다.

```powershell
cd "C:\MAGOS 홈페이지"
git clone https://github.com/sanariomi-droid/magos-homepage.git magos-homepage-v33
cd magos-homepage-v33
```

`.git`만 남기고 기존 파일을 지운 뒤 이 교체본의 내용 전체를 복사합니다.

```powershell
Get-ChildItem -Force |
Where-Object { $_.Name -ne ".git" } |
Remove-Item -Recurse -Force
```

복사 후:

```powershell
npm ci
npm run validate
npm test
npm run build
git add -A
git commit -m "MAGOS 홈페이지 v3.3 Vercel 안정화 전체교체"
git push origin main
```

원격 저장소가 없을 때만 다음을 사용합니다.

```powershell
git remote add origin https://github.com/sanariomi-droid/magos-homepage.git
```

이미 `origin`이 있으면 다시 추가하지 말고 `git remote -v`로 확인합니다.
