# MAGOS v3.3 전체교체 가이드

## 권장 방식: 새로 Clone 후 교체

```powershell
cd "C:\MAGOS 홈페이지"
git clone https://github.com/sanariomi-droid/magos-homepage.git magos-homepage-v33
cd magos-homepage-v33
```

현재 폴더에서 `.git`만 남기고 삭제합니다.

```powershell
Get-ChildItem -Force |
Where-Object { $_.Name -ne ".git" } |
Remove-Item -Recurse -Force
```

ZIP을 풀어 나온 **내용 전체**를 `magos-homepage-v33` 폴더에 복사합니다. 바깥 폴더를 한 번 더 넣지 않습니다.

복사 후 필수 경로 확인:

```powershell
Test-Path .\api\contact.js
Test-Path .\src\App.jsx
Test-Path .\package.json
```

모두 `True`여야 합니다.

## 설치·검증·빌드

```powershell
npm ci
npm run validate
npm test
npm run build
```

## GitHub 반영

```powershell
git status
git remote -v
git add -A
git commit -m "MAGOS 홈페이지 v3.3 Vercel 안정화 전체교체"
git push origin main
```

`git remote -v`에 origin이 없을 때만:

```powershell
git remote add origin https://github.com/sanariomi-droid/magos-homepage.git
```

## 주의

- `git init` 후 원격 저장소 이력을 강제 덮어쓰는 방식보다 Clone 방식이 안전합니다.
- `node_modules`와 `dist`를 복사하거나 업로드하지 않습니다.
- 기존 도메인이 연결된 Vercel 프로젝트를 유지합니다.
- 새 커밋이 올라가면 기존 Vercel 프로젝트가 자동으로 Production 배포합니다.
