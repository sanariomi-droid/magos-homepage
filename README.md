# MAGOS Vite Homepage

## 실행
```bash
npm install
npm run dev
```

## 환경변수
`.env`
```bash
VITE_LITE_URL=https://mri.magos.co.kr
```

## Streamlit 연결 방식
홈페이지의 `무료 진단` 버튼은 `VITE_LITE_URL`을 우선 사용합니다.

권장 운영:
- `magos.co.kr` → Vite 정적 홈페이지
- `mri.magos.co.kr` → Streamlit Lite 앱
- `app.magos.co.kr` → 유료 app.py
