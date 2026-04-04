# MAGOS 홈페이지 배포 구조

## 권장 도메인 구조
- `magos.co.kr` : 홈페이지
- `mri.magos.co.kr` : 무료 Lite Streamlit
- `app.magos.co.kr` : 유료 Streamlit

## 구조 1: Next.js + Streamlit
- Next.js 홈페이지를 `magos.co.kr`에 배포
- Streamlit Lite를 `mri.magos.co.kr`에 배포
- 유료 app.py를 `app.magos.co.kr`에 배포
- 홈페이지 버튼은 각 서브도메인으로 이동

## 구조 2: Vite + Streamlit
- Vite 빌드 결과를 정적 호스팅
- Streamlit은 별도 서버 또는 서브도메인 운영
- 초기 배포가 가장 간단함

## 4/20 기준 추천
첫 오픈은 **Vite 홈페이지 + Streamlit 서브도메인**이 가장 빠릅니다.
이후 기능이 많아지면 Next.js로 확장하는 방식이 좋습니다.
