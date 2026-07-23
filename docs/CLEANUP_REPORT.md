# 저장소 정리 보고서

## 제거한 중복·오래된 항목

- `public/legacy/`
- 루트 `styles.css`
- 기존 정적 홈페이지와 React 홈페이지의 이중 운영 구조
- `/legacy/index.html` 링크
- `/magos_logo.png` 구형 경로
- `/docs/...` 잘못된 PDF 경로
- 불완전한 `package.json` 빌드 설정

## 최종 운영 원칙

- 홈페이지 화면과 기능은 `src/App.jsx`, `src/App.css`에서 관리
- 공통 초기 스타일은 `src/index.css`에서 관리
- 이미지·PDF·사이트맵은 `public/`에서 관리
- `npm run build` 시 `dist/`를 자동 생성
- GitHub에는 `node_modules/`, `dist/`, `.vercel/`을 올리지 않음


## v3.1 추가 정리

- 루트 중복 `App.jsx` 미포함
- 미배포 `app.magos.ai.kr` 직접 연결 제거
- 상담폼 자동 mailto 대체동작 제거
- Git 메타데이터·node_modules·dist는 배포 ZIP에서 제외
