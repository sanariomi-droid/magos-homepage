# GitHub·Vercel 배포 체크리스트

## GitHub 저장소 최상위

```text
public/
src/
docs/
.env.example
.gitignore
.npmrc
.nvmrc
build.mjs
index.html
package.json
package-lock.json
vite.config.js
vercel.json
README.md
```

`node_modules/`, `dist/`, `.vercel/`, `.git/`은 업로드하지 않습니다.

## 로컬 검사

```bash
npm ci
npm run dev
npm run build
```

확인 항목:

- 고객 요구 3가지와 현장 적용 4개 분야
- 샘플 결과물·PoC 3종
- 특허출원 14건 필터
- 2026~2031 로드맵
- 모바일 메뉴
- 공개 PDF 버튼
- 브라우저 봉인·검증·위변조 시연
- 상담메일 성공 또는 상세 오류코드 표시
- `dist/index.html`의 `magos-prerender=complete`

## Vercel

- Framework Preset: Vite
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: 저장소 최상위
- 환경변수 4개를 Production·Preview·Development에 등록

## 배포 후 주소

- `https://magos.ai.kr/`
- `https://magos.ai.kr/robots.txt`
- `https://magos.ai.kr/sitemap.xml`
- `https://magos.ai.kr/documents/MAGOS_LedgerProof_PoC_v0.1.pdf`
