// 디데이 카드 관련 JavaScript 모듈

// ============================================
// 날짜 계산 함수들
// ============================================

/**
 * 연간 주기 날짜 계산
 * @param {Date} today - 오늘 날짜
 * @param {number} currentYear - 현재 연도
 * @returns {string} YYYY-MM-DD 형식의 날짜 문자열
 */
function calculateAnnualDate(today, currentYear) {
    const yearEnd = new Date(currentYear, 11, 31);
    yearEnd.setHours(0, 0, 0, 0);
    
    if (today > yearEnd) {
        return `${currentYear + 1}-12-31`;
    } else {
        return `${currentYear}-12-31`;
    }
}

/**
 * 월간 주기 날짜 계산
 * @param {Date} today - 오늘 날짜
 * @returns {string} YYYY-MM-DD 형식의 날짜 문자열
 */
function calculateMonthlyDate(today) {
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // 이번 달 말일 계산
    let monthEnd = new Date(currentYear, currentMonth + 1, 0);
    monthEnd.setHours(0, 0, 0, 0);
    
    // 이번 달 말일이 지났으면 다음 달 말일로 설정
    if (today > monthEnd) {
        monthEnd = new Date(currentYear, currentMonth + 2, 0);
        monthEnd.setHours(0, 0, 0, 0);
    }
    
    // 날짜 문자열로 변환
    const year = monthEnd.getFullYear();
    const month = String(monthEnd.getMonth() + 1).padStart(2, '0');
    const day = String(monthEnd.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 분기 주기 날짜 계산
 * @param {Date} today - 오늘 날짜
 * @returns {string} YYYY-MM-DD 형식의 날짜 문자열
 */
function calculateQuarterlyDate(today) {
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // 분기 계산
    let quarterEndMonth;
    if (currentMonth <= 2) {
        quarterEndMonth = 2; // 1분기 (3월 말일)
    } else if (currentMonth <= 5) {
        quarterEndMonth = 5; // 2분기 (6월 말일)
    } else if (currentMonth <= 8) {
        quarterEndMonth = 8; // 3분기 (9월 말일)
    } else {
        quarterEndMonth = 11; // 4분기 (12월 말일)
    }
    
    // 이번 분기 말일 계산
    let quarterEnd = new Date(currentYear, quarterEndMonth + 1, 0);
    quarterEnd.setHours(0, 0, 0, 0);
    
    // 이번 분기 말일이 지났으면 다음 분기 말일로 설정
    if (today > quarterEnd) {
        if (quarterEndMonth === 11) {
            quarterEnd = new Date(currentYear + 1, 3, 0); // 다음 해 1분기 말일
        } else {
            const nextQuarterEndMonth = quarterEndMonth + 3;
            quarterEnd = new Date(currentYear, nextQuarterEndMonth + 1, 0);
        }
        quarterEnd.setHours(0, 0, 0, 0);
    }
    
    // 날짜 문자열로 변환
    const year = quarterEnd.getFullYear();
    const month = String(quarterEnd.getMonth() + 1).padStart(2, '0');
    const day = String(quarterEnd.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 반기 주기 날짜 계산
 * @param {Date} today - 오늘 날짜
 * @returns {string} YYYY-MM-DD 형식의 날짜 문자열
 */
function calculateSemiannualDate(today) {
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // 반기 계산
    let halfYearEndMonth;
    if (currentMonth <= 5) {
        halfYearEndMonth = 5; // 상반기 (6월 말일)
    } else {
        halfYearEndMonth = 11; // 하반기 (12월 말일)
    }
    
    // 이번 반기 말일 계산
    let halfYearEnd = new Date(currentYear, halfYearEndMonth + 1, 0);
    halfYearEnd.setHours(0, 0, 0, 0);
    
    // 이번 반기 말일이 지났으면 다음 반기 말일로 설정
    if (today > halfYearEnd) {
        if (halfYearEndMonth === 11) {
            halfYearEnd = new Date(currentYear + 1, 6, 0); // 다음 해 상반기 말일
        } else {
            halfYearEnd = new Date(currentYear, 12, 0); // 하반기 말일
        }
        halfYearEnd.setHours(0, 0, 0, 0);
    }
    
    // 날짜 문자열로 변환
    const year = halfYearEnd.getFullYear();
    const month = String(halfYearEnd.getMonth() + 1).padStart(2, '0');
    const day = String(halfYearEnd.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 주간 주기 날짜 계산
 * @param {HTMLElement} template - 카드 템플릿 요소
 * @param {Date} today - 오늘 날짜
 * @returns {string|null} YYYY-MM-DD 형식의 날짜 문자열 또는 null
 */
function calculateWeeklyDate(template, today) {
    const originalTargetDate = template.getAttribute('data-target-date');
    if (!originalTargetDate) return null;
    
    const originalDate = new Date(originalTargetDate + 'T00:00:00');
    const targetDayOfWeek = originalDate.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
    const currentDay = today.getDay();
    
    // 이번 주의 목표 요일까지의 일수 계산
    let daysUntilTargetDay;
    if (currentDay === 0) {
        daysUntilTargetDay = 7 + targetDayOfWeek;
    } else if (targetDayOfWeek === 0) {
        daysUntilTargetDay = 7 - currentDay;
    } else if (currentDay < targetDayOfWeek) {
        daysUntilTargetDay = targetDayOfWeek - currentDay;
    } else if (currentDay === targetDayOfWeek) {
        daysUntilTargetDay = 7;
    } else {
        daysUntilTargetDay = 7 - (currentDay - targetDayOfWeek);
    }
    
    const thisWeekTargetDay = new Date(today);
    thisWeekTargetDay.setDate(today.getDate() + daysUntilTargetDay);
    thisWeekTargetDay.setHours(0, 0, 0, 0);
    
    // 날짜 문자열로 변환
    const year = thisWeekTargetDay.getFullYear();
    const month = String(thisWeekTargetDay.getMonth() + 1).padStart(2, '0');
    const day = String(thisWeekTargetDay.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 주기별 목표 날짜 계산 통합 함수
 * @param {string} period - 주기 ('annual', 'monthly', 'quarterly', 'semiannual', 'weekly')
 * @param {HTMLElement} template - 카드 템플릿 요소
 * @param {Date} today - 오늘 날짜
 * @param {number} currentYear - 현재 연도
 * @returns {string|null} YYYY-MM-DD 형식의 날짜 문자열 또는 null
 */
function calculateTargetDate(period, template, today, currentYear) {
    switch (period) {
        case 'annual':
            return calculateAnnualDate(today, currentYear);
        case 'monthly':
            return calculateMonthlyDate(today);
        case 'quarterly':
            return calculateQuarterlyDate(today);
        case 'semiannual':
            return calculateSemiannualDate(today);
        case 'weekly':
            return calculateWeeklyDate(template, today);
        default:
            return template.getAttribute('data-target-date');
    }
}

// ============================================
// 카드 스타일 업데이트 함수
// ============================================

/**
 * 완료 상태에 따른 카드 스타일 업데이트
 * @param {HTMLElement} card - 카드 요소
 * @param {boolean} isCompleted - 완료 여부
 */
function updateCardCompletionState(card, isCompleted) {
    const titleElement = card.querySelector('.dday-title');
    const valueElement = card.querySelector('.dday-value');
    const labelElement = card.querySelector('.dday-label');
    const periodElement = card.querySelector('.dday-period');
    
    if (isCompleted) {
        // 완료된 경우: 취소선, 회색 처리
        card.classList.add('opacity-60', 'bg-gray-50');
        if (titleElement) {
            titleElement.classList.add('line-through', 'text-gray-400');
            titleElement.classList.remove('text-gray-500');
        }
        if (valueElement) {
            valueElement.classList.add('line-through', 'text-gray-400');
        }
        if (labelElement) {
            labelElement.classList.add('line-through', 'text-gray-400');
            labelElement.classList.remove('text-gray-600');
        }
        if (periodElement) {
            periodElement.classList.add('text-gray-300');
            periodElement.classList.remove('text-gray-400');
        }
    } else {
        // 미완료인 경우: 원래 스타일 복원
        card.classList.remove('opacity-60', 'bg-gray-50');
        if (titleElement) {
            titleElement.classList.remove('line-through', 'text-gray-400');
            titleElement.classList.add('text-gray-500');
        }
        if (valueElement) {
            valueElement.classList.remove('line-through', 'text-gray-400');
        }
        if (labelElement) {
            labelElement.classList.remove('line-through', 'text-gray-400');
            labelElement.classList.add('text-gray-600');
        }
        if (periodElement) {
            periodElement.classList.remove('text-gray-300');
            periodElement.classList.add('text-gray-400');
        }
    }
}

// ============================================
// 카드 완료 상태 설정 함수
// ============================================

/**
 * 카드 완료 상태 토글 기능 설정
 * @param {HTMLElement} card - 카드 요소
 * @param {string} ddayKey - 디데이 키 (제목_날짜)
 * @param {HTMLElement} checkbox - 체크박스 요소
 */
function setupCardCompletion(card, ddayKey, checkbox) {
    checkbox.checked = JSON.parse(localStorage.getItem('completedDdays') || '[]').includes(ddayKey);
    checkbox.setAttribute('data-dday-key', ddayKey);
    
    // 완료 상태 토글 함수
    const toggleCompletion = (e, shouldToggleCheckbox = true) => {
        if (e) {
            e.stopPropagation();
        }
        const key = checkbox.getAttribute('data-dday-key');
        let completed = JSON.parse(localStorage.getItem('completedDdays') || '[]');
        
        // 체크박스 상태 토글 (카드 클릭 시에만)
        if (shouldToggleCheckbox) {
            checkbox.checked = !checkbox.checked;
        }
        
        if (checkbox.checked) {
            if (!completed.includes(key)) {
                completed.push(key);
            }
        } else {
            completed = completed.filter(k => k !== key);
        }
        
        localStorage.setItem('completedDdays', JSON.stringify(completed));
        updateCardCompletionState(card, checkbox.checked);
    };
    
    // 체크박스 클릭 이벤트
    checkbox.addEventListener('change', (e) => toggleCompletion(e, false));
    
    // 카드 클릭 이벤트 (체크박스 제외)
    card.addEventListener('click', (e) => {
        const isCheckboxClick = e.target === checkbox || e.target.closest('.dday-checkbox') === checkbox;
        const isCheckboxContainerClick = e.target.closest('.absolute') && e.target.closest('.absolute').querySelector('.dday-checkbox') === checkbox;
        
        if (!isCheckboxClick && !isCheckboxContainerClick) {
            toggleCompletion(e);
        }
    });
}

// ============================================
// 카드 D-day 표시 업데이트 함수
// ============================================

/**
 * D-day 값 및 날짜 레이블 업데이트
 * @param {HTMLElement} card - 카드 요소
 * @param {number} diffDays - 오늘부터 목표 날짜까지의 일수
 * @param {Date} targetDate - 목표 날짜
 * @param {string} period - 주기
 */
function updateCardDdayDisplay(card, diffDays, targetDate, period) {
    const valueElement = card.querySelector('.dday-value');
    const labelElement = card.querySelector('.dday-label');
    
    // D-day 값 업데이트
    if (valueElement) {
        if (diffDays > 0) {
            valueElement.textContent = `D-${diffDays}`;
            valueElement.classList.remove('text-gray-500', 'text-black', 'font-semibold');
            valueElement.classList.add('text-black');
        } else if (diffDays === 0) {
            valueElement.textContent = 'D-Day';
            valueElement.classList.remove('text-gray-500', 'text-black');
            valueElement.classList.add('text-black', 'font-semibold');
        } else {
            const pastDays = Math.abs(diffDays);
            valueElement.textContent = `D+${pastDays}`;
            valueElement.classList.remove('text-black', 'font-semibold');
            valueElement.classList.add('text-gray-500');
        }
    }
    
    // 날짜 레이블 업데이트
    if (labelElement) {
        if (period === 'annual') {
            const displayYear = targetDate.getFullYear();
            labelElement.textContent = `${displayYear}년 12월 31일`;
        } else {
            const displayYear = targetDate.getFullYear();
            const displayMonth = targetDate.getMonth() + 1;
            const displayDay = targetDate.getDate();
            labelElement.textContent = `${displayYear}년 ${displayMonth}월 ${displayDay}일`;
        }
    }
}

// ============================================
// AI 버튼 설정 함수
// ============================================

/**
 * AI 작성하기 버튼 설정
 * @param {HTMLElement} card - 카드 요소
 * @param {string} ddayTitle - 디데이 제목
 */
function setupAiButton(card, ddayTitle) {
    const aiEnabledDdays = ['상태변화 기록', '직원회의', '복지 및 포상', '사례관리 회의'];
    if (!aiEnabledDdays.includes(ddayTitle)) return;
    
    const aiButtonArea = card.querySelector('.dday-ai-button-area');
    if (!aiButtonArea) {
        console.warn('AI 버튼 영역을 찾을 수 없습니다:', ddayTitle);
        return;
    }
    
    // hidden 클래스는 제거하되, CSS로 hover 시에만 표시되도록 함
    aiButtonArea.classList.remove('hidden');
    // AI 버튼이 있는 카드에만 클래스 추가하여 스타일 적용
    card.classList.add('has-ai-button');
    
    // 버튼 영역이 비어있지 않으면 이미 설정된 것으로 간주
    if (aiButtonArea.innerHTML.trim() !== '') {
        return;
    }
    
    aiButtonArea.innerHTML = `
        <button class="ai-write-btn w-full px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors" onclick="event.stopPropagation()">
            AI 작성하기 (개발요청)
        </button>
    `;
    
    // 기본 상태는 숨김 (CSS로 제어하되, JavaScript에서도 초기화)
    aiButtonArea.style.opacity = '0';
    aiButtonArea.style.visibility = 'hidden';
    aiButtonArea.style.pointerEvents = 'none';
    aiButtonArea.style.transform = 'translateY(10px)';
    
    // 카드에 hover 이벤트 추가
    card.addEventListener('mouseenter', () => {
        aiButtonArea.style.opacity = '1';
        aiButtonArea.style.visibility = 'visible';
        aiButtonArea.style.pointerEvents = 'auto';
        aiButtonArea.style.transform = 'translateY(0)';
    });
    
    card.addEventListener('mouseleave', () => {
        aiButtonArea.style.opacity = '0';
        aiButtonArea.style.visibility = 'hidden';
        aiButtonArea.style.pointerEvents = 'none';
        aiButtonArea.style.transform = 'translateY(10px)';
    });
    
    // AI 작성하기 버튼 클릭 이벤트
    const aiWriteBtn = aiButtonArea.querySelector('.ai-write-btn');
    if (aiWriteBtn) {
        aiWriteBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            // 개발요청 API 호출
            try {
                const formData = new FormData();
                formData.append('service_type', 'visitCare');
                
                const response = await fetch('/api/increment-service-click/', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    alert('개발요청이 접수되었습니다.');
                } else {
                    alert('개발요청 접수에 실패했습니다.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('개발요청 접수에 실패했습니다.');
            }
        });
    }
}

// ============================================
// 카드 생성 함수
// ============================================

/**
 * 디데이 카드 생성 및 설정
 * @param {HTMLElement} template - 카드 템플릿 요소
 * @param {string} targetDateStr - 목표 날짜 문자열 (YYYY-MM-DD)
 * @param {Date} today - 오늘 날짜
 * @returns {Object} {card: HTMLElement, diffDays: number, targetDate: Date} 생성된 카드와 날짜 정보
 */
function createDdayCard(template, targetDateStr, today) {
    // 카드 복사
    const card = template.cloneNode(true);
    card.classList.remove('dday-card-template', 'hidden');
    card.classList.add('dday-card');
    
    // 완료 상태 키 생성
    const ddayTitle = template.getAttribute('data-title');
    const ddayKey = `${ddayTitle}_${targetDateStr}`;
    
    // 완료 상태 확인
    const completedDdays = JSON.parse(localStorage.getItem('completedDdays') || '[]');
    const isCompleted = completedDdays.includes(ddayKey);
    
    // 체크박스 설정
    const checkbox = card.querySelector('.dday-checkbox');
    if (checkbox) {
        setupCardCompletion(card, ddayKey, checkbox);
    }
    
    // 날짜 계산
    const targetDate = new Date(targetDateStr + 'T00:00:00');
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // D-day 표시 업데이트
    const period = template.getAttribute('data-period');
    updateCardDdayDisplay(card, diffDays, targetDate, period);
    
    // 완료 상태 적용
    updateCardCompletionState(card, isCompleted);
    
    // AI 버튼 설정 제거 (마우스 오버 버튼 삭제)
    // setupAiButton(card, ddayTitle);
    
    return { card, diffDays, targetDate };
}

// ============================================
// 섹션 분류 함수
// ============================================

/**
 * 카드를 섹션별로 분류
 * @param {HTMLElement} card - 카드 요소
 * @param {number} diffDays - 오늘부터 목표 날짜까지의 일수
 * @param {Date} monthEnd - 이번 달 말일
 * @param {Date} targetDate - 목표 날짜
 * @returns {string} 섹션 이름 ('thisWeek', 'thisMonth', 'other')
 */
function categorizeCard(card, diffDays, monthEnd, targetDate) {
    if (diffDays >= 0 && diffDays <= 7) {
        // 이번 주 (오늘부터 7일 이내)
        return 'thisWeek';
    } else if (diffDays > 7 && targetDate <= monthEnd) {
        // 이번 달 (7일 초과 ~ 이번 달 말일까지)
        return 'thisMonth';
    } else {
        // 올 해 (이번 달 이후)
        return 'other';
    }
}

// ============================================
// Masonry 레이아웃 함수들
// ============================================

/**
 * Masonry 레이아웃 적용 함수 (카드 배열을 받아서 배치)
 * @param {HTMLElement} container - 컨테이너 요소
 * @param {Array<HTMLElement>} cards - 카드 요소 배열
 */
function applyMasonryLayoutWithCards(container, cards) {
    if (!container || !cards || cards.length === 0) return;
    
    // 컬럼 수 결정 (반응형)
    let columns = 1;
    if (window.innerWidth >= 1024) {
        columns = 3;
    } else if (window.innerWidth >= 768) {
        columns = 2;
    }
    
    container.setAttribute('data-columns', columns);
    container.innerHTML = ''; // 기존 내용 제거
    
    // 컬럼 생성
    const columnElements = [];
    const columnHeights = [];
    
    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.className = 'dday-masonry-column';
        if (i > 0) {
            column.style.marginLeft = '16px';
        }
        container.appendChild(column);
        columnElements.push(column);
        columnHeights.push(0);
    }
    
    // 첫 번째 컬럼의 너비를 먼저 측정 (한 번만)
    const firstColumnWidth = columnElements[0].offsetWidth || container.offsetWidth / columns;
    
    // 카드들을 가장 짧은 컬럼에 배치
    cards.forEach((card) => {
        // 카드 높이를 직접 측정 (DOM에 추가하지 않고)
        // 카드가 이미 렌더링되어 있다면 offsetHeight 사용, 아니면 추정값 사용
        let cardHeight;
        if (card.offsetHeight > 0) {
            cardHeight = card.offsetHeight;
        } else {
            // 카드가 아직 DOM에 없으면 임시로 추가하여 측정 (최소한의 DOM 조작)
            const wasInDOM = card.parentNode !== null;
            if (!wasInDOM) {
                columnElements[0].appendChild(card);
            }
            cardHeight = card.offsetHeight;
            if (!wasInDOM) {
                columnElements[0].removeChild(card);
            }
        }
        
        // 가장 짧은 컬럼 찾기
        let shortestColumnIndex = 0;
        let shortestHeight = columnHeights[0];
        
        for (let i = 1; i < columns; i++) {
            if (columnHeights[i] < shortestHeight) {
                shortestHeight = columnHeights[i];
                shortestColumnIndex = i;
            }
        }
        
        // 카드를 가장 짧은 컬럼에 추가
        columnElements[shortestColumnIndex].appendChild(card);
        
        // 컬럼 높이 업데이트
        columnHeights[shortestColumnIndex] += cardHeight + 24; // gap 24px (CSS margin-bottom과 동일)
    });
}

/**
 * 기존 카드들을 재배치하는 함수 (리사이즈 시 사용)
 * @param {HTMLElement} container - 컨테이너 요소
 */
function applyMasonryLayout(container) {
    if (!container) return;
    
    // 빈 메시지가 있으면 스킵
    if (container.children.length === 0) return;
    if (container.children[0] && container.children[0].classList && container.children[0].classList.contains('col-span-full')) {
        return;
    }
    
    const cards = Array.from(container.querySelectorAll('.dday-card'));
    if (cards.length === 0) return;
    
    applyMasonryLayoutWithCards(container, cards);
}

// ============================================
// 메인 함수
// ============================================

/**
 * 섹션별로 디데이 카드 분류 및 표시
 */
function categorizeAndDisplayDdayCards() {
    let selectedService = localStorage.getItem('selectedService');
    
    // 저장된 값이 없으면 기본값으로 방문요양 설정
    if (!selectedService) {
        selectedService = 'visitCare';
        localStorage.setItem('selectedService', selectedService);
    }
    
    const templates = document.querySelectorAll('.dday-card-template');
    
    // 섹션 초기화
    const thisWeekSection = document.getElementById('thisWeekSection');
    const thisMonthSection = document.getElementById('thisMonthSection');
    const otherSection = document.getElementById('otherSection');
    const thisWeekSectionContainer = document.getElementById('thisWeekSectionContainer');
    const thisMonthSectionContainer = document.getElementById('thisMonthSectionContainer');
    const otherSectionContainer = document.getElementById('otherSectionContainer');
    
    if (!thisWeekSection || !thisMonthSection || !otherSection) return;
    if (!thisWeekSectionContainer || !thisMonthSectionContainer || !otherSectionContainer) return;
    
    thisWeekSection.innerHTML = '';
    thisMonthSection.innerHTML = '';
    otherSection.innerHTML = '';
    
    // 섹션 컨테이너 초기에는 숨김
    thisWeekSectionContainer.style.display = 'none';
    thisMonthSectionContainer.style.display = 'none';
    otherSectionContainer.style.display = 'none';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();
    
    // 이번 달 말일 계산
    const monthEnd = new Date(currentYear, today.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999);
    
    // 카드 분류를 위한 배열
    const thisWeekCards = [];
    const thisMonthCards = [];
    const otherCards = [];
    
    // 템플릿을 배열로 변환하여 성능 최적화
    const templateArray = Array.from(templates);
    
    templateArray.forEach(template => {
        const cardServiceType = template.getAttribute('data-service-type');
        
        // 센터 유형 필터링
        if (selectedService && selectedService.trim() !== '') {
            if (cardServiceType !== selectedService) {
                return; // 일치하지 않으면 스킵
            }
        }
        
        const period = template.getAttribute('data-period');
        
        // 목표 날짜 계산
        const targetDateStr = calculateTargetDate(period, template, today, currentYear);
        if (!targetDateStr) return;
        
        // 카드 생성
        const { card, diffDays, targetDate } = createDdayCard(template, targetDateStr, today);
        
        // 섹션 분류
        const section = categorizeCard(card, diffDays, monthEnd, targetDate);
        if (section === 'thisWeek') {
            thisWeekCards.push(card);
        } else if (section === 'thisMonth') {
            thisMonthCards.push(card);
        } else {
            otherCards.push(card);
        }
    });
    
    // 빈 섹션 처리 및 카드 배치
    if (thisWeekCards.length === 0) {
        thisWeekSectionContainer.style.display = 'none';
    } else {
        thisWeekSectionContainer.style.display = 'block';
        applyMasonryLayoutWithCards(thisWeekSection, thisWeekCards);
    }
    
    if (thisMonthCards.length === 0) {
        thisMonthSectionContainer.style.display = 'none';
    } else {
        thisMonthSectionContainer.style.display = 'block';
        applyMasonryLayoutWithCards(thisMonthSection, thisMonthCards);
    }
    
    // 올 해 섹션은 항상 표시 (비어있어도)
    if (otherCards.length === 0) {
        otherSection.innerHTML = '<div class="col-span-full text-center text-gray-400 py-4 text-sm">올 해 디데이가 없습니다.</div>';
    } else {
        applyMasonryLayoutWithCards(otherSection, otherCards);
    }
    otherSectionContainer.style.display = 'block';
}

// ============================================
// 이벤트 리스너 설정
// ============================================

// DOM이 준비되면 초기화
function initializeDdayCards() {
    // 템플릿이 로드될 때까지 대기 (최적화: 최대 5초, 50ms 간격)
    let attempts = 0;
    const maxAttempts = 100; // 100 * 50ms = 5초
    
    function checkAndInit() {
        attempts++;
        const templates = document.querySelectorAll('.dday-card-template');
        
        if (templates.length > 0) {
            categorizeAndDisplayDdayCards();
        } else if (attempts < maxAttempts) {
            setTimeout(checkAndInit, 50); // 100ms -> 50ms로 단축
        } else {
            console.error('디데이 카드 템플릿을 찾을 수 없습니다.');
        }
    }
    
    checkAndInit();
}

// 스크립트가 로드되면 즉시 실행 시도
(function() {
    // 이미 DOM이 로드된 경우
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initializeDdayCards, 100);
    } else {
        // DOM이 아직 로드 중인 경우
        if (window.addEventListener) {
            window.addEventListener('DOMContentLoaded', initializeDdayCards);
            window.addEventListener('load', initializeDdayCards);
        } else if (window.attachEvent) {
            window.attachEvent('onload', initializeDdayCards);
        }
    }
})();

// 서비스 업데이트 시 다시 분류
window.addEventListener('serviceUpdated', () => {
    categorizeAndDisplayDdayCards();
});

// localStorage 변경 감지 (다른 탭에서 변경된 경우)
window.addEventListener('storage', (e) => {
    if (e.key === 'selectedService') {
        categorizeAndDisplayDdayCards();
    }
});

// 매일 자정에 자동 갱신 체크 (연간/월간 주기 자동 갱신)
let lastCheckedDate = new Date().toDateString();
setInterval(() => {
    const now = new Date();
    const currentDateString = now.toDateString();
    
    // 날짜가 바뀌었거나 자정이면 갱신
    if (currentDateString !== lastCheckedDate || (now.getHours() === 0 && now.getMinutes() === 0)) {
        categorizeAndDisplayDdayCards();
        lastCheckedDate = currentDateString;
    }
}, 60000); // 1분마다 체크

// 리사이즈 이벤트 핸들러
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const thisWeekSection = document.getElementById('thisWeekSection');
        const thisMonthSection = document.getElementById('thisMonthSection');
        const otherSection = document.getElementById('otherSection');
        
        if (thisWeekSection) applyMasonryLayout(thisWeekSection);
        if (thisMonthSection) applyMasonryLayout(thisMonthSection);
        if (otherSection) applyMasonryLayout(otherSection);
    }, 250);
});

