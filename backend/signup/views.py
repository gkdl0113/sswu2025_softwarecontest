import random
import json
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .models import EmailVerification
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password


def get_request_data(request):
    """
    POST 요청에서 데이터를 가져오는 헬퍼 함수
    - application/json → request.body에서 읽음
    - form-data / x-www-form-urlencoded → request.POST에서 읽음
    """
    if request.content_type == "application/json":
        try:
            return json.loads(request.body)
        except json.JSONDecodeError:
            return {}
    return request.POST


@csrf_exempt
def send_verification_code(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST 요청만 지원됩니다."}, status=405)

    data = get_request_data(request)
    email = data.get("email")

    if not email:
        return JsonResponse({"error": "이메일을 입력해주세요."}, status=400)

    # 6자리 인증번호 생성
    code = str(random.randint(100000, 999999))
    EmailVerification.objects.update_or_create(email=email, defaults={"code": code})

    # 이메일 발송
    send_mail(
    subject="[회원가입] 인증번호",
    message=f"인증번호는 {code}입니다",
    from_email=settings.DEFAULT_FROM_EMAIL,  # EMAIL_HOST_USER와 동일
    recipient_list=[email],
    fail_silently=False
)

    return JsonResponse({"message": "인증번호 발송 완료"})


@csrf_exempt
def verify_code(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST 요청만 지원됩니다."}, status=405)

    data = get_request_data(request)
    email = data.get("email")
    code = data.get("code")

    if not email or not code:
        return JsonResponse({"error": "이메일과 인증번호를 모두 입력해주세요."}, status=400)

    try:
        verification = EmailVerification.objects.get(email=email)
    except EmailVerification.DoesNotExist:
        return JsonResponse({"error": "인증 기록이 없습니다."}, status=400)

    if verification.code == code:
        request.session['email_verified'] = email
        return JsonResponse({"message": "인증 성공"})
    else:
        return JsonResponse({"error": "인증번호 불일치"}, status=400)


@csrf_exempt
def signup_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST 요청만 지원됩니다."}, status=405)

    data = get_request_data(request)
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    confirm_password = data.get("confirm_password")

    if request.session.get('email_verified') != email:
        return JsonResponse({"error": "이메일 인증 필요"}, status=400)

    if password != confirm_password:
        return JsonResponse({"error": "비밀번호 불일치"}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "이미 사용 중인 사용자명입니다."}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({"error": "이미 가입된 이메일입니다."}, status=400)

    User.objects.create(
        username=username,
        email=email,
        password=make_password(password)
    )
    return JsonResponse({"message": "회원가입 완료"})
