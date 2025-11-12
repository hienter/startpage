from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from datetime import date
from .models import Dday, ServiceTypeClick, FeatureVote, UserServicePreference, FeatureRequest

def index(request):
    # 필요한 필드만 선택적으로 로드하여 쿼리 최적화
    ddays = Dday.objects.filter(is_active=True).only(
        'id', 'title', 'target_date', 'service_type', 'period', 'order'
    ).order_by('order', 'id')
    
    # date.today()를 한 번만 호출하여 성능 최적화
    today = date.today()
    
    # 템플릿에서 메서드 호출 대신 뷰에서 미리 계산하여 전달
    ddays_with_dates = []
    for dday in ddays:
        # get_actual_target_date에 today를 전달하여 중복 호출 방지
        actual_date = dday.get_actual_target_date(today=today)
        # period_display도 미리 계산
        period_display = dday.get_period_display()
        ddays_with_dates.append({
            'dday': dday,
            'actual_date': actual_date,
            'period_display': period_display,
        })
    
    context = {
        'ddays_with_dates': ddays_with_dates,
    }
    return render(request, 'index.html', context)

@csrf_exempt
@require_POST
def increment_service_click(request):
    """급여 유형 클릭 카운트 증가"""
    service_type = request.POST.get('service_type')
    
    if not service_type:
        return JsonResponse({'error': 'service_type is required'}, status=400)
    
    # ServiceTypeClick 객체 가져오기 또는 생성
    service_click, created = ServiceTypeClick.objects.get_or_create(
        service_type=service_type,
        defaults={'click_count': 0}
    )
    
    # 카운트 증가
    service_click.click_count += 1
    service_click.last_clicked_at = timezone.now()
    service_click.save()
    
    return JsonResponse({
        'success': True,
        'service_type': service_type,
        'click_count': service_click.click_count
    })

@csrf_exempt
@require_POST
def increment_feature_vote(request):
    """개발 예정 기능 투표 수 증가"""
    feature_id = request.POST.get('feature_id')
    feature_name = request.POST.get('feature_name', '')
    
    if not feature_id:
        return JsonResponse({'error': 'feature_id is required'}, status=400)
    
    # FeatureVote 객체 가져오기 또는 생성
    feature_vote, created = FeatureVote.objects.get_or_create(
        feature_id=feature_id,
        defaults={'feature_name': feature_name, 'vote_count': 0}
    )
    
    # 투표 수 증가
    feature_vote.vote_count += 1
    feature_vote.last_voted_at = timezone.now()
    if feature_name and not created:
        feature_vote.feature_name = feature_name  # 이름 업데이트
    feature_vote.save()
    
    return JsonResponse({
        'success': True,
        'feature_id': feature_id,
        'click_count': feature_vote.vote_count
    })

@csrf_exempt
@require_POST
def save_service_preference(request):
    """사용자 급여 유형 선택 저장"""
    service_type = request.POST.get('service_type')
    
    if not service_type:
        return JsonResponse({'error': 'service_type is required'}, status=400)
    
    # UserServicePreference 객체 가져오기 또는 생성
    preference, created = UserServicePreference.objects.get_or_create(
        service_type=service_type,
        defaults={'selection_count': 0}
    )
    
    # 선택 횟수 증가
    preference.selection_count += 1
    preference.last_selected_at = timezone.now()
    preference.save()
    
    return JsonResponse({
        'success': True,
        'service_type': service_type,
        'selection_count': preference.selection_count
    })

def development_features(request):
    """개발 예정 기능 확인하기 페이지 - 투표 형식"""
    # 활성화된 기능 개발 요청 목록 가져오기
    feature_requests = FeatureRequest.objects.filter(is_active=True).select_related('related_dday').order_by('order', 'id')
    
    # 모든 feature_id 수집
    feature_ids = [fr.feature_id for fr in feature_requests]
    
    # 모든 FeatureVote를 한 번에 가져와서 딕셔너리로 매핑 (N+1 쿼리 최적화)
    feature_votes = {
        vote.feature_id: vote
        for vote in FeatureVote.objects.filter(feature_id__in=feature_ids)
    }
    
    # 모든 개발 예정 기능을 하나의 리스트로 통합
    features = []
    
    for feature_request in feature_requests:
        # 각 기능의 투표 수는 FeatureVote에서 가져오기
        feature_vote = feature_votes.get(feature_request.feature_id)
        vote_count = feature_vote.vote_count if feature_vote else 0
        # 상태는 FeatureRequest에서 가져오기
        status = feature_request.status
        
        # service_type 결정: 직접 설정된 경우 또는 related_dday에서 가져오기
        service_type = feature_request.service_type
        if not service_type and feature_request.related_dday:
            service_type = feature_request.related_dday.service_type
        
        features.append({
            'id': feature_request.feature_id,
            'name': feature_request.feature_name,
            'type': feature_request.feature_type,
            'description': feature_request.description,
            'service_type': service_type or 'visitCare',  # 기본값
            'vote_count': vote_count,
            'status': status,
        })
    
    # 투표 수 기준으로 정렬 (내림차순), 투표 수가 같으면 이름 순
    features.sort(key=lambda x: (-x['vote_count'], x['name']))
    
    context = {
        'features': features,
    }
    return render(request, 'development_features.html', context)
