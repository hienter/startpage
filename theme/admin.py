from django.contrib import admin
from django.utils.html import format_html
from datetime import timedelta
from .models import Dday, FeatureVote, UserServicePreference, FeatureRequest
# ServiceTypeClick은 더 이상 사용되지 않음
# from .models import ServiceTypeClick

@admin.register(Dday)
class DdayAdmin(admin.ModelAdmin):
    list_display = ['title', 'target_date', 'service_type', 'period', 'is_active', 'order', 'created_at']
    list_filter = ['is_active', 'service_type', 'period', 'target_date']
    search_fields = ['title']
    list_editable = ['is_active', 'order']
    ordering = ['order', 'id']
    
    fieldsets = (
        ('기본 정보', {
            'fields': ('title', 'service_type', 'period', 'target_year', 'target_date', 'is_active', 'order'),
            'description': '주간 주기: target_date에 입력한 날짜의 요일을 기준으로 매주 그 요일이 목표 날짜가 됩니다. 예를 들어 2025-11-16(일요일)을 입력하면 매주 일요일이 목표 날짜가 됩니다.'
        }),
        ('시스템 정보', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        # 주간 주기일 때 target_date의 help_text를 더 명확하게 표시
        if 'target_date' in form.base_fields:
            # 현재 객체의 주기를 확인
            if obj and obj.period == 'weekly':
                form.base_fields['target_date'].help_text = (
                    '⚠️ 주간 주기: 날짜는 요일을 추출하기 위한 참조일입니다. '
                    '입력한 날짜의 요일을 기준으로 매주 그 요일이 목표 날짜가 됩니다. '
                    '예: 2025-11-16(일요일)을 입력하면 매주 일요일이 목표 날짜가 됩니다. '
                    '연도나 월은 중요하지 않으며, 요일만 사용됩니다.'
                )
            else:
                form.base_fields['target_date'].help_text = (
                    '주간 주기: 해당 날짜의 요일을 기준으로 매주 그 요일이 목표 날짜가 됩니다. '
                    '예: 2025-11-16(일요일)을 입력하면 매주 일요일이 목표 날짜가 됩니다. '
                    '월간/분기/반기 주기: 사용되지 않습니다.'
                )
        return form
    
    def save_model(self, request, obj, form, change):
        # 주간 주기인 경우 target_date를 현재 날짜 기준으로 정규화 (요일만 유지)
        if obj.period == 'weekly' and obj.target_date:
            from datetime import date
            today = date.today()
            target_day_of_week = obj.target_date.weekday()  # 0=월요일, 6=일요일
            
            # 이번 주의 해당 요일로 정규화
            days_until_target = (target_day_of_week - today.weekday()) % 7
            if days_until_target == 0 and obj.target_date < today:
                days_until_target = 7
            normalized_date = today + timedelta(days=days_until_target)
            
            # 요일만 유지하고 날짜는 현재 기준으로 정규화
            obj.target_date = normalized_date
        
        super().save_model(request, obj, form, change)


# ServiceTypeClick은 더 이상 사용되지 않으므로 어드민에서 제거
# @admin.register(ServiceTypeClick)
# class ServiceTypeClickAdmin(admin.ModelAdmin):
#     list_display = ['service_type', 'click_count', 'last_clicked_at', 'created_at', 'updated_at']
#     list_filter = ['service_type', 'last_clicked_at']
#     search_fields = ['service_type']
#     ordering = ['-click_count', 'service_type']
#     readonly_fields = ['created_at', 'updated_at']
#     
#     fieldsets = (
#         ('통계 정보', {
#             'fields': ('service_type', 'click_count', 'last_clicked_at')
#         }),
#         ('시스템 정보', {
#             'fields': ('created_at', 'updated_at'),
#             'classes': ('collapse',)
#         }),
#     )


@admin.register(FeatureVote)
class FeatureVoteAdmin(admin.ModelAdmin):
    list_display = ['feature_name', 'feature_id', 'status', 'vote_count', 'last_voted_at', 'created_at']
    list_filter = ['status', 'last_voted_at', 'created_at']
    search_fields = ['feature_name', 'feature_id']
    list_editable = ['status']
    ordering = ['-vote_count', 'feature_name']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('기본 정보', {
            'fields': ('feature_id', 'feature_name', 'status'),
            'description': '상태를 변경하면 개발 예정 기능 페이지에 반영됩니다. (개발 대기 / 개발 중 / 개발 완료)'
        }),
        ('투표 정보', {
            'fields': ('vote_count', 'last_voted_at')
        }),
        ('시스템 정보', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(UserServicePreference)
class UserServicePreferenceAdmin(admin.ModelAdmin):
    list_display = ['service_type', 'selection_count', 'last_selected_at', 'created_at', 'updated_at']
    list_filter = ['service_type', 'last_selected_at', 'created_at']
    search_fields = ['service_type']
    ordering = ['-selection_count', 'service_type']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('통계 정보', {
            'fields': ('service_type', 'selection_count', 'last_selected_at')
        }),
        ('시스템 정보', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(FeatureRequest)
class FeatureRequestAdmin(admin.ModelAdmin):
    list_display = ['feature_name', 'feature_id', 'status', 'feature_type', 'service_type', 'is_active', 'order', 'created_at']
    list_filter = ['status', 'is_active', 'feature_type', 'service_type', 'created_at']
    search_fields = ['feature_name', 'feature_id', 'description']
    list_editable = ['status', 'is_active', 'order']
    ordering = ['order', 'id']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('기본 정보', {
            'fields': ('feature_id', 'feature_name', 'description', 'feature_type', 'status'),
            'description': '상태를 변경하면 개발 예정 기능 페이지에 반영됩니다. (개발 대기 / 개발 중 / 개발 완료)'
        }),
        ('연관 정보', {
            'fields': ('service_type', 'related_dday'),
            'description': '급여 유형이나 디데이와 연관된 기능인 경우 선택하세요'
        }),
        ('표시 설정', {
            'fields': ('is_active', 'order')
        }),
        ('시스템 정보', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
