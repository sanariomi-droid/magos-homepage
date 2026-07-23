# GitHub 전체교체 안내

## 1. 기존 저장소 백업

기존 프로젝트를 ZIP으로 내려받거나 로컬 폴더를 복사합니다.

## 2. 저장소 파일 교체

`.git` 폴더를 유지하여 기존 GitHub 연결을 보존하려면 `.git`만 남기고 나머지를 삭제한 뒤, 이 전체교체본의 내용을 저장소 최상위에 복사합니다.

GitHub 웹에서 업로드하는 경우 기존 파일을 모두 삭제한 뒤 이 ZIP의 **폴더 안 내용**을 저장소 최상위에 업로드합니다. 상위 폴더가 한 단계 더 중첩되지 않게 주의합니다.

## 3. 로컬 확인

```powershell
npm ci
npm run dev
```

확인 후:

```powershell
Ctrl + C
npm run build
```

## 4. GitHub 업로드

```powershell
git add -A
git commit -m "MAGOS 홈페이지 v3.1 전체교체"
git push origin main
```

## 5. Vercel

GitHub `main` 커밋 후 자동 배포를 기다립니다. 환경변수를 변경했다면 캐시 없이 Production 재배포를 실행합니다.

## 6. 배포 후 확인

- 홈페이지: `https://magos.ai.kr/`
- 공개 PDF: `https://magos.ai.kr/documents/MAGOS_LedgerProof_PoC_v0.1.pdf`
- 상담메일: 성공문구와 EmailJS History 확인
- 두 번째 도메인도 같은 Production 배포에 연결되었는지 확인
