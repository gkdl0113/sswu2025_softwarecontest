# backend/views.py
import random
from django.http import JsonResponse
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt

# 코드 저장용 (임시 메모리)
verification_codes = {}

@csrf_exempt
def send_code(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        if not email:
            return JsonResponse({"error": "이메일이 필요합니다."}, status=400)

        # 6자리 랜덤 숫자 코드
        code = str(random.randint(100000, 999999))
        verification_codes[email] = code

        # 메일 발송
        subject = "회원가입 인증번호"
        message = f"인증번호는 {code} 입니다."
        send_mail(subject, message, None, [email])

        return JsonResponse({"message": "인증번호가 발송되었습니다.", "email": email})

    return JsonResponse({"error": "POST 요청만 가능합니다."}, status=405)


@csrf_exempt
def verify_code(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        code = request.POST.get('code')

        if verification_codes.get(email) == code:
            return JsonResponse({"message": "인증 성공"})
        else:
            return JsonResponse({"error": "인증 실패"}, status=400)

    return JsonResponse({"error": "POST 요청만 가능합니다."}, status=405)


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        # 회원가입 로직 (username, password, email 저장)
        return JsonResponse({"message": "회원가입 완료"})
    return JsonResponse({"error": "POST 요청만 가능합니다."}, status=405)
