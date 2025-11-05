# 웹사이트 배포 가이드

## 배포 방법

### 1. Vercel (권장)

1. GitHub에 프로젝트 푸시
2. [Vercel](https://vercel.com) 접속
3. "New Project" 클릭
4. GitHub 저장소 선택
5. 자동으로 배포됨!

**설정:**
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `out` (정적 export 사용 시)

### 2. Netlify

1. GitHub에 프로젝트 푸시
2. [Netlify](https://netlify.com) 접속
3. "New site from Git" 클릭
4. GitHub 저장소 선택
5. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `out`

### 3. GitHub Pages

1. GitHub에 프로젝트 푸시
2. GitHub Actions로 자동 배포 설정
3. 또는 `out` 폴더를 `gh-pages` 브랜치로 푸시

## 브라우저 시작 페이지 설정

### Chrome
1. Chrome 설정 (`chrome://settings/`)
2. "시작 그룹" 또는 "새 탭 페이지" 섹션
3. "특정 페이지 또는 페이지 집합 열기" 선택
4. 배포된 웹사이트 URL 추가

### Edge
1. Edge 설정 (`edge://settings/`)
2. "시작, 홈 및 새 탭" 메뉴
3. "새 탭 페이지"에서 "사용자 지정" 선택
4. 배포된 웹사이트 URL 입력

### Firefox
1. Firefox 설정 (`about:preferences`)
2. "시작" 섹션
3. "새 탭" 또는 "홈페이지" 설정
4. 배포된 웹사이트 URL 입력

## 로컬 개발

```bash
npm run dev
```

개발 서버가 `http://localhost:3000`에서 실행됩니다.

## 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `out` 폴더에 생성됩니다.

