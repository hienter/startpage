from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import Dday, ServiceTypeClick, FeatureVote, UserServicePreference

def index(request):
    ddays = Dday.objects.filter(is_active=True)
    context = {
        'ddays': ddays,
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
    # 모든 개발 예정 기능을 하나의 리스트로 통합
    features = []
    
    # AI 작성하기 기능이 있는 디데이 목록
    ai_enabled_ddays = ['상태변화 기록', '직원회의', '복지 및 포상', '사례관리 회의']
    ddays = Dday.objects.filter(
        is_active=True,
        title__in=ai_enabled_ddays
    ).order_by('title')
    
    # 고시 준수 AI 챗봇 기능 추가 (디데이에 없는 독립 기능)
    features.append({
        'id': 'ai_chatbot',
        'name': '고시 준수 AI 챗봇',
        'type': 'ai_writing',
        'description': '장기요양 관련 고시, 평가매뉴얼, 법령, 판례를 참조하여 질문에 대답하는 AI 챗봇입니다',
        'service_type': 'visitCare',
        'vote_count': 0,
        'status': 'pending',
    })
    
    # 고시 준수 AI 챗봇의 투표 수 가져오기
    try:
        chatbot_vote = FeatureVote.objects.get(feature_id='ai_chatbot')
        features[-1]['vote_count'] = chatbot_vote.vote_count
        features[-1]['status'] = chatbot_vote.status
    except FeatureVote.DoesNotExist:
        pass
    
    for dday in ddays:
        # 각 디데이의 투표 수와 상태는 FeatureVote에서 가져오기
        feature_id = f'dday_{dday.id}'
        try:
            feature_vote = FeatureVote.objects.get(feature_id=feature_id)
            vote_count = feature_vote.vote_count
            status = feature_vote.status
        except FeatureVote.DoesNotExist:
            vote_count = 0
            status = 'pending'
        
        # 제목을 더 풀어서 작성
        if dday.title == '상태변화 기록':
            display_name = '상태변화 기록 AI 작성하기'
            description = '상태변화 기록을 AI로 작성합니다'
        elif dday.title == '직원회의':
            display_name = '직원회의록 AI 작성하기'
            description = '직원회의록을 AI로 작성합니다'
        elif dday.title == '복지 및 포상':
            display_name = '복지 및 포상 내역 AI 작성하기'
            description = '복지 및 포상 내역을 AI로 작성하기 쉽게 합니다'
        elif dday.title == '사례관리 회의':
            display_name = '사례관리 회의록 AI 작성하기'
            description = '사례관리 회의록을 AI로 작성합니다'
        else:
            display_name = dday.title
            description = f'{dday.get_service_type_display} - {dday.get_period_display}'
        
        features.append({
            'id': f'dday_{dday.id}',
            'name': display_name,
            'type': 'ai_writing',
            'description': description,
            'service_type': dday.service_type,
            'vote_count': vote_count,
            'status': status,
        })
    
    # 개발중인 급여 유형 목록 (방문요양 제외)
    developing_service_types = [
        ('visitBath', '방문목욕 급여 유형 추가', '방문목욕 평가 기준을 반영합니다'),
        ('visitNurse', '방문간호 급여 유형 추가', '방문간호 평가 기준을 반영합니다'),
        ('dayCare', '주야간보호 급여 유형 추가', '주야간보호 평가 기준을 반영합니다'),
        ('shortTerm', '단기보호 급여 유형 추가', '단기보호 평가 기준을 반영합니다'),
        ('welfare', '복지용구 급여 유형 추가', '복지용구 평가 기준을 반영합니다'),
    ]
    
    for service_code, service_name, service_description in developing_service_types:
        # 각 급여 유형의 투표 수와 상태는 FeatureVote에서 가져오기
        feature_id = f'service_{service_code}'
        try:
            feature_vote = FeatureVote.objects.get(feature_id=feature_id)
            vote_count = feature_vote.vote_count
            status = feature_vote.status
        except FeatureVote.DoesNotExist:
            vote_count = 0
            status = 'pending'
        
        features.append({
            'id': f'service_{service_code}',
            'name': service_name,
            'type': 'service_type',
            'description': service_description,
            'service_type': service_code,
            'vote_count': vote_count,
            'status': status,
        })
    
    # 투표 수 기준으로 정렬 (내림차순), 투표 수가 같으면 이름 순
    features.sort(key=lambda x: (-x['vote_count'], x['name']))
    
    context = {
        'features': features,
    }
    return render(request, 'development_features.html', context)
