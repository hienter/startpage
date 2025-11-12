# SQLite 그대로 배포 가능한 플랫폼

현재 스택(Django + SQLite)을 **변경 없이** 배포할 수 있는 플랫폼입니다.

## ✅ 완전 무료 + SQLite 안정적 지원

### 1. PythonAnywhere (가장 추천 - SQLite 완벽 지원)

**장점:**
- ✅ 완전 무료
- ✅ SQLite 완벽 지원 (파일 시스템 영구적)
- ✅ 데이터 손실 없음
- ✅ 한국 접속 빠름

**단점:**
- ⚠️ 1개 앱만 무료
- ⚠️ 제한된 리소스

**배포 방법:**
1. https://www.pythonanywhere.com 접속
2. 계정 생성 (무료)
3. "Web" 탭 → "Add a new web app"
4. "Manual configuration" → Python 3.13 선택
5. GitHub에서 코드 클론:
   ```bash
   git clone https://github.com/hienter/startpage.git
   ```
6. 가상환경 생성 및 패키지 설치:
   ```bash
   python3.13 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
7. 환경 변수 설정 (Files 탭에서 `.env` 파일 생성):
   ```
   SECRET_KEY=y=5fr&#sygq-eorryw)$-oo+5)8+pn7i&)jw)*wiaz6yc7oesl
   DEBUG=False
   ALLOWED_HOSTS=yourusername.pythonanywhere.com
   ```
8. WSGI 설정 파일 수정 (Web 탭 → WSGI configuration file):
   ```python
   import os
   import sys
   
   path = '/home/yourusername/startpage'
   if path not in sys.path:
       sys.path.append(path)
   
   os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'
   
   from django.core.wsgi import get_wsgi_application
   application = get_wsgi_application()
   ```
9. Static files 설정 (Web 탭 → Static files):
   - URL: `/static/`
   - Directory: `/home/yourusername/startpage/staticfiles`
10. 마이그레이션 실행:
    ```bash
    python manage.py migrate
    python manage.py collectstatic --noinput
    ```
11. Reload 버튼 클릭

### 2. Fly.io (볼륨 마운트로 SQLite 영구 저장)

**장점:**
- ✅ 완전 무료 (월 3GB 트래픽)
- ✅ SQLite 볼륨 마운트 가능 (데이터 영구 저장)
- ✅ 빠른 시작

**단점:**
- ⚠️ CLI 설치 필요
- ⚠️ 볼륨 설정 필요

**배포 방법:**
1. Fly.io CLI 설치:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```
2. 로그인:
   ```bash
   fly auth login
   ```
3. 앱 생성 및 배포:
   ```bash
   fly launch
   ```
4. 볼륨 생성 (SQLite 데이터 영구 저장):
   ```bash
   fly volumes create sqlite_data --size 1
   ```
5. `fly.toml` 수정하여 볼륨 마운트 추가:
   ```toml
   [[mounts]]
     source = "sqlite_data"
     destination = "/data"
   ```
6. `settings.py`에서 SQLite 경로를 볼륨으로 변경:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.sqlite3',
           'NAME': '/data/db.sqlite3',
       }
   }
   ```
7. 환경 변수 설정:
   ```bash
   fly secrets set SECRET_KEY="your-secret-key"
   fly secrets set DEBUG="False"
   fly secrets set ALLOWED_HOSTS="startpage.fly.dev"
   ```

## ⚠️ SQLite 작동하지만 주의 필요

### 3. Render (SQLite 작동, 재시작 시 데이터 손실 가능)

**장점:**
- ✅ 완전 무료
- ✅ SQLite 작동
- ✅ 간단한 배포

**주의:**
- ⚠️ 재시작 시 SQLite 파일이 초기화될 수 있음
- ⚠️ 데이터 손실 가능성

**배포 방법:**
- 기존 Render 가이드와 동일
- SQLite 그대로 사용 가능하지만, 프로덕션 데이터는 손실될 수 있음

### 4. Railway (SQLite 작동, 재시작 시 데이터 손실 가능)

**주의:**
- ⚠️ 월 $5 크레딧 (소진 시 유료)
- ⚠️ 재시작 시 SQLite 파일 초기화 가능

## 📊 비교표

| 플랫폼 | SQLite 지원 | 데이터 영구성 | 무료 | 추천도 |
|--------|------------|-------------|------|--------|
| **PythonAnywhere** | ✅ 완벽 | ✅ 영구 | ✅ | ⭐⭐⭐⭐⭐ |
| **Fly.io** | ✅ (볼륨 필요) | ✅ (볼륨 사용 시) | ✅ | ⭐⭐⭐⭐ |
| **Render** | ✅ | ⚠️ 재시작 시 손실 가능 | ✅ | ⭐⭐⭐ |
| **Railway** | ✅ | ⚠️ 재시작 시 손실 가능 | ⚠️ 제한적 | ⭐⭐ |

## 결론

**현재 스택 그대로 배포하려면:**
1. **PythonAnywhere** - 가장 안전하고 간단 (추천)
2. **Fly.io** - 볼륨 설정하면 안전하지만 복잡
3. **Render** - 간단하지만 데이터 손실 위험

**데이터가 중요하다면 PythonAnywhere를 추천합니다!**

