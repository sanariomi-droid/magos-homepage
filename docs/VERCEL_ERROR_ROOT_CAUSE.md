# Vercel 빌드 실패 원인과 최종 조치

## 확인된 오류

```text
functions에 정의된 패턴 "api/contact.js"는 api 디렉터리 내의 어떤 서버리스 함수와도 일치하지 않습니다.
```

## 원인

`vercel.json`의 `functions` 속성은 glob 패턴으로 해석됩니다. 기존 설정이 Vercel CLI에서 실제 함수 소스와 일치하지 않는 것으로 판정되어, Vite 빌드가 시작되기 전에 배포가 중단되었습니다.

## v3.3.0 조치

1. `vercel.json`에서 `functions` 속성을 완전히 제거했습니다.
2. 함수는 `api/contact.js`에 유지했습니다.
3. Vercel의 자동 함수 탐지 방식에 맡겼습니다.
4. 프로젝트 검증 스크립트에서 `vercel.json`에 `functions`가 다시 들어오면 실패하도록 했습니다.
5. 루트의 잘못된 `contact.js`와 중복 `App.jsx`가 없는지 자동 확인합니다.

## 재발 방지

```bash
npm run validate
```

이 명령이 성공한 뒤에만 커밋·배포합니다.
