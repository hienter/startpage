# 배포 가이드

## Railway 배포 (추천)

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

## Render 배포

### 1. Render 계정 생성
- https://render.com 접속
- GitHub 계정으로 로그인

### 2. 새 Web Service 생성
1. "New +" → "Web Service" 선택
2. GitHub 저장소 연결
3. 설정:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn config.wsgi:application`

### 3. 환경 변수 설정
Render 대시보드에서 환경 변수 추가:
```
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-app.onrender.com
```

### 4. 데이터베이스
- Render에서 PostgreSQL 추가
- DATABASE_URL 자동 설정

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

