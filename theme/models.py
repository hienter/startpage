from django.db import models
from datetime import date, timedelta

class Dday(models.Model):
    SERVICE_TYPE_CHOICES = [
        ('visitCare', '방문요양'),
        ('visitBath', '방문목욕'),
        ('visitNurse', '방문간호'),
        ('dayCare', '주야간보호'),
        ('shortTerm', '단기보호'),
        ('welfare', '복지용구'),
    ]
    
    PERIOD_CHOICES = [
        ('annual', '연간'),
        ('monthly', '월간'),
        ('quarterly', '분기'),
        ('semiannual', '반기'),
        ('weekly', '주간'),
    ]
    
    title = models.CharField(max_length=100, verbose_name='제목', db_index=True)
    target_date = models.DateField(
        verbose_name='목표 날짜', 
        null=True, 
        blank=True, 
        help_text='주간 주기: 해당 날짜의 요일을 기준으로 매주 그 요일이 목표 날짜가 됩니다 (예: 2025-11-16을 입력하면 매주 일요일). 월간/분기/반기 주기: 사용되지 않습니다.'
    )
    target_year = models.IntegerField(verbose_name='대상 연도', null=True, blank=True, help_text='연간 주기인 경우 해당 연도를 설정하세요 (예: 2025)')
    service_type = models.CharField(
        max_length=20, 
        choices=SERVICE_TYPE_CHOICES, 
        verbose_name='센터 유형',
        default='visitCare',
        help_text='이 디데이가 표시될 센터 유형을 선택하세요'
    )
    period = models.CharField(
        max_length=20,
        choices=PERIOD_CHOICES,
        verbose_name='주기',
        default='annual'
    )
    is_active = models.BooleanField(default=True, verbose_name='활성화', db_index=True)
    order = models.IntegerField(default=0, verbose_name='순서')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='생성일')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='수정일')
    
    class Meta:
        verbose_name = '디데이'
        verbose_name_plural = '디데이'
        ordering = ['order', 'id']
        indexes = [
            models.Index(fields=['is_active', 'title']),  # 복합 인덱스: is_active와 title 함께 조회 시 성능 향상
        ]
    
    def get_actual_target_date(self, today=None):
        """실제 목표 날짜를 반환합니다. 연간 주기인 경우 해당 연도 말일(12월 31일)을 반환합니다.
        
        Args:
            today: 오늘 날짜 (date 객체). None이면 date.today()를 호출합니다. 성능 최적화를 위해 전달하는 것을 권장합니다.
        """
        # today가 전달되지 않으면 date.today() 호출 (하위 호환성)
        if today is None:
            today = date.today()
        
        if self.period == 'annual':
            # 연간 주기인 경우 항상 현재 연도 말일 반환 (JavaScript에서 자동 갱신)
            current_year = today.year
            return date(current_year, 12, 31)
        elif self.period == 'monthly':
            # 매월 주기인 경우 항상 현재 월 말일 반환 (JavaScript에서 자동 갱신)
            # 다음 달 0일 = 이번 달 마지막 날
            from calendar import monthrange
            last_day = monthrange(today.year, today.month)[1]
            return date(today.year, today.month, last_day)
        elif self.period == 'quarterly':
            # 분기 주기인 경우 항상 현재 분기 말일 반환 (JavaScript에서 자동 갱신)
            from calendar import monthrange
            # 분기 계산
            if today.month <= 3:
                # 1분기 (1월~3월) → 3월 말일
                last_day = monthrange(today.year, 3)[1]
                return date(today.year, 3, last_day)
            elif today.month <= 6:
                # 2분기 (4월~6월) → 6월 말일
                last_day = monthrange(today.year, 6)[1]
                return date(today.year, 6, last_day)
            elif today.month <= 9:
                # 3분기 (7월~9월) → 9월 말일
                last_day = monthrange(today.year, 9)[1]
                return date(today.year, 9, last_day)
            else:
                # 4분기 (10월~12월) → 12월 말일
                last_day = monthrange(today.year, 12)[1]
                return date(today.year, 12, last_day)
        elif self.period == 'semiannual':
            # 반기 주기인 경우 항상 현재 반기 말일 반환 (JavaScript에서 자동 갱신)
            from calendar import monthrange
            # 반기 계산
            if today.month <= 6:
                # 상반기 (1월~6월) → 6월 말일
                last_day = monthrange(today.year, 6)[1]
                return date(today.year, 6, last_day)
            else:
                # 하반기 (7월~12월) → 12월 말일
                last_day = monthrange(today.year, 12)[1]
                return date(today.year, 12, last_day)
        elif self.period == 'weekly':
            # 주간 주기인 경우 항상 이번 주 일요일 반환 (JavaScript에서 자동 갱신)
            # 이번 주 일요일 계산 (0=월요일, 6=일요일)
            days_until_sunday = (6 - today.weekday()) % 7
            if days_until_sunday == 0:
                # 오늘이 일요일이면 다음 주 일요일
                days_until_sunday = 7
            next_sunday = today + timedelta(days=days_until_sunday)
            return next_sunday
        else:
            # 연간이 아닌 경우 target_date 반환
            return self.target_date or today
    
    def __str__(self):
        return self.title


class ServiceTypeClick(models.Model):
    """급여 유형별 클릭 카운트"""
    SERVICE_TYPE_CHOICES = [
        ('visitCare', '방문요양'),
        ('visitBath', '방문목욕'),
        ('visitNurse', '방문간호'),
        ('dayCare', '주야간보호'),
        ('shortTerm', '단기보호'),
        ('welfare', '복지용구'),
    ]
    
    service_type = models.CharField(
        max_length=20,
        choices=SERVICE_TYPE_CHOICES,
        verbose_name='급여 유형',
        unique=True
    )
    click_count = models.IntegerField(default=0, verbose_name='클릭 횟수')
    last_clicked_at = models.DateTimeField(null=True, blank=True, verbose_name='마지막 클릭 시간')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='생성일')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='수정일')
    
    class Meta:
        verbose_name = '급여 유형 클릭 통계'
        verbose_name_plural = '급여 유형 클릭 통계'
        ordering = ['-click_count', 'service_type']
    
    def __str__(self):
        return f"{self.get_service_type_display()} - {self.click_count}회"


class FeatureVote(models.Model):
    """개발 예정 기능별 투표 수"""
    STATUS_CHOICES = [
        ('pending', '개발 대기'),
        ('in_progress', '개발 중'),
        ('completed', '개발 완료'),
    ]
    
    feature_id = models.CharField(
        max_length=100,
        unique=True,
        verbose_name='기능 ID',
        help_text='예: dday_1, service_visitBath'
    )
    feature_name = models.CharField(max_length=100, verbose_name='기능 이름')
    vote_count = models.IntegerField(default=0, verbose_name='투표 수')
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='개발 상태'
    )
    last_voted_at = models.DateTimeField(null=True, blank=True, verbose_name='마지막 투표 시간')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='생성일')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='수정일')
    
    class Meta:
        verbose_name = '기능 투표 통계'
        verbose_name_plural = '기능 투표 통계'
        ordering = ['-vote_count', 'feature_name']
    
    def __str__(self):
        return f"{self.feature_name} - {self.vote_count}표"


class UserServicePreference(models.Model):
    """사용자 급여 유형 선택 통계"""
    SERVICE_TYPE_CHOICES = [
        ('visitCare', '방문요양'),
        ('visitBath', '방문목욕'),
        ('visitNurse', '방문간호'),
        ('dayCare', '주야간보호'),
        ('shortTerm', '단기보호'),
        ('welfare', '복지용구'),
    ]
    
    service_type = models.CharField(
        max_length=20,
        choices=SERVICE_TYPE_CHOICES,
        verbose_name='급여 유형',
        unique=True
    )
    selection_count = models.IntegerField(default=0, verbose_name='선택 횟수')
    last_selected_at = models.DateTimeField(null=True, blank=True, verbose_name='마지막 선택 시간')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='생성일')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='수정일')
    
    class Meta:
        verbose_name = '급여 유형 선택 통계'
        verbose_name_plural = '급여 유형 선택 통계'
        ordering = ['-selection_count', 'service_type']
    
    def __str__(self):
        return f"{self.get_service_type_display()} - {self.selection_count}회"


class FeatureRequest(models.Model):
    """기능 개발 요청 리스트"""
    FEATURE_TYPE_CHOICES = [
        ('ai_writing', 'AI 작성하기'),
        ('service_type', '급여 유형'),
        ('other', '기타'),
    ]
    
    STATUS_CHOICES = [
        ('pending', '개발 대기'),
        ('in_progress', '개발 중'),
        ('completed', '개발 완료'),
    ]
    
    SERVICE_TYPE_CHOICES = [
        ('visitCare', '방문요양'),
        ('visitBath', '방문목욕'),
        ('visitNurse', '방문간호'),
        ('dayCare', '주야간보호'),
        ('shortTerm', '단기보호'),
        ('welfare', '복지용구'),
    ]
    
    feature_id = models.CharField(
        max_length=100,
        unique=True,
        verbose_name='기능 ID',
        help_text='고유한 기능 ID (예: ai_chatbot, dday_1, service_visitBath)'
    )
    feature_name = models.CharField(max_length=100, verbose_name='기능 이름')
    description = models.TextField(verbose_name='설명', help_text='기능에 대한 상세 설명')
    feature_type = models.CharField(
        max_length=20,
        choices=FEATURE_TYPE_CHOICES,
        default='other',
        verbose_name='기능 유형'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='개발 상태',
        db_index=True
    )
    service_type = models.CharField(
        max_length=20,
        choices=SERVICE_TYPE_CHOICES,
        null=True,
        blank=True,
        verbose_name='관련 급여 유형',
        help_text='급여 유형 관련 기능인 경우 선택하세요'
    )
    related_dday = models.ForeignKey(
        'Dday',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='관련 디데이',
        help_text='디데이 관련 기능인 경우 선택하세요'
    )
    is_active = models.BooleanField(default=True, verbose_name='활성화', db_index=True)
    order = models.IntegerField(default=0, verbose_name='순서', help_text='표시 순서 (낮을수록 먼저 표시)')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='생성일')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='수정일')
    
    class Meta:
        verbose_name = '기능 개발 요청'
        verbose_name_plural = '기능 개발 요청'
        ordering = ['order', 'id']
        indexes = [
            models.Index(fields=['is_active', 'order']),
        ]
    
    def __str__(self):
        return self.feature_name
