FROM python:3.13-slim

WORKDIR /app

# 시스템 의존성 설치
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y procps

# Python 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

# Static files 수집 (빌드 시에만 실행)
RUN python manage.py collectstatic --noinput

# 포트 노출
EXPOSE 8000

# Gunicorn 실행 (워커 수 최적화: CPU 코어 수 * 2 + 1, 메모리 제한 고려하여 2개로 설정)
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2", "--threads", "2", "--timeout", "30", "--keep-alive", "5"]

