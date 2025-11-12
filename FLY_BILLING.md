# Fly.io 비용 확인 및 설정 가이드

## Fly.io 무료 티어

Fly.io는 **무료 티어**를 제공하지만, 사용량에 따라 비용이 발생할 수 있습니다.

### 무료 티어 제한
- **월 3GB 트래픽** (무료)
- **3개 앱** (무료)
- **공유 CPU, 256MB RAM** (무료)
- **볼륨**: 1GB = 약 $0.15/월 (무료 티어에 포함되지 않음)

### 현재 설정 확인
현재 배포된 앱 설정:
- **앱 이름**: `naejanggi`
- **VM 크기**: shared CPU, 256MB RAM (무료)
- **볼륨**: 1GB SQLite 볼륨 (약 $0.15/월)
- **리전**: Tokyo (nrt)

## 비용 확인 방법

### 1. Fly.io 대시보드에서 확인 (가장 정확)

1. **대시보드 접속**: https://fly.io/dashboard
2. **Billing 탭** 클릭
3. **Usage** 섹션에서 확인:
   - 현재 사용량
   - 예상 비용
   - 무료 한도 사용량

### 2. CLI로 확인

```bash
# 앱 상태 확인
flyctl status --app naejanggi

# 머신 정보 확인
flyctl machine list --app naejanggi

# 볼륨 확인
flyctl volumes list --app naejanggi
```

## 비용 최소화 설정

### 현재 설정 (거의 무료)

현재 설정은 거의 무료입니다:
- ✅ **VM**: shared CPU, 256MB RAM = **무료**
- ⚠️ **볼륨**: 1GB = **약 $0.15/월** (SQLite 데이터 저장용)
- ✅ **트래픽**: 월 3GB까지 무료

### 비용이 발생하는 경우

1. **트래픽 초과**: 월 3GB 초과 시 추가 요금
2. **볼륨**: 1GB 볼륨 = 약 $0.15/월
3. **더 큰 VM**: shared CPU, 256MB 이상 사용 시

### 비용을 더 줄이려면

1. **볼륨 크기 줄이기** (현재 1GB):
   ```bash
   # 볼륨 크기는 변경 불가, 새로 생성 필요
   # 하지만 1GB는 최소 크기이므로 이미 최적화됨
   ```

2. **auto_stop_machines 설정 확인** (이미 설정됨):
   - 비활성 시 자동 중지 → 비용 절감

## 예상 월 비용

**현재 설정 기준:**
- VM (shared CPU, 256MB): **$0** (무료)
- 볼륨 (1GB): **약 $0.15/월**
- 트래픽 (3GB 이하): **$0** (무료)

**총 예상 비용: 약 $0.15/월** (약 200원)

## 비용 알림 설정

1. Fly.io 대시보드 접속
2. **Settings** → **Billing** → **Spend Limits** 설정
3. 월 사용량 한도 설정 가능

## 참고

- Fly.io 공식 가격표: https://fly.io/docs/about/pricing/
- 무료 티어 상세: https://fly.io/docs/about/pricing/#free-allowances

