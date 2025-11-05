# Shadcn/UI 리팩토링 계획

## 현재 상황 분석

### ✅ Shadcn/UI를 사용하는 부분
- `Button` - 피드백 버튼, 설정 버튼, Dialog 내 버튼들
- `Dialog` - 설정 모달
- `Popover` - 설정 안내 팝오버
- `Card` - D-day 위젯 카드들
- `Label` - Dialog 내 레이블
- `RadioGroup` / `RadioGroupItem` - 급여 유형 선택

### ❌ Shadcn/UI를 사용하지 않는 부분

#### 1. **시계 및 날짜 표시** (우선순위: 중간)
- **위치**: `app/page.tsx` (462-464줄)
- **현재**: 순수 HTML (`<h1>`, `<div>`) + 커스텀 CSS
- **문제점**: 
  - shadcn/ui의 Typography 시스템을 활용하지 않음
  - 일관성 없는 스타일링
- **리팩토링 방안**:
  - `Typography` 컴포넌트가 없으므로 그대로 유지하거나
  - shadcn/ui의 `Heading`, `Text` 컴포넌트 추가 고려
  - 또는 현재 구조 유지 (시계는 특수한 케이스이므로)

#### 2. **섹션 제목** (우선순위: 낮음)
- **위치**: `app/page.tsx` (470, 502, 534줄)
- **현재**: 순수 HTML (`<h2 className="dday-section-title">`)
- **문제점**: 
  - shadcn/ui의 Typography 시스템 미사용
- **리팩토링 방안**:
  - `Heading` 컴포넌트 추가 또는 현재 구조 유지
  - shadcn/ui에는 기본 Typography 컴포넌트가 없으므로 현재 구조 유지 권장

#### 3. **팝오버 내 엑스 버튼** (우선순위: 높음)
- **위치**: `app/page.tsx` (450-456줄)
- **현재**: 네이티브 `<button>` 태그 + Tailwind CSS
- **문제점**:
  - shadcn/ui의 `Button` 컴포넌트 사용 가능
  - 접근성 및 일관성 측면에서 개선 필요
- **리팩토링 방안**:
  ```tsx
  // 현재
  <button
    onClick={handlePopoverClose}
    className="absolute top-1 right-1 p-1 hover:bg-white/10 rounded transition-colors"
    aria-label="닫기"
  >
    <X className="size-4" />
  </button>

  // 개선안
  <Button
    variant="ghost"
    size="icon"
    onClick={handlePopoverClose}
    className="absolute top-1 right-1 h-6 w-6"
    aria-label="닫기"
  >
    <X className="size-4" />
  </Button>
  ```

#### 4. **출처 정보** (우선순위: 낮음)
- **위치**: `app/page.tsx` (566-570줄)
- **현재**: 순수 HTML (`<p>`) + shadcn/ui 토큰 사용 (`text-xs text-muted-foreground`)
- **문제점**: 
  - 컴포넌트는 아니지만 shadcn/ui 토큰을 사용하고 있어 괜찮음
- **리팩토링 방안**: 현재 구조 유지 권장

#### 5. **사용되지 않는 CSS 클래스** (우선순위: 낮음)
- **위치**: `app/globals.css`
- **현재**: 
  - `.planner-table` 관련 스타일 (158-208줄) - 사용되지 않음
  - `.dot` 관련 스타일 (221-233줄) - 사용되지 않음
  - `.settings-panel`, `.settings-row` 등 (276-298줄) - 사용되지 않음
  - `.modal-backdrop`, `.modal` 등 (302-335줄) - 사용되지 않음
  - `.icon-btn`, `.btn` 등 (336-358줄) - 사용되지 않음
  - `.radio-group`, `.radio-item` (364-377줄) - 사용되지 않음
- **리팩토링 방안**: 
  - 사용되지 않는 CSS 클래스 제거
  - 코드 정리 및 유지보수성 향상

## 리팩토링 우선순위

### 🔴 높은 우선순위
1. **팝오버 내 엑스 버튼을 shadcn/ui Button으로 변경**
   - 영향도: 낮음 (작은 변경)
   - 효과: 일관성 향상, 접근성 개선

### 🟡 중간 우선순위
2. **사용되지 않는 CSS 클래스 제거**
   - 영향도: 없음 (사용되지 않는 코드)
   - 효과: 코드 정리, 유지보수성 향상

### 🟢 낮은 우선순위
3. **시계 및 날짜 표시 검토**
   - 영향도: 중간 (레이아웃에 영향)
   - 효과: 미미 (시계는 특수한 케이스)
   - 권장: 현재 구조 유지

4. **섹션 제목 검토**
   - 영향도: 낮음
   - 효과: 미미 (shadcn/ui에 Typography 컴포넌트 없음)
   - 권장: 현재 구조 유지

## 구현 계획

### Phase 1: 즉시 적용 가능 (높은 우선순위)
- [ ] 팝오버 내 엑스 버튼을 shadcn/ui Button으로 변경

### Phase 2: 코드 정리 (중간 우선순위)
- [ ] 사용되지 않는 CSS 클래스 제거
  - `.planner-table` 관련
  - `.dot` 관련
  - `.settings-panel` 관련
  - `.modal-*` 관련
  - `.icon-btn`, `.btn` 관련
  - `.radio-group`, `.radio-item` 관련

### Phase 3: 검토 (낮은 우선순위)
- [ ] 시계 및 날짜 표시 구조 검토
- [ ] 섹션 제목 구조 검토
- [ ] Typography 컴포넌트 추가 검토 (필요시)

## 주의사항
- shadcn/ui는 기본적으로 Typography 컴포넌트를 제공하지 않음
- 시계와 날짜는 특수한 스타일링이 필요하므로 현재 구조 유지 권장
- 모든 변경 사항은 기존 기능에 영향을 주지 않도록 주의

