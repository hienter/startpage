# Fly.io 배포 가이드

현재 스택(Django + SQLite)을 Fly.io에 배포하는 방법입니다.

## 사전 준비

### 1. Fly.io CLI 설치

```bash
curl -L https://fly.io/install.sh | sh
```

macOS의 경우:
```bash
brew install flyctl
```

### 2. Fly.io 로그인

```bash
fly auth login
```

브라우저가 열리면 GitHub 계정으로 로그인합니다.

## 배포 단계

### 1. 앱 초기화 및 배포

```bash
cd /Users/haekwan/Documents/startpage
fly launch
```

질문에 답변:
- **App name**: `startpage` (또는 원하는 이름)
- **Region**: `icn` (서울) 또는 `nrt` (도쿄) - 한국과 가까운 지역
- **Postgres**: `No` (SQLite 사용)
- **Redis**: `No`

### 2. SQLite 볼륨 생성 (데이터 영구 저장)

```bash
fly volumes create sqlite_data --size 1 --region icn
```

- `--size 1`: 1GB 볼륨 생성 (필요에 따라 조정)
- `--region icn`: 서울 리전 (앱과 동일한 리전)

### 3. 환경 변수 설정

```bash
fly secrets set SECRET_KEY="y=5fr&#sygq-eorryw)$-oo+5)8+pn7i&)jw)*wiaz6yc7oesl"
fly secrets set DEBUG="False"
fly secrets set ALLOWED_HOSTS="startpage.fly.dev"
```

또는 대시보드에서 설정:
- https://fly.io/dashboard → 앱 선택 → Secrets 탭

### 4. 마이그레이션 실행

```bash
fly ssh console
```

터미널에서:
```bash
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

### 5. 배포 확인

```bash
fly open
```

또는 브라우저에서 `https://startpage.fly.dev` 접속

## 유용한 명령어

### 앱 상태 확인
```bash
fly status
```

### 로그 확인
```bash
fly logs
```

### SSH 접속
```bash
fly ssh console
```

### 환경 변수 확인
```bash
fly secrets list
```

### 앱 재시작
```bash
fly apps restart startpage
```

### 볼륨 확인
```bash
fly volumes list
```

## 문제 해결

### SQLite 파일이 생성되지 않는 경우

1. 볼륨이 제대로 마운트되었는지 확인:
   ```bash
   fly ssh console
   ls -la /data
   ```

2. 권한 문제인 경우:
   ```bash
   fly ssh console
   chmod 777 /data
   ```

### Static files가 보이지 않는 경우

1. collectstatic 실행 확인:
   ```bash
   fly ssh console
   python manage.py collectstatic --noinput
   ```

2. WhiteNoise 설정 확인 (이미 설정됨)

### 데이터베이스 마이그레이션 오류

```bash
fly ssh console
python manage.py migrate --run-syncdb
```

## 비용

- **무료 티어**: 월 3GB 트래픽, 3개 앱
- **볼륨**: 1GB = 약 $0.15/월
- **머신**: 공유 CPU, 256MB RAM = 무료 (사용량에 따라)

## 참고

- Fly.io 공식 문서: https://fly.io/docs/
- Django 배포 가이드: https://fly.io/docs/django/

