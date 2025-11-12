# 배포 가이드

## 무료 배포 옵션 비교

| 플랫폼 | 무료 티어 | 제한사항 | 추천도 |
|--------|----------|---------|--------|
| **Render** | ✅ 완전 무료 | 15분 비활성 시 슬립, 느린 시작 | ⭐⭐⭐⭐⭐ |
| **Fly.io** | ✅ 완전 무료 | 월 3GB 트래픽, 3개 앱 | ⭐⭐⭐⭐ |
| **Railway** | ⚠️ 제한적 | $5 크레딧/월, 소진 시 유료 | ⭐⭐⭐ |
| **PythonAnywhere** | ✅ 완전 무료 | 1개 앱, 제한된 리소스 | ⭐⭐⭐ |

## Render 배포 (가장 추천 - 완전 무료)

### 장점
- ✅ 완전 무료 (무제한)
- ✅ PostgreSQL 무료 제공
- ✅ 자동 HTTPS
- ⚠️ 15분 비활성 시 슬립 (첫 요청 시 깨어남, 약 30초 소요)

### 1. Render 계정 생성
- https://render.com 접속
- GitHub 계정으로 로그인

### 2. 새 Web Service 생성
1. "New +" → "Web Service" 선택
2. GitHub 저장소 `hienter/startpage` 연결
3. 설정:
   - **Name**: `startpage` (원하는 이름)
   - **Region**: `Singapore` (한국과 가까움)
   - **Branch**: `main`
   - **Root Directory**: (비워두기)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
   - **Start Command**: `gunicorn config.wsgi:application`
   - **Plan**: `Free` 선택

### 3. 환경 변수 설정
Render 대시보드 → Environment 탭에서 추가:
```
SECRET_KEY=y=5fr&#sygq-eorryw)$-oo+5)8+pn7i&)jw)*wiaz6yc7oesl
DEBUG=False
ALLOWED_HOSTS=startpage.onrender.com
```

### 4. 데이터베이스 (선택사항)
- Render에서 PostgreSQL 추가 가능 (무료)
- SQLite도 작동하지만 프로덕션에는 권장하지 않음

### 5. 배포 완료
- 배포 완료 후 `https://startpage.onrender.com` 접속
- 첫 접속 시 약 30초 소요 (슬립에서 깨어나는 시간)

## Fly.io 배포 (완전 무료, 빠른 시작)

### 장점
- ✅ 완전 무료 (월 3GB 트래픽)
- ✅ 빠른 시작 (슬립 없음)
- ✅ 전 세계 엣지 서버
- ⚠️ CLI 설치 필요

### 1. Fly.io CLI 설치
```bash
curl -L https://fly.io/install.sh | sh
```

### 2. 로그인 및 배포
```bash
fly auth login
fly launch
```

### 3. 환경 변수 설정
Fly.io 대시보드에서 설정하거나:
```bash
fly secrets set SECRET_KEY="your-secret-key"
fly secrets set DEBUG="False"
fly secrets set ALLOWED_HOSTS="startpage.fly.dev"
```

## Railway 배포 (제한적 무료)

### 주의
- ⚠️ 월 $5 크레딧 제공 (소진 시 유료)
- ⚠️ 크레딧 소진 시 자동 중지

### 1. Railway 계정 생성
- https://railway.app 접속
- GitHub 계정으로 로그인

### 2. 프로젝트 배포
1. Railway 대시보드에서 "New Project" 클릭
2. "Deploy from GitHub repo" 선택
3. 이 저장소 선택
4. 배포 시작

### 3. 환경 변수 설정
Railway 대시보드에서 다음 환경 변수 설정:

```
SECRET_KEY=your-secret-key-here (랜덤 문자열 생성)
DEBUG=False
ALLOWED_HOSTS=your-domain.railway.app,*.railway.app
```

SECRET_KEY 생성 방법:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 4. 데이터베이스 설정
- Railway에서 PostgreSQL 추가
- DATABASE_URL 환경 변수가 자동으로 설정됨
- settings.py에서 DATABASE_URL을 읽도록 설정 필요 (선택사항)

### 5. 마이그레이션 실행
Railway 대시보드의 Deployments 탭에서 터미널 열기:
```bash
python manage.py migrate
python manage.py createsuperuser
```

## 로컬 테스트

배포 전 로컬에서 프로덕션 모드 테스트:

```bash
# 환경 변수 설정
export SECRET_KEY="your-secret-key"
export DEBUG="False"
export ALLOWED_HOSTS="localhost,127.0.0.1"

# Static files 수집
python manage.py collectstatic --noinput

# 마이그레이션
python manage.py migrate

# 서버 실행
gunicorn config.wsgi:application
```

## 주의사항

1. **SECRET_KEY**: 반드시 환경 변수로 설정하고 절대 코드에 하드코딩하지 마세요
2. **DEBUG**: 프로덕션에서는 항상 False로 설정
3. **ALLOWED_HOSTS**: 배포 도메인을 정확히 설정
4. **데이터베이스**: SQLite는 프로덕션에 부적합. PostgreSQL 사용 권장
5. **Static Files**: WhiteNoise로 정적 파일 제공 설정됨

