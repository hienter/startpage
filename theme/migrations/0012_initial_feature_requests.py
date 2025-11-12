# Generated manually to populate initial feature requests

from django.db import migrations


def create_initial_feature_requests(apps, schema_editor):
    FeatureRequest = apps.get_model('theme', 'FeatureRequest')
    Dday = apps.get_model('theme', 'Dday')
    
    # 고시 준수 AI 챗봇
    FeatureRequest.objects.get_or_create(
        feature_id='ai_chatbot',
        defaults={
            'feature_name': '고시 준수 AI 챗봇',
            'description': '장기요양 관련 고시, 평가매뉴얼, 법령, 판례를 참조하여 질문에 대답하는 AI 챗봇입니다',
            'feature_type': 'ai_writing',
            'service_type': 'visitCare',
            'is_active': True,
            'order': 1,
        }
    )
    
    # 디데이 관련 AI 작성하기 기능들
    dday_mappings = [
        (17, '상태변화 기록', '상태변화 기록 AI 작성하기', '상태변화 기록을 AI로 작성합니다', 2),
        (2, '직원회의', '직원회의록 AI 작성하기', '직원회의록을 AI로 작성합니다', 3),
        (5, '복지 및 포상', '복지 및 포상 내역 AI 작성하기', '복지 및 포상 내역을 AI로 작성하기 쉽게 합니다', 4),
        (16, '사례관리 회의', '사례관리 회의록 AI 작성하기', '사례관리 회의록을 AI로 작성합니다', 5),
    ]
    
    for dday_id, dday_title, feature_name, description, order in dday_mappings:
        try:
            dday = Dday.objects.get(id=dday_id)
            FeatureRequest.objects.get_or_create(
                feature_id=f'dday_{dday_id}',
                defaults={
                    'feature_name': feature_name,
                    'description': description,
                    'feature_type': 'ai_writing',
                    'related_dday': dday,
                    'is_active': True,
                    'order': order,
                }
            )
        except Dday.DoesNotExist:
            # 디데이가 없으면 related_dday 없이 생성
            FeatureRequest.objects.get_or_create(
                feature_id=f'dday_{dday_id}',
                defaults={
                    'feature_name': feature_name,
                    'description': description,
                    'feature_type': 'ai_writing',
                    'is_active': True,
                    'order': order,
                }
            )
    
    # 급여 유형 관련 기능들
    service_types = [
        ('visitBath', '방문목욕 급여 유형 추가', '방문목욕 평가 기준을 반영합니다', 6),
        ('visitNurse', '방문간호 급여 유형 추가', '방문간호 평가 기준을 반영합니다', 7),
        ('dayCare', '주야간보호 급여 유형 추가', '주야간보호 평가 기준을 반영합니다', 8),
        ('shortTerm', '단기보호 급여 유형 추가', '단기보호 평가 기준을 반영합니다', 9),
        ('welfare', '복지용구 급여 유형 추가', '복지용구 평가 기준을 반영합니다', 10),
    ]
    
    for service_code, service_name, service_description, order in service_types:
        FeatureRequest.objects.get_or_create(
            feature_id=f'service_{service_code}',
            defaults={
                'feature_name': service_name,
                'description': service_description,
                'feature_type': 'service_type',
                'service_type': service_code,
                'is_active': True,
                'order': order,
            }
        )


def reverse_initial_feature_requests(apps, schema_editor):
    FeatureRequest = apps.get_model('theme', 'FeatureRequest')
    FeatureRequest.objects.filter(
        feature_id__in=[
            'ai_chatbot',
            'dday_2', 'dday_5', 'dday_16', 'dday_17',
            'service_visitBath', 'service_visitNurse', 'service_dayCare',
            'service_shortTerm', 'service_welfare',
        ]
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('theme', '0011_featurerequest'),
    ]

    operations = [
        migrations.RunPython(create_initial_feature_requests, reverse_initial_feature_requests),
    ]

